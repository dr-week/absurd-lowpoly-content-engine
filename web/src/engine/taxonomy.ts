import type { HookCategory, SituationCategory, TopicOption } from '../types';

export interface CategoryMeta<T extends string> {
  id: T;
  label: string;
}

export const HOOK_CATEGORIES: readonly CategoryMeta<HookCategory>[] = [
  { id: 'iconic', label: 'Iconic Figures' },
  { id: 'build', label: 'Over-Engineer' },
  { id: 'origin', label: 'Fake Origins' },
  { id: 'science', label: 'Weird Science' },
  { id: 'tutorial', label: 'Fake Hacks' },
  { id: 'news', label: 'Breaking Chaos' },
];

export const SITUATION_CATEGORIES: readonly CategoryMeta<SituationCategory>[] = [
  { id: 'global', label: 'World & Politics' },
  { id: 'coastal', label: 'Goa & Travel' },
  { id: 'tech', label: 'AI & Gadgets' },
  { id: 'ego', label: 'Petty Ego' },
  { id: 'lab', label: 'Lab & Space' },
  { id: 'childhood', label: 'School & Origin' },
];

export function getHookLabel(id: HookCategory): string {
  return HOOK_CATEGORIES.find((h) => h.id === id)?.label ?? id;
}

export function getSituationLabel(id: SituationCategory): string {
  return SITUATION_CATEGORIES.find((s) => s.id === id)?.label ?? id;
}

const ICONIC_RE = /\b(elon|musk|trump|doland|gandhi|gandhiji|bapu|putin|putinder|modi|zuck|motabhai|giga|chaddha|doge|spooder|sigma|gta)\b/i;

export function classifyHook(topic: TopicOption): HookCategory {
  if (topic.angle === 'fake-origin') return 'origin';
  if (topic.angle === 'weird-science') return 'science';
  if (topic.angle === 'fake-tutorial') return 'tutorial';
  if (topic.angle === 'breaking-news') return 'news';
  if (ICONIC_RE.test(`${topic.brand} ${topic.title}`)) return 'iconic';
  if (topic.angle === 'over-engineer') return 'build';
  return 'build';
}

export function classifySituation(topic: TopicOption): SituationCategory {
  const text = `${topic.brand} ${topic.title} ${topic.pitch}`.toLowerCase();
  if (/goa|beach|anjuna|scooter|airport|travel|ferry/.test(text)) return 'coastal';
  if (/school|kindergarten|1st grade|bully|paratha|childhood|8-year|9-year|charkha|dj/.test(text)) return 'childhood';
  if (/mars|nasa|cern|mit|lab|orbit|sleep|whey|protein|fish|cat|physicist|scientist/.test(text)) return 'lab';
  if (/un |summit|g20|bank|silo|submarine|tariff|treaty|global|bridge/.test(text)) return 'global';
  if (/ai |toaster|wi-fi|wifi|router|collider|phone|app|startup|zepto/.test(text)) return 'tech';
  return 'ego';
}
