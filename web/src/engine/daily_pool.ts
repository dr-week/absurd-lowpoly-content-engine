import type { ScoredTopic, TopicOption } from '../types';
import { scoreComedyCraft } from './comedy_craft';
import { cryptoRng, cryptoShuffle } from './randomizer';
import { classifyHook, classifySituation } from './taxonomy';

interface DailyPoolPayload {
  updated_at?: string;
  episodes?: TopicOption[];
}

let cachedPool: TopicOption[] | null = null;

/**
 * Loads optional 6-hour pre-generated AI episodes from ./daily_episodes.json (0ms, 0 rate limit).
 * Gracefully returns [] if no daily pool has been generated yet.
 */
export async function loadDailyAiPool(): Promise<TopicOption[]> {
  if (cachedPool !== null) return cachedPool;
  try {
    const resp = await fetch('./daily_episodes.json', { cache: 'no-store' });
    if (!resp.ok) {
      cachedPool = [];
      return [];
    }
    const data = (await resp.json()) as DailyPoolPayload;
    cachedPool = Array.isArray(data.episodes) ? data.episodes : [];
    return cachedPool;
  } catch {
    cachedPool = [];
    return [];
  }
}

export async function pullUnseenDailyEpisodes(seenTitles: Set<string>, count = 8): Promise<ScoredTopic[]> {
  const pool = await loadDailyAiPool();
  if (!pool.length) return [];
  const fresh = cryptoShuffle(
    pool.filter((ep) => ep.title && !seenTitles.has(ep.title.trim().toLowerCase())),
    cryptoRng,
  );
  if (fresh.length < 4) return [];
  return fresh.slice(0, count).map((ep) => ({
    ...ep,
    brandHeat: 92,
    viralScore: Math.min(99, Math.round(scoreComedyCraft(ep).total * 0.98)),
    hookCategory: classifyHook(ep),
    situationCategory: classifySituation(ep),
  }));
}
