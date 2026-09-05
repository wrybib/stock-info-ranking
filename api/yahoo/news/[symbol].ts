import { fetchNews, PUBLIC_CACHE_CONTROL } from '../../_lib/yahoo';

/**
 * Vercel Serverless Function
 * GET /api/yahoo/news/:symbol?count=15
 *
 * Live company headlines from Yahoo's search endpoint (no auth needed).
 * News is time-sensitive: short edge cache.
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

    const upstream = await fetchNews(symbol, Number(url.searchParams.get('count') || '15'));
    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600',
      },
    });
  },
};
