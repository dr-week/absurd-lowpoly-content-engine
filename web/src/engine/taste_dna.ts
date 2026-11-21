import type { HookCategory, RatingLogEntry, SavedItem, SituationCategory } from '../types';
import { getHookLabel, getSituationLabel } from './taxonomy';

export interface TasteDna {
  topHooks: string[];
  topSituations: string[];
  topWorlds: string[];
  avoidWorlds: string[];
  promptSummary: string;
}

function rankMap(map: Map<string, number>, limit: number): string[] {
  return Array.from(map.entries())
    .filter(([, score]) => score > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([k]) => k);
}

/**
 * Computes the user's live Taste DNA from Saved topics + Thumbs Up/Down logs,
 * powering both the Viral analytics card and Live AI prompt personalization.
 */
export function computeTasteDna(logs: RatingLogEntry[], saved: SavedItem[]): TasteDna {
  const hooks = new Map<string, number>();
  const sits = new Map<string, number>();
  const worlds = new Map<string, number>();
  const dislikes = new Map<string, number>();

  for (const item of saved) {
    const h = getHookLabel(item.topic.hookCategory as HookCategory);
    const s = getSituationLabel(item.topic.situationCategory as SituationCategory);
    hooks.set(h, (hooks.get(h) ?? 0) + (item.generated ? 3 : 2));
    sits.set(s, (sits.get(s) ?? 0) + (item.generated ? 3 : 2));
    worlds.set(item.topic.brand, (worlds.get(item.topic.brand) ?? 0) + 2);
  }

  for (const e of logs) {
    if (e.vote === 'up') {
      worlds.set(e.brand, (worlds.get(e.brand) ?? 0) + 1);
    } else {
      dislikes.set(e.brand, (dislikes.get(e.brand) ?? 0) + 1);
      worlds.set(e.brand, (worlds.get(e.brand) ?? 0) - 1);
    }
  }

  const topHooks = rankMap(hooks, 3);
  const topSituations = rankMap(sits, 3);
  const topWorlds = rankMap(worlds, 4);
  const avoidWorlds = rankMap(dislikes, 3);

  const parts: string[] = [];
  if (topHooks.length) parts.push(`Favorite Hooks: ${topHooks.join(', ')}`);
  if (topSituations.length) parts.push(`Favorite Situations: ${topSituations.join(', ')}`);
  if (topWorlds.length) parts.push(`Favorite Worlds/Figures: ${topWorlds.join(', ')}`);
  if (avoidWorlds.length) parts.push(`Avoid Worlds: ${avoidWorlds.join(', ')}`);

  return { topHooks, topSituations, topWorlds, avoidWorlds, promptSummary: parts.join(' | ') };
}
