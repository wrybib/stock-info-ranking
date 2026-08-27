import React from 'react';
import { Building2, UserCheck, TrendingUp, TrendingDown } from 'lucide-react';
import { HoldingsSnapshot } from '../types';
import { TranslationDict } from '../utils/translations';

interface OwnershipPanelProps {
  holdings: HoldingsSnapshot | null;
  loading: boolean;
  t: TranslationDict;
}

const fmtShares = (v: number | undefined): string => {
  if (v === undefined || !Number.isFinite(v)) return '--';
  const abs = Math.abs(v);
  if (abs >= 1e9) return `${(v / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${(v / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${(v / 1e3).toFixed(1)}K`;
  return v.toLocaleString();
};

const fmtDate = (iso: string | undefined): string =>
  iso
    ? new Date(iso).toLocaleDateString([], { year: '2-digit', month: 'short', day: 'numeric' })
    : '--';

const changeColor = (v: number | undefined): string => {
  if (v === undefined || !Number.isFinite(v)) return 'text-slate-400';
  if (v > 0.05) return 'text-emerald-400';
  if (v < -0.05) return 'text-rose-400';
  return 'text-slate-400';
};

function SectionHeader({
  icon,
  color,
  title,
}: {
  icon: React.ReactNode;
  color: string;
  title: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
      <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${color}`}>
        {icon} {title}
      </span>
    </div>
  );
}

function StatChip({
  label,
  value,
  color,
}: {
  label: string;
  value: number | undefined;
  color: string;
}) {
  return (
    <div className="text-right">
      <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">{label}</div>
      <div className={`text-lg font-bold font-mono ${color}`}>
        {value !== undefined ? `${value.toFixed(1)}%` : '--'}
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="min-w-0">
      <div className="text-[9px] uppercase tracking-wide text-slate-500 font-bold truncate">
        {label}
      </div>
      <div className={`text-[11px] font-mono font-bold ${color} truncate`} title={value}>
        {value}
      </div>
    </div>
  );
}

export const OwnershipPanel: React.FC<OwnershipPanelProps> = ({ holdings, loading, t }) => {
  if (loading) {
    return (
      <div className="bg-[#0e1628] border border-slate-800 rounded-3xl p-6 shadow-xl animate-pulse">
        <div className="flex items-center gap-2.5 mb-4">
          <Building2 className="w-5 h-5 text-teal-400" />
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
            {t.ownershipTitle}
          </h3>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 rounded-xl bg-slate-800/50" />
          ))}
        </div>
      </div>
    );
  }

  if (!holdings) {
    return (
      <div className="bg-[#0e1628] border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-2.5 mb-3">
          <Building2 className="w-5 h-5 text-slate-400" />
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
            {t.ownershipTitle}
          </h3>
        </div>
        <p className="text-xs text-slate-400">{t.ownershipUnavailable}</p>
      </div>
    );
  }

  const net = holdings.netActivity;
  const topHolders = (holdings.holders ?? []).slice(0, 8);
  const insiderTxs = (holdings.insiderTransactions ?? []).slice(0, 6);

  return (
    <div className="bg-[#0e1628] border border-slate-800 rounded-3xl p-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
              {t.ownershipTitle}
            </h3>
            <p className="text-[11px] text-slate-400">{holdings.ticker}</p>
          </div>
        </div>
        {holdings.ownedPercentInstitutions !== undefined ||
        holdings.majorHolders?.institutionsPercent !== undefined ||
        holdings.majorHolders?.insidersPercent !== undefined ||
        holdings.majorHolders?.institutionsFloatPercent !== undefined ? (
          <div className="flex flex-wrap items-center justify-end gap-x-5 gap-y-2">
            <StatChip
              label={t.institutionOwnership}
              value={holdings.majorHolders?.institutionsPercent ?? holdings.ownedPercentInstitutions}
              color="text-teal-300"
            />
            <StatChip
              label={t.insidersWord}
              value={holdings.majorHolders?.insidersPercent}
              color="text-sky-300"
            />
            <StatChip
              label={t.floatWord}
              value={holdings.majorHolders?.institutionsFloatPercent}
              color="text-violet-300"
            />
          </div>
        ) : null}
      </div>

      {/* Institutions count caption */}
      {holdings.institutionsCount !== undefined && (
        <p className="text-[11px] text-slate-400 -mt-3 mb-3">
          {t.sectionInstitutions}: {holdings.institutionsCount.toLocaleString()}{' '}
          {t.institutionsWord}
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-5">
        {/* ---------------- Institutional holders ---------------- */}
        <div>
          <SectionHeader
            icon={<Building2 className="w-3.5 h-3.5" />}
            color="text-cyan-400"
            title={t.sectionInstitutions}
          />
          {topHolders.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-900/80 text-[9px] uppercase tracking-wider text-slate-500">
                    <th className="px-2.5 py-2 font-bold">{t.colInstitution}</th>
                    <th className="px-2 py-2 font-bold text-right">{t.colShares}</th>
                    <th className="px-2 py-2 font-bold text-right">{t.colPercent}</th>
                    <th className="px-2 py-2 font-bold text-right">{t.colChangeQtr}</th>
                  </tr>
                </thead>
                <tbody>
                  {topHolders.map((holder, i) => (
                    <tr
                      key={`${holder.name}-${i}`}
                      className="border-t border-slate-800/70 hover:bg-slate-900/50"
                    >
                      <td
                        className="px-2.5 py-2 text-xs text-slate-200 max-w-[180px] truncate"
                        title={`${holder.name}${holder.reportDate ? ` · ${fmtDate(holder.reportDate)}` : ''}`}
                      >
                        {holder.name}
                      </td>
                      <td className="px-2 py-2 text-xs font-mono text-slate-300 text-right whitespace-nowrap">
                        {fmtShares(holder.shares)}
                      </td>
                      <td className="px-2 py-2 text-xs font-mono text-slate-300 text-right">
                        {holder.pctHeld !== undefined ? `${holder.pctHeld.toFixed(2)}%` : '--'}
                      </td>
                      <td
                        className={`px-2 py-2 text-xs font-mono text-right ${changeColor(holder.pctChange)}`}
                      >
                        {holder.pctChange !== undefined
                          ? `${holder.pctChange > 0 ? '+' : ''}${holder.pctChange.toFixed(1)}%`
                          : '--'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-slate-500 p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
              {t.noInstitutionData}
            </p>
          )}
        </div>

        {/* ---------------- Insider activity ---------------- */}
        <div>
          <SectionHeader
            icon={<UserCheck className="w-3.5 h-3.5" />}
            color="text-amber-400"
            title={t.sectionInsiders}
          />

          {/* Net activity summary */}
          {net && (net.netPercentBuy !== undefined || net.buysShares !== undefined) && (
            <div className="mb-3 p-3 rounded-xl bg-gradient-to-r from-[#091629] via-[#0d1c33] to-[#091629] border border-amber-500/20">
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-[11px] text-slate-300 font-bold">
                  {net.buysCount ?? 0} {t.insiderBuys} / {net.sellsCount ?? 0}{' '}
                  {t.insiderSells}
                  {net.period ? ` · ${net.period}` : ''}
                </span>
                {net.netPercentBuy !== undefined && (
                  <span
                    className={`text-xs font-bold font-mono px-2 py-0.5 rounded-md ${
                      net.netPercentBuy >= 0
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {net.netPercentBuy >= 0 ? (
                      <TrendingUp className="w-3 h-3 inline mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 inline mr-1" />
                    )}
                    {net.netPercentBuy >= 0 ? '+' : ''}
                    {net.netPercentBuy.toFixed(1)}%
                  </span>
                )}
              </div>
              {/* Buy/sell share split bar */}
              <div className="relative h-1.5 rounded-full bg-rose-500/25 overflow-hidden">
                {(() => {
                  const buys = Math.abs(net.buysShares ?? 0);
                  const sells = Math.abs(net.sellsShares ?? 0);
                  const total = buys + sells;
                  const buyPct = total > 0 ? (buys / total) * 100 : 50;
                  return (
                    <>
                      <div
                        className="absolute inset-y-0 left-0 bg-emerald-500/70"
                        style={{ width: `${buyPct}%` }}
                      />
                      <div
                        className="absolute inset-y-0 right-0 bg-rose-500/70"
                        style={{ width: `${100 - buyPct}%` }}
                      />
                    </>
                  );
                })()}
              </div>

              {/* Share-volume stats: Bought / Sold / Net / Total insider holdings */}
              {(net.buysShares !== undefined ||
                net.sellsShares !== undefined ||
                net.netShares !== undefined ||
                net.totalInsiderShares !== undefined) && (
                <div className="grid grid-cols-4 gap-x-2 mt-2">
                  <MiniStat
                    label={t.insiderBought}
                    value={net.buysShares !== undefined ? fmtShares(net.buysShares) : '--'}
                    color="text-emerald-300"
                  />
                  <MiniStat
                    label={t.insiderSold}
                    value={net.sellsShares !== undefined ? fmtShares(net.sellsShares) : '--'}
                    color="text-rose-300"
                  />
                  <MiniStat
                    label={t.insiderNet}
                    value={
                      net.netShares !== undefined
                        ? `${net.netShares >= 0 ? '+' : ''}${fmtShares(net.netShares)}`
                        : '--'
                    }
                    color={
                      net.netShares === undefined || net.netShares >= 0
                        ? 'text-emerald-300'
                        : 'text-rose-300'
                    }
                  />
                  <MiniStat
                    label={t.insiderHeld}
                    value={
                      net.totalInsiderShares !== undefined
                        ? fmtShares(net.totalInsiderShares)
                        : '--'
                    }
                    color="text-slate-200"
                  />
                </div>
              )}
            </div>
          )}

          {/* Recent insider transactions */}
          {insiderTxs.length > 0 ? (
            <ul className="space-y-1.5 max-h-[240px] overflow-y-auto pr-1">
              {insiderTxs.map((tx, i) => {
                // Detail line: role · holding type · size traded
                const detailBits: string[] = [];
                if (tx.filerRelation) detailBits.push(tx.filerRelation);
                if (tx.ownership) detailBits.push(tx.ownership);
                if (tx.shares !== undefined && Number.isFinite(tx.shares)) {
                  detailBits.push(`${tx.shares >= 0 ? '+' : ''}${fmtShares(tx.shares)} sh`);
                }
                return (
                  <li
                    key={`${tx.filerName}-${i}`}
                    className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-200 truncate">
                        {tx.filerName}
                      </span>
                      <span
                        className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded shrink-0 ${
                          (tx.transactionType ?? '').toLowerCase().includes('buy') ||
                          (tx.transactionText ?? '').toLowerCase().startsWith('purchase')
                            ? 'bg-emerald-500/15 text-emerald-300'
                            : (tx.transactionType ?? '').toLowerCase().includes('sell')
                            ? 'bg-rose-500/15 text-rose-300'
                            : 'bg-slate-700/50 text-slate-300'
                        }`}
                      >
                        {tx.transactionType ?? '--'}
                      </span>
                    </div>
                    {detailBits.length > 0 && (
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
                        {detailBits.join(' · ')}
                      </div>
                    )}
                    {tx.transactionText && (
                      <div
                        className="text-[10px] text-slate-400 mt-0.5 line-clamp-1"
                        title={tx.transactionText}
                      >
                        {tx.transactionText}
                      </div>
                    )}
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5 flex items-center justify-between gap-2">
                      <span>{fmtDate(tx.startDate)}</span>
                      {tx.moneyText && (
                        <span className="text-slate-400 font-bold">{tx.moneyText}</span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-xs text-slate-500 p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
              {t.noInsiderData}
            </p>
          )}
        </div>
      </div>

      {/* Source note */}
      <p className="text-[10px] text-slate-500 mt-4 pt-3 border-t border-slate-800/70">
        {t.ownershipSourceNote}
      </p>
    </div>
  );
};
