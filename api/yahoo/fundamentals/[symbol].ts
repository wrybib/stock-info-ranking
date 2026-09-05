import { fetchFundamentals, PUBLIC_CACHE_CONTROL } from '../../../lib/yahoo.ts';

/**
 * Vercel Serverless Function
 * GET /api/yahoo/fundamentals/:symbol
 *
 * Handles the cookie+crumb handshake with Yahoo quoteSummary internally.
 * Longer edge cache: fundamentals change slowly (daily at most).
 */
export default {
  async fetch(request: Request) {
    if (request.method === 'OPTIONS') return new Response(null, { status: 204 });
    if (request.method !== 'GET') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const parts = new URL(request.url).pathname.split('/').filter(Boolean);
    const symbol = decodeURIComponent(parts[parts.length - 1] ?? '').trim();
    if (!symbol) return Response.json({ error: 'Missing symbol' }, { status: 400 });

    const upstream = await fetchFundamentals(symbol);
    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=86400',
      },
    });
  },
};
