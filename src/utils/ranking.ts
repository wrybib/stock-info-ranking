import {
  Stock,
  Fundamentals,
  OptionsSnapshot,
  RankedStock,
  RankedMetric,
} from '../types';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

interface MetricInput {
  key: string;
  label: string;
  /** Raw numeric value used for cross-sectional stats. */
  value: number;
  /** +1 => higher is better, -1 => lower is better. */
  direction: 1 | -1;
  /** Relative weight inside its category (sums need not be 1). */
  weight: number;
  displayValue: string;
}

interface CategoryResult {
  score: number | null;
  metrics: RankedMetric[];
}

/* ------------------------------------------------------------------ */
/* Technical metrics (real daily candles from history['1Y'])           */
/* ------------------------------------------------------------------ */

function sma(values: number[], period: number): number | null {
  if (values.length < period) return null;
  const slice = values.slice(-period);
  return slice.reduce((a, b) => a + b, 0) / period;
}

export function computeTechnicalMetrics(stock: Stock): MetricInput[] | null {
  const series = stock.history['1Y'] ?? [];
  // Require a real multi-month daily series before scoring anything.
  if (series.length < 60) return null;

  const closes = series.map((p) => p.close);
  const volumes = series.map((p) => p.volume);
  const price = closes[closes.length - 1];
  if (!price || price <= 0) return null;

  const pctReturn = (lookback: number): number | null => {
    if (closes.length < lookback + 1) return null;
    const past = closes[closes.length - 1 - lookback];
    return past > 0 ? ((price - past) / past) * 100 : null;
  };

  // Return between two lookback points, e.g. t-63 -> t-21.
  const pctReturnBetween = (fromLb: number, toLb: number): number | null => {
    if (closes.length < fromLb + 1) return null;
    const start = closes[closes.length - 1 - fromLb];
    const end = closes[closes.length - 1 - toLb];
    return start > 0 ? ((end - start) / start) * 100 : null;
  };

  // Academic-style momentum (Jegadeesh–Titman): 3-month move EXCLUDING the most
  // recent month. Avoids short-term-reversal contamination and heavy overlap
  // with the freshest price action.
  const mom3x1 = pctReturnBetween(63, 21);
  const mom3m = pctReturn(63);
  const ma50 = sma(closes, 50);
  const ma50Gap = ma50 && ma50 > 0 ? ((price - ma50) / ma50) * 100 : null;

  const high52w =
    stock.high52w > 0
      ? stock.high52w
      : Math.max(...series.map((p) => p.high));
  const distFromHigh = high52w > 0 ? ((price - high52w) / high52w) * 100 : null;

  const recentVol = volumes.slice(-5);
  const baseVol = volumes.slice(-25, -5);
  const avg = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);
  const volTrend = baseVol.length > 0 && avg(baseVol) > 0 ? avg(recentVol) / avg(baseVol) : null;

  const fmt = (v: number, suffix = '%') =>
    `${v >= 0 ? '+' : ''}${v.toFixed(1)}${suffix}`;

  const metrics: MetricInput[] = [];
  if (mom3x1 !== null)
    metrics.push({ key: 'mom3x1', label: 'Momentum 3M (ex-last mo.)', value: mom3x1, direction: 1, weight: 0.30, displayValue: fmt(mom3x1) });
  if (mom3m !== null)
    metrics.push({ key: 'mom3m', label: 'Momentum 3M', value: mom3m, direction: 1, weight: 0.25, displayValue: fmt(mom3m) });
  if (ma50Gap !== null)
    metrics.push({ key: 'ma50gap', label: 'Price vs SMA50', value: ma50Gap, direction: 1, weight: 0.25, displayValue: fmt(ma50Gap) });
  if (distFromHigh !== null)
    metrics.push({ key: 'disthigh', label: 'vs 52W High', value: distFromHigh, direction: 1, weight: 0.10, displayValue: fmt(distFromHigh) });
  if (volTrend !== null)
    metrics.push({
      key: 'voltrend',
      label: 'Volume Trend',
      value: volTrend,
      direction: 1,
      weight: 0.10,
      displayValue: `${volTrend.toFixed(2)}x`,
    });

  return metrics.length >= 2 ? metrics : null;
}

/* ------------------------------------------------------------------ */
/* Fundamental metrics                                                 */
/* ------------------------------------------------------------------ */

export function computeFundamentalMetrics(fund: Fundamentals | null): MetricInput[] | null {
  if (!fund) return null;

  const metrics: MetricInput[] = [];
  const push = (
    key: string,
    label: string,
    v: number | undefined,
    direction: 1 | -1,
    weight: number,
    render: (x: number) => string
  ) => {
    if (typeof v === 'number' && Number.isFinite(v)) {
      metrics.push({ key, label, value: v, direction, weight, displayValue: render(v) });
    }
  };

  push('revgrowth', 'Revenue Growth YoY', fund.revenueGrowthPercent, 1, 0.25, (x) => `${x >= 0 ? '+' : ''}${x.toFixed(1)}%`);
  push('earngrowth', 'Earnings Growth YoY', fund.earningsGrowthPercent, 1, 0.25, (x) => `${x >= 0 ? '+' : ''}${x.toFixed(1)}%`);
  push('margin', 'Profit Margin', fund.profitMarginPercent, 1, 0.20, (x) => `${x.toFixed(1)}%`);
  push('roe', 'Return on Equity', fund.roePercent, 1, 0.15, (x) => `${x.toFixed(1)}%`);
  push('dte', 'Debt/Equity', fund.debtToEquity, -1, 0.15, (x) => `${x.toFixed(0)}%`);

  return metrics.length >= 2 ? metrics : null;
}

/* ------------------------------------------------------------------ */
/* Options metrics                                                     */
/* ------------------------------------------------------------------ */

