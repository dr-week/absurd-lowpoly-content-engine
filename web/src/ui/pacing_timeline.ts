import type { CompiledScript } from '../engine/script/script_types';
import { renderGlyph } from './glyphs';

export function renderPacingTimeline(script: CompiledScript): string {
  const ratio = Math.min(100, Math.round((script.totalWords / Math.max(1, script.wordBudget)) * 100));
  const overBudget = script.totalWords > script.wordBudget;

  const beatBars = script.beats
    .map((b) => {
      const pct = Math.max(10, Math.round((b.actualSec / Math.max(1, script.totalSec)) * 100));
      return `<div class="pacing-beat" style="flex:${pct}">
        <span class="pacing-beat-label">${b.label}</span>
        <span class="pacing-beat-sec">${b.actualSec}s</span>
      </div>`;
    })
    .join('');

  return `<div class="pacing-timeline">
    <div class="pacing-header">
      <span class="pacing-title">${renderGlyph('clock')} Pacing &amp; Word Budget</span>
      <span class="pacing-stat ${overBudget ? 'is-over' : ''}">
        ${script.totalWords} / ${script.wordBudget} words (${script.totalSec}s / ${script.targetDurationSec}s)
      </span>
    </div>
    <div class="pacing-meter">
      <div class="pacing-meter-fill ${overBudget ? 'is-over' : ''}" style="width:${ratio}%"></div>
    </div>
    <div class="pacing-beats">${beatBars}</div>
  </div>`;
}
