import { LiveNewsItem } from '../types';
import { toYahooTicker } from './yahooFinance';

/**
 * Live news via Yahoo search endpoint through our proxy:
 * GET /api/yahoo/news/:symbol
 *
 * Returns real headlines (title, publisher, link, timestamp).
 * No sentiment scores are provided by Yahoo and none are invented here.
 */
export async function fetchLiveNews(
  symbol: string,
  count = 15
): Promise<LiveNewsItem[] | null> {
  try {
    const url = `/api/yahoo/news/${encodeURIComponent(toYahooTicker(symbol))}?count=${count}`;
    const response = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!response.ok) return null;

    const payload = await response.json();
    if (!Array.isArray(payload?.news)) return null;

    const items: LiveNewsItem[] = [];
    for (const raw of payload.news) {
      const title = typeof raw?.title === 'string' ? raw.title.trim() : '';
      if (!title) continue;

      const ts = Number(raw?.providerPublishTime);
      items.push({
        id: String(raw?.uuid ?? `${title}-${raw?.providerPublishTime ?? ''}`),
        title,
        publisher: typeof raw?.publisher === 'string' && raw.publisher ? raw.publisher : 'Yahoo Finance',
        url: typeof raw?.link === 'string' ? raw.link : '',
        publishedAt: Number.isFinite(ts) && ts > 0 ? new Date(ts * 1000).toISOString() : '',
      });
    }

    return items;
  } catch {
    return null;
  }
}

/** "3 mins ago" style relative label. */
export function formatRelativeTime(iso: string): string {
  if (!iso) return '';
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
  return new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric' });
}
