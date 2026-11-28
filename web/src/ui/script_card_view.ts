import { DELIVERY_CUES, stripAllCues } from '../engine/script/delivery_cues';
import type { CompiledScript } from '../engine/script/script_types';
import { renderGlyph } from './glyphs';

export type CopyMode = 'clean' | 'rehearsal' | 'json';

export function formatScriptForCopy(script: CompiledScript, mode: CopyMode): string {
  if (mode === 'json') return JSON.stringify(script, null, 2);
  if (mode === 'clean') {
    return script.beats.map((b) => stripAllCues(b.spokenText)).join('\n\n');
  }
  return script.beats
    .map((b) => `[${b.label} | ${b.transition} | ${b.actualSec}s]\n${b.spokenText}`)
    .join('\n\n');
}

export function renderScriptCard(script: CompiledScript): string {
  const cueChips = DELIVERY_CUES.map(
    (c) => `<button type="button" class="cue-chip" data-cue-tag="${c.tag}">${c.label}</button>`,
  ).join('');

  const beatsHtml = script.beats
    .map(
      (b) => `<div class="script-beat" data-beat-id="${b.id}">
        <div class="beat-meta">
          <span class="beat-label">${b.label}</span>
          <span class="beat-transition">${b.transition}</span>
          <span class="beat-timing">${b.actualSec}s / ${b.wordCount}w</span>
        </div>
        <p class="beat-text">${b.spokenText}</p>
      </div>`,
    )
    .join('');

  return `<div class="script-card">
    <div class="script-card-header">
      <h3 class="script-card-title">${renderGlyph('sparkles')} ${script.title}</h3>
      <div class="copy-mode-group">
        <button type="button" class="copy-btn" data-copy-mode="clean">${renderGlyph('copy')} Clean</button>
        <button type="button" class="copy-btn" data-copy-mode="rehearsal">${renderGlyph('copy')} Rehearsal</button>
        <button type="button" class="copy-btn" data-copy-mode="json">${renderGlyph('copy')} JSON</button>
      </div>
    </div>
    <div class="cue-chip-bar">${cueChips}</div>
    <div class="script-beats-list">${beatsHtml}</div>
  </div>`;
}
