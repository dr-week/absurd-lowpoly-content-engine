import type { HookCategory, ScoredTopic, TopicOption } from '../types';
import { classifyHook, classifySituation } from './taxonomy';

const HOOK_TO_ANGLE: Record<HookCategory, string> = {
  iconic: 'over-engineer',
  build: 'over-engineer',
  origin: 'fake-origin',
  science: 'weird-science',
  tutorial: 'fake-tutorial',
  news: 'breaking-news',
};

/**
 * Turns any user-written 1-line idea into a structured ScoredTopic ready for
 * Live AI or instant 6-frame/6-shot prompt generation + Viral Pack + Part 2 sequels.
 */
export function buildCustomEpisode(rawIdea: string, hookChoice: HookCategory | 'all' = 'all'): ScoredTopic {
  const clean = rawIdea.trim().replace(/\s+/g, ' ');
  const words = clean.split(' ');
  const title = words.slice(0, 8).join(' ').toUpperCase();
  const brand = words.slice(0, 2).join(' ').replace(/[^A-Za-z0-9\s'-]/g, '') || 'Custom';
  const stamp = Date.now().toString(36).slice(-5);

  const base: TopicOption = {
    id: `custom_${stamp}`,
    title,
    angle: hookChoice !== 'all' ? HOOK_TO_ANGLE[hookChoice] : 'over-engineer',
    brand,
    trendHook: 'Custom Idea',
    pitch: clean,
  };

  return {
    ...base,
    brandHeat: 94,
    viralScore: 95,
    hookCategory: hookChoice !== 'all' ? hookChoice : classifyHook(base),
    situationCategory: classifySituation(base),
  };
}
