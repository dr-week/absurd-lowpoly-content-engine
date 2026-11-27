export interface VisualGateResult {
  cleanAudio: string;
  strippedNotes: string[];
}

const VISUAL_STAGE_RE =
  /(\[B-ROLL:[^\]]*\]|\[VISUAL:[^\]]*\]|\((?:Cut to|Pan|Zoom|Wide shot|Close-up)[^)]*\)|\*[^*]+\*)/gi;

export function sanitizeAudioFirst(raw: string): VisualGateResult {
  const strippedNotes: string[] = [];
  const cleanAudio = raw
    .replace(VISUAL_STAGE_RE, (match) => {
      strippedNotes.push(match.trim());
      return '';
    })
    .replace(/\s{2,}/g, ' ')
    .trim();

  return { cleanAudio, strippedNotes };
}
