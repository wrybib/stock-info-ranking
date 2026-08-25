import { fetchOptions } from '../../_lib/yahoo';

/**
 * Vercel Serverless Function
 * GET /api/yahoo/options/:symbol
 *
 * Raw options chain (strikes, IV, open interest, volume) from Yahoo.
 * Requires cookie+crumb handshake — handled in the shared lib.
 * 404 for instruments without listed options (e.g. A-shares).
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

  const upstream = await fetchOptions(symbol);
  res.setHeader('Content-Type', 'application/json');
  // Chains move with price; moderate cache.
  res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=1800');
  res.status(upstream.status).send(upstream.body);
}
