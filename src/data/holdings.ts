import {
  HoldingsSnapshot,
  InstitutionalHolder,
  InsiderTransaction,
  MajorHolders,
  NetShareActivity,
} from '../types';
import { toYahooTicker } from './yahooFinance';

/**
 * Ownership data that Yahoo Finance itself exposes (quoteSummary modules):
 *  - majorHoldersBreakdown     → ownership split (insiders / institutions / float)
 *  - institutionOwnership      → top institutional holders (13F-style)
 *  - insiderTransactions       → recent insider buys/sells
 *  - netSharePurchaseActivity  → aggregate insider activity (~6 months)
 *
 * Fetched through our proxy: /api/yahoo/holdings/:symbol
 */

type YahooField = { raw?: number; fmt?: string } | undefined;

const num = (field: YahooField): number | undefined =>
  field && typeof field.raw === 'number' && Number.isFinite(field.raw) ? field.raw : undefined;

const isoFromTimestamp = (field: YahooField): string | undefined => {
  const raw = num(field);
  if (raw === undefined || raw <= 0) return undefined;
  return new Date(raw * 1000).toISOString();
};

/** Yahoo reports quarter-over-quarter position change as a fraction (0.0085 = +0.85%). */
function toPercent(field: YahooField): number | undefined {
  const raw = num(field);
  if (raw === undefined) return undefined;
  return raw <= 5 ? Number((raw * 100).toFixed(2)) : Number(raw.toFixed(2));
}

/**
 * Yahoo does NOT provide a structured transaction type for insiders — the
 * buy/sell/other classification must be derived from transactionText prefixes:
 *   "Purchase at price X per share." / "Sale at price X per share." /
 *   "Stock Award(Grant)…" / "Stock Gift…" / "Option Exercise…"
 */
function deriveTxType(text?: string): string | undefined {
  const t = String(text ?? '').trim().toLowerCase();
  if (!t) return undefined;
  if (t.startsWith('purchase') || t.startsWith('buy')) return 'Buy';
  if (
    t.startsWith('sale') ||
    t.startsWith('sell') ||
    t.startsWith('automatic sell') ||
    t.startsWith('disposition')
  ) {
    return 'Sell';
  }
  if (t.includes('award') || t.includes('grant')) return 'Award';
  if (t.includes('gift')) return 'Gift';
  if (t.includes('exercise')) return 'Exercise';
  if (t.includes('transfer')) return 'Transfer';
  return 'Other';
}

export async function fetchYahooHoldings(symbol: string): Promise<HoldingsSnapshot | null> {
  try {
    const url = `/api/yahoo/holdings/${encodeURIComponent(toYahooTicker(symbol))}`;
    const response = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!response.ok) return null;

    const payload = await response.json();
    const result = payload?.quoteSummary?.result?.[0];
    if (!result) return null;

    const inst = result.institutionOwnership ?? {};
    // NOTE: the live API returns `ownershipList`; older docs say `holdersList`.
    const holdersRaw: any[] =
      (Array.isArray(inst.ownershipList) && inst.ownershipList) ||
      (Array.isArray(inst.holdersList) && inst.holdersList) ||
      [];
    const holders: InstitutionalHolder[] = holdersRaw.map((holder) => ({
      name: String(holder.organization ?? holder.name ?? 'Unknown'),
      shares: num(holder.position),
      // pctHeld arrives as a fraction (0.08 = 8%)
      pctHeld: toPercent(holder.pctHeld),
      value: num(holder.value),
      // Quarter-over-quarter change vs previous 13F report, already a fraction
      pctChange: toPercent(holder.pctChange),
      /** 13F/13G report period end (ISO). */
      reportDate: isoFromTimestamp(holder.reportDate),
    }));

    const txsRaw = result.insiderTransactions?.transactions;
    const insiderTransactions: InsiderTransaction[] = Array.isArray(txsRaw)
      ? (txsRaw as any[]).map((tx) => ({
          filerName: String(tx.filerName ?? 'Unknown'),
          filerRelation:
            typeof tx.filerRelation === 'string' ? tx.filerRelation : undefined,
          transactionText:
            typeof tx.transactionText === 'string' ? tx.transactionText : undefined,
          transactionType: deriveTxType(
            typeof tx.transactionText === 'string' ? tx.transactionText : undefined
          ),
          /** "D" = direct, "I" = indirect holding. */
          ownership:
            typeof tx.ownership === 'string'
              ? tx.ownership === 'D'
                ? 'Direct'
                : tx.ownership === 'I'
                ? 'Indirect'
                : tx.ownership
              : undefined,
          startDate: isoFromTimestamp(tx.startDate),
          shares: num(tx.shares),
          value: num(tx.value),
          postTransactionShares: num(tx.postTransactionShares),
          /** Pre-formatted dollar amount like "$1.2M" when Yahoo provides one. */
          moneyText: typeof tx.moneyText === 'string' ? tx.moneyText : undefined,
        }))
      : [];

    const net = result.netSharePurchaseActivity ?? {};
    const netActivity: NetShareActivity | undefined =
      net && typeof net === 'object'
        ? {
            period: typeof net.period === 'string' ? net.period : undefined,
            // NOTE: Yahoo wraps ALL numeric fields (including these counts) in
            // {raw, fmt} objects, so they must go through num().
            buysCount: num(net.buyInfoCount),
            buysShares: num(net.buyInfoShares),
            sellsCount: num(net.sellInfoCount),
            sellsShares: num(net.sellInfoShares),
            // Yahoo's official net figure (shares) — not always bought-sold,
            // since grants/exercises feed into it too.
            netShares: num(net.netInfoShares),
            totalInsiderShares: num(net.totalInsiderShares),
            // Yahoo key is netPercentInsiderShares, reported as a fraction
            netPercentBuy: toPercent(net.netPercentInsiderShares),
          }
        : undefined;

    // High-level ownership split. Yahoo reports these as fractions (0.07 = 7%);
    // guard against modules that already return percents.
    const mh = result.majorHoldersBreakdown ?? {};
    const majorHolders: MajorHolders = {
      insidersPercent: toPercent(mh.insidersPercentHeld),
      institutionsPercent: toPercent(mh.institutionsPercentHeld),
      institutionsFloatPercent: toPercent(mh.institutionsFloatPercentHeld),
    };

    return {
      ticker: symbol.trim().toUpperCase(),
      majorHolders,
      institutionsCount:
        typeof inst.institutionsCount === 'number' ? inst.institutionsCount : undefined,
      ownedPercentInstitutions: (() => {
        const raw = num(inst.ownedPercent);
        if (raw === undefined) return undefined;
        return raw <= 1.5 ? Number((raw * 100).toFixed(2)) : Number(raw.toFixed(2));
      })(),
      holders,
      insiderTransactions,
      netActivity,
    };
  } catch {
    return null;
  }
}
