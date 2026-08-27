/**
 * Shared Yahoo Finance upstream logic.
 *
 * Used by BOTH:
 *  - Vercel Serverless Functions (api/yahoo/**\/[symbol].ts) in production
 *  - server.js Express wrapper via tsx for local development
 *
 * Two upstream endpoints:
 *  1. Chart        /v8/finance/chart/{sym}          -> no auth needed
 *  2. QuoteSummary /v10/finance/quoteSummary/{sym}  -> requires cookie + crumb
 *
 * All functions return the RAW Yahoo JSON text so that parsing stays on the
 * frontend (same contract as the original proxy design).
 */

export const YAHOO_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';

/** Cache at the CDN edge: fresh for 5 min, serve stale up to 15 min while revalidating. */
export const PUBLIC_CACHE_CONTROL = 'public, s-maxage=300, stale-while-revalidate=900';

const CRUMB_TTL_MS = 30 * 60 * 1000;

const ALLOWED_RANGES = new Set(['1d','5d','1mo','3mo','6mo','1y','2y','5y','10y','ytd','max']);
const ALLOWED_INTERVALS = new Set(['1m','2m','5m','15m','30m','60m','90m','1h','1d','5d','1wk','1mo','3mo']);

export interface UpstreamResult {
  status: number;
  body: string;
}

/**
 * Normalize user input into a Yahoo-usable symbol.
 * Mirrors the frontend toYahooTicker() so the API is robust even when
 * called by clients that skip normalization (curl, mobile app, etc.).
 *
 *  "002230"     -> "002230.SZ"   (6xx -> Shanghai .SS)
 *  "600848"     -> "600848.SS"
 *  "0700.HK"    -> "0700.HK"
 *  "AAPL.US"    -> "AAPL"
 */
export function normalizeSymbol(input: string): string {
  const clean = String(input ?? '')
    .trim()
    .toUpperCase()
    .replace(/\.(?:US|HK|SS|SZ|NS|NQ|L)$/i, '');

  if (/^\d{6}$/.test(clean)) {
    return `${clean}.${clean.startsWith('6') ? 'SS' : 'SZ'}`;
  }
  if (/^\d{4,5}(\.HK)?$/i.test(clean)) {
    return `${clean.replace(/\.HK$/i, '')}.HK`;
  }
  return clean;
}

/* ------------------------------------------------------------------ */
/* Cookie + crumb management (required for quoteSummary)               */
/* ------------------------------------------------------------------ */

// Module-scope state survives across warm serverless invocations,
// so we don't redo the handshake on every request.
const crumbState = {
  cookieHeader: null as string | null,
  crumb: null as string | null,
  fetchedAt: 0,
};

function collectSetCookies(res: Response): string[] {
  const anyRes = res as unknown as { headers: Headers & { getSetCookie?: () => string[] } };
  if (typeof anyRes.headers.getSetCookie === 'function') {
    return anyRes.headers.getSetCookie();
  }
  const raw = res.headers.get('set-cookie');
  return raw ? raw.split(/,(?=[^;]+?=)/) : [];
}

async function refreshCrumb(): Promise<string> {
  // Step 1: obtain session cookies. fc.yahoo.com responds 404 but sets the
  // A1/A3 cookies we need; finance.yahoo.com is a fallback.
  let cookieHeader = '';
  const seedUrls = ['https://fc.yahoo.com', 'https://finance.yahoo.com'];
  for (const seedUrl of seedUrls) {
    try {
      const res = await fetch(seedUrl, { headers: { 'User-Agent': YAHOO_UA } });
      const pairs = collectSetCookies(res)
        .map((c) => c.split(';')[0].trim())
        .filter(Boolean);
      if (pairs.length > 0) {
        cookieHeader = pairs.join('; ');
        break;
      }
    } catch {
      /* try next seed */
    }
  }

  // Step 2: exchange cookies for a crumb token.
  const res = await fetch('https://query1.finance.yahoo.com/v1/test/getcrumb', {
    headers: {
      Accept: '*/*',
      'User-Agent': YAHOO_UA,
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
  });
  const crumb = (await res.text()).trim();

  if (!res.ok || !crumb || crumb.length > 128) {
    throw new Error('Unable to obtain Yahoo crumb');
  }

  crumbState.cookieHeader = cookieHeader || null;
  crumbState.crumb = crumb;
  crumbState.fetchedAt = Date.now();
  return crumb;
}

export async function getCrumb(forceRefresh = false): Promise<string> {
  const isFresh =
    !forceRefresh &&
    crumbState.crumb !== null &&
    Date.now() - crumbState.fetchedAt < CRUMB_TTL_MS;
  if (isFresh && crumbState.crumb) return crumbState.crumb;
  return refreshCrumb();
}

/* ------------------------------------------------------------------ */
/* Endpoint 1: price chart (no auth)                                   */
/* ------------------------------------------------------------------ */

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetch the chart endpoint. Yahoo intermittently answers 429 ("Too Many
 * Requests") under bursts — retry once with a short backoff before giving up,
 * so a single throttle blip doesn't surface as "symbol not found" in the UI.
 */
export async function fetchChart(
  rawSymbol: string,
  range = '1mo',
  interval = '1d'
): Promise<UpstreamResult> {
  const symbol = normalizeSymbol(rawSymbol);
  const safeRange = ALLOWED_RANGES.has(range) ? range : '1mo';
  const safeInterval = ALLOWED_INTERVALS.has(interval) ? interval : '1d';
  const url = `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
    symbol
  )}?range=${safeRange}&interval=${safeInterval}`;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          Accept: 'application/json',
          'Accept-Language': 'en-US,en;q=0.9',
          'User-Agent': YAHOO_UA,
        },
      });

      // Throttled -> back off briefly and retry once.
      if ((res.status === 429 || res.status === 503) && attempt === 0) {
        await sleep(700);
        continue;
      }

      return { status: res.status, body: (await res.text()) || '{}' };
    } catch (err) {
      if (attempt === 0) {
        await sleep(500);
        continue;
      }
      return { status: 502, body: JSON.stringify({ error: 'Unable to load Yahoo data' }) };
    }
  }

  // Unreachable, but TypeScript needs a return.
  return { status: 502, body: JSON.stringify({ error: 'Unable to load Yahoo data' }) };
}

