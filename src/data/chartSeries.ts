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
    const url =
      `/api/yahoo/chart/${encodeURIComponent(toYahooTicker(symbol))}` +
      `?range=${cfg.range}&interval=${cfg.interval}`;
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

    // Moving average over the previous 10 points.
    points.forEach((p, i) => {
      if (i >= 9) {
        let sum = 0;
        for (let j = i - 9; j <= i; j++) sum += points[j].close;
        p.ma10 = Number((sum / 10).toFixed(4));
      }
    });

    return points;
  } catch (err) {
    if ((err as Error)?.name === 'AbortError') throw err;
    return null;
  }
}
