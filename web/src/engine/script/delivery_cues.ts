export type DeliveryCueType =
  | 'PAUSE'
  | 'BEAT'
  | 'WHISPER'
  | 'DEADPAN'
  | 'CAMERA'
  | 'SFX';

export interface ParsedCue {
  type: DeliveryCueType;
  raw: string;
  value?: string;
  index: number;
}

const KNOWN_CUES = new Set<string>([
  'PAUSE',
  'BEAT',
  'WHISPER',
  'DEADPAN',
  'CAMERA',
  'SFX',
]);

const CUE_PATTERN = /\[([A-Z_]+)(?::\s*([^\]]+))?\]/g;

export function extractDeliveryCues(text: string): ParsedCue[] {
  const cues: ParsedCue[] = [];
  let match: RegExpExecArray | null;
  CUE_PATTERN.lastIndex = 0;

  while ((match = CUE_PATTERN.exec(text)) !== null) {
    const tag = match[1];
    if (KNOWN_CUES.has(tag)) {
      cues.push({
        type: tag as DeliveryCueType,
        raw: match[0],
        value: match[2]?.trim(),
        index: match.index,
      });
    }
  }
  return cues;
}

export function stripDeliveryCues(text: string): string {
  return text
    .replace(CUE_PATTERN, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export function formatRehearsalLine(text: string): string {
  return text.replace(/\s{2,}/g, ' ').trim();
}
