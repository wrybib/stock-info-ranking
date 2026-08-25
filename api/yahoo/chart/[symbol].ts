import { fetchChart, PUBLIC_CACHE_CONTROL } from '../../_lib/yahoo';

/**
 * Vercel Serverless Function
 * GET /api/yahoo/chart/:symbol?range=1mo&interval=1d
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

  const range = String(req.query.range || '1mo');
  const interval = String(req.query.interval || '1d');

  const upstream = await fetchChart(symbol, range, interval);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', PUBLIC_CACHE_CONTROL);
  res.status(upstream.status).send(upstream.body);
}
