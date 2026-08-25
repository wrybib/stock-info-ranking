import { Stock, StockDataPoint, Timeframe } from '../types';

const toDisplayTicker = (symbol: string) => symbol.trim().toUpperCase();

/** Why a symbol lookup failed — drives accurate user-facing messages. */
export type LookupFailureReason = 'not_found' | 'rate_limited' | 'service_down';

export type StockLookupResult =
  | { ok: true; stock: Stock }
  | { ok: false; reason: LookupFailureReason };

export function toYahooTicker(symbol: string): string {
  const clean = toDisplayTicker(symbol).replace(/\.(?:US|HK|SS|SZ|NS|NQ|L)$/i, '');

  if (/^\d{6}$/.test(clean)) {
    return `${clean}.${clean.startsWith('6') ? 'SS' : 'SZ'}`;
  }

  if (/^\d{4,5}(\.HK)?$/i.test(clean)) {
    return `${clean.replace(/\.HK$/i, '')}.HK`;
  }

  return clean;
}

function getNumberArray(values: number[] | undefined): number[] {
  return Array.isArray(values) ? values.filter((value) => Number.isFinite(value)) : [];
}

/** Parse one real Yahoo chart series into display points (with MA10). */
function parseSeries(
  quote: {
    open?: number[];
    high?: number[];
    low?: number[];
    close?: number[];
    volume?: number[];
  },
  timestamps: number[] | undefined
): StockDataPoint[] {
  const opens = getNumberArray(quote.open);
  const highs = getNumberArray(quote.high);
  const lows = getNumberArray(quote.low);
  const closes = getNumberArray(quote.close);
  const volumes = getNumberArray(quote.volume);

  const length = Math.max(
    timestamps?.length ?? 0,
    opens.length,
    highs.length,
    lows.length,
    closes.length,
    volumes.length
  );
  if (length === 0) return [];

  const points: StockDataPoint[] = [];
  for (let i = 0; i < length; i += 1) {
    const ts = timestamps?.[i] ?? Date.now() - (length - i) * 60 * 1000;
    const open = opens[i] ?? closes[i] ?? 0;
    const high = highs[i] ?? Math.max(open, closes[i] ?? open);
    const low = lows[i] ?? Math.min(open, closes[i] ?? open);
    const close = closes[i] ?? open;

    if (!Number.isFinite(close) || close <= 0) continue;

    let ma10 = close;
    const window = closes.slice(Math.max(0, i - 9), i + 1);
    if (window.length > 0) {
      const sum = window.reduce((total, value) => total + value, 0);
      ma10 = sum / window.length;
    }

    points.push({
      date: new Date(ts * 1000).toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
        year: '2-digit',
      }),
      timestamp: ts * 1000,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume: Math.max(0, Math.round(volumes[i] ?? 0)),
      ma10: Number(ma10.toFixed(2)),
    });
  }

  return points;
}

type ChartFetchOutcome =
  | { status: number; ok: true; result: any }
  | { status: number; ok: false };

async function fetchYahooChart(
  symbol: string,
  range: string,
  interval: string
): Promise<ChartFetchOutcome> {
  const proxyUrl =
    `/api/yahoo/chart/${encodeURIComponent(toYahooTicker(symbol))}` +
    `?range=${encodeURIComponent(range)}&interval=${encodeURIComponent(interval)}`;

  try {
    const response = await fetch(proxyUrl, {
      headers: { Accept: 'application/json' },
    });

    // Network-level failure of our own proxy (server not running, etc.)
    if (response.status === 404 || response.status >= 500) {
      return { status: response.status, ok: false };
    }

    const payload = await response.json().catch(() => null);
    const result = payload?.chart?.result?.[0] ?? null;

    if (!response.ok || !result) {
      // Yahoo answers 404 for genuinely unknown symbols.
      return { status: response.status, ok: false };
    }

    return { status: response.status, ok: true, result };
  } catch {
    // fetch() itself threw -> proxy unreachable.
    return { status: 0, ok: false };
  }
}

function mapFailure(status: number): LookupFailureReason {
  if (status === 404) return 'not_found';
  if (status === 429 || status === 503) return 'rate_limited';
  if (status === 0 || status === 404 || status >= 500) return 'service_down';
  return 'not_found';
}

