import type { TopicOption } from '../types';

export interface ComedyMechanism {
  id: string;
  name: string;
  rule: string;
  punchlineRule: string;
}

export const COMEDY_MECHANISMS: readonly ComedyMechanism[] = [
  {
    id: 'broken-assumption',
    name: 'Setup -> Assumption -> Shatter',
    rule: 'Make Shots 1-3 build one obvious expectation, then shatter ONE assumption in Shot 5 while staying 100% logically consistent with the setup.',
    punchlineRule: 'Put the single reveal word at the very end of Shot 6 Hindi dialogue and cut immediately.',
  },
  {
    id: 'rule-of-three',
    name: 'Rule of Three Escalation',
    rule: 'Shot 2 sets a pattern, Shot 3 confirms it bigger, Shot 4-5 breaks the pattern with an absurdly logical leap.',
    punchlineRule: 'Third beat breaks prediction; keep Shot 6 under 7 Hindi words with zero explanation.',
  },
  {
    id: 'game-heighten',
    name: 'UCB Game of the Scene',
    rule: 'Shot 1 grounded Base Reality -> Shot 2 one Unusual Thing -> Shots 3-5 heighten stakes using deadpan internal logic (no random unrelated gags).',
    punchlineRule: 'Shot 6 delivers a deadpan status-preserving button and instant hard cut to black.',
  },
  {
    id: 'callback-loop',
    name: 'Shot 1 -> Shot 6 Callback Loop',
    rule: 'Plant one tiny concrete prop or detail in Shot 1, escalate far away in Shots 2-5, then bring that exact Shot 1 detail back in Shot 6 with new meaning.',
    punchlineRule: 'End on the Shot 1 callback so viewers immediately rewatch to catch the setup.',
  },
  {
    id: 'status-reversal',
    name: 'High-Status Deadpan vs Petty Detail',
    rule: 'Place a world leader, Nobel scientist, or billionaire in a grand crisis, then make them obsess over a microscopic petty inconvenience.',
    punchlineRule: 'Maximize status gap: global catastrophe framed around a ₹10 or 2-second annoyance.',
  },
  {
    id: 'misdirection-turn',
    name: 'But / Therefore Misdirection',
    rule: 'Connect every shot with BUT (obstacle/reversal) or THEREFORE (consequence) — never "and then".',
    punchlineRule: 'Reveal the hidden true motive only on the last two words of Shot 6.',
  },
  {
    id: 'savage-reversal',
    name: 'Slice-of-Life Savage Comeback',
    rule: 'Shot 1-2 grounded relatable annoyance (boss lecture, smug critic, strict rule) -> Shot 3-4 peak arrogance -> Shot 5-6 deadpan literal compliance or savage 1-line comeback that flips the power dynamic.',
    punchlineRule: 'Zero lecturing; deliver the savage comeback in <= 7 Hindi words and cut immediately.',
  },
];

export function pickComedyMechanism(seed = Math.random()): ComedyMechanism {
  const idx = Math.floor(Math.abs(seed) * COMEDY_MECHANISMS.length) % COMEDY_MECHANISMS.length;
  return COMEDY_MECHANISMS[idx];
}

export const WRITERS_ROOM_RULES =
  'RETENTION & COMEDY WRITER RULES (MANDATORY): ' +
  '1) ZERO AI GIBBERISH (HUMAN SLICE-OF-LIFE): Every premise must be instantly relatable in 2 seconds (office boss, cafe critic, surprise exam, traffic, midnight walk, heist). Surreal twists are great, robotic nonsense is banned. ' +
  '2) EVERY-BEAT RETENTION PACING: Shot 1 = instant hook mid-action; Shot 2 = familiar expectation; Shot 3 = first micro-twist; Shot 4 = peak tension or smug flex; Shot 5 = grounded expectation shatter / savage comeback; Shot 6 = <= 7-word Hindi punchline (reveal word LAST) + hard cut for >100% rewatch loop. ' +
  '3) BUT/THEREFORE CAUSALITY: Every shot transition must be "BUT" (reversal) or "THEREFORE" (escalation), NEVER "and then". ' +
  '4) SPECIFICITY & CALLBACK: Use concrete numbers/props ("9:03 AM", "₹10", "Question 1", "back cover") and call back Shot 1 in Shot 6.';

export interface CraftScore {
  total: number;
  hasSixBeats: boolean;
  punchlineWords: number;
  hasCallback: boolean;
  hasSpecificity: boolean;
}

const STOP = new Set(['the', 'and', 'for', 'with', 'from', 'that', 'this', 'into', 'over', 'onto', 'then', 'they', 'their', 'one', 'two']);

function extractKeywords(text: string): string[] {
  return (text.toLowerCase().match(/[a-z]{4,}/g) ?? []).filter((w) => !STOP.has(w));
}

/**
 * Evaluates real comedy craft on a topic's 6-frame / 6-shot structure:
 * - Complete 6-beat causal structure
 * - Punchline economy (<= 8 words in Shot 6 Hindi & concise Frame 6 caption)
 * - Concrete specificity (numbers, currency, exact props)
 * - Shot 1 -> Shot 6 callback loop
 */
export function scoreComedyCraft(topic: TopicOption): CraftScore {
  const frames = topic.frames ?? [];
  const shots = topic.shots ?? [];
  const hasSixBeats = frames.length === 6 && shots.length === 6;

  const lastShot = shots[shots.length - 1];
  const punchlineWords = lastShot ? lastShot.hindi.trim().split(/\s+/).filter(Boolean).length : 0;

  const fullText = `${topic.title} ${topic.pitch} ${frames.map((f) => f.action).join(' ')}`;
  const hasSpecificity = /\d|₹|\$|°|%|km|ft|inch|crore|level/i.test(fullText);

  let hasCallback = false;
  if (frames.length >= 6) {
    const setupKeys = new Set(extractKeywords(`${frames[0].action} ${frames[1].action}`));
    const payoffKeys = extractKeywords(`${frames[5].action} ${frames[4].action} ${frames[5].caption}`);
    hasCallback = payoffKeys.some((k) => setupKeys.has(k));
  }

  let total = 70;
  if (hasSixBeats) total += 10;
  if (punchlineWords >= 3 && punchlineWords <= 8) total += 8;
  if (hasSpecificity) total += 6;
  if (hasCallback) total += 6;

  return { total: Math.min(100, total), hasSixBeats, punchlineWords, hasCallback, hasSpecificity };
}
