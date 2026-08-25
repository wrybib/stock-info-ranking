import React, { useState } from 'react';
import {
  ListFilter,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  Search,
  Sparkles,
  ChevronRight,
  Globe2,
} from 'lucide-react';
import { Stock, CurrencyInfo } from '../types';
import { TranslationDict } from '../utils/translations';
import { formatCurrencyValue } from '../utils/currencies';
import { PRESET_STOCKS } from '../data/defaultStocks';

interface WatchlistSidebarProps {
  watchlist: Stock[];
  activeStock: Stock;
  onSelectStock: (stock: Stock) => void;
  onAddStock: (stock: Stock) => void;
  onRemoveStock: (ticker: string) => void;
  onSearchSymbol: (symbol: string) => void;
  currency: CurrencyInfo;
  t: TranslationDict;
}

export const WatchlistSidebar: React.FC<WatchlistSidebarProps> = ({
  watchlist,
  activeStock,
  onSelectStock,
  onAddStock,
  onRemoveStock,
  onSearchSymbol,
  currency,
  t,
}) => {
  const [quickAddSymbol, setQuickAddSymbol] = useState('');
  const [activeTab, setActiveTab] = useState<'watchlist' | 'presets'>('watchlist');

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickAddSymbol.trim()) {
      onSearchSymbol(quickAddSymbol.trim());
      setQuickAddSymbol('');
    }
  };

  const usPresets = PRESET_STOCKS.filter((s) => !/^\d{6}$/.test(s.ticker));
  const chinaPresets = PRESET_STOCKS.filter((s) => /^\d{6}$/.test(s.ticker));

  return (
    <div
      id="watchlist-sidebar-panel"
      className="bg-[#0e1628] border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col h-full relative overflow-hidden"
    >
      {/* Header & Tabs */}
      <div className="pb-3 border-b border-slate-800/80 mb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ListFilter className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wide">
              {t.watchlist}
            </h3>
          </div>
          <span className="text-[10px] font-mono font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
            {watchlist.length} {t.tickersCount}
          </span>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 gap-1 bg-[#080d19] p-1 rounded-xl border border-slate-800 text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('watchlist')}
            className={`py-1 rounded-lg transition-all ${
              activeTab === 'watchlist'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.myListTab} ({watchlist.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`py-1 rounded-lg transition-all ${
              activeTab === 'presets'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.popularStocks}
          </button>
        </div>
      </div>

      {/* Quick Add Search Bar */}
      <form onSubmit={handleQuickAdd} className="mb-3">
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder={t.searchAddStock}
            value={quickAddSymbol}
            onChange={(e) => setQuickAddSymbol(e.target.value)}
            className="w-full pl-8 pr-12 py-1.5 bg-[#080d19] border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            className="absolute right-1 px-2 py-0.5 text-[10px] font-bold bg-emerald-600 hover:bg-emerald-500 text-slate-950 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      {/* Stock List Content */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[600px]">
        {activeTab === 'watchlist' ? (
          watchlist.length > 0 ? (
            watchlist.map((stock) => {
              const isActive = activeStock.ticker === stock.ticker;
              const isPositive = stock.changePercent >= 0;

              return (
                <div
                  key={stock.ticker}
                  className={`group relative p-2.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                    isActive
                      ? 'bg-emerald-950/30 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                      : 'bg-[#09101d] border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                  onClick={() => onSelectStock(stock)}
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-black text-xs text-slate-100 group-hover:text-emerald-300">
                        {stock.ticker}
                      </span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                      {stock.name}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold font-mono text-slate-200">
                      {formatCurrencyValue(stock.currentPrice, currency)}
                    </div>
                    <div
                      className={`text-[10px] font-bold font-mono flex items-center justify-end gap-0.5 ${
                        isPositive ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isPositive ? '+' : ''}
                      {stock.changePercent.toFixed(1)}%
                    </div>
                  </div>

                  {/* Remove Button — always visible (no hover-only reveal) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveStock(stock.ticker);
                    }}
                    className="ml-2 p-1 text-slate-500 hover:text-rose-400 rounded transition-colors cursor-pointer"
                    title={t.removeFromWatchlist}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          ) : (
            <div className="p-6 text-center bg-[#080d19] border border-slate-800 rounded-2xl">
              <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                {t.noStocksInWatchlist}
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('presets')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                {t.browseTickers}
              </button>
            </div>
          )
        ) : (
          /* Presets Browser */
          <div className="space-y-4">
            {/* US Equities */}
            <div>
              <div className="text-[10px] font-bold uppercase text-slate-400 mb-1.5 px-1 flex items-center justify-between">
                <span>{t.usStocks}</span>
                <span className="text-slate-500">NASDAQ / NYSE</span>
              </div>
              <div className="space-y-1.5">
                {usPresets.map((s) => {
                  const inWatchlist = watchlist.some((w) => w.ticker === s.ticker);
                  return (
                    <div
                      key={s.ticker}
                      onClick={() => {
                        onSelectStock(s);
                        if (!inWatchlist) onAddStock(s);
                      }}
                      className="p-2 rounded-xl bg-[#09101d] hover:bg-slate-800/60 border border-slate-800 flex items-center justify-between cursor-pointer group"
                    >
                      <div>
                        <span className="font-mono font-bold text-xs text-slate-200 group-hover:text-emerald-300">
                          {s.ticker}
                        </span>
                        <div className="text-[10px] text-slate-400 truncate max-w-[110px]">
                          {s.name}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-200">
                          {formatCurrencyValue(s.currentPrice, currency)}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!inWatchlist) onAddStock(s);
                          }}
                          className={`p-1 rounded text-[10px] cursor-pointer ${
                            inWatchlist
                              ? 'text-emerald-400 bg-emerald-950/40'
                              : 'text-slate-400 hover:text-white bg-slate-800'
                          }`}
                        >
                          {inWatchlist ? '✓' : '+'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* China A-Shares */}
            <div>
              <div className="text-[10px] font-bold uppercase text-slate-400 mb-1.5 px-1 flex items-center justify-between">
                <span>{t.chineseStocks}</span>
                <span className="text-slate-500">SSE / SZSE (A股)</span>
              </div>
              <div className="space-y-1.5">
                {chinaPresets.map((s) => {
                  const inWatchlist = watchlist.some((w) => w.ticker === s.ticker);
                  return (
                    <div
                      key={s.ticker}
                      onClick={() => {
                        onSelectStock(s);
                        if (!inWatchlist) onAddStock(s);
                      }}
                      className="p-2 rounded-xl bg-[#09101d] hover:bg-slate-800/60 border border-slate-800 flex items-center justify-between cursor-pointer group"
                    >
                      <div>
                        <span className="font-mono font-bold text-xs text-cyan-400 group-hover:text-cyan-300">
                          {s.ticker}
                        </span>
                        <div className="text-[10px] text-slate-400 truncate max-w-[110px]">
                          {s.name}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-200">
                          {formatCurrencyValue(s.currentPrice, currency)}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!inWatchlist) onAddStock(s);
                          }}
                          className={`p-1 rounded text-[10px] cursor-pointer ${
                            inWatchlist
                              ? 'text-emerald-400 bg-emerald-950/40'
                              : 'text-slate-400 hover:text-white bg-slate-800'
                          }`}
                        >
                          {inWatchlist ? '✓' : '+'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
