import { getHookLabel, getSituationLabel, HOOK_CATEGORIES, SITUATION_CATEGORIES } from '../engine/taxonomy';
import { getVote } from '../engine/telemetry';
import { Glyphs } from '../glyphs';
import type { GeneratedPrompts, HookCategory, RatingLogEntry, ScoredTopic, SituationCategory } from '../types';
import { esc } from './escape';
import { renderViralPackagingCard } from './packaging_card';

function renderCodeRow(kind: 'storyboard' | 'video', label: string, meta: string, content: string, vote: 'up' | 'down' | null, copied: boolean): string {
  return `
    <div class="prompt-row">
      <div class="code-block-card">
        <div class="code-block-card__header">
          <span class="code-block-card__label">${esc(label)}</span>
          <span class="code-block-card__meta">${esc(meta)}</span>
        </div>
        <pre id="code-${kind}">${esc(content)}</pre>
      </div>
      <aside class="side-rail" aria-label="Rate ${kind}">
        <button type="button" class="vote-btn ${vote === 'up' ? 'is-up' : ''}" data-action="vote-prompt" data-kind="${kind}" data-vote="up" title="Good ${kind}">${Glyphs.thumbsUp(16)}</button>
        <button type="button" class="vote-btn ${vote === 'down' ? 'is-down' : ''}" data-action="vote-prompt" data-kind="${kind}" data-vote="down" title="Weak ${kind}">${Glyphs.thumbsDown(16)}</button>
        <button type="button" class="vote-btn" data-action="copy-prompt" data-kind="${kind}" title="Copy">${copied ? Glyphs.check(16) : Glyphs.copy(16)}</button>
      </aside>
    </div>
  `;
}

