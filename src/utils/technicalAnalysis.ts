import { Stock, StockDataPoint, TechnicalAnalysis, RiskLevel } from '../types';

/**
 * Wilder-smoothed RSI. Returns null when there is not enough real history —
 * callers must skip the factor entirely instead of fabricating a value.
 */
export function computeRSI(prices: number[], period: number = 14): number | null {
  if (prices.length < period + 1) return null;
  
  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff >= 0) {
      gains += diff;
    } else {
      losses += Math.abs(diff);
    }
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  for (let i = period + 1; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff >= 0) {
      avgGain = (avgGain * (period - 1) + diff) / period;
      avgLoss = (avgLoss * (period - 1)) / period;
    } else {
      avgGain = (avgGain * (period - 1)) / period;
      avgLoss = (avgLoss * (period - 1) + Math.abs(diff)) / period;
    }
  }

  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  const rsi = 100 - 100 / (1 + rs);
  return Number(rsi.toFixed(1));
}

export function computeMA10(prices: number[]): number {
  if (prices.length === 0) return 0;
  const slice = prices.slice(-10);
  const sum = slice.reduce((a, b) => a + b, 0);
  return Number((sum / slice.length).toFixed(2));
}

/** Daily return stdev in percent over the given closes; null if too few points. */
export function computeVolatility(prices: number[]): number | null {
  if (prices.length < 3) return null;
  const returns: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (returns.length - 1);
  const stdDev = Math.sqrt(variance);
  // DAILY percent stdev (not annualized — multiply by √252 for the annual view)
  return Number((stdDev * 100).toFixed(2));
}

/**
 * Average True Range (Wilder smoothing) in price units. Unlike close-to-close
 * stdev it accounts for intrabar range and overnight gaps, which makes it the
 * right basis for "tomorrow's expected range". Returns null when the series
 * has fewer than period+1 candles.
 */
export function computeATR(series: StockDataPoint[], period: number = 14): number | null {
  if (series.length < period + 1) return null;

  const trs: number[] = [];
  for (let i = 1; i < series.length; i++) {
    const { high, low, close } = series[i];
    const prevClose = series[i - 1].close;
    trs.push(Math.max(high - low, Math.abs(high - prevClose), Math.abs(low - prevClose)));
  }

  // Seed with the simple mean of the first `period` true ranges, then smooth.
  let atr = trs.slice(0, period).reduce((a, b) => a + b, 0) / period;
  for (let i = period; i < trs.length; i++) {
    atr = (atr * (period - 1) + trs[i]) / period;
  }
  return Number(atr.toFixed(4));
}

