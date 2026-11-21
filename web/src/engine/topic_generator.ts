import { getBrandHeat } from '../data/brands';
import { CRAFT_STORIES_A } from '../data/stories_craft_a';
import { CRAFT_STORIES_B } from '../data/stories_craft_b';
import { CRAFT_STORIES_C } from '../data/stories_craft_c';
import { NEWS_STORIES } from '../data/stories_news';
import { ORIGIN_STORIES } from '../data/stories_origin';
import { OVERENGINEER_STORIES } from '../data/stories_overengineer';
import { SCIENCE_STORIES } from '../data/stories_science';
import { SPIRAL_STORIES } from '../data/stories_spiral';
import { TUTORIAL_STORIES } from '../data/stories_tutorial';
import type { RatingLogEntry, ScoredTopic, TopicOption } from '../types';
import { scoreComedyCraft } from './comedy_craft';
import { synthesizeTrendCard } from './trend_synthesizer';

const PREV_ID_PREFIX = '__previd__';

export const ALL_BESPOKE_STORIES: readonly TopicOption[] = [
  ...OVERENGINEER_STORIES,
  ...ORIGIN_STORIES,
  ...NEWS_STORIES,
  ...TUTORIAL_STORIES,
  ...SPIRAL_STORIES,
  ...SCIENCE_STORIES,
  ...CRAFT_STORIES_A,
  ...CRAFT_STORIES_B,
  ...CRAFT_STORIES_C,
];

const FORMAT_KEYS = ['over-engineer', 'fake-origin', 'breaking-news', 'fake-tutorial', 'petty-spiral', 'weird-science'] as const;

export const STORY_FORMAT_PACKS: readonly (readonly TopicOption[])[] = FORMAT_KEYS.map((key) =>
  ALL_BESPOKE_STORIES.filter((s) => s.angle === key),
);

/** Normalizes overlapping brand/world labels so Goa & Goa Shack never collide in the same batch. */
export function worldFamily(brand: string): string {
  const b = brand.toLowerCase();
  if (b.includes('goa')) return 'goa';
  if (b.includes('elon') || b.includes('musk')) return 'elon';
  if (b.includes('gandhi')) return 'gandhi';
  if (b.includes('trump')) return 'trump';
  if (b.includes('putin')) return 'putin';
  if (b.includes('modi')) return 'modi';
  if (b.includes('ai ') || b === 'ai' || b.includes('tech')) return 'ai-tech';
  if (b.includes('mars') || b.includes('nasa') || b.includes('space')) return 'space';
  return b.replace(/[^a-z0-9]+/g, '-');
}

function shuffle<T>(items: readonly T[], rng: () => number): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Reorders chosen cards so no two adjacent cards ever share the same story format. */
function spreadAdjacentFormats(items: TopicOption[], rng: () => number): TopicOption[] {
  const pool = shuffle(items, rng);
  const out: TopicOption[] = [];
  while (pool.length > 0) {
    const lastAngle = out.length > 0 ? out[out.length - 1].angle : '';
    const idx = pool.findIndex((s) => s.angle !== lastAngle);
    const next = pool.splice(idx >= 0 ? idx : 0, 1)[0];
    if (out.length > 0 && next.angle === lastAngle) {
      const slot = out.findIndex((s, i) => s.angle !== next.angle && (i === 0 || out[i - 1].angle !== next.angle));
      if (slot >= 0) out.splice(slot, 0, next);
      else out.push(next);
    } else {
      out.push(next);
    }
  }
  return out;
}

/**
 * Stratified 6-Format Comedy-Craft Selector (36 bespoke stories, Zero Mad-Libs):
 * - Pulls from ALL 6 structurally different story formats in every 8-card batch.
 * - Enforces MAX 1 card per world/brand family (e.g. never 2 Goa or 2 Gandhiji cards in one batch).
 * - Guarantees ZERO adjacent same-format cards and 0/8 consecutive repeats across F5 reloads.
 */
export function generateFreshDiverseBatch(params: {
  count: number;
  query: string;
  logs: RatingLogEntry[];
  seenPairs: Set<string>;
  batchNonce: number;
  rng?: () => number;
}): ScoredTopic[] {
  const { count, query, logs, seenPairs, batchNonce, rng = Math.random } = params;
  const angleBias = new Map<string, number>();
  for (const e of logs) angleBias.set(e.angle, (angleBias.get(e.angle) ?? 0) + (e.vote === 'up' ? 8 : -8));

  const prevIds = new Set(
    Array.from(seenPairs).filter((k) => k.startsWith(PREV_ID_PREFIX)).map((k) => k.slice(PREV_ID_PREFIX.length)),
  );

  const chosen: TopicOption[] = [];
  const usedIds = new Set<string>();
  const usedWorlds = new Set<string>();
  const q = query.trim().toLowerCase();

  const take = (story: TopicOption): void => {
    chosen.push(story);
    usedIds.add(story.id);
    usedWorlds.add(worldFamily(story.brand));
  };

  if (q) {
    const hit = shuffle(ALL_BESPOKE_STORIES, rng).find(
      (s) => !prevIds.has(s.id) && (s.title.toLowerCase().includes(q) || s.brand.toLowerCase().includes(q) || s.pitch.toLowerCase().includes(q)),
    );
    take(hit ?? synthesizeTrendCard(query.trim(), batchNonce));
  }

  // Round 1: guarantee 1 fresh story from EACH of the 6 distinct formats with unique world families
  for (const pack of shuffle(STORY_FORMAT_PACKS, rng)) {
    if (chosen.length >= count) break;
    const strict = shuffle(pack.filter((s) => !usedIds.has(s.id) && !prevIds.has(s.id) && !usedWorlds.has(worldFamily(s.brand))), rng);
    const relaxed = shuffle(pack.filter((s) => !usedIds.has(s.id) && !prevIds.has(s.id)), rng);
    const fallback = shuffle(pack.filter((s) => !usedIds.has(s.id)), rng);
    const pick = strict[0] ?? relaxed[0] ?? fallback[0];
    if (pick) take(pick);
  }

  // Round 2: fill remaining slots with fresh stories from unused world families
  const leftovers = shuffle(
    ALL_BESPOKE_STORIES.filter((s) => !usedIds.has(s.id) && !prevIds.has(s.id) && !usedWorlds.has(worldFamily(s.brand))),
    rng,
  );
  for (const s of leftovers) {
    if (chosen.length >= count) break;
    if (!usedWorlds.has(worldFamily(s.brand))) take(s);
  }

  for (const k of Array.from(seenPairs)) if (k.startsWith(PREV_ID_PREFIX)) seenPairs.delete(k);
  for (const s of chosen) seenPairs.add(`${PREV_ID_PREFIX}${s.id}`);

  return spreadAdjacentFormats(chosen, rng).map((story) => {
    const brandHeat = getBrandHeat(story.brand);
    const craft = scoreComedyCraft(story);
    const taste = angleBias.get(story.angle) ?? 0;
    const viralScore = Math.max(35, Math.min(99, Math.round(brandHeat * 0.45 + craft.total * 0.52 + taste * 0.4)));
    return { ...story, brandHeat, viralScore };
  });
}
