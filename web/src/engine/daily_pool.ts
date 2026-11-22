import type { ScoredTopic, TopicOption } from '../types';
import { sanitizeTopic } from './alias_sanitizer';
import { scoreComedyCraft } from './comedy_craft';
import { cryptoRng, cryptoShuffle } from './randomizer';
import { classifyHook, classifySituation } from './taxonomy';
import { assignDiverseVisualStyles } from './visual_styles';

const BANNED_DAILY_RE = /\b(goa|goan|uncle|uncles|delhi|mumbai)\b|[\u{1F300}-\u{1FAFF}\u2600-\u27BF]/iu;

interface DailyPoolPayload {
  updated_at?: string;
  episodes?: TopicOption[];
}

let cachedPool: TopicOption[] | null = null;

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
    pool
      .filter((ep) => ep.title && !seenTitles.has(ep.title.trim().toLowerCase()) && !BANNED_DAILY_RE.test(`${ep.title} ${ep.pitch}`))
      .map(sanitizeTopic),
    cryptoRng,
  );
  if (fresh.length < 4) return [];
  return assignDiverseVisualStyles(fresh.slice(0, count), cryptoRng).map((ep) => ({
    ...ep,
    brandHeat: 92,
    viralScore: Math.min(99, Math.round(scoreComedyCraft(ep).total * 0.98)),
    hookCategory: classifyHook(ep),
    situationCategory: classifySituation(ep),
  }));
}
