import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';
import {
  Stock,
  RiskLevel,
  DisplayMode,
  CurrencyInfo,
  CustomLanguage,
  LiveNewsItem,
  Fundamentals,
  OptionsSnapshot,
  HoldingsSnapshot,
} from './types';
import { POPULAR_CURRENCIES, formatCurrencyValue } from './utils/currencies';
import {
  BUILT_IN_LANGUAGES,
  getTranslation,
  LanguageCode,
} from './utils/translations';
import { PRESET_STOCKS, makeStubStock } from './data/defaultStocks';
import { loadJSON, saveJSON, AppSettings } from './utils/storage';
import { lookupStockWithYahoo } from './data/yahooFinance';
import { fetchYahooFundamentals } from './data/fundamentals';
import { fetchLiveNews } from './data/news';
import { fetchYahooOptions } from './data/options';
import { fetchYahooHoldings } from './data/holdings';
import { computeRankings } from './utils/ranking';
import { analyzeStock } from './utils/technicalAnalysis';

import { Header } from './components/Header';
import { CorePredictionCard } from './components/CorePredictionCard';
import { TechnicalChecklist } from './components/TechnicalChecklist';
import { LivePriceChart } from './components/LivePriceChart';
import { NewsSection } from './components/NewsSection';
import { StockRankings } from './components/StockRankings';
import { WatchlistSidebar } from './components/WatchlistSidebar';
import { FundamentalsPanel } from './components/FundamentalsPanel';
import { TechMetricsPanel } from './components/TechMetricsPanel';
import { OwnershipPanel } from './components/OwnershipPanel';
import { SettingsModal } from './components/SettingsModal';
import { ToastContainer, ToastMessage } from './components/Toast';

