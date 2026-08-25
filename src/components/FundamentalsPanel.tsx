import React from 'react';
import {
  Landmark,
  TrendingUp,
  Percent,
  Scale,
  Users,
  CalendarDays,
  Gauge,
} from 'lucide-react';
import { Fundamentals } from '../types';
import { TranslationDict } from '../utils/translations';

interface FundamentalsPanelProps {
  fundamentals: Fundamentals | null;
  loading: boolean;
  currentPrice: number;
  t: TranslationDict;
}

const fmtNum = (v: number | undefined, digits = 2, suffix = ''): string =>
  v === undefined || !Number.isFinite(v) ? '--' : `${v.toFixed(digits)}${suffix}`;

/** Compact money formatting: 1234567890 -> $1.23B */
const fmtMoney = (v: number | undefined): string => {
  if (v === undefined || !Number.isFinite(v)) return '--';
  const abs = Math.abs(v);
  if (abs >= 1e12) return `$${(v / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `$${(v / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
  return `$${v.toLocaleString()}`;
};

const fmtDate = (iso: string | undefined): string =>
  iso ? new Date(iso).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' }) : '--';

const pctColor = (v: number | undefined): string => {
  if (v === undefined) return 'text-slate-300';
  if (v > 0) return 'text-emerald-400';
  if (v < 0) return 'text-rose-400';
  return 'text-slate-300';
};

const RECOMMENDATION_COLORS: Record<string, string> = {
  strongbuy: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  buy: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  hold: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  underperform: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
  sell: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
};

function Metric({ label, value, valueClass = '' }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
      <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">{label}</div>
      <div className={`text-sm font-bold font-mono mt-0.5 ${valueClass || 'text-slate-100'}`}>{value}</div>
    </div>
  );
}

export const FundamentalsPanel: React.FC<FundamentalsPanelProps> = ({
  fundamentals,
  loading,
  currentPrice,
  t,
}) => {
  if (loading) {
    return (
      <div className="bg-[#0e1628] border border-slate-800 rounded-3xl p-6 shadow-xl animate-pulse">
        <div className="flex items-center gap-2.5 mb-4">
          <Landmark className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
            {t.fundamentalsTitle}
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-14 rounded-xl bg-slate-800/50" />
          ))}
        </div>
      </div>
    );
  }

  // Explicit unavailable state — never fall back to fabricated numbers.
  if (!fundamentals) {
    return (
      <div className="bg-[#0e1628] border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-2.5 mb-3">
          <Landmark className="w-5 h-5 text-slate-400" />
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
            {t.fundamentalsTitle}
          </h3>
        </div>
        <p className="text-xs text-slate-400">{t.fundamentalsUnavailable}</p>
      </div>
    );
  }

  const f = fundamentals;
  const recKey = (f.recommendationKey ?? '').replace(/[\s_]/g, '').toLowerCase();
  const recColor = RECOMMENDATION_COLORS[recKey] ?? 'bg-slate-700/40 text-slate-300 border-slate-600/40';

  // Analyst target bar position (current price vs low..high window)
  let targetPosPct: number | undefined;
  if (f.targetLowPrice !== undefined && f.targetHighPrice !== undefined && f.targetHighPrice > f.targetLowPrice) {
    targetPosPct = Math.max(
      0,
      Math.min(100, ((currentPrice - f.targetLowPrice) / (f.targetHighPrice - f.targetLowPrice)) * 100)
    );
  }
  const upsidePercent =
    f.targetMeanPrice !== undefined && currentPrice > 0
      ? ((f.targetMeanPrice - currentPrice) / currentPrice) * 100
      : undefined;

  return (
    <div className="bg-[#0e1628] border border-slate-800 rounded-3xl p-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Landmark className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
              {t.fundamentalsTitle}
            </h3>
            <p className="text-[11px] text-slate-400">
              {[f.sector, f.industry].filter(Boolean).join(' • ') || f.ticker}
            </p>
          </div>
        </div>
        {f.recommendationKey && (
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 text-xs font-black uppercase rounded-lg border ${recColor}`}>
              Analysts: {f.recommendationKey.replace(/([a-z])([A-Z])/g, '$1 $2')}
            </span>
            {f.numberOfAnalysts !== undefined && (
              <span className="text-[10px] text-slate-400 font-mono">
                ({f.numberOfAnalysts} {t.analystsWord})
              </span>
            )}
          </div>
        )}
      </div>

      {/* Valuation */}
      <div className="mb-4">
        <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Gauge className="w-3.5 h-3.5" /> {t.sectionValuation}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          <Metric label="P/E (TTM)" value={fmtNum(f.trailingPe, 1)} />
          <Metric label="P/E (Fwd)" value={fmtNum(f.forwardPe, 1)} />
          <Metric label="PEG" value={fmtNum(f.pegRatio)} />
          <Metric label="P/B" value={fmtNum(f.priceToBook)} />
          <Metric label="EPS (TTM)" value={fmtNum(f.epsTrailing)} />
          <Metric label="EPS (Fwd)" value={fmtNum(f.epsForward)} />
          <Metric label="Beta" value={fmtNum(f.beta)} />
        </div>
      </div>

      {/* Profitability & Growth side by side with Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div>
          <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Percent className="w-3.5 h-3.5" /> {t.sectionProfitability}
          </div>
          <div className="space-y-2">
            <Metric label="Gross Margin" value={fmtNum(f.grossMarginPercent, 1, '%')} valueClass={pctColor(f.grossMarginPercent)} />
            <Metric label="Operating Margin" value={fmtNum(f.operatingMarginPercent, 1, '%')} valueClass={pctColor(f.operatingMarginPercent)} />
            <Metric label="Net Margin" value={fmtNum(f.profitMarginPercent, 1, '%')} valueClass={pctColor(f.profitMarginPercent)} />
            <Metric label="ROE" value={fmtNum(f.roePercent, 1, '%')} valueClass={pctColor(f.roePercent)} />
            <Metric label="ROA" value={fmtNum(f.roaPercent, 1, '%')} valueClass={pctColor(f.roaPercent)} />
          </div>
        </div>

        <div>
          <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" /> {t.sectionGrowth}
          </div>
          <div className="space-y-2">
            <Metric label="Revenue Growth YoY" value={fmtNum(f.revenueGrowthPercent, 1, '%')} valueClass={pctColor(f.revenueGrowthPercent)} />
            <Metric label="Earnings Growth YoY" value={fmtNum(f.earningsGrowthPercent, 1, '%')} valueClass={pctColor(f.earningsGrowthPercent)} />
            <Metric label="Dividend Yield" value={fmtNum(f.dividendYieldPercent, 2, '%')} />
            <Metric label="Payout Ratio" value={fmtNum(f.payoutRatioPercent, 1, '%')} />
            <Metric label="Next Earnings" value={fmtDate(f.nextEarningsDate)} />
          </div>
        </div>

        <div>
          <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5" /> {t.sectionHealth}
          </div>
          <div className="space-y-2">
            <Metric label="Debt / Equity" value={fmtNum(f.debtToEquity, 0, '%')} valueClass={(f.debtToEquity ?? 0) > 150 ? 'text-rose-400' : 'text-slate-100'} />
            <Metric label="Current Ratio" value={fmtNum(f.currentRatio)} />
            <Metric label="Total Cash" value={fmtMoney(f.totalCash)} />
            <Metric label="Total Debt" value={fmtMoney(f.totalDebt)} />
            <Metric label="Free Cash Flow" value={fmtMoney(f.freeCashflow)} valueClass={pctColor(f.freeCashflow)} />
          </div>
        </div>
      </div>

      {/* Analyst consensus target bar */}
      {(f.targetMeanPrice !== undefined || targetPosPct !== undefined) && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#091629] via-[#0d1c33] to-[#091629] border border-indigo-500/25">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> {t.sectionTargets} ({f.numberOfAnalysts ?? '?'} {t.analystsWord})
            </span>
            {upsidePercent !== undefined && (
              <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-md ${
                upsidePercent >= 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
              }`}>
                {upsidePercent >= 0 ? '+' : ''}{upsidePercent.toFixed(1)}% {t.toMeanTarget}
              </span>
            )}
          </div>

          {targetPosPct !== undefined && (
            <>
              <div className="relative h-2 rounded-full bg-slate-800 overflow-hidden my-3">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-rose-500/60 via-amber-500/60 to-emerald-500/60"
                  style={{ width: '100%' }}
                />
                {/* Current price marker */}
                <div
                  className="absolute top-[-4px] w-1 h-[18px] bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.9)]"
                  style={{ left: `calc(${targetPosPct}% - 2px)` }}
                  title={`Current: ${currentPrice}`}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                <span>Low {fmtNum(f.targetLowPrice)}</span>
                <span className="text-indigo-300 font-bold">Mean {fmtNum(f.targetMeanPrice)}</span>
                <span>High {fmtNum(f.targetHighPrice)}</span>
              </div>
            </>
          )}
        </div>
      )}

      <p className="text-[10px] text-slate-500 mt-3 flex items-center gap-1">
        <CalendarDays className="w-3 h-3" />
        {t.fundamentalsSourceNote}
      </p>
    </div>
  );
};
