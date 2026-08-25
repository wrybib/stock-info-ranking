import { Fundamentals } from '../types';
import { toYahooTicker } from './yahooFinance';

/* ------------------------------------------------------------------ */
/* Fundamentals via Yahoo quoteSummary                                 */
/* Fetched through our proxy: /api/yahoo/fundamentals/:symbol          */
/* ------------------------------------------------------------------ */

type YahooField = { raw?: number; fmt?: string } | undefined;

const num = (field: YahooField): number | undefined =>
  field && typeof field.raw === 'number' && Number.isFinite(field.raw) ? field.raw : undefined;

/** Parse "12.34%" fmt strings; falls back to raw*100 for fraction-typed fields. */
const pct = (field: YahooField, treatRawAsFraction = true): number | undefined => {
  if (!field) return undefined;
  if (typeof field.fmt === 'string' && field.fmt.includes('%')) {
    const parsed = parseFloat(field.fmt.replace('%', '').replace(/,/g, ''));
    if (Number.isFinite(parsed)) return parsed;
  }
  const raw = num(field);
  if (raw === undefined) return undefined;
  return treatRawAsFraction ? Number((raw * 100).toFixed(2)) : raw;
};

const isoFromTimestamp = (field: YahooField): string | undefined => {
  const raw = num(field);
  if (raw === undefined || raw <= 0) return undefined;
  return new Date(raw * 1000).toISOString();
};

/**
 * Fetch fundamentals for a symbol from our proxy.
 * Returns null on any failure — callers must render an explicit
 * "unavailable" state rather than falling back to fake data.
 */
export async function fetchYahooFundamentals(symbol: string): Promise<Fundamentals | null> {
  try {
    const url = `/api/yahoo/fundamentals/${encodeURIComponent(toYahooTicker(symbol))}`;
    const response = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!response.ok) return null;

    const payload = await response.json();
    const result = payload?.quoteSummary?.result?.[0];
    if (!result) return null;

    const profile = result.assetProfile ?? {};
    const detail = result.summaryDetail ?? {};
    const stats = result.defaultKeyStatistics ?? {};
    const fin = result.financialData ?? {};
    const cal = result.calendarEvents ?? {};

    // Dividend yield is inconsistent across Yahoo payloads: prefer the
    // formatted "0.65%" string, else fall back to financialData's raw value.
    const dividendYield =
      pct(detail.dividendYield as YahooField) ?? num(fin.dividendYield as YahooField);

    const trend = Array.isArray(result.recommendationTrend?.trend)
      ? (result.recommendationTrend.trend as any[]).map((point: any) => ({
          period: String(point.period ?? ''),
          strongBuy: Number(point.strongBuy ?? 0),
          buy: Number(point.buy ?? 0),
          hold: Number(point.hold ?? 0),
          sell: Number(point.sell ?? 0),
          strongSell: Number(point.strongSell ?? 0),
        }))
      : undefined;

    return {
      ticker: symbol.trim().toUpperCase(),
      currency: detail.currency?.fmt || undefined,
      sector: profile.sector,
      industry: profile.industry,

      trailingPe: num(detail.trailingPE as YahooField),
      forwardPe: num(detail.forwardPE as YahooField),
      pegRatio: num(stats.pegRatio as YahooField),
      priceToBook: num(stats.priceToBook as YahooField),
      bookValue: num(stats.bookValue as YahooField),
      epsTrailing: num(stats.trailingEps as YahooField),
      epsForward: num(stats.forwardEps as YahooField),
      beta: num(stats.beta as YahooField) ?? num(detail.beta as YahooField),
      marketCap: num(detail.marketCap as YahooField),

      dividendYieldPercent: dividendYield,
      dividendRate: num(detail.dividendRate as YahooField),
      payoutRatioPercent: pct(detail.payoutRatio as YahooField),

      grossMarginPercent: pct(fin.grossMargins as YahooField),
      operatingMarginPercent: pct(fin.operatingMargins as YahooField),
      ebitdaMarginPercent: pct(fin.ebitdaMargins as YahooField),
      profitMarginPercent: pct(fin.profitMargins as YahooField),
      roePercent: pct(fin.returnOnEquity as YahooField),
      roaPercent: pct(fin.returnOnAssets as YahooField),

      revenueGrowthPercent: pct(fin.revenueGrowth as YahooField),
      earningsGrowthPercent: pct(fin.earningsGrowth as YahooField),

      debtToEquity: num(fin.debtToEquity as YahooField), // already scaled by Yahoo
      currentRatio: num(fin.currentRatio as YahooField),
      quickRatio: num(fin.quickRatio as YahooField),
      totalCash: num(fin.totalCash as YahooField),
      totalDebt: num(fin.totalDebt as YahooField),
      freeCashflow: num(fin.freeCashflow as YahooField),
      operatingCashflow: num(fin.operatingCashflow as YahooField),

      targetMeanPrice: num(fin.targetMeanPrice as YahooField),
      targetHighPrice: num(fin.targetHighPrice as YahooField),
      targetLowPrice: num(fin.targetLowPrice as YahooField),
      recommendationKey:
        typeof fin.recommendationKey === 'string' ? fin.recommendationKey : undefined,
      recommendationMean: num(fin.recommendationMean as YahooField),
      numberOfAnalysts: num(fin.numberOfAnalystOpinions as YahooField),
      recommendationTrend: trend,

      nextEarningsDate: isoFromTimestamp(cal.earningsDate?.[0] as YahooField),
      exDividendDate: isoFromTimestamp(cal.exDividendDate as YahooField),
    };
  } catch {
    return null;
  }
}
