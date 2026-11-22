import { CHARACTER_ROSTER } from '../data/characters';
import { Glyphs } from '../glyphs';
import { esc } from './escape';

export function renderCustomIdeaBar(draft: string): string {
  const chips = CHARACTER_ROSTER.map(
    (c) => `<button type="button" class="pill" data-action="pick-char" data-starter="${esc(c.starter)}" title="Start with ${esc(c.label)}">${esc(c.label)}</button>`,
  ).join('');

  return `
    <div class="card-subpanel" style="padding:10px 12px; gap:8px;">
      <div class="trend-strip">${chips}</div>
      <div class="section-header__actions" style="width:100%;">
        <input type="text" id="custom-idea-input" class="compact-input" style="flex:1; width:auto;" placeholder="Write your own 1-line idea (e.g. Hulke argues over ₹10 auto meter)..." value="${esc(draft)}" />
        <button type="button" class="btn btn--primary" data-action="run-custom-idea" title="Generate Prompts from Your Idea">${Glyphs.arrowRight(14)}<span>Create</span></button>
      </div>
    </div>
  `;
}
