export interface LiveTrendItem {
  title: string;
  niche: 'tech' | 'history' | 'science';
  source: 'hackernews' | 'wikipedia';
}

export async function fetchHackerNewsTrends(limit = 6): Promise<LiveTrendItem[]> {
  try {
    const res = await fetch(`https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=${limit}`);
    if (!res.ok) return [];
    const data = (await res.json()) as { hits?: Array<{ title?: string }> };
    return (data.hits ?? [])
      .filter((h) => h.title)
      .map((h) => ({ title: h.title!.trim(), niche: 'tech' as const, source: 'hackernews' as const }));
  } catch {
    return [];
  }
}

export async function fetchWikipediaTopTrends(limit = 6): Promise<LiveTrendItem[]> {
  try {
    const d = new Date(Date.now() - 86_400_000 * 2);
    const yyyy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(d.getUTCDate()).padStart(2, '0');
    const res = await fetch(
      `https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia/all-access/${yyyy}/${mm}/${dd}`,
    );
    if (!res.ok) return [];
    const data = (await res.json()) as { items?: Array<{ articles?: Array<{ article: string }> }> };
    const articles = data.items?.[0]?.articles ?? [];
    return articles
      .filter((a) => !a.article.startsWith('Special:') && a.article !== 'Main_Page')
      .slice(0, limit)
      .map((a) => ({
        title: a.article.replace(/_/g, ' '),
        niche: 'history' as const,
        source: 'wikipedia' as const,
      }));
  } catch {
    return [];
  }
}

export async function fetchAllLiveTrends(): Promise<LiveTrendItem[]> {
  const [hn, wiki] = await Promise.all([fetchHackerNewsTrends(), fetchWikipediaTopTrends()]);
  return [...hn, ...wiki];
}

export async function loadLiveTrends(): Promise<{ trends: LiveTrendItem[]; keywords: string[] }> {
  const trends = await fetchAllLiveTrends();
  return { trends, keywords: trends.map((t) => t.title) };
}

export function pickTrendChips(
  data: { keywords?: string[] } | string[],
  count = 6,
): string[] {
  const list = Array.isArray(data) ? data : (data.keywords ?? []);
  return list.slice(0, count);
}
