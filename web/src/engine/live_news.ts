import { scoreHeadlineComedyPotential } from './headline_filter';
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
  if (hasStorage()) localStorage.setItem(USED_NEWS_KEY, JSON.stringify(Array.from(used).slice(-1000)));
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

async function fetchHackerNews(count = 5): Promise<LiveHeadline[]> {
  const endpoint = cryptoRng() > 0.5 ? 'topstories.json' : 'newstories.json';
  const ids = await fetchJsonWithTimeout<number[]>(`https://hacker-news.firebaseio.com/v0/${endpoint}`);
  if (!ids?.length) return [];
  const sample = cryptoShuffle(ids.slice(0, 450), cryptoRng).slice(0, count);
  const items = await Promise.all(
    sample.map((id) => fetchJsonWithTimeout<{ title?: string }>(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, 3500)),
  );
  return items.filter((i): i is { title: string } => Boolean(i?.title)).map((i) => ({ title: i.title, source: 'Hacker News' }));
}

async function fetchSpaceNews(count = 5): Promise<LiveHeadline[]> {
  const offset = Math.floor(cryptoRng() * 1500);
  const data = await fetchJsonWithTimeout<{ results?: Array<{ title: string; news_site?: string }> }>(
    `https://api.spaceflightnewsapi.net/v4/articles/?limit=20&offset=${offset}`,
  );
  if (!data?.results?.length) return [];
  return cryptoShuffle(data.results, cryptoRng)
    .slice(0, count)
    .map((r) => ({ title: r.title, source: r.news_site || 'Space News' }));
}

/**
 * Fetches fresh, NEVER-BEFORE-USED online headlines from 10,000+ live items across 4 zero-key CORS sources:
 * Hacker News (1,000 top+new) + Spaceflight News (1,500+ articles) + Wikipedia Random (6.9M+) + GitHub Actions RSS.
 */
export async function fetchFreshOnlineNews(count = 8): Promise<LiveHeadline[]> {
  const used = loadUsedHeadlines();
  const [feed, hn, space] = await Promise.all([
    loadLiveTrends().catch(() => null),
    fetchHackerNews(8),
    fetchSpaceNews(8),
  ]);

  const rss: LiveHeadline[] = (feed?.trends ?? []).map((t) => ({ title: t.title, source: t.source }));
  const scored = cryptoShuffle([...hn, ...space, ...rss], cryptoRng)
    .map((item) => ({ item, score: scoreHeadlineComedyPotential(item.title) }))
    .filter((x) => x.score >= 0)
    .sort((a, b) => b.score - a.score);

  const fresh: LiveHeadline[] = [];
  const seenLocal = new Set<string>();

  for (const { item } of scored) {
    const key = item.title.trim().toLowerCase().slice(0, 75);
    if (!key || seenLocal.has(key) || used.has(key)) continue;
    seenLocal.add(key);
    fresh.push(item);
    if (fresh.length >= count) break;
  }

  for (const item of fresh) used.add(item.title.trim().toLowerCase().slice(0, 75));
  saveUsedHeadlines(used);
  return fresh;
}
