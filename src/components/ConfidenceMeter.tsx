import React from 'react';
import { Bot } from 'lucide-react';
import { Stock, TechnicalAnalysis } from '../types';
import { TranslationDict } from '../utils/translations';

interface ConfidenceMeterProps {
  stock: Stock;
  analysis: TechnicalAnalysis;
  t: TranslationDict;
}

/**
 * Signal-confidence meter derived from the live technical model
 * (agreement strength between trend/RSI/volume factors).
 * No simulated accuracy history — nothing here claims past performance.
 */
export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({ stock, analysis, t }) => {
  // Confidence meter calculation (20 segments)
  const totalSegments = 20;
  const activeSegments = Math.round((analysis.confidenceScore / 100) * totalSegments);

  const confidenceLevelKey =
    analysis.confidenceLevel === 'Extreme'
      ? 'confidenceExtreme'
      : analysis.confidenceLevel === 'High'
      ? 'confidenceHigh'
      : analysis.confidenceLevel === 'Moderate'
      ? 'confidenceModerate'
      : 'confidenceLow';

  const confidenceLabel = (t as any)[confidenceLevelKey] || analysis.confidenceLevel;

  return (
    <div
      id="ai-confidence-meter-card"
      className="bg-[#0e1628] border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
                {t.aiConfidenceMeter}
              </h3>
              <p className="text-[11px] text-slate-400">
                Model signal agreement on <strong className="text-emerald-400">{stock.ticker}</strong>
              </p>
            </div>
          </div>

          <span
            className={`px-2.5 py-1 text-xs font-black font-mono rounded-lg border ${
              analysis.confidenceLevel === 'Extreme' || analysis.confidenceLevel === 'High'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
            }`}
          >
            {confidenceLabel} ({analysis.confidenceScore}%)
          </span>
        </div>

        {/* Segmented LED style meter */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span>0% LOW</span>
            <span>CONFIDENCE INDEX</span>
            <span>100% MAX</span>
          </div>

          <div className="flex items-center gap-1.5 p-2 bg-[#080d19] rounded-2xl border border-slate-800">
            {Array.from({ length: totalSegments }).map((_, i) => {
              const isActive = i < activeSegments;
              let barColor = 'bg-slate-800';
              if (isActive) {
                if (i < 8) barColor = 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]';
                else if (i < 15) barColor = 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]';
                else barColor = 'bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.8)]';
              }
              return (
                <div
                  key={i}
                  className={`h-7 flex-1 rounded-sm transition-all duration-300 ${barColor}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400">
        {t.modelDisclaimerNote}
      </div>
    </div>
  );
};
