import { CHARACTER_ROSTER } from '../data/characters';
import { Glyphs } from '../glyphs';
import { esc } from './escape';

export function renderCustomIdeaBar(draft: string): string {
  const chips = CHARACTER_ROSTER.map(
    (c) => `<button type="button" class="pill" data-action="pick-char" data-starter="${esc(c.starter)}" title="Start with ${esc(c.label)}">${esc(c.label)}</button>`,
  ).join('');

  return `
    <div class="composer-bar">
      <div class="composer-bar__row">
        <input type="text" id="custom-idea-input" class="compact-input" style="flex:1; min-width:0; width:auto;" placeholder="Write your own 1-line idea (e.g. Hulke argues over ₹10 auto meter)..." value="${esc(draft)}" />
        <button type="button" class="btn btn--primary" data-action="run-custom-idea" title="Generate Prompts from Your Idea">${Glyphs.arrowRight(14)}<span>Create</span></button>
      </div>
      <div class="composer-bar__row">
        <span class="composer-bar__label" style="display:inline-flex; align-items:center; gap:4px;">${Glyphs.user(12)}<span>Cast</span></span>
        <div class="chip-rail">${chips}</div>
      </div>
    </div>
  `;
}
