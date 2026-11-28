export type CueKind = 'pause' | 'tone' | 'emphasis' | 'visual';

export interface DeliveryCue {
  id: string;
  label: string;
  tag: string;
  kind: CueKind;
}

export const DELIVERY_CUES: DeliveryCue[] = [
  { id: 'pause_1s', label: '1s Pause', tag: '[PAUSE - 1s]', kind: 'pause' },
  { id: 'pause_2s', label: '2s Pause', tag: '[PAUSE - 2s]', kind: 'pause' },
  { id: 'tone_deadpan', label: 'Deadpan', tag: '[TONE: DEADPAN]', kind: 'tone' },
  { id: 'tone_urgent', label: 'Urgent', tag: '[TONE: URGENT]', kind: 'tone' },
  { id: 'emph_snap', label: 'Snap', tag: '[EMPHASIS: SNAP]', kind: 'emphasis' },
  { id: 'vis_cut', label: 'B-Roll Cut', tag: '[VISUAL: TIGHT_CUT]', kind: 'visual' },
];

export function insertCueAtEnd(text: string, tag: string): string {
  const trimmed = text.trim();
  return trimmed ? `${trimmed} ${tag}` : tag;
}

export function stripAllCues(text: string): string {
  return text.replace(/\[[^\]]+\]/g, '').replace(/\s{2,}/g, ' ').trim();
}
