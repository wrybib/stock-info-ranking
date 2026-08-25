import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Clock,
  Settings as SettingsIcon,
  TrendingUp,
  Globe,
  Plus,
} from 'lucide-react';
import { Stock, RiskLevel, CurrencyInfo } from '../types';
import { TranslationDict } from '../utils/translations';
import { formatCurrencyValue } from '../utils/currencies';
import { PRESET_STOCKS } from '../data/defaultStocks';

interface HeaderProps {
  currentStock: Stock;
  onSelectStock: (stock: Stock) => void;
  onSearchSymbol: (symbol: string) => void;
  riskLevel: RiskLevel;
  onChangeRiskLevel: (level: RiskLevel) => void;
  currency: CurrencyInfo;
  currentLanguage: string;
  onChangeLanguage: (code: string) => void;
  onOpenSettings: () => void;
  t: TranslationDict;
}

export const Header: React.FC<HeaderProps> = ({
  currentStock,
  onSelectStock,
  onSearchSymbol,
  riskLevel,
  onChangeRiskLevel,
  currency,
  currentLanguage,
  onChangeLanguage,
  onOpenSettings,
  t,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [estTimeStr, setEstTimeStr] = useState('');
  const [marketStatus, setMarketStatus] = useState<{ label: string; color: string; isOpen: boolean }>({
    label: 'MARKET OPEN',
    color: 'emerald',
    isOpen: true,
  });

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Sync EST Clock & Market Hours
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format in America/New_York
      const estFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        weekday: 'short',
      });
      setEstTimeStr(estFormatter.format(now) + ' EST');

      // Check market hours: Mon-Fri (day 1-5), 9:30 AM to 4:00 PM EST
      const estDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
      const day = estDate.getDay();
      const hour = estDate.getHours();
      const minute = estDate.getMinutes();
      const timeInMinutes = hour * 60 + minute;

      const isWeekday = day >= 1 && day <= 5;
      const isMarketOpen = isWeekday && timeInMinutes >= 9 * 60 + 30 && timeInMinutes < 16 * 60;
      const isPreMarket = isWeekday && timeInMinutes >= 4 * 60 && timeInMinutes < 9 * 60 + 30;
      const isAfterHours = isWeekday && timeInMinutes >= 16 * 60 && timeInMinutes < 20 * 60;

      if (isMarketOpen) {
        setMarketStatus({ label: t.marketOpen, color: 'emerald', isOpen: true });
      } else if (isPreMarket) {
        setMarketStatus({ label: t.preMarket, color: 'amber', isOpen: false });
      } else if (isAfterHours) {
        setMarketStatus({ label: t.afterHours, color: 'indigo', isOpen: false });
      } else {
        setMarketStatus({ label: t.marketClosed, color: 'rose', isOpen: false });
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [t]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearching(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchSymbol(searchQuery.trim());
      setIsSearching(false);
      setSearchQuery('');
    }
  };

  const filteredSuggestions = searchQuery.trim()
    ? PRESET_STOCKS.filter(
        (s) =>
          s.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : PRESET_STOCKS.slice(0, 6);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-800 px-3 sm:px-4 lg:px-6 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto w-full flex flex-wrap md:flex-nowrap items-center justify-between gap-2.5">
        {/* Left: Branding & Search Bar */}
        <div className="flex items-center gap-2 sm:gap-3.5 flex-1 min-w-[240px] max-w-2xl">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-black shadow-[0_0_12px_rgba(16,185,129,0.3)]">
              <TrendingUp className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="hidden xs:block">
              <div className="flex items-center gap-1.5">
                <span className="text-sm sm:text-base font-bold tracking-tight text-white uppercase">
                  Stock<span className="text-emerald-400">Predictor</span>
                </span>
                <span className="hidden sm:inline px-1.5 py-0.5 text-[9px] font-bold font-mono uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded">
                  QUANT AI
                </span>
              </div>
            </div>
          </div>

          {/* Search Bar with live popup */}
          <div ref={searchContainerRef} className="relative flex-1 min-w-[140px]">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-2.5 pointer-events-none" />
                <input
                  id="stock-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearching(true);
                  }}
                  onFocus={() => setIsSearching(true)}
                  placeholder={t.searchPlaceholder}
                  className="w-full pl-8 sm:pl-9 pr-16 sm:pr-20 py-1.5 bg-slate-900 border border-slate-700/80 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg text-xs md:text-sm text-slate-100 placeholder-slate-500 transition-all outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-1 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[11px] sm:text-xs font-semibold bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-md transition-colors"
                >
                  Predict
                </button>
              </div>
            </form>

            {/* Dropdown Suggestions */}
            {isSearching && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#0f172a] border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in max-h-80 overflow-y-auto">
                <div className="p-2.5 border-b border-slate-800 text-[11px] font-semibold text-slate-400 flex items-center justify-between">
                  <span>{searchQuery ? `Search Results for "${searchQuery}"` : t.popularStocks}</span>
                  <span className="text-slate-500">US & A-Shares</span>
                </div>

                {filteredSuggestions.length > 0 ? (
                  <div className="p-1">
                    {filteredSuggestions.map((stock) => (
                      <button
                        key={stock.ticker}
                        onClick={() => {
                          onSelectStock(stock);
                          setIsSearching(false);
                          setSearchQuery('');
                        }}
                        className="w-full flex items-center justify-between p-2 hover:bg-slate-800/80 rounded-lg text-left transition-colors group"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono font-bold text-sm text-emerald-400 group-hover:text-emerald-300">
                            {stock.ticker}
                          </span>
                          <div>
                            <div className="text-xs font-medium text-slate-200">
                              {stock.name}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {stock.exchange} • {stock.currency}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold text-slate-200 font-mono">
                            {formatCurrencyValue(stock.currentPrice, currency)}
                          </div>
                          <div
                            className={`text-[10px] font-semibold font-mono ${
                              stock.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {stock.changePercent >= 0 ? '+' : ''}
                            {stock.changePercent.toFixed(1)}%
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center">
                    <p className="text-xs text-slate-300 mb-2">
                      Custom symbol "<span className="font-mono text-emerald-400">{searchQuery}</span>" detected.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        onSearchSymbol(searchQuery.trim());
                        setIsSearching(false);
                        setSearchQuery('');
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold rounded-lg inline-flex items-center gap-1.5 transition-colors shadow-lg shadow-emerald-900/30 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Create & Analyze {searchQuery.toUpperCase()}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: EST Clock, Quick Language, Paper Wallet, Risk Selector & Settings */}
        <div className="flex items-center justify-end gap-1.5 sm:gap-2.5 flex-wrap sm:flex-nowrap">
          {/* Quick Language Switcher Dropdown */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <Globe className="w-3.5 h-3.5 text-slate-400 ml-2 mr-1" />
            <select
              id="header-language-select"
              value={currentLanguage}
              onChange={(e) => onChangeLanguage(e.target.value)}
              className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer py-1 pr-2"
              title="Change language / 更改语言"
            >
              <option value="en" className="bg-slate-900 text-slate-200">
                🇺🇸 English
              </option>
              <option value="zh-CN" className="bg-slate-900 text-slate-200">
                🇨🇳 中文
              </option>
              <option value="es" className="bg-slate-900 text-slate-200">
                🇪🇸 Español
              </option>
              <option value="ja" className="bg-slate-900 text-slate-200">
                🇯🇵 日本語
              </option>
              <option value="de" className="bg-slate-900 text-slate-200">
                🇩🇪 Deutsch
              </option>
              <option value="fr" className="bg-slate-900 text-slate-200">
                🇫🇷 Français
              </option>
            </select>
          </div>

          {/* EST Digital Clock & Market Indicator */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-mono text-slate-300 font-medium whitespace-nowrap text-[11px]">
              {estTimeStr || '9:30 AM EST'}
            </span>
            <div className="flex items-center gap-1 pl-1.5 border-l border-slate-800">
              <span
                className={`w-2 h-2 rounded-full ${
                  marketStatus.color === 'emerald'
                    ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]'
                    : marketStatus.color === 'amber'
                    ? 'bg-amber-400'
                    : 'bg-rose-400'
                }`}
              />
              <span
                className={`text-[10px] font-bold uppercase tracking-tight whitespace-nowrap ${
                  marketStatus.color === 'emerald'
                    ? 'text-emerald-400'
                    : marketStatus.color === 'amber'
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}
              >
                {marketStatus.label}
              </span>
            </div>
          </div>

          {/* Settings Modal Button */}
          <button
            type="button"
            id="btn-open-settings"
            onClick={onOpenSettings}
            className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded-lg transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
            title="Open Settings & Language / Currency"
          >
            <SettingsIcon className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline text-xs font-bold text-slate-200">
              {t.settings}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
