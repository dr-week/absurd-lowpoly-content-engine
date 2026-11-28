const VISUAL_TAG_RE = /\[VISUAL:[^\]]*\]/gi;

export function sanitizeAudioFirst(text: string, includeVisuals: boolean): string {
  if (includeVisuals) return text.trim();
  return text
    .replace(VISUAL_TAG_RE, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export function extractVisualCues(text: string): string[] {
  const matches = text.match(VISUAL_TAG_RE) ?? [];
  return matches.map((m) => m.replace(/^\[VISUAL:\s*/i, '').replace(/\]$/, '').trim());
}
