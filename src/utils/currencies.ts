import { CurrencyInfo } from '../types';

export const POPULAR_CURRENCIES: CurrencyInfo[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', rateToUSD: 1.0 },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan (RMB)', rateToUSD: 7.24 },
  { code: 'EUR', symbol: '€', name: 'Euro', rateToUSD: 0.92 },
  { code: 'GBP', symbol: '£', name: 'British Pound', rateToUSD: 0.79 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rateToUSD: 155.4 },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar', rateToUSD: 7.82 },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rateToUSD: 1.36 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rateToUSD: 1.52 },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc', rateToUSD: 0.89 },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', rateToUSD: 1.34 },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', rateToUSD: 83.5 },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won', rateToUSD: 1375.0 },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', rateToUSD: 5.42 },
  { code: 'MXN', symbol: 'Mex$', name: 'Mexican Peso', rateToUSD: 17.8 },
  { code: 'BTC', symbol: '₿', name: 'Bitcoin', rateToUSD: 0.000015 },
  { code: 'ETH', symbol: 'Ξ', name: 'Ethereum', rateToUSD: 0.00038 },
];

export function findCurrencies(query: string): CurrencyInfo[] {
  const cleanQuery = query.trim().toUpperCase();
  if (!cleanQuery) return POPULAR_CURRENCIES;
  return POPULAR_CURRENCIES.filter(
    (c) =>
      c.code.toUpperCase().includes(cleanQuery) ||
      c.name.toUpperCase().includes(cleanQuery) ||
      c.symbol.includes(cleanQuery)
  );
}

export function formatCurrencyValue(
  amountInUSD: number,
  currency: CurrencyInfo,
  decimals: number = 2
): string {
  const converted = amountInUSD * currency.rateToUSD;
  
  if (currency.code === 'BTC' || currency.code === 'ETH') {
    return `${currency.symbol}${converted.toFixed(4)}`;
  }
  
  if (currency.code === 'JPY' || currency.code === 'KRW') {
    return `${currency.symbol}${Math.round(converted).toLocaleString()}`;
  }

  return `${currency.symbol}${converted.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}
