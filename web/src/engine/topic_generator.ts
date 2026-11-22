import { getBrandHeat } from '../data/brands';
import { CRAFT_STORIES_A } from '../data/stories_craft_a';
import { CRAFT_STORIES_B } from '../data/stories_craft_b';
import { CRAFT_STORIES_C } from '../data/stories_craft_c';
import { ICONIC_STORIES_B } from '../data/stories_iconic_b';
import { MEME_STORIES } from '../data/stories_meme';
import { MEME_STORIES_B } from '../data/stories_meme_b';
import { NEWS_STORIES } from '../data/stories_news';
import { ORIGIN_STORIES } from '../data/stories_origin';
import { OVERENGINEER_STORIES } from '../data/stories_overengineer';
import { SCIENCE_STORIES } from '../data/stories_science';
import { SPIRAL_STORIES } from '../data/stories_spiral';
import { TUTORIAL_STORIES } from '../data/stories_tutorial';
import type { HookCategory, RatingLogEntry, ScoredTopic, SituationCategory, TopicOption } from '../types';
import { sanitizeTopic } from './alias_sanitizer';
import { scoreComedyCraft } from './comedy_craft';
import { cryptoRng, cryptoShuffle } from './randomizer';
import { classifyHook, classifySituation } from './taxonomy';
import { synthesizeTrendCard } from './trend_synthesizer';

const PREV_ID_PREFIX = '__previd__';
const COOL_ID_PREFIX = '__coolid__';

export const ALL_BESPOKE_STORIES: readonly TopicOption[] = [
  ...OVERENGINEER_STORIES, ...ORIGIN_STORIES, ...NEWS_STORIES, ...TUTORIAL_STORIES, ...SPIRAL_STORIES,
  ...SCIENCE_STORIES, ...CRAFT_STORIES_A, ...CRAFT_STORIES_B, ...CRAFT_STORIES_C, ...MEME_STORIES,
  ...MEME_STORIES_B, ...ICONIC_STORIES_B,
].map(sanitizeTopic);

const FORMAT_KEYS = ['over-engineer', 'fake-origin', 'breaking-news', 'fake-tutorial', 'petty-spiral', 'weird-science'] as const;

export const STORY_FORMAT_PACKS: readonly (readonly TopicOption[])[] = FORMAT_KEYS.map((key) =>
  ALL_BESPOKE_STORIES.filter((s) => s.angle === key),
);

export function worldFamily(brand: string): string {
  const b = brand.toLowerCase();
  for (const [rx, fam] of [
    [/goa/, 'goa'], [/elon|musk/, 'elon'], [/gandhi|bapu/, 'gandhi'], [/trump|doland/, 'trump'],
    [/putin/, 'putin'], [/modi/, 'modi'], [/zuck/, 'zuck'], [/giga/, 'gigachad'], [/doge/, 'doge'],
    [/spooder/, 'spooder'], [/ai |^ai$|tech/, 'ai-tech'], [/mars|nasa|space/, 'space'],
  ] as const) {
    if (rx.test(b)) return fam;
  }
  return b.replace(/[^a-z0-9]+/g, '-');
}