/* ------------------------------------------------------------------ */
/* Endpoint 3: live company news via /v1/finance/search (no auth)      */
/* ------------------------------------------------------------------ */

export async function fetchNews(rawSymbol: string, maxItems = 15): Promise<UpstreamResult> {
  const symbol = normalizeSymbol(rawSymbol);
  const count = Math.max(1, Math.min(30, Math.floor(Number(maxItems) || 15)));
  const url =
    `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(symbol)}` +
    `&quotesCount=0&newsCount=${count}&enableFuzzyQuery=false`;

  try {
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent': YAHOO_UA,
      },
    });
    return { status: res.status, body: (await res.text()) || '{}' };
  } catch {
    return { status: 502, body: JSON.stringify({ error: 'Unable to load Yahoo news' }) };
  }
}

/* ------------------------------------------------------------------ */
/* Endpoint 2: fundamentals / quote summary (cookie + crumb)           */
/* ------------------------------------------------------------------ */

const SUMMARY_MODULES = [
  'assetProfile',
  'summaryDetail',
  'defaultKeyStatistics',
  'financialData',
  'calendarEvents',
  'recommendationTrend',
].join(',');

/** Ownership data: ownership split + institutional 13F-style holders + insider activity. */
const HOLDINGS_MODULES = [
  'majorHoldersBreakdown',
  'institutionOwnership',
  'insiderTransactions',
  'netSharePurchaseActivity',
].join(',');

async function attemptQuoteSummary(
  symbol: string,
  crumb: string,
  modules: string = SUMMARY_MODULES
): Promise<UpstreamResult> {
  const url =
    `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${encodeURIComponent(symbol)}` +
    `?modules=${modules}&crumb=${encodeURIComponent(crumb)}`;

  try {
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent': YAHOO_UA,
        ...(crumbState.cookieHeader ? { Cookie: crumbState.cookieHeader } : {}),
      },
    });
    return { status: res.status, body: (await res.text()) || '{}' };
  } catch {
    return { status: 502, body: JSON.stringify({ error: 'Unable to load Yahoo quoteSummary' }) };
  }
}

export async function fetchFundamentals(rawSymbol: string): Promise<UpstreamResult> {
  const symbol = normalizeSymbol(rawSymbol);
  try {
    const crumb = await getCrumb();
    let result = await attemptQuoteSummary(symbol, crumb, SUMMARY_MODULES);

    // Stale/invalid crumb -> force one refresh and retry exactly once.
    if ([401, 403, 404].includes(result.status)) {
      const freshCrumb = await getCrumb(true);
      result = await attemptQuoteSummary(symbol, freshCrumb, SUMMARY_MODULES);
    }

    return result;
  } catch {
    return {
      status: 502,
      body: JSON.stringify({ error: 'Yahoo fundamentals unavailable' }),
    };
  }
}

/**
 * Institutional holders + insider transactions (quoteSummary ownership modules).
 * Same cookie+crumb handshake as fundamentals.
 */
export async function fetchHoldings(rawSymbol: string): Promise<UpstreamResult> {
  const symbol = normalizeSymbol(rawSymbol);
  try {
    const crumb = await getCrumb();
    let result = await attemptQuoteSummary(symbol, crumb, HOLDINGS_MODULES);

    if ([401, 403, 404].includes(result.status)) {
      const freshCrumb = await getCrumb(true);
      result = await attemptQuoteSummary(symbol, freshCrumb, HOLDINGS_MODULES);
    }

    return result;
  } catch {
    return {
      status: 502,
      body: JSON.stringify({ error: 'Yahoo holdings unavailable' }),
    };
  }
}

/* ------------------------------------------------------------------ */
/* Endpoint 4: options chain (cookie + crumb)                          */
/* ------------------------------------------------------------------ */

async function attemptOptions(symbol: string, crumb: string): Promise<UpstreamResult> {
  const url =
    `https://query2.finance.yahoo.com/v7/finance/options/${encodeURIComponent(symbol)}` +
    `?crumb=${encodeURIComponent(crumb)}`;

  try {
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent': YAHOO_UA,
        ...(crumbState.cookieHeader ? { Cookie: crumbState.cookieHeader } : {}),
      },
    });
    return { status: res.status, body: (await res.text()) || '{}' };
  } catch {
    return { status: 502, body: JSON.stringify({ error: 'Unable to load Yahoo options' }) };
  }
}

/**
 * Options chain snapshot. Used to derive sentiment/volatility metrics:
 * ATM implied volatility and put/call ratios.
 * Returns 404 for symbols without listed options (e.g. A-shares).
 */
export async function fetchOptions(rawSymbol: string): Promise<UpstreamResult> {
  const symbol = normalizeSymbol(rawSymbol);
  try {
    const crumb = await getCrumb();
    let result = await attemptOptions(symbol, crumb);

    if ([401, 403].includes(result.status)) {
      const freshCrumb = await getCrumb(true);
      result = await attemptOptions(symbol, freshCrumb);
    }

    return result;
  } catch {
    return { status: 502, body: JSON.stringify({ error: 'Yahoo options unavailable' }) };
  }
}
