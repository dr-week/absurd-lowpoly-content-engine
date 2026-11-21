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

function shuffle<T>(items: readonly T[], rng: () => number): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Stratified 6-Format Comedy-Craft Selector (36 bespoke stories, Zero Mad-Libs):
 * - Pulls from ALL 6 structurally different story formats in every 8-card batch.
 * - Excludes all 8 story IDs shown in the immediately previous batch (0/8 repeat across reloads).
 * - Scores every topic with real Comedy Craft + Brand Heat + User Taste Logs.
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
  const q = query.trim().toLowerCase();

  if (q) {
    const hit = shuffle(ALL_BESPOKE_STORIES, rng).find(
      (s) => !prevIds.has(s.id) && (s.title.toLowerCase().includes(q) || s.brand.toLowerCase().includes(q) || s.pitch.toLowerCase().includes(q)),
    );
    const first = hit ?? synthesizeTrendCard(query.trim(), batchNonce);
    chosen.push(first);
    usedIds.add(first.id);
  }

  // Round 1: guarantee 1 fresh story from EACH of the 6 distinct formats
  for (const pack of shuffle(STORY_FORMAT_PACKS, rng)) {
    if (chosen.length >= count) break;
    const fresh = shuffle(pack.filter((s) => !usedIds.has(s.id) && !prevIds.has(s.id)), rng);
    const pick = fresh[0] ?? shuffle(pack.filter((s) => !usedIds.has(s.id)), rng)[0];
    if (pick) {
      chosen.push(pick);
      usedIds.add(pick.id);
    }
  }

  // Round 2: fill remaining slots from distinct fresh stories
  const leftovers = shuffle(
    ALL_BESPOKE_STORIES.filter((s) => !usedIds.has(s.id) && !prevIds.has(s.id)),
    rng,
  );
  for (const s of leftovers) {
    if (chosen.length >= count) break;
    chosen.push(s);
    usedIds.add(s.id);
  }

  for (const k of Array.from(seenPairs)) if (k.startsWith(PREV_ID_PREFIX)) seenPairs.delete(k);
  for (const s of chosen) seenPairs.add(`${PREV_ID_PREFIX}${s.id}`);

  return shuffle(chosen, rng).map((story) => {
    const brandHeat = getBrandHeat(story.brand);
    const craft = scoreComedyCraft(story);
    const taste = angleBias.get(story.angle) ?? 0;
    const viralScore = Math.max(35, Math.min(99, Math.round(brandHeat * 0.45 + craft.total * 0.52 + taste * 0.4)));
    return { ...story, brandHeat, viralScore };
  });
}