export function renderStudioView(params: {
  topics: ScoredTopic[];
  logs: RatingLogEntry[];
  generatedIds: Set<string>;
  selectedId: string | null;
  activeTopic?: ScoredTopic;
  prompts: GeneratedPrompts | null;
  loadingTopics: boolean;
  loading: boolean;
  seedQuery: string;
  hookFilter: HookCategory | 'all';
  situationFilter: SituationCategory | 'all';
  liveTrends: string[];
  copiedTarget: 'storyboard' | 'video' | 'packaging' | null;
}): string {
  const { topics, logs, generatedIds, selectedId, activeTopic, prompts, loadingTopics, loading, seedQuery, hookFilter, situationFilter, liveTrends, copiedTarget } = params;

  const hookOpts = ['<option value="all">All Hooks</option>', ...HOOK_CATEGORIES.map((h) => `<option value="${h.id}" ${hookFilter === h.id ? 'selected' : ''}>${esc(h.label)}</option>`)].join('');
  const sitOpts = ['<option value="all">All Situations</option>', ...SITUATION_CATEGORIES.map((s) => `<option value="${s.id}" ${situationFilter === s.id ? 'selected' : ''}>${esc(s.label)}</option>`)].join('');

  const trendChips = liveTrends.length
    ? `<div class="trend-strip">${liveTrends
        .slice(0, 6)
        .map((kw) => `<button type="button" class="pill ${seedQuery === kw ? 'pill--accent' : ''}" data-action="pick-trend" data-trend="${esc(kw)}" title="Toggle live trend">${esc(kw)}</button>`)
        .join('')}</div>`
    : '';

  const cards = loadingTopics
    ? '<div class="empty-state" style="grid-column:1/-1;">Generating 8 fresh AI topics...</div>'
    : topics
        .map((t) => {
          const vote = getVote(logs, 'topic', t.id);
          const selected = selectedId === t.id;
          const isGen = generatedIds.has(t.id);
          const cls = ['topic-card', selected ? 'is-selected' : '', vote === 'up' ? 'is-liked' : '', vote === 'down' ? 'is-disliked' : ''].filter(Boolean).join(' ');
          return `
            <article class="${cls}">
              <div class="topic-card__body">
                <div class="topic-card__top">
                  <span class="topic-card__tag">${esc(getHookLabel(t.hookCategory))} · ${esc(getSituationLabel(t.situationCategory))}</span>
                  <div class="vote-group">
                    ${isGen ? `<span class="pill pill--positive" title="Generated">${Glyphs.check(11)}</span>` : ''}
                    <span class="pill pill--accent" title="Viral score">${t.viralScore}</span>
                  </div>
                </div>
                <h3 class="topic-card__title">${esc(t.title)}</h3>
                <p class="topic-card__pitch">${esc(t.pitch)}</p>
              </div>
              <div class="topic-card__footer">
                <div class="vote-group">
                  <button type="button" class="vote-btn ${vote === 'up' ? 'is-up' : ''}" data-action="vote-topic" data-id="${esc(t.id)}" data-vote="up" title="Save">${Glyphs.thumbsUp(15)}</button>
                  <button type="button" class="vote-btn ${vote === 'down' ? 'is-down' : ''}" data-action="vote-topic" data-id="${esc(t.id)}" data-vote="down" title="Dislike">${Glyphs.thumbsDown(15)}</button>
                </div>
                <button type="button" class="btn ${selected ? 'btn--primary' : ''}" data-action="select-topic" data-id="${esc(t.id)}" title="Generate Prompts">${Glyphs.arrowRight(15)}</button>
              </div>
            </article>
          `;
        })
        .join('');

  let promptBody = '<div class="empty-state">Select a topic above</div>';
  if (loading) {
    promptBody = '<div class="empty-state">Generating...</div>';
  } else if (prompts) {
    const sbVote = getVote(logs, 'storyboard', prompts.topicId);
    const vidVote = getVote(logs, 'video', prompts.topicId);
    promptBody = `
      <div class="prompt-stack">
        ${renderCodeRow('storyboard', 'Storyboard (3x2)', prompts.topicTitle, prompts.storyboardPrompt, sbVote, copiedTarget === 'storyboard')}
        ${renderCodeRow('video', 'Video Prompt', 'No time / No size', prompts.videoPrompt, vidVote, copiedTarget === 'video')}
        ${renderViralPackagingCard(activeTopic, prompts, copiedTarget === 'packaging')}
      </div>
    `;
  }

  return `
    <section class="section-card zuari-surface-elevated" id="section-topics">
      <div class="section-header">
        <div class="section-header__title-group">
          <span class="section-header__step">01</span>
          <h2>Topics</h2>
        </div>
        <div class="section-header__actions">
          <select id="filter-hook" class="compact-select" aria-label="Hook category">${hookOpts}</select>
          <select id="filter-situation" class="compact-select" aria-label="Situation category">${sitOpts}</select>
          <input type="text" id="seed-input" class="compact-input" placeholder="Brand or topic..." value="${esc(seedQuery)}" />
          <button type="button" class="btn btn--primary btn--icon" data-action="regenerate-topics" title="8 New Topics">${Glyphs.refresh(15)}</button>
        </div>
      </div>
      ${trendChips}
      <div class="topics-grid">${cards}</div>
    </section>

    <section class="section-card zuari-surface-elevated" id="section-prompts">
      <div class="section-header">
        <div class="section-header__title-group">
          <span class="section-header__step">02</span>
          <h2>Prompts</h2>
        </div>
        ${
          prompts
            ? `<div class="section-header__actions">
                <button type="button" class="btn" data-action="reroll-rig" title="Swap 1998 Camera & Lighting Rig">${Glyphs.refresh(14)}<span>Camera</span></button>
                <button type="button" class="btn" data-action="reroll-punchline" title="Try Alternate Shot 6 Punchline">${Glyphs.sparkle(14)}<span>Punchline</span></button>
                <button type="button" class="btn btn--primary" data-action="make-sequel" title="Generate Part 2 Callback Sequel">${Glyphs.arrowRight(14)}<span>Part 2</span></button>
              </div>`
            : ''
        }
      </div>
      ${promptBody}
    </section>
  `;
}
