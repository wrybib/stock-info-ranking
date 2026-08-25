import { OptionsSnapshot } from '../types';
import { toYahooTicker } from './yahooFinance';

interface YahooOptionContract {
  strike?: number;
  impliedVolatility?: number;
  openInterest?: number;
  volume?: number | null;
}

interface YahooOptionsPayload {
  optionChain?: {
    result?: Array<{
      underlyingSymbol?: string;
      expirationDates?: number[];
      options?: Array<{
        calls?: YahooOptionContract[];
        puts?: YahooOptionContract[];
      }>;
      quote?: { regularMarketPrice?: number };
    }>;
    error?: unknown;
  };
}

/**
 * Derive a compact options snapshot from Yahoo's raw chain:
 *  - ATM implied volatility (strike nearest spot, nearest expiry)
 *  - put/call ratios on open interest and volume (nearest expiry)
 *
 * Returns null when the instrument has no listed options (e.g. A-shares)
 * or when upstream fails — callers must treat options metrics as optional.
 */
export async function fetchYahooOptions(
  symbol: string
): Promise<OptionsSnapshot | null> {
  try {
    const url = `/api/yahoo/options/${encodeURIComponent(toYahooTicker(symbol))}`;
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) return null;

    const payload: YahooOptionsPayload = await res.json();
    const result = payload?.optionChain?.result?.[0];
    const chain = result?.options?.[0];
    if (!chain) return null;

    const spot = Number(result?.quote?.regularMarketPrice ?? 0);
    const calls = chain.calls ?? [];
    const puts = chain.puts ?? [];
    if (calls.length === 0 && puts.length === 0) return null;

    // ATM IV: contracts whose strike is closest to the current price.
    let atmIvPercent: number | undefined;
    if (spot > 0) {
      const ivs: number[] = [];
      for (const list of [calls, puts]) {
        const atm = list
          .filter((c) => typeof c.impliedVolatility === 'number' && c.impliedVolatility > 0)
          .sort((a, b) => Math.abs((a.strike ?? 0) - spot) - Math.abs((b.strike ?? 0) - spot))[0];
        if (atm) ivs.push(atm.impliedVolatility as number);
      }
      if (ivs.length > 0) {
        atmIvPercent =
          Math.round((ivs.reduce((a, b) => a + b, 0) / ivs.length) * 100 * 10) / 10;
      }
    }

    const sumOi = (list: YahooOptionContract[]) =>
      list.reduce((total, c) => total + (typeof c.openInterest === 'number' ? c.openInterest : 0), 0);
    const sumVol = (list: YahooOptionContract[]) =>
      list.reduce((total, c) => total + (typeof c.volume === 'number' ? c.volume : 0), 0);

    const callOi = sumOi(calls);
    const putOi = sumOi(puts);
    const callVol = sumVol(calls);
    const putVol = sumVol(puts);

    const round2 = (n: number) => Math.round(n * 100) / 100;

    return {
      ticker: toYahooTicker(symbol),
      underlyingPrice: spot > 0 ? spot : undefined,
      atmIvPercent,
      putCallOiRatio: callOi > 0 ? round2(putOi / callOi) : undefined,
      putCallVolumeRatio: callVol > 0 ? round2(putVol / callVol) : undefined,
      totalOpenInterest: callOi + putOi,
      expirationCount: result?.expirationDates?.length ?? 1,
    };
  } catch {
    return null;
  }
}
