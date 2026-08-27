import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Target,
} from 'lucide-react';
import { Stock, TechnicalAnalysis, DisplayMode, CurrencyInfo } from '../types';
import { TranslationDict } from '../utils/translations';
import { formatCurrencyValue } from '../utils/currencies';

interface CorePredictionCardProps {
  stock: Stock;
  analysis: TechnicalAnalysis;
  displayMode: DisplayMode;
  onChangeDisplayMode: (mode: DisplayMode) => void;
  currency: CurrencyInfo;
  t: TranslationDict;
}

export const CorePredictionCard: React.FC<CorePredictionCardProps> = ({
  stock,
  analysis,
  displayMode,
  onChangeDisplayMode,
  currency,
  t,
}) => {
  // Determine displayed percentage and direction based on user's displayMode setting
  let shownDirection: 'rise' | 'dip' = analysis.direction;
  let shownPercent = analysis.probabilityRise;

  if (displayMode === 'rise_only') {
    shownDirection = 'rise';
    shownPercent = analysis.probabilityRise;
  } else if (displayMode === 'dip_only') {
    shownDirection = 'dip';
    shownPercent = analysis.probabilityDip;
  } else {
    // Auto dynamic: show higher probability
    if (analysis.probabilityRise >= 50) {
      shownDirection = 'rise';
      shownPercent = analysis.probabilityRise;
    } else {
      shownDirection = 'dip';
      shownPercent = analysis.probabilityDip;
    }
  }

  const isRise = shownDirection === 'rise';
  const glowColor = isRise ? 'emerald' : 'rose';

  return (
    <div
      id="core-prediction-card"
      className={`relative overflow-hidden rounded-3xl p-6 md:p-8 transition-all duration-500 border ${
        isRise
          ? 'bg-gradient-to-b from-[#092218] via-[#0b1726] to-[#070c18] border-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.22)]'
          : 'bg-gradient-to-b from-[#240c14] via-[#140f1f] to-[#070c18] border-rose-500/50 shadow-[0_0_50px_rgba(239,68,68,0.22)]'
      }`}
    >
      {/* Background Animated Glow Orb */}
      <div
        className={`absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-40 transition-colors duration-700 ${
          isRise ? 'bg-emerald-500' : 'bg-rose-500'
        }`}
      />
      <div
        className={`absolute -bottom-20 -left-20 w-60 h-60 rounded-full blur-3xl pointer-events-none opacity-25 transition-colors duration-700 ${
          isRise ? 'bg-teal-500' : 'bg-red-600'
        }`}
      />

      <div className="relative z-10 flex flex-col justify-between h-full gap-6">
        {/* Top Tag & Stock Summary & Direct Rise/Dip Mode Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 text-xs font-extrabold uppercase tracking-wider rounded-full border flex items-center gap-1.5 ${
                isRise
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-[0_0_12px_rgba(239,68,68,0.3)]'
              }`}
            >
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              {t.corePrediction}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {stock.exchange} • {stock.currency}
            </span>
          </div>

          {/* Direct Interactive View Selector (Auto / Rise View / Dip View) */}
          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-700 shadow-inner">
            <button
              type="button"
              id="btn-view-auto"
              onClick={() => onChangeDisplayMode('auto')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                displayMode === 'auto'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title={t.autoTooltip}
            >
              {t.viewAuto}
            </button>
            <button
              type="button"
              id="btn-view-rise"
              onClick={() => onChangeDisplayMode('rise_only')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                displayMode === 'rise_only'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow'
                  : 'text-emerald-400 hover:bg-emerald-950/40'
              }`}
              title={t.riseViewTooltip}
  >
              <TrendingUp className="w-3 h-3" />
              {t.viewRise} ({analysis.probabilityRise}%)
  </button>
            <button
              type="button"
              id="btn-view-dip"
              onClick={() => onChangeDisplayMode('dip_only')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                displayMode === 'dip_only'
                  ? 'bg-rose-500 text-white font-black shadow'
                  : 'text-rose-400 hover:bg-rose-950/40'
              }`}
              title={t.dipViewTooltip}
            >
              <TrendingDown className="w-3 h-3" />
              {t.viewDip} ({analysis.probabilityDip}%)
            </button>
          </div>
        </div>

        {/* Main Probability Display & Giant Number */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 py-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {isRise ? t.probRising : t.probDipping}
              </span>
            </div>

            <div className="flex items-baseline gap-4">
              <div
                className={`text-5xl sm:text-6xl md:text-7xl font-black tracking-tight font-mono drop-shadow-[0_0_20px_rgba(0,0,0,0.8)] ${
                  isRise ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {shownPercent}%
              </div>

              {/* Animated Directional Arrow */}
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center border shadow-xl shrink-0 transition-transform ${
                  isRise
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50 shadow-emerald-900/40 animate-bounce'
                    : 'bg-rose-500/20 text-rose-300 border-rose-400/50 shadow-rose-900/40 animate-bounce'
                }`}
              >
                {isRise ? (
                  <ArrowUpRight className="w-8 h-8 sm:w-9 sm:h-9 stroke-[2.5]" />
                ) : (
                  <ArrowDownRight className="w-8 h-8 sm:w-9 sm:h-9 stroke-[2.5]" />
                )}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-md font-medium leading-relaxed">
              {isRise ? t.leanUpward : t.leanDownward}
            </p>
            <p className="text-[10px] text-slate-500 mt-1.5 max-w-md leading-relaxed">
              {t.modelDisclaimer}
            </p>
          </div>

          {/* Target Price Window Box */}
          <div className="w-full md:w-auto md:min-w-[260px] bg-slate-900/80 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 uppercase font-bold mb-1">
              <Target className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t.targetTomorrow}</span>
            </div>

            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-black text-slate-100 font-mono">
                {formatCurrencyValue(analysis.targetPrice, currency)}
              </div>
              <span
                className={`text-xs font-bold font-mono px-2 py-0.5 rounded-md ${
                  analysis.targetChangePercent >= 0
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-rose-500/20 text-rose-400'
                }`}
              >
                {analysis.targetChangePercent >= 0 ? '+' : ''}
                {analysis.targetChangePercent.toFixed(1)}%
              </span>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-800">
              <div className="text-[10px] text-slate-400 font-semibold mb-1">
                {t.estimatedWindow}
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                <span className="text-rose-400">
                  {formatCurrencyValue(analysis.targetPriceLow, currency)}
                </span>
                <span className="text-slate-500">↔</span>
                <span className="text-emerald-400">
                  {formatCurrencyValue(analysis.targetPriceHigh, currency)}
                </span>
              </div>
            </div>

            {/* Position-sizing hint (Kelly-lite, scaled by the user's risk level) */}
            <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">
                {t.positionSizeHint}
              </span>
              <span
                className={`text-xs font-black font-mono px-2 py-0.5 rounded-md border ${
                  analysis.suggestedPositionPct > 0
                    ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40'
                    : 'bg-slate-700/40 text-slate-400 border-slate-600/60'
                }`}
              >
                {analysis.suggestedPositionPct.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