export function computeOptionsMetrics(options: OptionsSnapshot | null): MetricInput[] | null {
  if (!options) return null;

  const metrics: MetricInput[] = [];
  const addRatio = (key: string, label: string, value: number | undefined, weight: number) => {
    if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
      metrics.push({
        key,
        label,
        value,
        direction: -1,
        weight,
        displayValue: value.toFixed(2),
      });
    }
  };

  // Lower put/call ratios indicate more bullish positioning.
  addRatio('pcr', 'Put/Call OI', options.putCallOiRatio, 0.6);
  addRatio('pcrVolume', 'Put/Call Volume', options.putCallVolumeRatio, 0.4);

  if (typeof options.atmIvPercent === 'number' && Number.isFinite(options.atmIvPercent) && options.atmIvPercent > 0) {
    metrics.push({
      key: 'atmIv',
      label: 'ATM Implied Volatility',
      value: options.atmIvPercent,
      direction: -1,
      weight: 0.2,
      displayValue: `${options.atmIvPercent.toFixed(1)}%`,
    });
  }

  return metrics.length > 0 ? metrics : null;
}

/* ------------------------------------------------------------------ */
/* Cross-sectional z-scores & composite                                */
/* ------------------------------------------------------------------ */

const CATEGORY_WEIGHTS: Record<string, number> = {
  technical: 0.45,
  fundamental: 0.35,
  options: 0.2,
};

/**
 * Rank every watchlist stock by weighted cross-sectional z-scores.
 *
 * Each metric is standardized across the current watchlist
 * (z = (x - mean) / sigma, sign-adjusted by metric direction), then combined:
 *   category score = weighted mean of that category's z-scores
 *   composite      = weighted mean of available category scores
 *
 * Stocks lacking data for a category simply have that category excluded and
 * the remaining weights renormalized — nothing is imputed or invented.
 * Requires at least 2 stocks; otherwise returns an empty ranking.
 */
export function computeRankings(
  stocks: Stock[],
  fundamentalsByTicker: Record<string, Fundamentals | null>,
  optionsByTicker: Record<string, OptionsSnapshot | null>
): RankedStock[] {
  if (stocks.length < 2) return [];

  // Gather raw metric inputs per stock.
  const rawPerStock = stocks.map((stock) => {
    const tickerKey = stock.ticker.toUpperCase();
    return {
      stock,
      categories: {
        technical: computeTechnicalMetrics(stock),
        fundamental: computeFundamentalMetrics(fundamentalsByTicker[tickerKey] ?? null),
        options: computeOptionsMetrics(optionsByTicker[tickerKey] ?? null),
      } as Record<string, MetricInput[] | null>,
    };
  });

  // Collect values per metric key across stocks that have them.
  const valuesByKey = new Map<string, number[]>();
  rawPerStock.forEach(({ categories }) => {
    Object.values(categories).forEach((metrics) => {
      metrics?.forEach((m) => {
        if (!valuesByKey.has(m.key)) valuesByKey.set(m.key, []);
        valuesByKey.get(m.key)!.push(m.value);
      });
    });
  });

  const statsByKey = new Map<string, { mean: number; sigma: number }>();
  valuesByKey.forEach((values, key) => {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance =
      values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / Math.max(1, values.length - 1);
    const sigma = Math.sqrt(variance);
    statsByKey.set(key, { mean, sigma });
  });

  // Build ranked results.
  const results: RankedStock[] = rawPerStock.map(({ stock, categories }) => {
    const allMetrics: RankedMetric[] = [];
    const catScores: Record<string, number | null> = {};

    (Object.keys(categories) as Array<keyof typeof categories>).forEach((cat) => {
      const inputs = categories[cat];
      if (!inputs || inputs.length === 0) {
        catScores[cat] = null;
        return;
      }

      let weightedSum = 0;
      let weightTotal = 0;
      inputs.forEach((m) => {
        const { mean, sigma } = statsByKey.get(m.key)!;
        // Degenerate spread (all equal) => neutral contribution.
        const zRaw = sigma > 1e-9 ? (m.value - mean) / sigma : 0;
        const z = Math.max(-2.5, Math.min(2.5, zRaw * m.direction));
        weightedSum += z * m.weight;
        weightTotal += m.weight;
        allMetrics.push({
          key: m.key,
          label: m.label,
          category: cat as any,
          displayValue: m.displayValue,
          z: Math.round(z * 100) / 100,
          weight: m.weight,
        });
      });

      catScores[cat] = weightTotal > 0 ? weightedSum / weightTotal : null;
    });

    let compositeNum = 0;
    let compositeDen = 0;
    Object.entries(catScores).forEach(([cat, score]) => {
      if (score !== null) {
        compositeNum += score * CATEGORY_WEIGHTS[cat];
        compositeDen += CATEGORY_WEIGHTS[cat];
      }
    });
    const composite = compositeDen > 0 ? compositeNum / compositeDen : 0;

    return {
      stock,
      rank: 0,
      compositeScore: Math.round(composite * 100) / 100,
      technicalScore: catScores.technical !== undefined ? roundOrNull(catScores.technical) : null,
      fundamentalScore: catScores.fundamental !== undefined ? roundOrNull(catScores.fundamental) : null,
      optionsScore: catScores.options !== undefined ? roundOrNull(catScores.options) : null,
      metrics: allMetrics,
      dataQuality: {
        technical: catScores.technical != null,
        fundamental: catScores.fundamental != null,
        options: catScores.options != null,
      },
    };
  });

  results.sort((a, b) => b.compositeScore - a.compositeScore);
  results.forEach((r, i) => {
    r.rank = i + 1;
  });

  return results;
}

function roundOrNull(v: number | null): number | null {
  return v === null ? null : Math.round(v * 100) / 100;
}
