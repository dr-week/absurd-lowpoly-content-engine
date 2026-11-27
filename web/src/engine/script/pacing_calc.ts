export const WORDS_PER_SEC = 2.3;
export const DEFAULT_PAUSE_SEC = 0.6;

const PAUSE_TAG_RE = /\[PAUSE(?::\s*([\d.]+)s?)?\]/gi;
const CUE_TAG_RE = /\[[A-Z_]+(?::[^\]]*)?\]/g;

export function parsePauseSeconds(text: string): number {
  let total = 0;
  let match: RegExpExecArray | null;
  PAUSE_TAG_RE.lastIndex = 0;
  while ((match = PAUSE_TAG_RE.exec(text)) !== null) {
    const val = match[1] ? Number.parseFloat(match[1]) : DEFAULT_PAUSE_SEC;
    total += Number.isFinite(val) && val > 0 ? val : DEFAULT_PAUSE_SEC;
  }
  return Math.round(total * 10) / 10;
}

export function countSpokenWords(text: string): number {
  const withoutCues = text.replace(CUE_TAG_RE, ' ').trim();
  if (!withoutCues) return 0;
  return withoutCues.split(/\s+/).filter(Boolean).length;
}

export function estimateBeatDurationSec(text: string): number {
  const words = countSpokenWords(text);
  const pauseSec = parsePauseSeconds(text);
  const speechSec = words / WORDS_PER_SEC;
  return Math.round((speechSec + pauseSec) * 10) / 10;
}

export function availableSpeechSeconds(
  targetDurationSec: number,
  text: string
): number {
  const pauseSec = parsePauseSeconds(text);
  return Math.max(0, Math.round((targetDurationSec - pauseSec) * 10) / 10);
}

export interface PacingSummary {
  totalWords: number;
  totalPauseSec: number;
  totalDurationSec: number;
  effectiveWpm: number;
}

export function calculatePacingSummary(
  beats: ReadonlyArray<{ text: string }>
): PacingSummary {
  let totalWords = 0;
  let totalPauseSec = 0;
  let totalDurationSec = 0;

  for (const beat of beats) {
    totalWords += countSpokenWords(beat.text);
    totalPauseSec += parsePauseSeconds(beat.text);
    totalDurationSec += estimateBeatDurationSec(beat.text);
  }

  const minutes = totalDurationSec / 60;
  const effectiveWpm = minutes > 0 ? Math.round(totalWords / minutes) : 0;

  return {
    totalWords,
    totalPauseSec: Math.round(totalPauseSec * 10) / 10,
    totalDurationSec: Math.round(totalDurationSec * 10) / 10,
    effectiveWpm,
  };
}
