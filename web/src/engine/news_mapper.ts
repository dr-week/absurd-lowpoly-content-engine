import { scoreComedyCraft } from './comedy_craft';
import { fetchFreshOnlineNews, type LiveHeadline } from './live_news';
import { cryptoRng, cryptoShuffle } from './randomizer';
import { classifyHook, classifySituation } from './taxonomy';
import { ALL_BESPOKE_STORIES, worldFamily } from './topic_generator';
import { assignDiverseVisualStyles } from './visual_styles';
import type { HookCategory, ScoredTopic, SituationCategory, TopicOption } from '../types';

function inferThemeFromHeadlines(headlines: LiveHeadline[]): string[] {
  const joined = headlines.map((h) => h.title.toLowerCase()).join(' ');
  const themes: string[] = [];
  if (/mars|moon|nasa|space|rocket|orbit|satellite/.test(joined)) themes.push('space', 'elon', 'motabhai');
  if (/ai|model|robot|chip|nvidia|google|apple|code/.test(joined)) themes.push('ai-tech', 'zuck', 'elon');
  if (/study|scientist|brain|sleep|physics|cern|mit|lab/.test(joined)) themes.push('science', 'gigachad');
  if (/beach|ferry|tourist|flight|airport/.test(joined)) themes.push('coastal');
  if (/trump|putin|un |summit|tariff|bank|election/.test(joined)) themes.push('trump', 'putin', 'modi', 'gandhi');
  if (/game|gta|police|traffic|chase|bank|heist/.test(joined)) themes.push('gta');
  return themes;
}

/**
 * Clean Live-News-to-Story Mapper (Zero Raw-Headline String Slicing!):
 * - Reads real live online headlines & comedy feeds ONLY to detect hot themes.
 * - Selects 8 grammatically clean, 100% human-written stories from our 60-story vault with randomized VisualStyle engines.
 */
export async function pickCleanLiveNewsStories(params: {
  seenTitles: Set<string>;
  hookFilter: HookCategory | 'all';
  situationFilter: SituationCategory | 'all';
  count?: number;
}): Promise<ScoredTopic[]> {
  const { seenTitles, hookFilter, situationFilter, count = 8 } = params;
  const headlines = await fetchFreshOnlineNews(8).catch(() => []);
  const hotFamilies = new Set(inferThemeFromHeadlines(headlines));

  const matchesFilter = (s: TopicOption): boolean =>
    (hookFilter === 'all' || classifyHook(s) === hookFilter) &&
    (situationFilter === 'all' || classifySituation(s) === situationFilter);

  const unseen = ALL_BESPOKE_STORIES.filter(
    (s) => matchesFilter(s) && !seenTitles.has(s.title.trim().toLowerCase()),
  );
  const pool = unseen.length >= count ? unseen : ALL_BESPOKE_STORIES.filter(matchesFilter);

  const prioritized = cryptoShuffle(pool, cryptoRng).sort((a, b) => {
    const aHot = hotFamilies.has(worldFamily(a.brand)) ? 1 : 0;
    const bHot = hotFamilies.has(worldFamily(b.brand)) ? 1 : 0;
    return bHot - aHot;
  });

  const chosen: TopicOption[] = [];
  const usedWorlds = new Set<string>();
  for (const s of prioritized) {
    if (chosen.length >= count) break;
    const fam = worldFamily(s.brand);
    if (hookFilter === 'all' && situationFilter === 'all' && usedWorlds.has(fam)) continue;
    usedWorlds.add(fam);
    chosen.push(s);
  }
  for (const s of prioritized) {
    if (chosen.length >= count) break;
    if (!chosen.some((c) => c.id === s.id)) chosen.push(s);
  }

  return assignDiverseVisualStyles(chosen, cryptoRng).map((story) => {
    const craft = scoreComedyCraft(story);
    return {
      ...story,
      brandHeat: 94,
      viralScore: Math.min(99, Math.round(craft.total * 0.97)),
      hookCategory: classifyHook(story),
      situationCategory: classifySituation(story),
    };
  });
}
