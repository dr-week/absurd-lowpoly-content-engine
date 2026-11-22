import { VISUAL_STYLE_OPTIONS, type VisualStyleMeta } from '../data/visual_styles_catalog';
import type { TopicOption, VisualStyle } from '../types';
import { cryptoRng, cryptoShuffle } from './randomizer';

export { VISUAL_STYLE_OPTIONS, type VisualStyleMeta };

export function getVisualStyleMeta(style: VisualStyle): VisualStyleMeta {
  return VISUAL_STYLE_OPTIONS.find((s) => s.id === style) ?? VISUAL_STYLE_OPTIONS[0];
}

/**
 * Assigns a diverse randomized VisualStyle across a batch of topics so every card in the 8-card grid
 * pairs its story with a completely distinct visual aesthetic drawn from all 14 Visual Engines
 * (Low-Poly, Sandbox HUD, CCTV, Claymation, 2D Stylized, 2D × Real World, 2D × 3D Hybrid, Paper Cutout, etc.).
 */
export function assignDiverseVisualStyles<T extends TopicOption>(
  topics: T[],
  rng: () => number = cryptoRng,
): (T & { visualStyle: VisualStyle })[] {
  const allIds = VISUAL_STYLE_OPTIONS.map((s) => s.id);
  const deck = [...cryptoShuffle(allIds, rng), ...cryptoShuffle(allIds, rng)];
  const counts = new Map<VisualStyle, number>();
  let cursor = 0;

  const takeUnique = (): VisualStyle => {
    for (let i = 0; i < deck.length; i += 1) {
      const candidate = deck[(cursor + i) % deck.length];
      if ((counts.get(candidate) ?? 0) === 0) {
        cursor = (cursor + i + 1) % deck.length;
        counts.set(candidate, 1);
        return candidate;
      }
    }
    const fallback = deck[cursor % deck.length];
    cursor += 1;
    counts.set(fallback, (counts.get(fallback) ?? 0) + 1);
    return fallback;
  };

  return topics.map((t) => {
    const preferred =
      t.visualStyle ??
      (/gta/i.test(`${t.brand} ${t.title}`) ? (rng() > 0.4 ? 'gta6-vice' : 'hybrid-1998-gta6') : undefined);
    if (preferred && (counts.get(preferred) ?? 0) < 1) {
      counts.set(preferred, 1);
      return { ...t, visualStyle: preferred };
    }
    return { ...t, visualStyle: takeUnique() };
  });
}