export default function App() {
  // Toast notifications state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback(
    (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success', title?: string) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev.slice(-3), { id, message, type, title }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // 1. Settings & Localization State — persisted to localStorage across reloads
  const savedSettings = useMemo<AppSettings>(() => loadJSON('sp.settings', {}), []);

  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(savedSettings.language ?? 'en');
  const [customLanguages, setCustomLanguages] = useState<Record<string, CustomLanguage>>(
    savedSettings.customLanguages ?? {}
  );
  const [currentCurrency, setCurrentCurrency] = useState<CurrencyInfo>(
    POPULAR_CURRENCIES.find((c) => c.code === savedSettings.currencyCode) ?? POPULAR_CURRENCIES[0] // USD
  );
  const [displayMode, setDisplayMode] = useState<DisplayMode>(
    savedSettings.displayMode === 'rise_only' || savedSettings.displayMode === 'dip_only'
      ? savedSettings.displayMode
      : 'auto'
  );
  const [riskLevel, setRiskLevel] = useState<RiskLevel>(
    savedSettings.riskLevel === 'Low' || savedSettings.riskLevel === 'High'
      ? savedSettings.riskLevel
      : 'Medium'
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Persist settings whenever any of them changes
  useEffect(() => {
    saveJSON('sp.settings', {
      language: currentLanguage,
      customLanguages,
      currencyCode: currentCurrency.code,
      displayMode,
      riskLevel,
    });
  }, [currentLanguage, customLanguages, currentCurrency, displayMode, riskLevel]);

  // 2. Active Stock & Watchlist State — the watchlist itself persists across
  // reloads (ticker/name/exchange/currency only; market data is always
  // re-fetched fresh from Yahoo on load).
  const savedWatchlist = useMemo<Stock[]>(() => {
    const metas = loadJSON<Array<Partial<{ ticker: string; name: string; exchange: string; currency: string }>>>(
      'sp.watchlist',
      []
    );
    const valid = Array.isArray(metas)
      ? metas.filter((m) => typeof m?.ticker === 'string' && m.ticker.trim())
      : [];
    if (valid.length === 0) {
      // First visit (or cleared storage): sensible default list
      return [
        PRESET_STOCKS[0], // NVDA
        PRESET_STOCKS[1], // TSLA
        PRESET_STOCKS[3], // 002230 iFLYTEK
        PRESET_STOCKS[5], // 600848 Shanghai Belling
      ];
    }
    return valid.map((m) => {
      const preset = PRESET_STOCKS.find((p) => p.ticker.toUpperCase() === m.ticker!.toUpperCase());
      if (preset) return preset;
      return makeStubStock(m.ticker!, { name: m.name, exchange: m.exchange, currency: m.currency });
    });
  }, []);

  const [currentStock, setCurrentStock] = useState<Stock>(() => {
    const savedTicker = loadJSON<string>('sp.activeTicker', '');
    const match = savedTicker
      ? savedWatchlist.find((s) => s.ticker.toUpperCase() === savedTicker.toUpperCase())
      : undefined;
    return match ?? savedWatchlist[0] ?? PRESET_STOCKS[0];
  });
  const [watchlist, setWatchlist] = useState<Stock[]>(savedWatchlist);
  const [appView, setAppView] = useState<'watchlist' | 'detail'>('watchlist');

  useEffect(() => {
    saveJSON(
      'sp.watchlist',
      watchlist.map(({ ticker, name, exchange, currency }) => ({ ticker, name, exchange, currency }))
    );
  }, [watchlist]);

  useEffect(() => {
    saveJSON('sp.activeTicker', currentStock.ticker);
  }, [currentStock.ticker]);

  const hydrateStockWithYahoo = useCallback(async (stock: Stock): Promise<Stock> => {
    const result = await lookupStockWithYahoo(stock.ticker);
    if (!result.ok) {
      // Keep the existing object; UI shows zero/empty states for missing data.
      return stock;
    }
    return { ...stock, ...result.stock };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadInitialStocks = async () => {
      // Hydrate ONLY the entries actually in the watchlist (restored or defaults)
      const liveStocks = await Promise.all(savedWatchlist.map((stock) => hydrateStockWithYahoo(stock)));
      if (!isMounted) return;

      const liveMap = new Map(liveStocks.map((stock) => [stock.ticker.toUpperCase(), stock]));
      setCurrentStock((prev) => liveMap.get(prev.ticker.toUpperCase()) ?? prev);
      setWatchlist((prev) => prev.map((stock) => liveMap.get(stock.ticker.toUpperCase()) ?? stock));
    };

    loadInitialStocks();

    return () => {
      isMounted = false;
    };
  }, [hydrateStockWithYahoo, savedWatchlist]);

  // Live refresh: re-fetch the active stock every 45s so the daily change
  // (price vs previous close) tracks the real market while the page is open.
  useEffect(() => {
    const ticker = currentStock.ticker;
    const id = setInterval(async () => {
      if (document.hidden) return; // skip work in background tabs
      const result = await lookupStockWithYahoo(ticker);
      if (!result.ok) return; // keep last good data on transient errors
      setCurrentStock((prev) =>
        prev.ticker.toUpperCase() === result.stock.ticker.toUpperCase()
          ? { ...prev, ...result.stock }
          : prev
      );
      setWatchlist((prev) =>
        prev.map((s) =>
          s.ticker.toUpperCase() === result.stock.ticker.toUpperCase()
            ? { ...s, ...result.stock }
            : s
        )
      );
    }, 45_000);
    return () => clearInterval(id);
  }, [currentStock.ticker]);

  // 3. Live News State (real Yahoo headlines for the active ticker)
  const [liveNews, setLiveNews] = useState<LiveNewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState<boolean>(true);

  const loadNews = useCallback(async (ticker: string) => {
    setNewsLoading(true);
    const items = await fetchLiveNews(ticker);
    setLiveNews(items ?? []);
    setNewsLoading(false);
  }, []);

  useEffect(() => {
    loadNews(currentStock.ticker);
  }, [currentStock.ticker, loadNews]);

  // 4. Algorithm Calculation
  // Note: fabricated news sentiment is no longer fed into the model —
  // only real market/technical data is scored.
  const technicalAnalysis = useMemo(() => {
    return analyzeStock(currentStock, riskLevel);
  }, [currentStock, riskLevel]);

  // 4b. Fundamentals (real Yahoo quoteSummary data; null => show unavailable state)
  const [fundamentals, setFundamentals] = useState<Fundamentals | null>(null);
  const [fundamentalsLoading, setFundamentalsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setFundamentalsLoading(true);

    const ticker = currentStock.ticker;
    fetchYahooFundamentals(ticker).then((result) => {
      if (!isMounted) return;
      setFundamentals(result);
      setFundamentalsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [currentStock.ticker]);

  // 4b-bis. Ownership data (Yahoo holders/insiders) for the active ticker.
  // A null result renders the panel's explicit "unavailable" state.
  const [holdings, setHoldings] = useState<HoldingsSnapshot | null>(null);
  const [holdingsLoading, setHoldingsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setHoldingsLoading(true);

    fetchYahooHoldings(currentStock.ticker).then((result) => {
      if (!isMounted) return;
      setHoldings(result);
      setHoldingsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [currentStock.ticker]);

  // 4c. Watchlist-wide fundamentals + options for the ranking engine
  const [fundamentalsMap, setFundamentalsMap] = useState<Record<string, Fundamentals | null>>({});
  const [optionsMap, setOptionsMap] = useState<Record<string, OptionsSnapshot | null>>({});
  const [rankingLoading, setRankingLoading] = useState<boolean>(true);

  const watchlistKey = watchlist.map((s) => s.ticker.toUpperCase()).join(',');

  useEffect(() => {
    let isMounted = true;
    setRankingLoading(true);

    const tickers = watchlistKey.split(',').filter(Boolean);

    Promise.all(
      tickers.map(async (ticker) => {
        const [fundRes, optRes] = await Promise.all([
          fetchYahooFundamentals(ticker),
          fetchYahooOptions(ticker),
        ]);
        return { ticker, fund: fundRes, options: optRes };
      })
    ).then((rows) => {
      if (!isMounted) return;
      const funds: Record<string, Fundamentals | null> = {};
      const opts: Record<string, OptionsSnapshot | null> = {};
      rows.forEach(({ ticker, fund, options }) => {
        funds[ticker] = fund;
        opts[ticker] = options;
      });
      setFundamentalsMap(funds);
      setOptionsMap(opts);
      setRankingLoading(false);
    });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchlistKey]);

  // 4d. Cross-sectional z-score ranking of the watchlist
  const rankedStocks = useMemo(() => {
    const hydrated = watchlist.filter(
      (s) => (s.history['1Y']?.length ?? 0) > 0 || s.currentPrice > 0
    );
    return computeRankings(hydrated, fundamentalsMap, optionsMap);
  }, [watchlist, fundamentalsMap, optionsMap]);

  // 5. Translation Dictionary
  const t = useMemo(() => {
    return getTranslation(currentLanguage, customLanguages);
  }, [currentLanguage, customLanguages]);

  // Handler for adding/selecting new stock
  const handleSelectStock = async (stock: Stock) => {
    setAppView('detail');
    const hydratedStock = await hydrateStockWithYahoo(stock);
    setCurrentStock(hydratedStock);
    showToast(`Loaded ${hydratedStock.ticker} (${hydratedStock.name})`, 'info');
  };

  const handleSearchSymbol = async (symbol: string) => {
    const trimmed = symbol.trim();
    if (!trimmed) {
      showToast('Please enter a ticker symbol to search.', 'warning', 'No Symbol');
      return;
    }

    const result = await lookupStockWithYahoo(trimmed);
    if (!result.ok) {
      if (result.reason === 'rate_limited') {
        showToast(
          'The data provider is throttling requests right now. Wait a few seconds and try again.',
          'warning',
          'Rate Limited'
        );
      } else if (result.reason === 'service_down') {
        showToast(
          'Cannot reach the market-data service. Make sure the API server is running (npm run dev starts both).',
          'error',
          'Service Unavailable'
        );
      } else {
        showToast(
          `No market data found for ${trimmed.toUpperCase()}. Double-check the ticker.`,
          'error',
          'Symbol Not Found'
        );
      }
      return;
    }

    const liveStock = result.stock;
    setAppView('detail');
    setCurrentStock(liveStock);
    showToast(`Analyzed symbol ${liveStock.ticker}`, 'info');
    setWatchlist((prev) => {
      if (prev.some((s) => s.ticker.toUpperCase() === liveStock.ticker.toUpperCase())) {
        return prev;
      }
      return [liveStock, ...prev];
    });
  };

  const handleAddStockToWatchlist = (stock: Stock) => {
    setWatchlist((prev) => {
      if (prev.some((s) => s.ticker.toUpperCase() === stock.ticker.toUpperCase())) {
        return prev;
      }
      showToast(`Added ${stock.ticker} to Watchlist`, 'success');
      return [stock, ...prev];
    });
  };

  const handleRemoveStockFromWatchlist = (ticker: string) => {
    setWatchlist((prev) => prev.filter((s) => s.ticker.toUpperCase() !== ticker.toUpperCase()));
    showToast(`Removed ${ticker} from Watchlist`, 'info');
  };

  // Live News Refresh
  const handleRefreshNews = () => {
    loadNews(currentStock.ticker);
  };

  const handleAddCustomLanguage = (lang: CustomLanguage) => {
    setCustomLanguages((prev) => ({
      ...prev,
      [lang.code]: lang,
    }));
    showToast(`Added custom language: ${lang.name}`, 'success');
  };

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* 1. Header Area with Clock, Wallet, Search & Settings */}
      <Header
        currentStock={currentStock}
        onSelectStock={handleSelectStock}
        onSearchSymbol={handleSearchSymbol}
        riskLevel={riskLevel}
        onChangeRiskLevel={setRiskLevel}
        currency={currentCurrency}
        currentLanguage={currentLanguage}
        onChangeLanguage={(code) => setCurrentLanguage(code as LanguageCode)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        t={t}
      />

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {appView === 'watchlist' ? (
          <div className="space-y-5 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
              <div className="lg:col-span-4">
                <WatchlistSidebar
                  watchlist={watchlist}
                  activeStock={currentStock}
                  onSelectStock={handleSelectStock}
                  onAddStock={handleAddStockToWatchlist}
                  onRemoveStock={handleRemoveStockFromWatchlist}
                  onSearchSymbol={handleSearchSymbol}
                  currency={currentCurrency}
                  t={t}
                />
              </div>
              <div className="lg:col-span-8">
                <StockRankings
                  ranked={rankedStocks}
                  loading={rankingLoading}
                  activeTicker={currentStock.ticker}
                  onSelectStock={(ticker) => {
                    const target = watchlist.find(
                      (s) => s.ticker.toUpperCase() === ticker.toUpperCase()
                    );
                    if (target) handleSelectStock(target);
                  }}
                  t={t}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-5 sm:space-y-6">
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setAppView('watchlist')}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-sm font-semibold text-slate-200 hover:border-emerald-500/60 hover:text-emerald-300 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {t.watchlist}
              </button>
              <span className="text-xs font-mono text-slate-500">{currentStock.ticker}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
              <aside className="hidden lg:block lg:col-span-3">
                <WatchlistSidebar
                  watchlist={watchlist}
                  activeStock={currentStock}
                  onSelectStock={handleSelectStock}
                  onAddStock={handleAddStockToWatchlist}
                  onRemoveStock={handleRemoveStockFromWatchlist}
                  onSearchSymbol={handleSearchSymbol}
                  currency={currentCurrency}
                  t={t}
                />
              </aside>

              <div className="lg:col-span-9 space-y-5 sm:space-y-6">
                <div className="grid grid-cols-1 xl:grid-cols-5 gap-5 sm:gap-6 items-stretch">
                  <div className="xl:col-span-3">
                    <CorePredictionCard
                      stock={currentStock}
                      analysis={technicalAnalysis}
                      displayMode={displayMode}
                      onChangeDisplayMode={setDisplayMode}
                      currency={currentCurrency}
                      t={t}
                    />
                  </div>
                  <div className="xl:col-span-2">
                    <TechnicalChecklist stock={currentStock} analysis={technicalAnalysis} t={t} />
                  </div>
                </div>

                <TechMetricsPanel stock={currentStock} analysis={technicalAnalysis} currency={currentCurrency} t={t} />
                <LivePriceChart stock={currentStock} currency={currentCurrency} t={t} />
                <FundamentalsPanel
                  fundamentals={fundamentals}
                  loading={fundamentalsLoading}
                  currentPrice={currentStock.currentPrice}
                  t={t}
                />
                <OwnershipPanel holdings={holdings} loading={holdingsLoading} t={t} />
                <NewsSection
                  stock={currentStock}
                  newsList={liveNews}
                  loading={newsLoading}
                  onRefresh={handleRefreshNews}
                  t={t}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Settings Modal (Language Switcher, Add Any Custom Language, Currency search & converter, Display mode) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentLanguage={currentLanguage}
        onChangeLanguage={(code) => {
          setCurrentLanguage(code as LanguageCode);
          showToast(`Language set to ${code.toUpperCase()}`, 'info');
        }}
        customLanguages={customLanguages}
        onAddCustomLanguage={handleAddCustomLanguage}
        currentCurrency={currentCurrency}
        onChangeCurrency={(curr) => {
          setCurrentCurrency(curr);
          showToast(`Currency updated to ${curr.code} (${curr.symbol})`, 'info');
        }}
        displayMode={displayMode}
        onChangeDisplayMode={(mode) => {
          setDisplayMode(mode);
          showToast(mode === 'auto' ? t.modeAutoToast : mode === 'rise_only' ? t.modeRiseToast : t.modeDipToast, 'info');
        }}
        riskLevel={riskLevel}
        onChangeRiskLevel={(lvl) => {
          setRiskLevel(lvl);
          showToast(`Risk tolerance adjusted to ${lvl}`, 'info');
        }}
        t={t}
      />

      {/* Floating Interactive Toast Feedback Banner Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
