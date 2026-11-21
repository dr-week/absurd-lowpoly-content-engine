import { getBrandHeat } from '../data/brands';
import { DOMAIN_SEEDS, type DomainSeed } from '../data/seeds_domains';
import { TWIST_SEEDS, type TwistSeed } from '../data/seeds_twists';
import type { RatingLogEntry, ScoredTopic } from '../types';

function shuffle<T>(items: T[], rng: () => number): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildTopic(domain: DomainSeed, twist: TwistSeed, batchNonce: number): Omit<ScoredTopic, 'viralScore' | 'brandHeat'> {
  const id = `${domain.angle}_${twist.key}_${batchNonce}`;
  const title = `${domain.brand.toUpperCase()}: ${twist.titleTag}`;
  const pitch = `${domain.protagonist} ${domain.trigger}; ${twist.pitchVerb}, then ${domain.payoffSpeaker} deadpans "${domain.payoffLine}"`;

  return {
    id,
    title,
    angle: domain.angle,
    brand: domain.brand,
    trendHook: `${domain.brand} × ${twist.key}`,
    pitch,
    frames: [
      { frame: 1, position: 'Top Left', framing: 'Wide static shot', action: `In a ${domain.setting}, ${domain.protagonist} ${domain.trigger}.`, caption: domain.triggerCaption },
      { frame: 2, position: 'Top Center', framing: 'Medium angle', action: `Suddenly, ${twist.joltAction}.`, caption: twist.joltCaption },
      { frame: 3, position: 'Top Right', framing: 'Close-up detail', action: `Stark reaction as ${domain.protagonist} stares blankly at the bizarre shift.`, caption: 'Ye kya ho gaya?' },
      { frame: 4, position: 'Bottom Left', framing: 'Low-angle wide shot', action: `Across the ${domain.setting}, ${twist.chaosAction}.`, caption: twist.chaosCaption },
      { frame: 5, position: 'Bottom Center', framing: 'Deadpan medium shot', action: `In total silence, ${twist.calmAction}.`, caption: twist.calmCaption },
      { frame: 6, position: 'Bottom Right', framing: 'Absurd close-up', action: `The ${domain.payoffSpeaker} leans in stiffly with zero emotion.`, caption: domain.payoffLine },
    ],
    shots: [
      { shot: 1, visual: `Static shot in ${domain.setting} as ${domain.protagonist} ${domain.trigger}.`, sfx: 'Subtle ambient Indian street hum', hindi: domain.triggerHindi },
      { shot: 2, visual: `Hard cut as ${twist.joltAction}.`, sfx: twist.joltSfx, hindi: twist.joltHindi },
      { shot: 3, visual: `Close-up on ${domain.protagonist} blinking once with zero expression.`, sfx: 'Awkward silent room tone', hindi: 'सब एक सेकंड के लिए रुक गए।' },
      { shot: 4, visual: `Hard cut to wide shot where ${twist.chaosAction}.`, sfx: twist.chaosSfx, hindi: twist.chaosHindi },
      { shot: 5, visual: `Hard cut to medium shot as ${twist.calmAction}.`, sfx: 'Quiet hollow wind loop', hindi: twist.calmHindi },
      { shot: 6, visual: `Sudden snap-zoom to ${domain.payoffSpeaker} delivering a flat stare.`, sfx: 'Compressed bass hit, instant hard cut to black', hindi: domain.payoffHindi },
    ],
  };
}

/**
 * Generates N completely unrelated, fresh, randomized topics on EVERY refresh:
 * - Guaranteed 100% unique angle + unique brand + unique twist within every batch of 8.
 * - Tracks seen (domain, twist) pairs so consecutive refreshes never repeat topics.
 * - Uses user logs ONLY for Viral Score display (never collapses diversity to one brand!).
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
  for (const e of logs) {
    angleBias.set(e.angle, (angleBias.get(e.angle) ?? 0) + (e.vote === 'up' ? 8 : -8));
  }

  let domains = shuffle(DOMAIN_SEEDS, rng);
  const q = query.trim().toLowerCase();
  if (q) {
    const matched = domains.filter(
      (d) => d.brand.toLowerCase().includes(q) || d.angle.toLowerCase().includes(q) || d.setting.toLowerCase().includes(q),
    );
    if (matched.length > 0) {
      const rest = domains.filter((d) => !matched.includes(d));
      domains = [...matched, ...rest];
    }
  }

  const chosenDomains = domains.slice(0, Math.min(count, domains.length));
  const twists = shuffle(TWIST_SEEDS, rng);
  const usedTwists = new Set<string>();
  const results: ScoredTopic[] = [];

  for (const domain of chosenDomains) {
    const lastKeyPrefix = `__last__${domain.angle}::`;
    const lastPair = Array.from(seenPairs).find((k) => k.startsWith(lastKeyPrefix));
    const lastTwistKey = lastPair ? lastPair.slice(lastKeyPrefix.length) : '';

    let twist = twists.find(
      (tw) => !usedTwists.has(tw.key) && tw.key !== lastTwistKey && !seenPairs.has(`${domain.angle}::${tw.key}`),
    );
    if (!twist) {
      for (const k of Array.from(seenPairs)) {
        if (k.startsWith(`${domain.angle}::`)) seenPairs.delete(k);
      }
      twist = twists.find((tw) => !usedTwists.has(tw.key) && tw.key !== lastTwistKey) ?? twists[0];
    }

    if (lastPair) seenPairs.delete(lastPair);
    seenPairs.add(`${lastKeyPrefix}${twist.key}`);
    usedTwists.add(twist.key);
    seenPairs.add(`${domain.angle}::${twist.key}`);

    const brandHeat = getBrandHeat(domain.brand);
    const taste = angleBias.get(domain.angle) ?? 0;
    const viralScore = Math.max(25, Math.min(99, Math.round(brandHeat * 0.78 + 14 + taste * 0.5)));
    results.push({ ...buildTopic(domain, twist, batchNonce), brandHeat, viralScore });
  }

  return results;
}
