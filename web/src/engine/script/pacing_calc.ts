export const WORDS_PER_SEC = 2.3;
export const PAUSE_1S_PENALTY_WORDS = 2.5;
export const PAUSE_2S_PENALTY_WORDS = 5.0;

const PAUSE_1S_RE = /\[PAUSE\s*-\s*1s\]/gi;
const PAUSE_2S_RE = /\[PAUSE\s*-\s*2s\]/gi;
const ANY_TAG_RE = /\[[^\]]+\]/g;

export function countSpokenWords(text: string): number {
  const cleaned = text.replace(ANY_TAG_RE, ' ').trim();
  if (!cleaned) return 0;
  return cleaned.split(/\s+/).length;
}

export function countPausePenaltyWords(text: string): number {
  const p1 = (text.match(PAUSE_1S_RE) ?? []).length;
  const p2 = (text.match(PAUSE_2S_RE) ?? []).length;
  return p1 * PAUSE_1S_PENALTY_WORDS + p2 * PAUSE_2S_PENALTY_WORDS;
}

export function computeWordBudget(targetSec: number, textWithCues = ''): number {
  const rawBudget = Math.round(targetSec * WORDS_PER_SEC);
  const penalty = countPausePenaltyWords(textWithCues);
  return Math.max(1, Math.round(rawBudget - penalty));
}

export function estimateSpokenSeconds(text: string): number {
  const words = countSpokenWords(text);
  const p1 = (text.match(PAUSE_1S_RE) ?? []).length;
  const p2 = (text.match(PAUSE_2S_RE) ?? []).length;
  const speechSec = words / WORDS_PER_SEC;
  return Number((speechSec + p1 * 1.0 + p2 * 2.0).toFixed(1));
}

export function parsePauseSeconds(tag: string): number {
  const m = /\[PAUSE\s*-\s*(\d+(?:\.\d+)?)s\]/i.exec(tag);
  return m ? Number(m[1]) : 0;
}
