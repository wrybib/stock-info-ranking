import { Stock, TechnicalAnalysis, RiskLevel } from '../types';

export function computeRSI(prices: number[], period: number = 14): number {
  if (prices.length < period + 1) return 50.0;
  
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

export function computeVolatility(prices: number[]): number {
  if (prices.length < 2) return 1.5;
  const returns: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (returns.length - 1);
  const stdDev = Math.sqrt(variance);
  // Annualized or daily percentage
  return Number((stdDev * 100).toFixed(2));
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

  // 2. 14-Day RSI
  const rsi = computeRSI(prices.length >= 15 ? prices : [currentPrice * 0.98, currentPrice * 0.99, currentPrice]);
  const rsiStatus = rsi <= 32 ? 'oversold' : rsi >= 68 ? 'overbought' : 'neutral';

  // 3. Volume Surge
  const volumeRatio = stock.avgVolume10d > 0 ? stock.volume / stock.avgVolume10d : 1.0;
  const isVolumeSurge = volumeRatio >= 1.15;

  // 4. Volatility & Standard Deviation
  const volatility = computeVolatility(prices);

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

  // Risk multiplier
  const riskMultiplier = riskLevel === 'High' ? 1.2 : riskLevel === 'Low' ? 0.8 : 1.0;

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
  if (rsi > 52 && rsi <= 70) rsiScore = ((rsi - 52) / 18) * 7;
  else if (rsi < 48 && rsi >= 30) rsiScore = -((48 - rsi) / 18) * 7;
  else if (rsi > 70) rsiScore = -(Math.min(10, (rsi - 70)) * 0.5); // overbought penalty
  else if (rsi < 30) rsiScore = Math.min(9, ((30 - rsi) * 0.45)); // oversold bounce potential

  // Factor C: price vs SMA50 — intermediate trend context, capped ±7.
  const sma50Score = sma50GapPercent !== null ? clamp(sma50GapPercent * 0.35, -7, 7) : 0;

  // Factor D: 5-day momentum — recent push/fade, capped ±5.
  const mom5Score = ret5d !== null ? clamp(ret5d * 1.0, -5, 5) : 0;

  // Factor E: volume confirmation — meaningful only on surge days,
  // small directional lean otherwise.
  const isDayPositive = stock.changePercent >= 0;
  const volumeScore = isVolumeSurge
    ? (isDayPositive ? 1 : -1) * Math.min(6, (volumeRatio - 1) * 10)
    : isDayPositive
    ? 1
    : -1;

  // Total raw score from Technicals
  const rawModelTotal = (ma10Score + rsiScore + sma50Score + mom5Score + volumeScore) * riskMultiplier;

  // Map to a 0-100 score centred at 50. Theoretical bounds ≈ [22, 78];
  // realistic outputs cluster in [40, 60].
  let probabilityRise = Math.round(clamp(50 + rawModelTotal, 25, 75));
  const probabilityDip = 100 - probabilityRise;

  const direction: 'rise' | 'dip' = probabilityRise >= 50 ? 'rise' : 'dip';

  // Target Price Window calculation
  // Daily expected move based on volatility standard deviation & probability skew
  const expectedReturnPercent = ((probabilityRise - 50) / 50) * (volatility * 0.85);
  const targetChangePercent = Number(expectedReturnPercent.toFixed(2));
  const targetPrice = Number((currentPrice * (1 + targetChangePercent / 100)).toFixed(2));

  // Volatility corridor: Min to Max tomorrow range
  const dailyRangePercent = Math.max(1.2, volatility * 0.65);
  const targetPriceLow = Number((targetPrice * (1 - dailyRangePercent / 100)).toFixed(2));
  const targetPriceHigh = Number((targetPrice * (1 + dailyRangePercent / 100)).toFixed(2));

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
      formulaInfo: `SMA_{10} = \\frac{1}{10} \\sum_{i=1}^{10} P_{t-i} | Delta: ${ma10DiffPercent >= 0 ? '+' : ''}${ma10DiffPercent.toFixed(1)}%`,
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
            formulaInfo: `SMA_{50} = \\frac{1}{50} \\sum_{i=1}^{50} P_{t-i} | Delta: ${sma50GapPercent >= 0 ? '+' : ''}${sma50GapPercent.toFixed(1)}%`,
          },
        ]
      : []),
    {
      id: 'rsi-check',
      titleKey: 'rsiMomentum',
      descriptionKey: rsiStatus === 'oversold' ? 'oversold' : rsiStatus === 'overbought' ? 'overbought' : rsi >= 50 ? 'momentumPositive' : 'momentumNegative',
      valueText: `RSI(14): ${rsi}`,
      isBullish: rsi < 32 || (rsi >= 50 && rsi < 70),
      scoreContribution: Math.round(Math.abs(rsiScore)),
      formulaInfo: `RSI = 100 - \\frac{100}{1 + RS} | 14-period Wilder smoothing`,
    },
    {
      id: 'volume-check',
      titleKey: 'volumeSurge',
      descriptionKey: isVolumeSurge ? 'highVolume' : 'lowVolume',
      valueText: `${(volumeRatio * 100).toFixed(0)}% of 10D Avg`,
      isBullish: isDayPositive && isVolumeSurge,
      scoreContribution: Math.round(Math.abs(volumeScore)),
      formulaInfo: `V_{ratio} = \\frac{V_{today}}{V_{avg10d}} = ${volumeRatio.toFixed(2)}x`,
    },
    {
      id: 'range52w-check',
      titleKey: 'volatilitySentiment',
      descriptionKey: position52wPercent >= 70 ? 'momentumPositive' : position52wPercent <= 30 ? 'oversold' : 'neutral',
      valueText: `${position52wPercent}% of 52W Range`,
      isBullish: position52wPercent >= 55,
      scoreContribution: Math.round(Math.abs(position52wPercent - 50) / 5),
      formulaInfo: `Pos = \\frac{P - L_{52w}}{H_{52w} - L_{52w}} = ${position52wPercent}% of 52-week range`,
    },
  ];

  return {
    ma10,
    isPriceAboveMA10,
    rsi,
    rsiStatus,
    volumeRatio,
    volatility,
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
    confidenceScore,
    confidenceLevel,
    checkList,
  };
}
