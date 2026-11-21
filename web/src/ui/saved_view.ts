import { Glyphs } from '../glyphs';
import type { SavedFilter, SavedItem } from '../types';
import { esc } from './escape';

export function renderSavedView(params: {
  saved: SavedItem[];
  filter: SavedFilter;
  selectedId: string | null;
}): string {
  const { saved, filter, selectedId } = params;
  const doneCount = saved.filter((i) => i.generated).length;
  const pendingCount = saved.length - doneCount;

  const visible = saved.filter((i) => {
    if (filter === 'done') return i.generated;
    if (filter === 'pending') return !i.generated;
    return true;
  });

  const cards = visible.length
    ? visible
        .map((item) => {
          const t = item.topic;
          const selected = selectedId === t.id;
          const statusPill = item.generated
            ? `<span class="pill pill--positive">${Glyphs.check(12)} Done</span>`
            : `<span class="pill">Pending</span>`;
          return `
            <article class="topic-card ${selected ? 'is-selected' : ''} is-liked">
              <div class="topic-card__body">
                <div class="topic-card__top">
                  <span class="topic-card__tag">${esc(t.brand)}</span>
                  ${statusPill}
                </div>
                <h3 class="topic-card__title">${esc(t.title)}</h3>
                <p class="topic-card__pitch">${esc(t.pitch)}</p>
              </div>
              <div class="topic-card__footer">
                <button type="button" class="vote-btn" data-action="remove-saved" data-id="${esc(t.id)}" title="Remove from Saved">
                  ${Glyphs.close(14)}
                </button>
                <button type="button" class="btn ${selected ? 'btn--primary' : ''}" data-action="select-saved" data-id="${esc(t.id)}" title="${item.generated ? 'View or Re-generate Prompts' : 'Generate Prompts'}">
                  ${Glyphs.arrowRight(15)}
                </button>
              </div>
            </article>
          `;
        })
        .join('')
    : `<div class="empty-state" style="grid-column:1/-1;">${
        saved.length === 0 ? 'Tap Thumbs Up on any topic to save it here' : `No ${filter} items`
      }</div>`;

  return `
    <section class="section-card zuari-surface-elevated" id="section-saved">
      <div class="section-header">
        <div class="section-header__title-group">
          <span class="section-header__step">Saved</span>
          <h2>Saved</h2>
        </div>
        <div class="section-header__actions">
          <button type="button" class="pill ${filter === 'all' ? 'pill--accent' : ''}" data-action="saved-filter" data-filter="all">All ${saved.length}</button>
          <button type="button" class="pill ${filter === 'pending' ? 'pill--accent' : ''}" data-action="saved-filter" data-filter="pending">Pending ${pendingCount}</button>
          <button type="button" class="pill ${filter === 'done' ? 'pill--positive' : ''}" data-action="saved-filter" data-filter="done">Done ${doneCount}</button>
        </div>
      </div>
      <div class="topics-grid">${cards}</div>
    </section>
  `;
}
