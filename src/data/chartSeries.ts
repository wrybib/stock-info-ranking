import { Timeframe, StockDataPoint } from '../types';
import { toYahooTicker } from './yahooFinance';

/** Yahoo range/interval pairs chosen to match each UI timeframe. */
export const TIMEFRAME_TO_YAHOO: Record<Timeframe, { range: string; interval: string }> = {
  '1D': { range: '1d', interval: '15m' },
  '5D': { range: '5d', interval: '30m' },
  '1M': { range: '1mo', interval: '1d' },
  '6M': { range: '6mo', interval: '1d' },
  YTD: { range: 'ytd', interval: '1d' },
  '1Y': { range: '1y', interval: '1d' },
  '5Y': { range: '5y', interval: '1wk' },
  ALL: { range: 'max', interval: '1mo' },
};

const WARMUP_RANGE: Partial<Record<Timeframe, string>> = {
  '1M': '1y',
  '6M': '2y',
  YTD: '2y',
  '1Y': '2y',
  '5Y': '10y',
};

interface YahooChartPayload {
  chart?: {
    result?: Array<{
      timestamp?: number[];
      indicators?: {
        quote?: Array<{
          open?: (number | null)[];
          high?: (number | null)[];
          low?: (number | null)[];
          close?: (number | null)[];
          volume?: (number | null)[];
        }>;
      };
    }>;
    error?: unknown;
  };
}

function formatDate(tsSeconds: number, intraday: boolean): string {
  const d = new Date(tsSeconds * 1000);
  return intraday
    ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : d.toLocaleDateString([], { month: 'short', day: 'numeric', year: '2-digit' });
}

function visibleStartTimestamp(timeframe: Timeframe): number | undefined {
  const start = new Date();
  switch (timeframe) {
    case '1D':
      start.setDate(start.getDate() - 1);
      break;
    case '5D':
      start.setDate(start.getDate() - 5);
      break;
    case '1M':
      start.setMonth(start.getMonth() - 1);
      break;
    case '6M':
      start.setMonth(start.getMonth() - 6);
      break;
    case 'YTD':
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      break;
    case '1Y':
      start.setFullYear(start.getFullYear() - 1);
      break;
    case '5Y':
      start.setFullYear(start.getFullYear() - 5);
      break;
    case 'ALL':
      return undefined;
  }
  return Math.floor(start.getTime() / 1000);
}

/**
 * Fetch one real price series for the given timeframe via /api/yahoo/chart.
 * Returns null on failure so callers can show an explicit error/empty state.
 */
export async function fetchChartSeries(
  symbol: string,
  timeframe: Timeframe,
  signal?: AbortSignal
): Promise<StockDataPoint[] | null> {
  const cfg = TIMEFRAME_TO_YAHOO[timeframe] ?? TIMEFRAME_TO_YAHOO['1M'];
  try {
    const requestRange = WARMUP_RANGE[timeframe] ?? cfg.range;
    const url =
      `/api/yahoo/chart/${encodeURIComponent(toYahooTicker(symbol))}` +
      `?range=${requestRange}&interval=${cfg.interval}`;
    const res = await fetch(url, { headers: { Accept: 'application/json' }, signal });
    if (!res.ok) return null;

    const payload: YahooChartPayload = await res.json();
    const result = payload?.chart?.result?.[0];
    const quote = result?.indicators?.quote?.[0];
    if (!result?.timestamp || !quote) return null;

    const intraday = cfg.interval.endsWith('m') || cfg.interval === '1h';
    const points: StockDataPoint[] = [];

    for (let i = 0; i < result.timestamp.length; i++) {
      const close = quote.close?.[i];
      const open = quote.open?.[i];
      const high = quote.high?.[i];
      const low = quote.low?.[i];
      if (
        close == null || open == null || high == null || low == null ||
        Number.isNaN(close) || Number.isNaN(open)
      ) {
        continue;
      }
      points.push({
        timestamp: result.timestamp[i],
        date: formatDate(result.timestamp[i], intraday),
        open,
        high,
        low,
        close,
        volume: quote.volume?.[i] ?? 0,
      });
    }

    // Moving averages are left undefined until their full lookback exists.
    points.forEach((p, i) => {
      if (i >= 9) {
        let sum = 0;
        for (let j = i - 9; j <= i; j++) sum += points[j].close;
        p.ma10 = Number((sum / 10).toFixed(4));
      }
      if (i >= 49) {
        let sum = 0;
        for (let j = i - 49; j <= i; j++) sum += points[j].close;
        p.sma50 = Number((sum / 50).toFixed(4));
      }
      if (i >= 199) {
        let sum = 0;
        for (let j = i - 199; j <= i; j++) sum += points[j].close;
        p.sma200 = Number((sum / 200).toFixed(4));
      }
    });

    // EMA starts at the first close, then applies the standard smoothing factor.
    let ema9 = points[0]?.close;
    let ema20 = points[0]?.close;
    points.forEach((p, i) => {
      if (i === 0) return;
      ema9 = p.close * (2 / 10) + (ema9 as number) * (1 - 2 / 10);
      ema20 = p.close * (2 / 21) + (ema20 as number) * (1 - 2 / 21);
      if (i >= 8) p.ema9 = Number((ema9 as number).toFixed(4));
      if (i >= 19) p.ema20 = Number((ema20 as number).toFixed(4));
    });

    const visibleStart = visibleStartTimestamp(timeframe);
    return visibleStart === undefined
      ? points
      : points.filter((point) => point.timestamp >= visibleStart);
  } catch (err) {
    if ((err as Error)?.name === 'AbortError') throw err;
    return null;
  }
}
