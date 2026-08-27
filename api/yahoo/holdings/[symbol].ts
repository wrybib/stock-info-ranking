import { fetchHoldings } from '../../_lib/yahoo';

/**
 * Vercel Serverless Function
 * GET /api/yahoo/holdings/:symbol
 *
 * Institutional holders (13F-style) + insider transactions + net share
 * purchase activity from Yahoo quoteSummary ownership modules.
 * Requires cookie+crumb handshake — handled in the shared lib.
 */
export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const symbol = String(req.query.symbol ?? '').trim();
  if (!symbol) {
    res.status(400).json({ error: 'Missing symbol' });
    return;
  }

  const upstream = await fetchHoldings(symbol);
  res.setHeader('Content-Type', 'application/json');
  // Ownership updates quarterly / on insider filings; cache long.
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.status(upstream.status).send(upstream.body);
}
