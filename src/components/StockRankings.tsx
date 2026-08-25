import React from 'react';
import { Trophy, TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import { RankedStock } from '../types';
import { TranslationDict } from '../utils/translations';

interface StockRankingsProps {
  ranked: RankedStock[];
  loading: boolean;
  activeTicker: string;
  onSelectStock: (ticker: string) => void;
  t: TranslationDict;
}

function scoreColor(z: number | null): string {
  if (z === null) return 'text-slate-600';
  if (z >= 0.5) return 'text-emerald-400';
  if (z <= -0.5) return 'text-rose-400';
  return 'text-slate-300';
}

function scoreChip(z: number | null): React.ReactNode {
  if (z === null) {
    return <span className="font-mono text-[11px] text-slate-600">—</span>;
  }
  const Icon = z > 0.05 ? TrendingUp : z < -0.05 ? TrendingDown : Minus;
  const tone =
    z > 0.05 ? 'text-emerald-400' : z < -0.05 ? 'text-rose-400' : 'text-slate-400';
  return (
    <span className={`inline-flex items-center gap-1 font-mono text-[11px] font-bold ${tone}`}>
      <Icon className="w-3 h-3" />
      {z >= 0 ? `+${z.toFixed(2)}` : z.toFixed(2)}
    </span>
  );
}

/**
 * Cross-sectional ranking of the user's watchlist.
 * Composite = weighted z-scores of technical / fundamental / options metrics.
 */
export const StockRankings: React.FC<StockRankingsProps> = ({
  ranked,
  loading,
  activeTicker,
  onSelectStock,
  t,
}) => {
  const maxAbs = Math.max(0.01, ...ranked.map((r) => Math.abs(r.compositeScore)));

  return (
    <div
      id="stock-rankings-panel"
      className="bg-[#0e1628] border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
              {t.rankingsTitle}
            </h3>
            <p className="text-[11px] text-slate-400">
              {t.rankingsSubtitle}
            </p>
          </div>
        </div>
        {loading && (
          <span className="px-2.5 py-1 text-xs font-mono bg-slate-800 border border-slate-700 rounded-lg text-cyan-400 animate-pulse">
            {t.scoringWatchlist}
          </span>
        )}
      </div>

      {/* Table */}
      {ranked.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-800">
                <th className="py-2 pr-3 font-semibold">#</th>
                <th className="py-2 pr-3 font-semibold">{t.colTicker}</th>
                <th className="py-2 pr-3 font-semibold min-w-[160px]">{t.colCompositeScore}</th>
                <th className="py-2 pr-3 font-semibold text-center" title="Momentum, SMA50 position, 52W distance, volume trend">
                  {t.colTechZ}
                </th>
                <th className="py-2 pr-3 font-semibold text-center" title="Revenue & earnings growth, margins, ROE, debt/equity">
                  {t.colFundZ}
                </th>
                <th className="py-2 pr-3 font-semibold text-center" title="Put/call open-interest positioning">
                  {t.colOptZ}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {ranked.map((r) => {
                const isActive = r.stock.ticker.toUpperCase() === activeTicker.toUpperCase();
                const isTop = r.rank <= 3 && ranked.length >= 3;
                const barWidth = Math.max(6, (Math.abs(r.compositeScore) / maxAbs) * 100);
                const positive = r.compositeScore >= 0;
                return (
                  <tr
                    key={r.stock.ticker}
                    onClick={() => onSelectStock(r.stock.ticker)}
                    className={`cursor-pointer transition-colors ${
                      isActive ? 'bg-emerald-500/10' : 'hover:bg-slate-800/40'
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-2.5 pr-3">
                      <span
                        className={`inline-flex w-7 h-7 items-center justify-center rounded-lg text-xs font-black font-mono ${
                          isTop
                            ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {r.rank}
                      </span>
                    </td>

                    {/* Ticker */}
                    <td className="py-2.5 pr-3">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-100 font-mono">
                          {r.stock.ticker}
                          {isActive && (
                            <span className="ml-1.5 px-1 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[9px] uppercase align-middle">
                              {t.rankActive}
                            </span>
                          )}
                        </span>
                        <span className="text-[10px] text-slate-500 max-w-[160px] truncate">
                          {r.stock.name}
                        </span>
                      </div>
                    </td>

                    {/* Composite bar */}
                    <td className="py-2.5 pr-3">
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1 h-2 bg-slate-800/80 rounded-full overflow-hidden max-w-[140px]">
                          <div
                            className={`absolute top-0 bottom-0 rounded-full ${
                              positive ? 'bg-emerald-400 left-1/2' : 'bg-rose-400 right-1/2'
                            }`}
                            style={{ width: `${barWidth / 2}%` }}
                          />
                          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-600" />
                        </div>
                        <span
                          className={`font-mono text-[11px] font-bold ${
                            positive ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {r.compositeScore >= 0 ? '+' : ''}
                          {r.compositeScore.toFixed(2)}
                        </span>
                      </div>
                    </td>

                    {/* Category z-scores */}
                    <td className="py-2.5 pr-3 text-center">{scoreChip(r.technicalScore)}</td>
                    <td className="py-2.5 pr-3 text-center">{scoreChip(r.fundamentalScore)}</td>
                    <td className="py-2.5 pr-3 text-center">{scoreChip(r.optionsScore)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-8 text-center">
          <p className="text-xs text-slate-400">
            {loading ? t.scoringWatchlist : t.rankingsNeedsTwo}
          </p>
        </div>
      )}

      {/* Methodology footer */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-start gap-2 text-[10px] text-slate-500 leading-relaxed">
        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-600" />
        <span>{t.rankingsMethodology}</span>
      </div>
    </div>
  );
};
