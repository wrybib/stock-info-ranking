import React from 'react';
import {
  CheckCircle2,
  XCircle,
  TrendingUp,
  TrendingDown,
  Info,
  Sliders,
  Cpu,
  BarChart2,
} from 'lucide-react';
import { Stock, TechnicalAnalysis } from '../types';
import { TranslationDict } from '../utils/translations';

interface TechnicalChecklistProps {
  stock: Stock;
  analysis: TechnicalAnalysis;
  t: TranslationDict;
}

export const TechnicalChecklist: React.FC<TechnicalChecklistProps> = ({
  stock,
  analysis,
  t,
}) => {
  return (
    <div
      id="technical-checklist-panel"
      className="bg-[#0e1628] border border-slate-800 rounded-3xl p-6 flex flex-col justify-between h-full shadow-xl relative overflow-hidden"
    >
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
                {t.technicalChecklist}
              </h3>
              <p className="text-[11px] text-slate-400">{t.technicalMathExplanation}</p>
            </div>
          </div>
          <span className="text-[11px] font-mono font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-2.5 py-1 rounded-lg">
            4-FACTOR QUANT
          </span>
        </div>

        {/* Checklist items */}
        <div className="space-y-3">
          {analysis.checkList.map((item) => {
            const title = (t as any)[item.titleKey] || item.titleKey;
            const desc = (t as any)[item.descriptionKey] || item.descriptionKey;

            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  item.isBullish
                    ? 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/50'
                    : 'bg-rose-950/20 border-rose-500/30 hover:border-rose-500/50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      {item.isBullish ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-400" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200 leading-tight">
                        {title}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 font-medium">
                        {desc}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 mt-1 flex items-center gap-2">
                        <span className="bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-800 text-slate-300">
                          {item.valueText}
                        </span>
                        <span className="truncate max-w-[200px]" title={item.formulaInfo}>
                          {item.formulaInfo}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <span
                      className={`inline-block font-mono text-xs font-bold px-2 py-0.5 rounded-md ${
                        item.isBullish
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {item.isBullish ? `+${item.scoreContribution}%` : `-${item.scoreContribution}%`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer summary bar */}
      <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <span className="text-slate-400 font-medium">Weighted Model Convergence:</span>
        <span
          className={`font-mono font-bold ${
            analysis.direction === 'rise' ? 'text-emerald-400' : 'text-rose-400'
          }`}
        >
          {analysis.direction === 'rise' ? '🟢 Bullish Convergence' : '🔴 Bearish Pullback'} (
          {analysis.probabilityRise}% / {analysis.probabilityDip}%)
        </span>
      </div>
    </div>
  );
};
