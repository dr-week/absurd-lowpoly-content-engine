export type GlyphName =
  | 'send'
  | 'play'
  | 'pause'
  | 'mirror'
  | 'copy'
  | 'eye'
  | 'shield'
  | 'sparkles'
  | 'sliders'
  | 'clock'
  | 'plus'
  | 'close'
  | 'stage'
  | 'spark'
  | 'chat'
  | 'frame'
  | 'check'
  | 'save'
  | 'reset';

const PATHS: Record<GlyphName, string> = {
  send: '<path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/>',
  play: '<polygon points="6 3 20 12 6 21 6 3"/>',
  pause: '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>',
  mirror: '<path d="M12 3v18"/><path d="M8 7l-4 5 4 5"/><path d="M16 7l4 5-4 5"/>',
  copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>',
  sparkles: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z"/>',
  sliders: '<line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/><circle cx="9" cy="6" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="10" cy="18" r="2"/>',
  clock: '<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  close: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  stage: '<rect x="3" y="4" width="18" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="18" x2="12" y2="21"/>',
  spark: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z"/>',
  chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  frame: '<rect x="5" y="2" width="14" height="20" rx="2"/><line x1="9" y1="18" x2="15" y2="18"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>',
  reset: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
};

export function renderGlyph(name: GlyphName, cls = 'studio-glyph'): string {
  return `<svg class="${cls}" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${PATHS[name]}</svg>`;
}

export const uiGlyphs = {
  render: renderGlyph,
  send: (cls?: string) => renderGlyph('send', cls),
  play: (cls?: string) => renderGlyph('play', cls),
  pause: (cls?: string) => renderGlyph('pause', cls),
  mirror: (cls?: string) => renderGlyph('mirror', cls),
  copy: (cls?: string) => renderGlyph('copy', cls),
  eye: (cls?: string) => renderGlyph('eye', cls),
  shield: (cls?: string) => renderGlyph('shield', cls),
  sparkles: (cls?: string) => renderGlyph('sparkles', cls),
  sliders: (cls?: string) => renderGlyph('sliders', cls),
  clock: (cls?: string) => renderGlyph('clock', cls),
  plus: (cls?: string) => renderGlyph('plus', cls),
  close: (cls?: string) => renderGlyph('close', cls),
  stage: (cls?: string) => renderGlyph('stage', cls),
  spark: (cls?: string) => renderGlyph('spark', cls),
  chat: (cls?: string) => renderGlyph('chat', cls),
  frame: (cls?: string) => renderGlyph('frame', cls),
  check: (cls?: string) => renderGlyph('check', cls),
  save: (cls?: string) => renderGlyph('save', cls),
  reset: (cls?: string) => renderGlyph('reset', cls),
};
