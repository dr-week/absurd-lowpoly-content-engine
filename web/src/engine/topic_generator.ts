import { getBrandHeat } from '../data/brands';
import { NEWS_STORIES } from '../data/stories_news';
import { ORIGIN_STORIES } from '../data/stories_origin';
import { OVERENGINEER_STORIES } from '../data/stories_overengineer';
import { SCIENCE_STORIES } from '../data/stories_science';
import { SPIRAL_STORIES } from '../data/stories_spiral';
import { TUTORIAL_STORIES } from '../data/stories_tutorial';
import type { RatingLogEntry, ScoredTopic, TopicOption } from '../types';

const PREV_ID_PREFIX = '__previd__';

export const STORY_FORMAT_PACKS: readonly (readonly TopicOption[])[] = [
  OVERENGINEER_STORIES,
  ORIGIN_STORIES,
  NEWS_STORIES,
  TUTORIAL_STORIES,
  SPIRAL_STORIES,
  SCIENCE_STORIES,
];

function shuffle<T>(items: readonly T[], rng: () => number): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function synthesizeTrendCard(query: string, batchNonce: number): TopicOption {
  const label = query.trim().slice(0, 24);
  return {
    id: `trend_${label.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${batchNonce}`,
    title: `BREAKING: ${label.toUpperCase()} OVER-ENGINEERED`,
    angle: 'breaking-news',
    brand: label,
    trendHook: `Live Trend: ${label}`,
    pitch: `Live broadcast: Engineers build a 40-foot orbital rig to analyze "${label}"; after 3 hours of glowing radars, the screen prints a single shrug.`,
    frames: [
      { frame: 1, position: 'Top Left', framing: 'Broadcast studio shot', action: `Anchor unveils a breaking headline about "${label}" behind a flashing red ticker.`, caption: `${label} pe breaking news aayi.` },
      { frame: 2, position: 'Top Center', framing: 'Lab wide shot', action: `Ten engineers bolt glowing radars and steel pipes onto a tiny monitor showing "${label}".`, caption: '40 foot ka analyzer bana diya.' },
      { frame: 3, position: 'Top Right', framing: 'Gauge close-up', action: `Pressure dials hit red while cooling fans roar across the concrete floor.`, caption: 'System full overload pe chala.' },
      { frame: 4, position: 'Bottom Left', framing: 'Wide control room', action: `Lights flicker as a giant dot-matrix printer spits out one single sheet of paper.`, caption: '3 ghante baad report nikli.' },
      { frame: 5, position: 'Bottom Center', framing: 'Paper close-up', action: `The official printout reads in bold bitmap font: "NEED MORE DATA ON ${label.toUpperCase()}".`, caption: 'Report mein sirf "pata nahi" likha.' },
      { frame: 6, position: 'Bottom Right', framing: 'Studio close-up', action: `Anchor folds the paper neatly and nods with complete journalistic pride.`, caption: 'Update agle bulletin mein denge.' },
    ],
    shots: [
      { shot: 1, visual: `Halogen-lit broadcast shot of anchor announcing breaking news on "${label}".`, sfx: 'Urgent 1998 TV news sting', hindi: `ब्रेकिंग न्यूज़ में ${label} छाया रहा।` },
      { shot: 2, visual: `Hard cut to engineers welding giant radar dishes around one tiny monitor.`, sfx: 'Wrench ratchets and hydraulic hiss', hindi: 'चालीस फुट का एनालाइज़र बना दिया।' },
      { shot: 3, visual: `Close-up of gauges spinning into the red zone as overhead lamps dim.`, sfx: 'Rising turbine hum', hindi: 'पूरा सिस्टम ओवरलोड हो गया।' },
      { shot: 4, visual: `Wide control-room cut as an old printer spits out one single sheet.`, sfx: 'Noisy dot-matrix printer buzz', hindi: 'तीन घंटे बाद एक पन्ना निकला।' },
      { shot: 5, visual: `Smash-cut to printout reading "NEED MORE DATA" in crisp bitmap letters.`, sfx: 'Dry paper snap', hindi: 'रिपोर्ट में सिर्फ़ पता नहीं लिखा था।' },
      { shot: 6, visual: `Direct lens shot of anchor folding the paper with solemn pride.`, sfx: 'News sting + bass drop, instant hard cut to black', hindi: 'बोले, अपडेट अगले बुलेटिन में देंगे।' },
    ],
  };
}

/**
 * Stratified 6-Format Selector (Zero Mad-Libs!):
 * - Pulls from ALL 6 structurally different story formats in every 8-card batch.
 * - Excludes all 8 story IDs shown in the immediately previous batch (0/8 repeat across reloads!).
 * - Supports custom search / live trend chips cleanly without breaking format variety.
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
    const allStories = STORY_FORMAT_PACKS.flat();
    const hit = shuffle(allStories, rng).find(
      (s) => !prevIds.has(s.id) && (s.title.toLowerCase().includes(q) || s.brand.toLowerCase().includes(q) || s.pitch.toLowerCase().includes(q)),
    );
    const first = hit ?? synthesizeTrendCard(query.trim(), batchNonce);
    chosen.push(first);
    usedIds.add(first.id);
  }

  // Round 1: guarantee 1 fresh story from EACH of the 6 distinct formats!
  for (const pack of shuffle(STORY_FORMAT_PACKS, rng)) {
    if (chosen.length >= count) break;
    const fresh = shuffle(pack.filter((s) => !usedIds.has(s.id) && !prevIds.has(s.id)), rng);
    const pick = fresh[0] ?? shuffle(pack.filter((s) => !usedIds.has(s.id)), rng)[0];
    if (pick) {
      chosen.push(pick);
      usedIds.add(pick.id);
    }
  }

  // Round 2: fill remaining slots (e.g. slots 7 & 8) from distinct formats not in prevIds
  const leftovers = shuffle(
    STORY_FORMAT_PACKS.flat().filter((s) => !usedIds.has(s.id) && !prevIds.has(s.id)),
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
    const taste = angleBias.get(story.angle) ?? 0;
    const viralScore = Math.max(35, Math.min(99, Math.round(brandHeat * 0.82 + 12 + taste * 0.5)));
    return { ...story, brandHeat, viralScore };
  });
}
