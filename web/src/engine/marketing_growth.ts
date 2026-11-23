import type { MarketingPlatform, ScoredTopic } from '../types';
import { getHookLabel } from './taxonomy';

export interface GrowthMarketingPack {
  hooks: readonly { variant: 'A' | 'B' | 'C'; angle: string; text: string }[];
  dmShareTrigger: string;
  pinnedCommentTrap: string;
  platformPost: { label: string; caption: string; hashtags: readonly string[]; fullCopy: string };
  brandPlacement: { propLine: string; pinnedCta: string } | null;
}

export const PLATFORM_OPTIONS: readonly { id: MarketingPlatform; label: string }[] = [
  { id: 'reels', label: 'IG Reels' },
  { id: 'shorts', label: 'YT Shorts' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'x', label: 'X / Threads' },
];

function cleanTag(raw: string): string {
  const s = raw.replace(/[^a-zA-Z0-9]+/g, '');
  return s ? `#${s.toLowerCase()}` : '#comedy';
}

/**
 * 2026 Viral Growth & Retention Marketing Engine:
 * Generates A/B/C first-2-second hooks, DM-Share triggers (Sends per Reach),
 * Pinned Comment debate traps, platform-native posts, and stealth brand cameos.
 */
export function buildGrowthMarketingPack(
  topic: ScoredTopic,
  platform: MarketingPlatform = 'reels',
  brandProduct = '',
): GrowthMarketingPack {
  const rawTitle = topic.title.replace(/^(?:PART\s*\d+|CROSSOVER):\s*/i, '').trim();
  const shortTitle = rawTitle.length > 48 ? `${rawTitle.slice(0, 45).trim()}...` : rawTitle;
  const hero = topic.brand || 'This guy';
  const hookTag = cleanTag(getHookLabel(topic.hookCategory));

  const hooks = [
    { variant: 'A', angle: 'Curiosity Gap', text: `Wait for the last 2 seconds: ${shortTitle.toLowerCase()}.` },
    { variant: 'B', angle: 'Status Shock', text: `${hero} really thought this plan would work...` },
    { variant: 'C', angle: 'Relatable POV', text: `POV: one tiny everyday problem spirals completely out of control.` },
  ] as const;

  const dmShareTrigger = `Send this to the friend who over-complicates every tiny problem like ${hero}.`;
  const pinnedCommentTrap = `Be honest—would you have walked away or doubled down like ${hero}? Drop 1 or 2 below.`;

  const baseTags = Array.from(new Set(['#shorts', '#reels', '#comedy', '#animation', '#plottwist', hookTag]));

  const platformMap: Record<MarketingPlatform, { label: string; caption: string; hashtags: readonly string[] }> = {
    reels: {
      label: 'Instagram Reels',
      caption: `${hooks[0].text}\n${dmShareTrigger}`,
      hashtags: baseTags.slice(0, 5),
    },
    shorts: {
      label: 'YouTube Shorts',
      caption: `${rawTitle} (Wait for the twist!)\n\n${pinnedCommentTrap}`,
      hashtags: ['#shorts', '#comedy', '#animation', '#plottwist'],
    },
    tiktok: {
      label: 'TikTok',
      caption: `${hooks[1].text} Tell me I'm wrong.`,
      hashtags: ['#fyp', '#comedy', '#animation', '#plottwist', hookTag],
    },
    x: {
      label: 'X / Threads',
      caption: `${hooks[1].text}\n\n(Watch till Shot 5—the ending is criminal.)`,
      hashtags: ['#comedy', '#animation'],
    },
  };

  const chosen = platformMap[platform];
  const cleanProd = brandProduct.trim();
  const brandPlacement = cleanProd
    ? {
        propLine: `Stealth Prop Cameo (Shot 2): Character deadpan glances at "${cleanProd}" as the ONLY normal thing working in the entire chaotic room—zero ad speech, pure visual contrast.`,
        pinnedCta: `Pinned CTA: Everyone asking about ${cleanProd} from Shot 2—grab it here -> [your-link]`,
      }
    : null;

  const fullCopy = [
    chosen.caption,
    brandPlacement ? `\n${brandPlacement.pinnedCta}` : '',
    `\n${chosen.hashtags.join(' ')}`,
  ]
    .filter(Boolean)
    .join('\n')
    .trim();

  return {
    hooks,
    dmShareTrigger,
    pinnedCommentTrap,
    platformPost: { ...chosen, fullCopy },
    brandPlacement,
  };
}
