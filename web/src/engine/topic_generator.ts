import { getBrandHeat } from '../data/brands';
import { pickRandom } from '../data/dictionaries';
import { DOMAIN_SEEDS, type DomainSeed } from '../data/seeds_domains';
import { TWIST_SEEDS, type TwistSeed } from '../data/seeds_twists';
import type { RatingLogEntry, ScoredTopic } from '../types';
import { CAMERA_PROFILES, PAYOFF_STAGINGS, REACTION_STAGINGS, type CameraProfile } from './cinematography';

const PREV_DOMAIN_PREFIX = '__prevdom__';

function shuffle<T>(items: T[], rng: () => number): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildTopic(
  domain: DomainSeed,
  twist: TwistSeed,
  cam: CameraProfile,
  batchNonce: number,
  rng: () => number,
): Omit<ScoredTopic, 'viralScore' | 'brandHeat'> {
  const reactPose = pickRandom(REACTION_STAGINGS, rng);
  const payoffPose = pickRandom(PAYOFF_STAGINGS, rng);
  const id = `${domain.angle}_${twist.key}_${batchNonce}`;
  const title = `${domain.brand.toUpperCase()}: ${twist.titleTag}`;
  const pitch = `${domain.protagonist} ${domain.trigger}; ${twist.pitchVerb}, then ${domain.payoffSpeaker} deadpans "${domain.payoffLine}"`;
  const [f1, f2, f3, f4, f5, f6] = cam.framings;
  const [, t2, t3, t4, t5, t6] = cam.transitions;

  return {
    id,
    title,
    angle: domain.angle,
    brand: domain.brand,
    trendHook: `${cam.name} × ${twist.key}`,
    pitch,
    frames: [
      { frame: 1, position: 'Top Left', framing: f1, action: `Under ${cam.lighting} in a ${domain.setting}, ${domain.protagonist} ${domain.trigger}.`, caption: domain.triggerCaption },
      { frame: 2, position: 'Top Center', framing: f2, action: `Suddenly, ${twist.joltAction}.`, caption: twist.joltCaption },
      { frame: 3, position: 'Top Right', framing: f3, action: `${domain.protagonist} ${reactPose}.`, caption: twist.reactCaption },
      { frame: 4, position: 'Bottom Left', framing: f4, action: `Across the ${domain.setting}, ${twist.chaosAction}.`, caption: twist.chaosCaption },
      { frame: 5, position: 'Bottom Center', framing: f5, action: `${twist.calmAction}.`, caption: twist.calmCaption },
      { frame: 6, position: 'Bottom Right', framing: f6, action: `The ${domain.payoffSpeaker} ${payoffPose}.`, caption: domain.payoffLine },
    ],
    shots: [
      { shot: 1, visual: `${f1} under ${cam.lighting} in a ${domain.setting} as ${domain.protagonist} ${domain.trigger}.`, sfx: cam.ambienceSfx, hindi: domain.triggerHindi },
      { shot: 2, visual: `${t2} ${twist.joltAction}.`, sfx: twist.joltSfx, hindi: twist.joltHindi },
      { shot: 3, visual: `${t3} ${domain.protagonist} who ${reactPose}.`, sfx: cam.pauseSfx, hindi: twist.reactHindi },
      { shot: 4, visual: `${t4} where ${twist.chaosAction}.`, sfx: twist.chaosSfx, hindi: twist.chaosHindi },
      { shot: 5, visual: `${t5} as ${twist.calmAction}.`, sfx: cam.aftermathSfx, hindi: twist.calmHindi },
      { shot: 6, visual: `${t6} the ${domain.payoffSpeaker} who ${payoffPose}.`, sfx: cam.endSfx, hindi: domain.payoffHindi },
    ],
  };
}

/** Generates 8 unrelated topics with varied camera grammar, lighting, SFX, and 0/8 brand overlap across refreshes. */
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

  const prevDomains = new Set(
    Array.from(seenPairs).filter((k) => k.startsWith(PREV_DOMAIN_PREFIX)).map((k) => k.slice(PREV_DOMAIN_PREFIX.length)),
  );
  let ordered = [
    ...shuffle(DOMAIN_SEEDS.filter((d) => !prevDomains.has(d.angle)), rng),
    ...shuffle(DOMAIN_SEEDS.filter((d) => prevDomains.has(d.angle)), rng),
  ];

  const q = query.trim().toLowerCase();
  if (q) {
    const matched = ordered.filter((d) => d.brand.toLowerCase().includes(q) || d.angle.toLowerCase().includes(q) || d.setting.toLowerCase().includes(q));
    if (matched.length > 0) {
      ordered = [...matched, ...ordered.filter((d) => !matched.includes(d))];
    } else {
      const label = query.trim().slice(0, 22);
      ordered = [{
        angle: `trend-${q.replace(/[^a-z0-9]+/g, '-').slice(0, 16)}`,
        brand: label,
        setting: `live press room covering "${label}"`,
        protagonist: `deadpan commentator discussing ${label}`,
        trigger: `taps a glowing screen showing breaking news about ${label}`,
        triggerHindi: `ब्रेकिंग न्यूज़ में ${label} दिखाया गया।`,
        triggerCaption: `${label} pe breaking news aayi.`,
        payoffSpeaker: 'anchor',
        payoffLine: 'Update agle bulletin mein denge.',
        payoffHindi: 'बोले, अपडेट अगले बुलेटिन में देंगे।',
      }, ...ordered];
    }
  }

  const chosenDomains = ordered.slice(0, Math.min(count, ordered.length));
  for (const k of Array.from(seenPairs)) if (k.startsWith(PREV_DOMAIN_PREFIX)) seenPairs.delete(k);
  for (const d of chosenDomains) seenPairs.add(`${PREV_DOMAIN_PREFIX}${d.angle}`);

  const twists = shuffle(TWIST_SEEDS, rng);
  const cams = shuffle([...CAMERA_PROFILES], rng);
  const usedTwists = new Set<string>();
  const results: ScoredTopic[] = [];

  for (let i = 0; i < chosenDomains.length; i += 1) {
    const domain = chosenDomains[i];
    const cam = cams[i % cams.length];
    const lastPrefix = `__last__${domain.angle}::`;
    const lastPair = Array.from(seenPairs).find((k) => k.startsWith(lastPrefix));
    const lastTwist = lastPair ? lastPair.slice(lastPrefix.length) : '';

    let twist = twists.find((tw) => !usedTwists.has(tw.key) && tw.key !== lastTwist && !seenPairs.has(`${domain.angle}::${tw.key}`));
    if (!twist) {
      for (const k of Array.from(seenPairs)) if (k.startsWith(`${domain.angle}::`)) seenPairs.delete(k);
      twist = twists.find((tw) => !usedTwists.has(tw.key) && tw.key !== lastTwist) ?? twists[0];
    }

    if (lastPair) seenPairs.delete(lastPair);
    seenPairs.add(`${lastPrefix}${twist.key}`);
    usedTwists.add(twist.key);
    seenPairs.add(`${domain.angle}::${twist.key}`);

    const brandHeat = getBrandHeat(domain.brand);
    const taste = angleBias.get(domain.angle) ?? 0;
    const viralScore = Math.max(25, Math.min(99, Math.round(brandHeat * 0.78 + 14 + taste * 0.5)));
    results.push({ ...buildTopic(domain, twist, cam, batchNonce, rng), brandHeat, viralScore });
  }

  return results;
}
