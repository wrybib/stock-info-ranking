import React from 'react';
import { Activity } from 'lucide-react';
import { Stock, TechnicalAnalysis, CurrencyInfo } from '../types';
import { TranslationDict } from '../utils/translations';
import { formatCurrencyValue } from '../utils/currencies';

interface TechMetricsPanelProps {
  stock: Stock;
  analysis: TechnicalAnalysis;
  currency: CurrencyInfo;
  t: TranslationDict;
}

const fmtPct = (v: number | null | undefined, digits = 1): string =>
  v === null || v === undefined || !Number.isFinite(v) ? '--' : `${v.toFixed(digits)}%`;

const deltaClass = (v: number | null): string => {
  if (v === null) return 'bg-slate-700/40 text-slate-400';
  return v >= 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300';
};

function Metric({
  label,
  value,
  delta = null,
  tooltip,
}: {
  label: string;
  value: string;
  /** Optional % delta chip shown next to the value. */
  delta?: number | null;
  tooltip?: string;
}) {
  const hasDelta = delta !== null && delta !== undefined && Number.isFinite(delta);
  return (
    <div
      title={tooltip}
      className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-600 transition-colors"
    >
      <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">{label}</div>
      <div className="flex items-center gap-1.5 mt-0.5">
        <span className="text-sm font-bold font-mono text-slate-100">{value}</span>
        {hasDelta && (
          <span
            className={`text-[10px] font-mono font-bold px-1 py-0 rounded ${deltaClass(delta ?? null)}`}
          >
            {delta! >= 0 ? '+' : ''}
            {delta!.toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Dedicated snapshot of the major technical metrics — pure data, no scoring.
 * Hover any cell for a plain-language explanation of the metric.
 */
export const TechMetricsPanel: React.FC<TechMetricsPanelProps> = ({
  stock,
  analysis,
  currency,
  t,
}) => {
  const price = stock.currentPrice;

  const ema9Diff =
    analysis.ema9 > 0 ? ((price - analysis.ema9) / analysis.ema9) * 100 : null;
  const sma50Diff =
    analysis.sma50 !== null && analysis.sma50 > 0
      ? ((price - analysis.sma50) / analysis.sma50) * 100
      : null;

  // Position inside the real 52-week range (0 = at low, 100 = at high)
  const range52w = stock.high52w - stock.low52w;
  const pos52w =
    range52w > 0 ? Math.max(0, Math.min(100, ((price - stock.low52w) / range52w) * 100)) : 50;

  const volTooltip = t.volProfileExpl;

  return (
    <div className="bg-[#0e1628] border border-slate-800 rounded-3xl p-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800 mb-4">
        <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <Activity className="w-4 h-4" />
        </div>
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
          {t.techMetricsTitle}
        </h3>
        <span className="ml-auto text-[10px] text-slate-500 hidden sm:block">
          {t.techMetricsHint}
        </span>
      </div>

      {/* Metric grid: trend + volume + volatility */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        <Metric
          label="9 EMA"
          value={formatCurrencyValue(analysis.ema9, currency)}
          delta={ema9Diff}
          tooltip={t.ma10Expl}
        />
        <Metric
          label={t.lblSma50}
          value={analysis.sma50 !== null ? formatCurrencyValue(analysis.sma50, currency) : '--'}
          delta={sma50Diff}
          tooltip={t.sma50Expl}
        />
        <Metric
          label={t.lblRsi14}
          value={analysis.rsi !== null ? analysis.rsi.toFixed(1) : '--'}
          tooltip={t.rsiExpl}
        />
        <Metric
          label={t.lblVolRatio}
          value={`${(analysis.volumeRatio * 100).toFixed(0)}%`}
          tooltip={t.volumeExpl}
        />
        <Metric label={t.lblAtr14} value={fmtPct(analysis.atr14Percent)} tooltip={volTooltip} />
        <Metric label={t.lblDailyVol} value={fmtPct(analysis.volatility)} tooltip={volTooltip} />
        <Metric
          label={t.lblAnnVol}
          value={fmtPct(analysis.volatilityAnnualized)}
          tooltip={volTooltip}
        />
      </div>

      {/* 52W range bar */}
      <div
        title={t.range52wExpl}
        className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-[#091629] via-[#0d1c33] to-[#091629] border border-cyan-500/25"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
            {t.range52wTitle}
          </span>
          <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300">
            {pos52w.toFixed(0)}%
          </span>
        </div>

        <div className="relative h-2 rounded-full bg-slate-800 overflow-hidden my-3">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-rose-500/60 via-amber-500/60 to-emerald-500/60"
            style={{ width: '100%' }}
          />
          {/* Current price marker */}
          <div
            className="absolute top-[-4px] w-1 h-[18px] bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.9)]"
            style={{ left: `calc(${pos52w}% - 2px)` }}
            title={`${t.range52wTitle}: ${formatCurrencyValue(price, currency)}`}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
          <span>L {formatCurrencyValue(stock.low52w, currency)}</span>
          <span className="text-cyan-300 font-bold">
            {formatCurrencyValue(price, currency)}
          </span>
          <span>H {formatCurrencyValue(stock.high52w, currency)}</span>
        </div>
      </div>
    </div>
  );
};
