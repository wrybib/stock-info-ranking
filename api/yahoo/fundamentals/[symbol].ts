import { fetchFundamentals, PUBLIC_CACHE_CONTROL } from '../../_lib/yahoo';

/**
 * Vercel Serverless Function
 * GET /api/yahoo/fundamentals/:symbol
 *
 * Handles the cookie+crumb handshake with Yahoo quoteSummary internally.
 * Longer edge cache: fundamentals change slowly (daily at most).
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

  const upstream = await fetchFundamentals(symbol);
  res.setHeader('Content-Type', 'application/json');
  // Fundamentals move slowly; cache longer than chart data.
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=1800, stale-while-revalidate=86400'
  );
  res.status(upstream.status).send(upstream.body);
}
