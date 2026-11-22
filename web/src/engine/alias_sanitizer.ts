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
      re: new RegExp(`\\b${alias.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'gi'),
      upper: preset.parodyName.toUpperCase(),
      normal: preset.parodyName,
      preset,
    }))
    .filter((rule) => !rule.re.test(preset.parodyName)),
);

const BRAND_TRADEMARK_RULES: readonly [RegExp, string][] = [
  [/\b(?:PlayStation\s*1|PlayStation|PS1)\b/gi, '1998 32-bit retro console'],
  [/\b(?:Nintendo\s*64|Nintendo|N64)\b/gi, '1998 retro 3D console'],
  [/\b(?:GTA\s*6|GTA\s*5|Grand\s+Theft\s+Auto|GTA)\b/gi, 'open-world sandbox game'],
  [/\bVice[- ]City\b/gi, 'coastal neon city'],
  [/\bAardman(?:-style)?\b/gi, 'handcrafted British-style'],
  [/\b(?:Pixar|Disney|Marvel|Avengers|DC\s+Comics)\b/gi, 'blockbuster studio'],
  [/\bWes[- ]Anderson\b/gi, 'symmetrical pastel-vintage'],
  [/\bGoPro\b/gi, 'action-cam'],
  [/\bSin\s+City\b/gi, 'high-contrast noir'],
  [/\b(?:Zepto|Blinkit)\b/gi, '10-Minute Delivery App'],
  [/\b(?:Swiggy|Zomato)\b/gi, 'Food Delivery App'],
  [/\b(?:Ola|Uber)\b/gi, 'Ride-Hail App'],
  [/\biPhone\b/gi, 'flagship smartphone'],
  [/\bTesla\b/gi, 'electric coupe'],
  [/\bSpaceX\b/gi, 'private rocket firm'],
  [/\bStarlink\b/gi, 'orbit satellite dish'],
  [/\b(?:ChatGPT|OpenAI)\b/gi, 'AI chatbot'],
  [/\bMrBeast\b/gi, 'mega-challenge creator'],
  [/\b(?:WhatsApp|Instagram|YouTube|Netflix|Google)\b/gi, 'viral app'],
  [/\b(?:Rolex|Gucci|Louis\s+Vuitton|Ferrari|Lamborghini)\b/gi, 'ultra-luxury'],
  [/\b(?:Starbucks|McDonald'?s|KFC|IKEA|Nike|Adidas)\b/gi, 'big-brand'],
];

/**
 * Replaces ALL raw celebrity, character, console, game, and third-party brand trademarks
 * so video generators (Veo / Sora / Flow) never block prompts for third-party content providers.
 */
export function sanitizeCopyrightNames(text: string): string {
  let out = text;
  for (const rule of ALIAS_RULES) {
    out = out.replace(rule.re, (match) => (match === match.toUpperCase() && match.length > 2 ? rule.upper : rule.normal));
  }
  for (const [re, replacement] of BRAND_TRADEMARK_RULES) {
    out = out.replace(re, replacement);
  }
  return out;
}

/**
 * Detects any parody meme character(s) present in a topic or prompt and returns a concise
 * original visual silhouette lock so AI generators render the exact look without third-party IP flags.
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
  return locks.length
    ? `Original comedic character design (shifted colors & alternate-dimension wardrobe): Render ${locks.slice(0, 2).join('; ')}.`
    : '';
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
