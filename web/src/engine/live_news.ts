import { loadLiveTrends } from './live_feeds';
import { cryptoRng, cryptoShuffle } from './randomizer';

export interface LiveHeadline {
  title: string;
  source: string;
}

const USED_NEWS_KEY = 'absurd_studio_used_news_v1';

function hasStorage(): boolean {
  return typeof localStorage !== 'undefined';
}

export function loadUsedHeadlines(): Set<string> {
  if (!hasStorage()) return new Set();
  try {
    const raw = localStorage.getItem(USED_NEWS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? (parsed as string[]) : []);
  } catch {
    return new Set();
  }
}

export function saveUsedHeadlines(used: Set<string>): void {
  if (hasStorage()) localStorage.setItem(USED_NEWS_KEY, JSON.stringify(Array.from(used).slice(-400)));
}

async function fetchJsonWithTimeout<T>(url: string, ms = 4500): Promise<T | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    const resp = await fetch(url, { signal: ctrl.signal });
    if (!resp.ok) return null;
    return (await resp.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchHackerNews(count = 4): Promise<LiveHeadline[]> {
  const ids = await fetchJsonWithTimeout<number[]>('https://hacker-news.firebaseio.com/v0/topstories.json');
  if (!ids?.length) return [];
  const sample = cryptoShuffle(ids.slice(0, 120), cryptoRng).slice(0, count);
  const items = await Promise.all(
    sample.map((id) => fetchJsonWithTimeout<{ title?: string }>(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, 3500)),
  );
  return items.filter((i): i is { title: string } => Boolean(i?.title)).map((i) => ({ title: i.title, source: 'Hacker News' }));
}

async function fetchSpaceNews(count = 4): Promise<LiveHeadline[]> {
  const offset = Math.floor(cryptoRng() * 60);
  const data = await fetchJsonWithTimeout<{ results?: Array<{ title: string; news_site?: string }> }>(
    `https://api.spaceflightnewsapi.net/v4/articles/?limit=15&offset=${offset}`,
  );
  if (!data?.results?.length) return [];
  return cryptoShuffle(data.results, cryptoRng)
    .slice(0, count)
    .map((r) => ({ title: r.title, source: r.news_site || 'Space News' }));
}

async function fetchWikiTopics(count = 2): Promise<LiveHeadline[]> {
  const rows = await Promise.all(
    Array.from({ length: count }, () =>
      fetchJsonWithTimeout<{ title?: string; description?: string }>('https://en.wikipedia.org/api/rest_v1/page/random/summary', 3500),
    ),
  );
  return rows
    .filter((r): r is { title: string; description?: string } => Boolean(r?.title))
    .map((r) => ({ title: r.description ? `${r.title} (${r.description})` : r.title, source: 'Wikipedia' }));
}

/**
 * Fetches fresh, never-used online headlines from 4 free zero-key CORS sources in parallel:
 * GitHub Actions RSS JSON (BBC/ScienceDaily/Goa/World) + Hacker News + Spaceflight News + Wikipedia.
 */
export async function fetchFreshOnlineNews(count = 8): Promise<LiveHeadline[]> {
  const used = loadUsedHeadlines();
  const [feed, hn, space, wiki] = await Promise.all([
    loadLiveTrends().catch(() => null),
    fetchHackerNews(4),
    fetchSpaceNews(4),
    fetchWikiTopics(2),
  ]);

  const rss: LiveHeadline[] = (feed?.trends ?? []).map((t) => ({ title: t.title, source: t.source }));
  const combined = cryptoShuffle([...hn, ...space, ...wiki, ...rss], cryptoRng);
  const fresh: LiveHeadline[] = [];
  const seenLocal = new Set<string>();

  for (const item of combined) {
    const key = item.title.trim().toLowerCase().slice(0, 70);
    if (!key || seenLocal.has(key) || used.has(key)) continue;
    seenLocal.add(key);
    fresh.push(item);
    if (fresh.length >= count) break;
  }

  for (const item of fresh) used.add(item.title.trim().toLowerCase().slice(0, 70));
  saveUsedHeadlines(used);
  return fresh;
}
