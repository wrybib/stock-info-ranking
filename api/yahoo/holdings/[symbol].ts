import { fetchHoldings } from '../../../lib/yahoo';

/**
 * Vercel Serverless Function
 * GET /api/yahoo/holdings/:symbol
 *
 * Institutional holders (13F-style) + insider transactions + net share
 * purchase activity from Yahoo quoteSummary ownership modules.
 * Requires cookie+crumb handshake — handled in the shared lib.
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

    const upstream = await fetchHoldings(symbol);
    return new Response(upstream.body, {
      status: upstream.status,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
    });
  },
};
