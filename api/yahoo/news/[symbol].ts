import { fetchNews, PUBLIC_CACHE_CONTROL } from '../../_lib/yahoo';

/**
 * Vercel Serverless Function
 * GET /api/yahoo/news/:symbol?count=15
 *
 * Live company headlines from Yahoo's search endpoint (no auth needed).
 * News is time-sensitive: short edge cache.
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

  const count = req.query.count ?? '15';
  const upstream = await fetchNews(symbol, Number(count));
  res.setHeader('Content-Type', 'application/json');
  // Headlines should be fresh; cache only briefly.
  res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=600');
  res.status(upstream.status).send(upstream.body);
}
