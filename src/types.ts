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
  scoreContribution: number; // points contributed to the raw model total (0 = informational)
  /** i18n key of a plain-language explanation of what this metric means. */
  explanationKey: string;
  }

export interface TechnicalAnalysis {
  ma10: number;
  isPriceAboveMA10: boolean;
  /** 50-day simple moving average; null when < 50 real closes. */
  sma50: number | null;
  /** Wilder RSI(14); null when real history is insufficient (never fabricated). */
  rsi: number | null;
  rsiStatus: 'oversold' | 'neutral' | 'overbought';
  volumeRatio: number; // volume / avgVolume
  /** Daily return stdev, in percent — NOT annualized. Null when history is too short. */
  volatility: number | null;
  /** Same stdev annualized (× √252); null when daily σ is unavailable. */
  volatilityAnnualized: number | null;
  /** ATR(14) as a percent of spot; null when < ~15 real daily candles. */
  atr14Percent: number | null;
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
  /** Kelly-lite sizing hint (0–25% of intended allocation), scaled by risk level. */
  suggestedPositionPct: number;
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

/* ------------------------------------------------------------------ */
/* Ownership & insiders (Yahoo quoteSummary modules)                   */
/* ------------------------------------------------------------------ */

/** One institutional holder row from Yahoo quoteSummary institutionOwnership (13F-style). */
export interface InstitutionalHolder {
  name: string;
  /** Shares held directly (13F reported position). */
  shares?: number;
  /** Percent of shares outstanding held by this institution (7.12 = 7.12%). */
  pctHeld?: number;
  /** Market value of the position, raw USD. */
  value?: number;
  /** Change vs previous quarter as a percent (+0.85 = +0.85%); undefined when new/no data. */
  pctChange?: number;
  /** 13F/13G report period end (ISO). */
  reportDate?: string;
}

/** One insider transaction from Yahoo quoteSummary insiderTransactions. */
export interface InsiderTransaction {
  filerName: string;
  /** e.g. "Director", "Officer", "10% Owner". */
  filerRelation?: string;
  /** Raw text like "Sale at price 180.13 per share." */
  transactionText?: string;
  /** "Buy" / "Sell" / "Award" / "Gift" / "Exercise" — derived from transactionText
   *  (Yahoo provides no structured type field). */
  transactionType?: string;
  /** "Direct" / "Indirect" holding, from Yahoo's D/I ownership flag. */
  ownership?: string;
  /** Transaction date (ISO). */
  startDate?: string;
  shares?: number;
  value?: number;
  /** Pre-formatted dollar amount like "$1.2M" when Yahoo provides one. */
  moneyText?: string;
}

/** Aggregate insider buy/sell activity over Yahoo's reporting window (~6 months). */
export interface NetShareActivity {
  period?: string;
  /** Number of purchase transactions filed by insiders. */
  buysCount?: number;
  /** Aggregate shares acquired across those purchases. */
  buysShares?: number;
  /** Number of sale transactions filed by insiders. */
  sellsCount?: number;
  /** Aggregate shares sold across those sales. */
  sellsShares?: number;
  /** Yahoo's official net change (shares) — may include grant/exercise adjustments. */
  netShares?: number;
  /** Total shares currently held by all insiders. */
  totalInsiderShares?: number;
  /** Net change as percent of insider float (-2.4 = net selling of 2.4%). */
  netPercentBuy?: number;
}

/** High-level ownership split from Yahoo majorHoldersBreakdown (percent, 7.12 = 7.12%). */
export interface MajorHolders {
  insidersPercent?: number;
  institutionsPercent?: number;
  institutionsFloatPercent?: number;
}

/** Ownership snapshot parsed from Yahoo quoteSummary holdings modules. */
export interface HoldingsSnapshot {
  ticker: string;
  majorHolders?: MajorHolders;
  institutionsCount?: number;
  ownedPercentInstitutions?: number;
  holders: InstitutionalHolder[];
  insiderTransactions: InsiderTransaction[];
  netActivity?: NetShareActivity;
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
