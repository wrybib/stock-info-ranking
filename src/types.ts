export type RiskLevel = 'Low' | 'Medium' | 'High';
export type DisplayMode = 'auto' | 'rise_only' | 'dip_only';

export interface StockDataPoint {
  date: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  ma10?: number;
}

export type Timeframe = '1D' | '5D' | '1M' | '6M' | 'YTD' | '1Y' | '5Y' | 'ALL';

export interface Stock {
  ticker: string;
  name: string;
  exchange: string;
  currency: string;
  currentPrice: number;
  previousClose: number;
  change: number;
  changePercent: number;
  high52w: number;
  low52w: number;
  volume: number;
  avgVolume10d: number;
  marketCap: string;
  peRatio?: number;
  sector: string;
  history: Record<Timeframe, StockDataPoint[]>;
}

export interface IndicatorCheckItem {
  id: string;
  titleKey: string;
  descriptionKey: string;
  valueText: string;
  isBullish: boolean;
  scoreContribution: number; // e.g. +30%
  formulaInfo: string;
}

export interface TechnicalAnalysis {
  ma10: number;
  isPriceAboveMA10: boolean;
  rsi: number;
  rsiStatus: 'oversold' | 'neutral' | 'overbought';
  volumeRatio: number; // volume / avgVolume
  volatility: number; // percentage standard deviation
  newsSentimentScore: number; // -1 to 1
  rawBullishScore: number; // 0 - 100
  rawBearishScore: number; // 0 - 100
  probabilityRise: number; // 0 - 100
  probabilityDip: number; // 0 - 100
  direction: 'rise' | 'dip';
  targetPrice: number;
  targetChangePercent: number;
  targetPriceLow: number;
  targetPriceHigh: number;
  confidenceScore: number; // 0 - 100
  confidenceLevel: 'Low' | 'Moderate' | 'High' | 'Extreme';
  checkList: IndicatorCheckItem[];
}

export interface NewsItem {
  id: string;
  ticker?: string;
  title: string;
  summary: string;
  source: string;
  timeAgo: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  impactPercent: number;
  url?: string;
}

/** Normalized fundamentals parsed from Yahoo quoteSummary (all percentages as numbers, e.g. 23.4 = 23.4%). */
export interface Fundamentals {
  ticker: string;
  currency?: string;
  sector?: string;
  industry?: string;

  // Valuation
  trailingPe?: number;
  forwardPe?: number;
  pegRatio?: number;
  priceToBook?: number;
  bookValue?: number;
  epsTrailing?: number;
  epsForward?: number;
  beta?: number;
  marketCap?: number; // raw USD

  // Dividends
  dividendYieldPercent?: number;
  dividendRate?: number;
  payoutRatioPercent?: number;

  // Profitability (percent)
  grossMarginPercent?: number;
  operatingMarginPercent?: number;
  ebitdaMarginPercent?: number;
  profitMarginPercent?: number;
  roePercent?: number;
  roaPercent?: number;

  // Growth (percent YoY)
  revenueGrowthPercent?: number;
  earningsGrowthPercent?: number;

  // Financial health
  debtToEquity?: number;
  currentRatio?: number;
  quickRatio?: number;
  totalCash?: number;
  totalDebt?: number;
  freeCashflow?: number;
  operatingCashflow?: number;

  // Analyst consensus
  targetMeanPrice?: number;
  targetHighPrice?: number;
  targetLowPrice?: number;
  recommendationKey?: string;
  recommendationMean?: number; // 1=strong buy ... 5=strong sell
  numberOfAnalysts?: number;
  recommendationTrend?: RecommendationTrendPoint[];

  // Events
  nextEarningsDate?: string; // ISO date
  exDividendDate?: string;
}

export interface RecommendationTrendPoint {
  period: string;
  strongBuy: number;
  buy: number;
  hold: number;
  sell: number;
  strongSell: number;
}

/** A real headline fetched from Yahoo Finance search news. */
export interface LiveNewsItem {
  id: string;
  title: string;
  publisher: string;
  url: string;
  /** Unix seconds per Yahoo; normalized to ISO on parse. */
  publishedAt: string;
}

export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
  rateToUSD: number; // 1 USD = rate * currency
}

export interface CustomLanguage {
  code: string;
  name: string;
  flag?: string;
  translations?: Record<string, string>;
}

/** Derived options-market snapshot used as ranking input. */
export interface OptionsSnapshot {
  ticker: string;
  underlyingPrice?: number;
  /** Implied volatility (%) at the strike closest to spot, nearest expiry. */
  atmIvPercent?: number;
  /** Aggregate put OI / call OI across the near expiries. <1 = bullish skew. */
  putCallOiRatio?: number;
  /** Same ratio on session volume, where available. */
  putCallVolumeRatio?: number;
  totalOpenInterest?: number;
  expirationCount: number;
}

export type RankingCategory = 'technical' | 'fundamental' | 'options';

/** One metric's z-score contribution for a single stock. */
export interface RankedMetric {
  key: string;
  label: string;
  category: RankingCategory;
  /** Raw metric value (formatted for display). */
  displayValue: string;
  z: number; // direction-adjusted cross-sectional z-score
  weight: number; // relative weight within its category
}

/** Final per-stock ranking result. */
export interface RankedStock {
  stock: Stock;
  rank: number;
  /** Weighted composite of category scores (z units). */
  compositeScore: number;
  technicalScore: number | null;
  fundamentalScore: number | null;
  optionsScore: number | null;
  metrics: RankedMetric[];
  dataQuality: {
    technical: boolean;
    fundamental: boolean;
    options: boolean;
  };
}
