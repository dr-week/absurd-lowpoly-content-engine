import type { GeneratedPrompts, ScoredTopic } from '../types';
import { getHookLabel, getSituationLabel } from './taxonomy';
import { detectTwistBlueprint } from './twist_architect';

export interface ViralPackage {
  titles: string[];
  pinnedComment: string;
  loopStatus: string;
  twistAudit: string;
  hashtags: string[];
  copyText: string;
}

function toTag(raw: string): string {
  const clean = raw.replace(/[^a-zA-Z0-9]+/g, '');
  return clean ? `#${clean}` : '#AbsurdComedy';
}

/**
 * Generates high-CTR Reels/Shorts viral packaging:
 * 3 titles, 1 comment-bait pinned comment, expectation-flip audit, loop audit, and 5 hashtags.
 */
export function buildViralPackage(topic: ScoredTopic, prompts: GeneratedPrompts): ViralPackage {
  const shortTitle = topic.title.replace(/^PART\s*\d+:\s*/i, '').trim();
  const titles = [
    `Wait till the end: ${shortTitle}`,
    `Nobody expected ${topic.brand} to solve it like this`,
    `${shortTitle} (Parallel Dimension Edition)`,
  ];

  const commentMap: Record<string, string> = {
    iconic: `Be honest — would ${topic.brand} actually do this in real life? Yes or No?`,
    build: 'Would you use the ₹10 fix or build the 40-foot machine? Tell me honestly.',
    origin: 'Real history books are too scared to print this chapter. Part 2?',
    science: 'Rate this scientific breakthrough from 1 to 10 (be brutal).',
    tutorial: 'Step 3 caught me completely off guard. Did you see it coming?',
    news: 'Breaking news or normal Tuesday? Drop your verdict below.',
  };
  const pinnedComment = commentMap[topic.hookCategory] ?? 'Did you catch the ending twist on the first watch?';

  const shot6Match = prompts.videoPrompt.match(/Shot 6:[\s\S]*?Hindi Dialogue:\s*"([^"]*)"/);
  const words = shot6Match ? shot6Match[1].trim().split(/\s+/).filter(Boolean).length : 0;
  const loopStatus = words > 0 && words <= 7 ? `Tight Loop (${words}w)` : `Crisp Cut (${words}w)`;
  const bp = detectTwistBlueprint(topic);
  const twistAudit = `${bp.label}: ${bp.assumedTrack} -> ${bp.subversionSnap}`;

  const hashtags = Array.from(
    new Set([
      '#UnexpectedTwist',
      '#DesiComedy',
      toTag(topic.brand),
      toTag(getHookLabel(topic.hookCategory)),
      toTag(getSituationLabel(topic.situationCategory)),
    ]),
  ).slice(0, 5);

  const copyText = [
    'VIRAL TITLES:',
    ...titles.map((t, i) => `${i + 1}. ${t}`),
    '',
    `TWIST CHECK: ${twistAudit}`,
    `PINNED COMMENT: ${pinnedComment}`,
    `LOOP AUDIT: ${loopStatus}`,
    `HASHTAGS: ${hashtags.join(' ')}`,
  ].join('\n');

  return { titles, pinnedComment, loopStatus, twistAudit, hashtags, copyText };
}