function spreadAdjacentFormats(items: TopicOption[], rng: () => number): TopicOption[] {
  const pool = cryptoShuffle(items, rng);
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

export function generateFreshDiverseBatch(params: {
  count: number;
  query: string;
  logs: RatingLogEntry[];
  seenPairs: Set<string>;
  batchNonce: number;
  hookFilter?: HookCategory | 'all';
  situationFilter?: SituationCategory | 'all';
  rng?: () => number;
}): ScoredTopic[] {
  const { count, query, logs, seenPairs, batchNonce, hookFilter = 'all', situationFilter = 'all', rng = cryptoRng } = params;
  const angleBias = new Map<string, number>();
  for (const e of logs) angleBias.set(e.angle, (angleBias.get(e.angle) ?? 0) + (e.vote === 'up' ? 8 : -8));

  const prevIds = new Set(Array.from(seenPairs).filter((k) => k.startsWith(PREV_ID_PREFIX)).map((k) => k.slice(PREV_ID_PREFIX.length)));
  const coolIds = new Set(Array.from(seenPairs).filter((k) => k.startsWith(COOL_ID_PREFIX)).map((k) => k.slice(COOL_ID_PREFIX.length)));
  const chosen: TopicOption[] = [];
  const usedIds = new Set<string>();
  const usedWorlds = new Set<string>();
  const usedSituations = new Set<SituationCategory>();
  const q = query.trim().toLowerCase();

  const take = (story: TopicOption): void => {
    chosen.push(story);
    usedIds.add(story.id);
    usedWorlds.add(worldFamily(story.brand));
    usedSituations.add(classifySituation(story));
  };

  const matchesFilters = (s: TopicOption): boolean =>
    (hookFilter === 'all' || classifyHook(s) === hookFilter) &&
    (situationFilter === 'all' || classifySituation(s) === situationFilter);

  if (q) {
    const hit = cryptoShuffle(ALL_BESPOKE_STORIES, rng).find(
      (s) => !prevIds.has(s.id) && matchesFilters(s) && (s.title.toLowerCase().includes(q) || s.brand.toLowerCase().includes(q) || s.pitch.toLowerCase().includes(q)),
    );
    take(hit ?? synthesizeTrendCard(query.trim(), batchNonce));
  }

  const filteredPool = ALL_BESPOKE_STORIES.filter(matchesFilters);
  if (hookFilter !== 'all' || situationFilter !== 'all') {
    for (const s of cryptoShuffle(filteredPool.filter((x) => !usedIds.has(x.id) && !prevIds.has(x.id)), rng)) {
      if (chosen.length >= count) break;
      take(s);
    }
  } else {
    // Round 1: 1 fresh story from EACH of 6 formats prioritizing 2-batch cooldown + unique worlds + unique situations
    for (const pack of cryptoShuffle(STORY_FORMAT_PACKS, rng)) {
      if (chosen.length >= count) break;
      const tier1 = cryptoShuffle(pack.filter((s) => !usedIds.has(s.id) && !prevIds.has(s.id) && !coolIds.has(s.id) && !usedWorlds.has(worldFamily(s.brand)) && !usedSituations.has(classifySituation(s))), rng);
      const tier2 = cryptoShuffle(pack.filter((s) => !usedIds.has(s.id) && !prevIds.has(s.id) && !usedWorlds.has(worldFamily(s.brand))), rng);
      const tier3 = cryptoShuffle(pack.filter((s) => !usedIds.has(s.id) && !prevIds.has(s.id)), rng);
      const pick = tier1[0] ?? tier2[0] ?? tier3[0];
      if (pick) take(pick);
    }
  }

  const fillPool = hookFilter !== 'all' || situationFilter !== 'all' ? filteredPool : ALL_BESPOKE_STORIES;
  for (const s of cryptoShuffle(fillPool.filter((x) => !usedIds.has(x.id) && !prevIds.has(x.id)), rng)) {
    if (chosen.length >= count) break;
    if (!usedWorlds.has(worldFamily(s.brand))) take(s);
  }
  for (const s of cryptoShuffle(fillPool.filter((x) => !usedIds.has(x.id)), rng)) {
    if (chosen.length >= count) break;
    if (hookFilter !== 'all' || situationFilter !== 'all' || !usedWorlds.has(worldFamily(s.brand))) take(s);
  }

  for (const k of Array.from(seenPairs)) if (k.startsWith(COOL_ID_PREFIX)) seenPairs.delete(k);
  for (const id of prevIds) seenPairs.add(`${COOL_ID_PREFIX}${id}`);
  for (const k of Array.from(seenPairs)) if (k.startsWith(PREV_ID_PREFIX)) seenPairs.delete(k);
  for (const s of chosen) seenPairs.add(`${PREV_ID_PREFIX}${s.id}`);

  return spreadAdjacentFormats(chosen, rng).map((story) => {
    const brandHeat = getBrandHeat(story.brand);
    const craft = scoreComedyCraft(story);
    const taste = angleBias.get(story.angle) ?? 0;
    const viralScore = Math.max(35, Math.min(99, Math.round(brandHeat * 0.45 + craft.total * 0.52 + taste * 0.4)));
    return { ...story, brandHeat, viralScore, hookCategory: classifyHook(story), situationCategory: classifySituation(story) };
  });
}
