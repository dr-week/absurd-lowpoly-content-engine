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
          const outcomeRow = item.generated
            ? `<div class="trend-strip" style="margin-top:6px;">
                <button type="button" class="pill ${item.outcome === 'flop' ? 'pill--accent' : ''}" data-action="set-outcome" data-id="${esc(t.id)}" data-outcome="flop">Flop</button>
                <button type="button" class="pill ${item.outcome === 'good' ? 'pill--accent' : ''}" data-action="set-outcome" data-id="${esc(t.id)}" data-outcome="good">Good</button>
                <button type="button" class="pill ${item.outcome === 'viral' ? 'pill--positive' : ''}" data-action="set-outcome" data-id="${esc(t.id)}" data-outcome="viral">Viral</button>
              </div>`
            : '';
          return `
            <article class="topic-card ${selected ? 'is-selected' : ''} is-liked">
              <div class="topic-card__body">
                <div class="topic-card__top">
                  <span class="topic-card__tag">${esc(t.brand)}</span>
                  ${statusPill}
                </div>
                <h3 class="topic-card__title">${esc(t.title)}</h3>
                <p class="topic-card__pitch">${esc(t.pitch)}</p>
                ${outcomeRow}
              </div>
              <div class="topic-card__footer">
                <div class="vote-group">
                  <button type="button" class="vote-btn" data-action="remove-saved" data-id="${esc(t.id)}" title="Remove">${Glyphs.close(14)}</button>
                  ${item.generated ? `<button type="button" class="btn" data-action="sequel-saved" data-id="${esc(t.id)}" title="Create Part 2 Sequel">Part 2</button>` : ''}
                </div>
                <button type="button" class="btn ${selected ? 'btn--primary' : ''}" data-action="select-saved" data-id="${esc(t.id)}" title="${item.generated ? 'View Prompts' : 'Generate Prompts'}">
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
          ${saved.length >= 2 ? `<button type="button" class="btn btn--primary" data-action="make-mashup" title="Fuse 2 Saved topics into a Crossover Episode">${Glyphs.sparkle(14)}<span>Mashup</span></button>` : ''}
          ${saved.length ? `<button type="button" class="btn btn--icon" data-action="export-saved-md" title="Export Saved Pack (.md)">${Glyphs.download(14)}</button>` : ''}
        </div>
      </div>
      <div class="topics-grid">${cards}</div>
    </section>
  `;
}
