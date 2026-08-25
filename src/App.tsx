import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Stock,
  RiskLevel,
  DisplayMode,
  CurrencyInfo,
  CustomLanguage,
  LiveNewsItem,
  Fundamentals,
  OptionsSnapshot,
} from './types';
import { POPULAR_CURRENCIES, formatCurrencyValue } from './utils/currencies';
import {
  BUILT_IN_LANGUAGES,
  getTranslation,
  LanguageCode,
} from './utils/translations';
import { PRESET_STOCKS } from './data/defaultStocks';
import { lookupStockWithYahoo } from './data/yahooFinance';
import { fetchYahooFundamentals } from './data/fundamentals';
import { fetchLiveNews } from './data/news';
import { fetchYahooOptions } from './data/options';
import { computeRankings } from './utils/ranking';
import { analyzeStock } from './utils/technicalAnalysis';

import { Header } from './components/Header';
import { CorePredictionCard } from './components/CorePredictionCard';
import { TechnicalChecklist } from './components/TechnicalChecklist';
import { LivePriceChart } from './components/LivePriceChart';
import { ConfidenceMeter } from './components/ConfidenceMeter';
import { NewsSection } from './components/NewsSection';
import { StockRankings } from './components/StockRankings';
import { WatchlistSidebar } from './components/WatchlistSidebar';
import { FundamentalsPanel } from './components/FundamentalsPanel';
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

  // 1. Settings & Localization State
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');
  const [customLanguages, setCustomLanguages] = useState<Record<string, CustomLanguage>>({});
  const [currentCurrency, setCurrentCurrency] = useState<CurrencyInfo>(POPULAR_CURRENCIES[0]); // USD
  const [displayMode, setDisplayMode] = useState<DisplayMode>('auto');
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('Medium');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // 2. Active Stock & Watchlist State
  // Initial stock: NVDA
  const [currentStock, setCurrentStock] = useState<Stock>(PRESET_STOCKS[0]);
  const [watchlist, setWatchlist] = useState<Stock[]>([
    PRESET_STOCKS[0], // NVDA
    PRESET_STOCKS[1], // TSLA
    PRESET_STOCKS[3], // 002230 科大讯飞
    PRESET_STOCKS[5], // 600848 上海贝岭
  ]);

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
      const liveStocks = await Promise.all(PRESET_STOCKS.map((stock) => hydrateStockWithYahoo(stock)));
      if (!isMounted) return;

      const liveMap = new Map(liveStocks.map((stock) => [stock.ticker.toUpperCase(), stock]));
      setCurrentStock((prev) => liveMap.get(prev.ticker.toUpperCase()) ?? prev);
      setWatchlist((prev) => prev.map((stock) => liveMap.get(stock.ticker.toUpperCase()) ?? stock));
    };

    loadInitialStocks();

    return () => {
      isMounted = false;
    };
  }, [hydrateStockWithYahoo]);

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
      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-6 space-y-6">
        {/* Top Analytics Grid: Sidebar Watchlist + Core Prediction Card + Technical Checklist */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Watchlist Sidebar (Col 3) */}
          <div className="lg:col-span-3 order-2 lg:order-1">
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

          {/* Core Prediction Matrix Card (Col 5) */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <CorePredictionCard
              stock={currentStock}
              analysis={technicalAnalysis}
              displayMode={displayMode}
              onChangeDisplayMode={setDisplayMode}
              currency={currentCurrency}
              t={t}
            />
          </div>

          {/* Technical Indicator Checklist (Col 4) */}
          <div className="lg:col-span-4 order-3">
            <TechnicalChecklist
              stock={currentStock}
              analysis={technicalAnalysis}
              t={t}
            />
          </div>
        </div>

        {/* Cross-Sectional Watchlist Ranking (z-scores: technical + fundamental + options) */}
        <div className="w-full">
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

        {/* Company Fundamentals (real Yahoo quoteSummary: valuation, margins, health, analyst targets) */}
        <div className="w-full">
          <FundamentalsPanel
            fundamentals={fundamentals}
            loading={fundamentalsLoading}
            currentPrice={currentStock.currentPrice}
            t={t}
          />
        </div>

        {/* Live Price Graph & Movement (Yahoo Style 1D, 5D, 1M, 6M, YTD, 1Y, 5Y, ALL) */}
        <div className="w-full">
          <LivePriceChart
            stock={currentStock}
            currency={currentCurrency}
            t={t}
          />
        </div>

        {/* AI Confidence Meter (live signal agreement; no simulated track record) */}
        <div className="w-full">
          <ConfidenceMeter
            stock={currentStock}
            analysis={technicalAnalysis}
            t={t}
          />
        </div>

        {/* Live Market News (real Yahoo headlines) */}
        <div className="w-full">
          <NewsSection
            stock={currentStock}
            newsList={liveNews}
            loading={newsLoading}
            onRefresh={handleRefreshNews}
            t={t}
          />
        </div>
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
          showToast(`Display mode: ${mode === 'auto' ? 'Auto (Prevailing)' : mode === 'rise_only' ? 'Rise View' : 'Dip View'}`, 'info');
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
