import { fetchChart, PUBLIC_CACHE_CONTROL } from '../../_lib/yahoo';

/**
 * Vercel Serverless Function
 * GET /api/yahoo/chart/:symbol?range=1mo&interval=1d
 */
export default {
  async fetch(request: Request) {
    if (request.method === 'OPTIONS') return new Response(null, { status: 204 });
    if (request.method !== 'GET') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const url = new URL(request.url);
    const parts = url.pathname.split('/').filter(Boolean);
    const symbol = decodeURIComponent(parts[parts.length - 1] ?? '').trim();
    if (!symbol) return Response.json({ error: 'Missing symbol' }, { status: 400 });

    const upstream = await fetchChart(
      symbol,
      url.searchParams.get('range') || '1mo',
      url.searchParams.get('interval') || '1d'
    );
    return new Response(upstream.body, {
      status: upstream.status,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': PUBLIC_CACHE_CONTROL },
    });
  },
};