/**
 * Hydrate a stock with live Yahoo data.
 *
 * One real `1y/1d` chart call provides:
 *  - current quote fields (price, 52w range, volume)
 *  - history['1Y']: the full real daily series (~252 pts), used by the
 *    ranking engine for momentum / moving-average metrics
 *  - history['1M']: last ~22 real dailies, used by the technical model
 *
 * Other timeframes are fetched lazily by LivePriceChart — never fabricated here.
 */
export async function lookupStockWithYahoo(symbol: string): Promise<StockLookupResult> {
  const displayTicker = toDisplayTicker(symbol);

  try {
    const outcome = await fetchYahooChart(displayTicker, '1y', '1d');
    if (!outcome.ok) {
      return { ok: false, reason: mapFailure(outcome.status) };
    }

    const result = outcome.result;
    const meta = result.meta ?? {};
    const quote = result.indicators?.quote?.[0] ?? {};
    const series = parseSeries(quote, result.timestamp);

    if (series.length === 0) {
      return { ok: false, reason: 'not_found' };
    }

    const emptyFrame: Record<Timeframe, StockDataPoint[]> = {
      '1D': [],
      '5D': [],
      '1M': series.slice(-22),
      '6M': [],
      YTD: [],
      '1Y': series,
      '5Y': [],
      ALL: [],
    };

    const currentPrice = Number(meta.regularMarketPrice ?? summaryLastPrice(quote.close) ?? 0);
    // Previous SESSION close — drives the daily change %.
    //
    // IMPORTANT: meta.chartPreviousClose is NOT usable here. For range=1y it is
    // the close one year ago (the bar before the range starts), which made every
    // watchlist row show its 1-year return as if it were today's move.
    // Prefer the explicit previousClose field Yahoo provides on chart meta;
    // fall back to the second-to-last daily bar (= yesterday's close).
    const metaPrevClose = Number(meta.previousClose ?? 0);
    const seriesCloses = series.map((p) => p.close);
    const previousClose =
      Number.isFinite(metaPrevClose) && metaPrevClose > 0
        ? metaPrevClose
        : seriesCloses.length >= 2
        ? seriesCloses[seriesCloses.length - 2]
        : currentPrice;
    const change = currentPrice - previousClose;
    const changePercent = previousClose > 0 ? (change / previousClose) * 100 : 0;
    // Round to 1 decimal — displayed as-is across the UI.
    const changePercent1dp = Number(changePercent.toFixed(1));
    const marketCap =
      typeof meta.marketCap === 'number' ? `$${(meta.marketCap / 1_000_000_000).toFixed(1)}B` : '';
    const high52w = Number(meta.fiftyTwoWeekHigh ?? currentPrice);
    const low52w = Number(meta.fiftyTwoWeekLow ?? currentPrice);
    const volume = Math.round(Number(meta.regularMarketVolume ?? getLatestValue(quote.volume) ?? 0));
    const avgVolume10d = Math.round(
      (getNumberArray(quote.volume).slice(-10).reduce((total, value) => total + value, 0) /
        Math.max(1, getNumberArray(quote.volume).slice(-10).length)) || volume
    );

    const stock: Stock = {
      ticker: displayTicker,
      name: meta.longName || meta.shortName || displayTicker,
      exchange: meta.fullExchangeName || meta.exchangeName || '',
      currency: meta.currency || 'USD',
      currentPrice,
      previousClose,
      change,
      changePercent: changePercent1dp,
      high52w,
      low52w,
      volume,
      avgVolume10d: avgVolume10d || volume,
      marketCap,
      peRatio: typeof meta.trailingPE === 'number' ? Number(meta.trailingPE.toFixed(1)) : undefined,
      sector: meta.quoteType || 'Market Data',
      history: emptyFrame,
    };

    return { ok: true, stock };
  } catch {
    return { ok: false, reason: 'service_down' };
  }
}

function summaryLastPrice(closes: number[] | undefined, offset = 0): number {
  const values = getNumberArray(closes);
  const index = values.length - 1 - offset;
  return values[Math.max(0, index)] ?? 0;
}

function getLatestValue(values: number[] | undefined): number {
  const cleaned = getNumberArray(values);
  return cleaned[cleaned.length - 1] ?? 0;
}
