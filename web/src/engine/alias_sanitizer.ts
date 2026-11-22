import { CHARACTER_ROSTER, type CharacterPreset } from '../data/characters';
import type { ScoredTopic, TopicOption } from '../types';

interface AliasRule {
  re: RegExp;
  upper: string;
  normal: string;
  preset: CharacterPreset;
}

const ALIAS_RULES: readonly AliasRule[] = CHARACTER_ROSTER.flatMap((preset) =>
  [...preset.rawAliases]
    .sort((a, b) => b.length - a.length)
    .map((alias) => ({
      re: new RegExp(`\\b${alias.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}(?!\\s*(?:bhai|bhau|-g|nder|-esh|-chaddha))\\b`, 'gi'),
      upper: preset.parodyName.toUpperCase(),
      normal: preset.parodyName,
      preset,
    })),
);

/**
 * Replaces raw celebrity / trademarked names with copyright-safe parody names
 * (e.g., "Elon Musk" -> "Elon Bhai", "Donald Trump" -> "Doland Bhau", "Spider-Man" -> "Spooder-Bhai").
 */
export function sanitizeCopyrightNames(text: string): string {
  let out = text;
  for (const rule of ALIAS_RULES) {
    out = out.replace(rule.re, (match) => (match === match.toUpperCase() && match.length > 2 ? rule.upper : rule.normal));
  }
  return out;
}

/**
 * Detects any parody meme character(s) present in a topic or prompt and returns a concise
 * 1998 PS1 visual silhouette lock so AI generators render the exact look without copyright names.
 */
export function detectCharacterLock(text: string): string {
  const lower = text.toLowerCase();
  const locks: string[] = [];
  for (const preset of CHARACTER_ROSTER) {
    const names = [preset.parodyName.toLowerCase(), ...preset.rawAliases];
    if (names.some((n) => lower.includes(n))) {
      locks.push(preset.visualLock);
    }
  }
  return locks.length ? `Character Silhouette Lock: Render ${locks.slice(0, 2).join('; ')}.` : '';
}

export function sanitizeTopic<T extends TopicOption | ScoredTopic>(topic: T): T {
  return {
    ...topic,
    title: sanitizeCopyrightNames(topic.title),
    brand: sanitizeCopyrightNames(topic.brand),
    pitch: sanitizeCopyrightNames(topic.pitch),
    frames: topic.frames?.map((f) => ({
      ...f,
      action: sanitizeCopyrightNames(f.action),
      caption: sanitizeCopyrightNames(f.caption),
    })),
    shots: topic.shots?.map((s) => ({
      ...s,
      visual: sanitizeCopyrightNames(s.visual),
    })),
  };
}
