import React from 'react';
import {
  Newspaper,
  RefreshCw,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { Stock, LiveNewsItem } from '../types';
import { TranslationDict } from '../utils/translations';
import { formatRelativeTime } from '../data/news';

interface NewsSectionProps {
  stock: Stock;
  newsList: LiveNewsItem[];
  loading: boolean;
  onRefresh: () => void;
  t: TranslationDict;
}

export const NewsSection: React.FC<NewsSectionProps> = ({
  stock,
  newsList,
  loading,
  onRefresh,
  t,
}) => {
  return (
    <div
      id="market-news-panel"
      className="bg-[#0e1628] border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between"
    >
      <div>
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Newspaper className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
                {t.marketNews}
              </h3>
              <p className="text-[11px] text-slate-400">
                Live headlines for <strong className="text-emerald-400">{stock.ticker}</strong> • Yahoo Finance
              </p>
            </div>
          </div>

          {/* Refresh */}
          <button
            id="btn-refresh-live-news"
            onClick={onRefresh}
            disabled={loading}
            className="px-2.5 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            title="Refresh live headlines"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Loading…' : 'Refresh'}</span>
          </button>
        </div>

        {/* News Cards List */}
        {newsList.length > 0 ? (
          <div className="space-y-3">
            {newsList.map((item) => (
              <a
                key={item.id}
                href={item.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 rounded-2xl bg-[#09101d] border border-slate-800 hover:border-cyan-500/40 hover:bg-[#0b1526] transition-all group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 pr-1">
                    {/* Meta row */}
                    <div className="flex items-center flex-wrap gap-2 mb-2 text-[11px] text-slate-400 font-medium">
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
                        {item.publisher}
                      </span>
                      {item.publishedAt && <span>{formatRelativeTime(item.publishedAt)}</span>}
                    </div>

                    {/* Title */}
                    <h4 className="text-xs sm:text-sm font-bold text-slate-100 leading-snug group-hover:text-white transition-colors">
                      {item.title}
                    </h4>
                  </div>

                  <ExternalLink className="w-4 h-4 shrink-0 mt-1 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-[#09101d] border border-slate-800 rounded-2xl">
            <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-3">
              {loading
                ? 'Fetching live headlines…'
                : 'No live headlines are available for this ticker right now.'}
            </p>
            {!loading && (
              <button
                onClick={onRefresh}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg inline-flex items-center gap-1.5 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Try Again
              </button>
            )}
          </div>
        )}

        <p className="text-[10px] text-slate-500 mt-4">
          Source: Yahoo Finance live news feed • headlines open at the publisher's site • cached ~2 min.
        </p>
      </div>
    </div>
  );
};
