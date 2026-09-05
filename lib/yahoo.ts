export const YAHOO_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';

export const PUBLIC_CACHE_CONTROL = 'public, s-maxage=300, stale-while-revalidate=900';
const CRUMB_TTL_MS = 30 * 60 * 1000;
const ALLOWED_RANGES = new Set(['1d', '5d', '1mo', '3mo', '6mo', '1y', '2y', '5y', '10y', 'ytd', 'max']);
const ALLOWED_INTERVALS = new Set(['1m', '2m', '5m', '15m', '30m', '60m', '90m', '1h', '1d', '5d', '1wk', '1mo', '3mo']);

export interface UpstreamResult {
  status: number;
  body: string;
}

export function normalizeSymbol(input: string): string {
  const clean = String(input ?? '')
    .trim()
    .toUpperCase()
    .replace(/\.(?:US|HK|SS|SZ|NS|NQ|L)$/i, '');
  if (/^\d{6}$/.test(clean)) return `${clean}.${clean.startsWith('6') ? 'SS' : 'SZ'}`;
  if (/^\d{4,5}(\.HK)?$/i.test(clean)) return `${clean.replace(/\.HK$/i, '')}.HK`;
  return clean;
}

const crumbState = {
  cookieHeader: null as string | null,
  crumb: null as string | null,
  fetchedAt: 0,
};

function collectSetCookies(res: Response): string[] {
  const headers = res.headers as Headers & { getSetCookie?: () => string[] };
  if (typeof headers.getSetCookie === 'function') return headers.getSetCookie();
  const raw = res.headers.get('set-cookie');
  return raw ? raw.split(/,(?=[^;]+?=)/) : [];
}

async function refreshCrumb(): Promise<string> {
  let cookieHeader = '';
  for (const seedUrl of ['https://fc.yahoo.com', 'https://finance.yahoo.com']) {
    try {
      const res = await fetch(seedUrl, { headers: { 'User-Agent': YAHOO_UA } });
      const pairs = collectSetCookies(res)
        .map((cookie) => cookie.split(';')[0].trim())
        .filter(Boolean);
      if (pairs.length > 0) {
        cookieHeader = pairs.join('; ');
        break;
      }
    } catch {
      // Try the fallback seed URL.
    }
  }

  const res = await fetch('https://query1.finance.yahoo.com/v1/test/getcrumb', {
    headers: {
      Accept: '*/*',
      'User-Agent': YAHOO_UA,
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
  });
  const crumb = (await res.text()).trim();
  if (!res.ok || !crumb || crumb.length > 128) throw new Error('Unable to obtain Yahoo crumb');

  crumbState.cookieHeader = cookieHeader || null;
  crumbState.crumb = crumb;
  crumbState.fetchedAt = Date.now();
  return crumb;
}

export async function getCrumb(forceRefresh = false): Promise<string> {
  if (
    !forceRefresh &&
    crumbState.crumb !== null &&
    Date.now() - crumbState.fetchedAt < CRUMB_TTL_MS
  ) {
    return crumbState.crumb;
  }
  return refreshCrumb();
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchChart(rawSymbol: string, range = '1mo', interval = '1d'): Promise<UpstreamResult> {
  const symbol = normalizeSymbol(rawSymbol);
  const safeRange = ALLOWED_RANGES.has(range) ? range : '1mo';
  const safeInterval = ALLOWED_INTERVALS.has(interval) ? interval : '1d';
  const url = `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${safeRange}&interval=${safeInterval}`;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { Accept: 'application/json', 'Accept-Language': 'en-US,en;q=0.9', 'User-Agent': YAHOO_UA },
      });
      if ((res.status === 429 || res.status === 503) && attempt === 0) {
        await sleep(700);
        continue;
      }
      return { status: res.status, body: (await res.text()) || '{}' };
    } catch {
      if (attempt === 0) {
        await sleep(500);
        continue;
      }
      return { status: 502, body: JSON.stringify({ error: 'Unable to load Yahoo data' }) };
    }
  }
  return { status: 502, body: JSON.stringify({ error: 'Unable to load Yahoo data' }) };
}

export async function fetchNews(rawSymbol: string, maxItems = 15): Promise<UpstreamResult> {
  const symbol = normalizeSymbol(rawSymbol);
  const count = Math.max(1, Math.min(30, Math.floor(Number(maxItems) || 15)));
  const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(symbol)}&quotesCount=0&newsCount=${count}&enableFuzzyQuery=false`;
  try {
    const res = await fetch(url, { headers: { Accept: 'application/json', 'User-Agent': YAHOO_UA } });
    return { status: res.status, body: (await res.text()) || '{}' };
  } catch {
    return { status: 502, body: JSON.stringify({ error: 'Unable to load Yahoo news' }) };
  }
}

const SUMMARY_MODULES = ['assetProfile', 'summaryDetail', 'defaultKeyStatistics', 'financialData', 'calendarEvents', 'recommendationTrend'].join(',');
const HOLDINGS_MODULES = ['majorHoldersBreakdown', 'institutionOwnership', 'insiderTransactions', 'netSharePurchaseActivity'].join(',');

async function attemptQuoteSummary(symbol: string, crumb: string, modules = SUMMARY_MODULES): Promise<UpstreamResult> {
  const url = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${encodeURIComponent(symbol)}?modules=${modules}&crumb=${encodeURIComponent(crumb)}`;
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json', 'User-Agent': YAHOO_UA, ...(crumbState.cookieHeader ? { Cookie: crumbState.cookieHeader } : {}) },
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
    let result = await attemptQuoteSummary(symbol, crumb);
    if ([401, 403, 404].includes(result.status)) result = await attemptQuoteSummary(symbol, await getCrumb(true));
    return result;
  } catch {
    return { status: 502, body: JSON.stringify({ error: 'Yahoo fundamentals unavailable' }) };
  }
}

export async function fetchHoldings(rawSymbol: string): Promise<UpstreamResult> {
  const symbol = normalizeSymbol(rawSymbol);
  try {
    const crumb = await getCrumb();
    let result = await attemptQuoteSummary(symbol, crumb, HOLDINGS_MODULES);
    if ([401, 403, 404].includes(result.status)) result = await attemptQuoteSummary(symbol, await getCrumb(true), HOLDINGS_MODULES);
    return result;
  } catch {
    return { status: 502, body: JSON.stringify({ error: 'Yahoo holdings unavailable' }) };
  }
}

async function attemptOptions(symbol: string, crumb: string): Promise<UpstreamResult> {
  const url = `https://query2.finance.yahoo.com/v7/finance/options/${encodeURIComponent(symbol)}?crumb=${encodeURIComponent(crumb)}`;
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json', 'User-Agent': YAHOO_UA, ...(crumbState.cookieHeader ? { Cookie: crumbState.cookieHeader } : {}) },
    });
    return { status: res.status, body: (await res.text()) || '{}' };
  } catch {
    return { status: 502, body: JSON.stringify({ error: 'Unable to load Yahoo options' }) };
  }
}

export async function fetchOptions(rawSymbol: string): Promise<UpstreamResult> {
  const symbol = normalizeSymbol(rawSymbol);
  try {
    const crumb = await getCrumb();
    let result = await attemptOptions(symbol, crumb);
    if ([401, 403].includes(result.status)) result = await attemptOptions(symbol, await getCrumb(true));
    return result;
  } catch {
    return { status: 502, body: JSON.stringify({ error: 'Yahoo options unavailable' }) };
  }
}
