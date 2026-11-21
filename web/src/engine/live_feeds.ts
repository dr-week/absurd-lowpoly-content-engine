// Free, zero-key, CORS-safe live trend & dictionary fetchers for GitHub Pages

export interface LiveTrendFeed {
  updated_at: string;
  keywords: string[];
  trends: Array<{ title: string; source: string; published: string; url: string }>;
}

let cachedFeed: LiveTrendFeed | null = null;

/** Load live India Google Trends & News JSON synced by GitHub Actions (zero CORS issues). */
export async function loadLiveTrends(): Promise<LiveTrendFeed | null> {
  if (cachedFeed) return cachedFeed;
  try {
    const resp = await fetch('./live_trends.json', { cache: 'no-store' });
    if (!resp.ok) return null;
    cachedFeed = (await resp.json()) as LiveTrendFeed;
    return cachedFeed;
  } catch {
    return null;
  }
}

/**
 * Fetch free, zero-key, CORS-enabled word associations from Datamuse API
 * to inject fresh unexpected dictionary keywords into topic randomization.
 */
export async function fetchDatamuseKeywords(seedWord: string, max = 8): Promise<string[]> {
  const clean = seedWord.trim().split(/\s+/)[0];
  if (!clean) return [];
  try {
    const url = `https://api.datamuse.com/words?rel_trg=${encodeURIComponent(clean)}&max=${max}`;
    const resp = await fetch(url);
    if (!resp.ok) return [];
    const rows = (await resp.json()) as Array<{ word: string }>;
    return rows.map((r) => r.word).filter((w) => w.length >= 3);
  } catch {
    return [];
  }
}

const CHIP_NOISE = new Set(['accuses', 'announces', 'claims', 'warns', "didn't", 'cremated', 'convicted', 'criminal', 'detained', 'conning', 'deadlock', 'close', 'dependent']);

export function pickTrendChips(pool: string[], count = 6): string[] {
  const clean = pool.filter((k) => !CHIP_NOISE.has(k.toLowerCase()));
  const arr = [...(clean.length >= count ? clean : pool)];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, count);
}