export function analyzeStock(
  stock: Stock,
  riskLevel: RiskLevel = 'Medium'
): TechnicalAnalysis {
  // Real daily closes: last ~22 points of the hydrated 1Y series.
  const history1M = stock.history['1M'] || [];
  const prices = history1M.map((p) => p.close);
  const yearSeries = stock.history['1Y'] || [];
  const yearlyCloses = yearSeries.map((p) => p.close);
  const currentPrice = stock.currentPrice;

  // 1. 10-Day Moving Average (short-term trend)
  const ma10 = computeMA10(prices.length > 0 ? prices : [currentPrice]);
  const isPriceAboveMA10 = currentPrice >= ma10;
  const ma10DiffPercent = ma10 > 0 ? ((currentPrice - ma10) / ma10) * 100 : 0;

  // 2. 14-Day RSI — fed ~100 daily closes so the Wilder seed washes out; a 1M
  // window leaves RSI dominated by its initialization. Null if too short.
  const rsi = computeRSI(yearlyCloses.slice(-101));
  const rsiStatus =
    rsi === null ? 'neutral' : rsi <= 32 ? 'oversold' : rsi >= 68 ? 'overbought' : 'neutral';

  // 3. Volume Surge — only genuine surges (≥ 1.5× the 10-day average) count.
  const VOLUME_SURGE_THRESHOLD = 1.5;
  const volumeRatio = stock.avgVolume10d > 0 ? stock.volume / stock.avgVolume10d : 1.0;
  const isVolumeSurge = volumeRatio >= VOLUME_SURGE_THRESHOLD;

  // 4. Volatility — daily return stdev (%) over ~90 sessions for stability
  // (NOT annualized; ×√252 below). Null when history is too short.
  const volWindow = yearlyCloses.length >= 31 ? yearlyCloses.slice(-90) : prices;
  const volatility = computeVolatility(volWindow);

  // 4b. ATR(14) from real daily candles — gap-aware range estimate
  const atr14 = computeATR(yearSeries);
  const atrPercent =
    atr14 && currentPrice > 0 ? Number(((atr14 / currentPrice) * 100).toFixed(2)) : null;

  // 5. 50-Day Moving Average (intermediate trend, from real 1Y series)
  const sma50 =
    yearlyCloses.length >= 50
      ? yearlyCloses.slice(-50).reduce((a, b) => a + b, 0) / 50
      : null;
  const sma50GapPercent = sma50 && sma50 > 0 ? ((currentPrice - sma50) / sma50) * 100 : null;

  // 6. 5-day momentum (% move over the last week)
  const ret5d =
    prices.length >= 6 && prices[prices.length - 6] > 0
      ? ((currentPrice - prices[prices.length - 6]) / prices[prices.length - 6]) * 100
      : null;

  /* ------------------------------------------------------------------
   * Signal model — calibrated so that a single factor can never dominate.
   *
   * Each factor is bounded and symmetric around 0 (neutral = no opinion),
   * and the sum maps onto a 0-100 score centred at 50. Typical outputs sit
   * between 40 and 60; only when short trend, intermediate trend, momentum,
   * RSI AND volume all align does the score exceed ~65.
   *
   * This is a heuristic composite of market internals — NOT a calibrated
   * probability of any outcome.
   * ------------------------------------------------------------------ */
  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

  // Factor A: price vs MA10 — magnitude-scaled, hard-capped at ±8.
  const ma10Score = clamp(ma10DiffPercent * 1.2, -8, 8);

  // Factor B: RSI — dead zone 48-52 (no signal), then linear, capped ±7.
  // Overbought (>70) actually REDUCES the score (mean-reversion risk).
  let rsiScore = 0;
  if (rsi !== null) {
    if (rsi > 52 && rsi <= 70) rsiScore = ((rsi - 52) / 18) * 7;
    else if (rsi < 48 && rsi >= 30) rsiScore = -((48 - rsi) / 18) * 7;
    else if (rsi > 70) rsiScore = -(Math.min(10, (rsi - 70)) * 0.5); // overbought penalty
    else if (rsi < 30) rsiScore = Math.min(9, ((30 - rsi) * 0.45)); // oversold bounce potential
  }

  // Factor C: price vs SMA50 — intermediate trend context, capped ±7.
  const sma50Score = sma50GapPercent !== null ? clamp(sma50GapPercent * 0.35, -7, 7) : 0;

  // Factor D: 5-day momentum — recent push/fade, capped ±5.
  const mom5Score = ret5d !== null ? clamp(ret5d * 1.0, -5, 5) : 0;

  // Factor E: volume confirmation — contributes ONLY on surge days. On ordinary
  // days it stays silent: a small ±1 lean would just duplicate short momentum.
  const isDayPositive = stock.changePercent >= 0;
  const volumeScore = isVolumeSurge
    ? (isDayPositive ? 1 : -1) * Math.min(6, (volumeRatio - 1) * 10)
    : 0;

  // Total raw score from Technicals — risk preference is deliberately NOT
  // applied here (it must not inflate the forecast); it lives in the
  // position-sizing hint below.
  const rawModelTotal = ma10Score + rsiScore + sma50Score + mom5Score + volumeScore;

  // Map to a 0-100 score centred at 50. Pre-clamp bounds are [15, 85];
  // the final clamp keeps outputs within [25, 75].
  let probabilityRise = Math.round(clamp(50 + rawModelTotal, 25, 75));
  const probabilityDip = 100 - probabilityRise;

  const direction: 'rise' | 'dip' = probabilityRise >= 50 ? 'rise' : 'dip';

  // Target Price Window calculation
  // Daily expected move based on volatility standard deviation & probability skew
  const expectedReturnPercent =
    ((probabilityRise - 50) / 50) * ((volatility ?? 0) * 0.85);
  const targetChangePercent = Number(expectedReturnPercent.toFixed(2));
  const targetPrice = Number((currentPrice * (1 + targetChangePercent / 100)).toFixed(2));

  // Volatility corridor: ATR(14)-based expected daily range (captures overnight
  // gaps). Stdev fallback only when real candle history is too short for ATR.
  const dailyRangePercent = atrPercent ?? Math.max(1.2, (volatility ?? 0) * 0.65);
  const targetPriceLow = Number((targetPrice * (1 - dailyRangePercent / 100)).toFixed(2));
  const targetPriceHigh = Number((targetPrice * (1 + dailyRangePercent / 100)).toFixed(2));

  // Annualized view of the same daily stdev (σ_daily × √252) — display only.
  const volatilityAnnualized =
    volatility !== null ? Number((volatility * Math.sqrt(252)).toFixed(1)) : null;

  /* ------------------------------------------------------------------
   * Position-sizing hint — the proper home for risk preference.
   * Kelly at an assumed ~1:1 payoff: f = max(0, 2p − 1), where p is the
   * dominant direction's probability. Scaled by the user's risk tier and
   * capped at 25% of intended allocation. Near-coin-flip ⇒ near-zero size.
   * Heuristic guidance only, not investment advice.
   * ------------------------------------------------------------------ */
  const pDominant = Math.max(probabilityRise, probabilityDip) / 100;
  const kellyUnit = Math.max(0, 2 * pDominant - 1);
  const riskScale = riskLevel === 'High' ? 1.0 : riskLevel === 'Medium' ? 0.6 : 0.35;
  const suggestedPositionPct =
    Math.round(Math.min(25, kellyUnit * 100 * riskScale) * 2) / 2;

  // Confidence Score & Level
  // Tied to (a) distance from the neutral 50 mark and (b) how many factors
  // agree with the net direction. A near-neutral model honestly reports LOW
  // confidence instead of a fake 60% floor.
  const factorList = [ma10Score, rsiScore, sma50Score, mom5Score, volumeScore];
  const netSign = rawModelTotal >= 0 ? 1 : -1;
  const agreeingFactors = factorList.filter(
    (f) => Math.abs(f) > 0.5 && (f >= 0 ? 1 : -1) === netSign
  ).length;

  const confidenceScore = clamp(
    Math.round(38 + Math.abs(rawModelTotal) * 1.1 + agreeingFactors * 3),
    30,
    90
  );
  let confidenceLevel: 'Low' | 'Moderate' | 'High' | 'Extreme' = 'Moderate';
  if (confidenceScore >= 78) confidenceLevel = 'Extreme';
  else if (confidenceScore >= 65) confidenceLevel = 'High';
  else if (confidenceScore >= 50) confidenceLevel = 'Moderate';
  else confidenceLevel = 'Low';

  // Position within the real 52-week range (0 = at low, 100 = at high)
  const range52w = stock.high52w - stock.low52w;
  const position52wPercent =
    range52w > 0 ? Number((((currentPrice - stock.low52w) / range52w) * 100).toFixed(1)) : 50;

  // Technical Checklist Items with clear mathematical tags
  const checkList = [
    {
      id: 'ma10-check',
      titleKey: 'ma10Crossover',
      descriptionKey: isPriceAboveMA10 ? 'aboveMA10' : 'belowMA10',
      valueText: `P: ${currentPrice} vs MA10: ${ma10}`,
      isBullish: isPriceAboveMA10,
      scoreContribution: Math.round(Math.abs(ma10Score)),
      explanationKey: 'ma10Expl',
    },
    ...(sma50GapPercent !== null && sma50 !== null
      ? [
          {
            id: 'sma50-check',
            titleKey: 'sma50Trend',
            descriptionKey: sma50GapPercent >= 0 ? 'aboveSMA50' : 'belowSMA50',
            valueText: `P: ${currentPrice} vs SMA50: ${sma50.toFixed(2)}`,
            isBullish: sma50GapPercent >= 0,
            scoreContribution: Math.round(Math.abs(sma50Score)),
            explanationKey: 'sma50Expl',
          },
        ]
      : []),
    ...(rsi !== null
      ? [
          {
            id: 'rsi-check',
            titleKey: 'rsiMomentum',
            descriptionKey: rsiStatus === 'oversold' ? 'oversold' : rsiStatus === 'overbought' ? 'overbought' : rsi >= 50 ? 'momentumPositive' : 'momentumNegative',
            valueText: `RSI(14): ${rsi}`,
            isBullish: rsi < 32 || (rsi >= 50 && rsi < 70),
            scoreContribution: Math.round(Math.abs(rsiScore)),
            explanationKey: 'rsiExpl',
          },
        ]
      : []),
    ...(ret5d !== null
      ? [
          {
            id: 'momentum-check',
            titleKey: 'momentumShort',
            descriptionKey:
              ret5d > 0 ? 'momRising' : ret5d < 0 ? 'momFading' : 'momFlat',
            valueText: `Δ ${ret5d >= 0 ? '+' : ''}${ret5d.toFixed(1)}% (5D)`,
            isBullish: mom5Score >= 0,
            scoreContribution: Math.round(Math.abs(mom5Score)),
            explanationKey: 'mom5Expl',
          },
        ]
      : []),
    {
      id: 'volume-check',
      titleKey: 'volumeSurge',
      descriptionKey: isVolumeSurge ? 'highVolume' : 'lowVolume',
      valueText: `${(volumeRatio * 100).toFixed(0)}% of 10D Avg`,
      isBullish: isDayPositive && isVolumeSurge,
      scoreContribution: Math.round(Math.abs(volumeScore)),
      explanationKey: 'volumeExpl',
    },
  ];

  return {
    ma10,
    isPriceAboveMA10,
    sma50,
    rsi,
    rsiStatus,
    volumeRatio,
    volatility,
    volatilityAnnualized,
    atr14Percent: atrPercent,
    newsSentimentScore: 0, // no fabricated sentiment is fed to the model
    rawBullishScore: probabilityRise,
    rawBearishScore: probabilityDip,
    probabilityRise,
    probabilityDip,
    direction,
    targetPrice,
    targetChangePercent,
    targetPriceLow,
    targetPriceHigh,
    suggestedPositionPct,
    confidenceScore,
    confidenceLevel,
    checkList,
  };
}
