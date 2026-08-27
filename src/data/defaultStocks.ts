import { Stock, Timeframe } from '../types';

/**
 * Empty history map — all series start empty and are filled exclusively by
 * real Yahoo chart data (hydration on load + per-timeframe fetches).
 */
export function emptyHistory(): Record<Timeframe, never[]> {
  return { '1D': [], '5D': [], '1M': [], '6M': [], 'YTD': [], '1Y': [], '5Y': [], 'ALL': [] };
}

/** Lightweight metadata persisted to localStorage between sessions. */
export interface StockMeta {
  ticker: string;
  name?: string;
  exchange?: string;
  currency?: string;
}

/**
 * Rebuild a placeholder Stock from saved metadata. All numeric fields are
 * zeroed placeholders; real Yahoo data replaces them during hydration.
 */
export function makeStubStock(
  ticker: string,
  meta: Partial<Omit<StockMeta, 'ticker'>> = {}
): Stock {
  return {
    ticker,
    name: meta.name ?? ticker,
    exchange: meta.exchange ?? '',
    currency: meta.currency ?? 'USD',
    currentPrice: 0,
    previousClose: 0,
    change: 0,
    changePercent: 0,
    high52w: 0,
    low52w: 0,
    volume: 0,
    avgVolume10d: 0,
    marketCap: '',
    sector: '',
    history: emptyHistory(),
  };
}

/**
 * Static preset metadata only (names/exchanges/currency).
 * All numeric fields are zeroed placeholders that get replaced by live Yahoo
 * data on load. Nothing here is simulated market data.
 */
export const PRESET_STOCKS: Stock[] = [
  {
    ticker: 'NVDA',
    name: 'NVIDIA Corporation',
    exchange: 'NASDAQ',
    currency: 'USD',
    currentPrice: 0,
    previousClose: 0,
    change: 0,
    changePercent: 0,
    high52w: 0,
    low52w: 0,
    volume: 0,
    avgVolume10d: 0,
    marketCap: '',
    sector: 'Semiconductors / AI Computing',
    history: emptyHistory(),
  },
  {
    ticker: 'TSLA',
    name: 'Tesla, Inc.',
    exchange: 'NASDAQ',
    currency: 'USD',
    currentPrice: 0,
    previousClose: 0,
    change: 0,
    changePercent: 0,
    high52w: 0,
    low52w: 0,
    volume: 0,
    avgVolume10d: 0,
    marketCap: '',
    sector: 'Automotive & Clean Energy',
    history: emptyHistory(),
  },
  {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    exchange: 'NASDAQ',
    currency: 'USD',
    currentPrice: 0,
    previousClose: 0,
    change: 0,
    changePercent: 0,
    high52w: 0,
    low52w: 0,
    volume: 0,
    avgVolume10d: 0,
    marketCap: '',
    sector: 'Consumer Electronics',
    history: emptyHistory(),
  },
  {
    ticker: '002230',
    name: 'iFLYTEK Co., Ltd.',
    exchange: 'SZSE (深交所)',
    currency: 'CNY',
    currentPrice: 0,
    previousClose: 0,
    change: 0,
    changePercent: 0,
    high52w: 0,
    low52w: 0,
    volume: 0,
    avgVolume10d: 0,
    marketCap: '',
    sector: 'Artificial Intelligence & Speech',
    history: emptyHistory(),
  },
  {
    ticker: '600276',
    name: 'Jiangsu Hengrui Pharmaceuticals',
    exchange: 'SSE (上交所)',
    currency: 'CNY',
    currentPrice: 0,
    previousClose: 0,
    change: 0,
    changePercent: 0,
    high52w: 0,
    low52w: 0,
    volume: 0,
    avgVolume10d: 0,
    marketCap: '',
    sector: 'Biotech & Pharmaceuticals',
    history: emptyHistory(),
  },
  {
    ticker: '600848',
    name: 'Shanghai Belling Co., Ltd.',
    exchange: 'SSE (上交所)',
    currency: 'CNY',
    currentPrice: 0,
    previousClose: 0,
    change: 0,
    changePercent: 0,
    high52w: 0,
    low52w: 0,
    volume: 0,
    avgVolume10d: 0,
    marketCap: '',
    sector: 'Semiconductors / IC Design',
    history: emptyHistory(),
  },
  {
    ticker: 'MSFT',
    name: 'Microsoft Corporation',
    exchange: 'NASDAQ',
    currency: 'USD',
    currentPrice: 0,
    previousClose: 0,
    change: 0,
    changePercent: 0,
    high52w: 0,
    low52w: 0,
    volume: 0,
    avgVolume10d: 0,
    marketCap: '',
    sector: 'Software & Cloud Services',
    history: emptyHistory(),
  },
];
