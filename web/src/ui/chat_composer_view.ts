import type { ScriptNiche } from '../engine/storage/storage_types';
import { renderGlyph } from './glyphs';

export interface ComposerState {
  niche: ScriptNiche;
  durationSec: number;
  includeVisuals: boolean;
}

export function renderChatComposer(state: ComposerState): string {
  const niches: ScriptNiche[] = ['tech', 'history', 'growth', 'science'];
  const options = niches
    .map((n) => `<option value="${n}" ${state.niche === n ? 'selected' : ''}>${n.toUpperCase()}</option>`)
    .join('');

  return `<form class="chat-composer" id="studio-chat-form">
    <div class="composer-controls">
      <label class="composer-field">
        <span>Niche</span>
        <select name="niche" id="studio-niche-select">${options}</select>
      </label>
      <label class="composer-field">
        <span>Duration (s)</span>
        <input type="number" id="studio-duration-input" min="15" max="90" step="5" value="${state.durationSec}" />
      </label>
      <label class="composer-toggle">
        <input type="checkbox" id="studio-visuals-toggle" ${state.includeVisuals ? 'checked' : ''} />
        <span>${renderGlyph('eye')} Visual Cues</span>
      </label>
    </div>
    <div class="composer-input-row">
      <input type="text" id="studio-topic-input" placeholder="Topic (e.g., why SQLite beats microservices)..." autocomplete="off" />
      <button type="submit" class="composer-send-btn" aria-label="Generate Script">
        ${renderGlyph('send')} <span>Compile</span>
      </button>
    </div>
  </form>`;
}
