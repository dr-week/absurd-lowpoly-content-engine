import { VISUAL_STYLE_OPTIONS } from '../engine/prompt_renderer';
import { getHookLabel, HOOK_CATEGORIES, SITUATION_CATEGORIES } from '../engine/taxonomy';
import { getVote } from '../engine/telemetry';
import { getVisualStyleMeta } from '../engine/visual_styles';
import { Glyphs } from '../glyphs';
import type { GeneratedPrompts, HookCategory, RatingLogEntry, ScoredTopic, SituationCategory, VisualStyle } from '../types';
import { renderCaptionsSection } from './captions_section';
import { renderCustomIdeaBar } from './custom_bar';
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
  topics: ScoredTopic[]; logs: RatingLogEntry[]; generatedIds: Set<string>;
  selectedId: string | null; activeTopic?: ScoredTopic; prompts: GeneratedPrompts | null;
  visualStyle: VisualStyle; loadingTopics: boolean; loading: boolean;
  seedQuery: string; customDraft: string; hookFilter: HookCategory | 'all';
  situationFilter: SituationCategory | 'all'; liveTrends: string[]; copiedTarget: string | null;
}): string {
  const { topics, logs, generatedIds, selectedId, activeTopic, prompts, visualStyle, loadingTopics, loading, seedQuery, customDraft, hookFilter, situationFilter, liveTrends, copiedTarget } = params;

  const hookOpts = ['<option value="all">All Hooks</option>', ...HOOK_CATEGORIES.map((h) => `<option value="${h.id}" ${hookFilter === h.id ? 'selected' : ''}>${esc(h.label)}</option>`)].join('');
  const sitOpts = ['<option value="all">All Situations</option>', ...SITUATION_CATEGORIES.map((s) => `<option value="${s.id}" ${situationFilter === s.id ? 'selected' : ''}>${esc(s.label)}</option>`)].join('');
  const styleOpts = VISUAL_STYLE_OPTIONS.map((v) => `<option value="${v.id}" ${visualStyle === v.id ? 'selected' : ''}>${esc(v.label)}</option>`).join('');

  const trendChips = liveTrends.length
    ? `<div class="trend-strip">${liveTrends
        .slice(0, 6)
        .map((kw) => `<button type="button" class="pill ${seedQuery === kw ? 'pill--accent' : ''}" data-action="pick-trend" data-trend="${esc(kw)}" title="Toggle live trend">${esc(kw)}</button>`)
        .join('')}</div>`
    : '';

  const catRail = `<div class="cat-rail" role="tablist" aria-label="Content Type Gradients">
    <button type="button" class="cat-pill ${hookFilter === 'all' ? 'is-active' : ''}" data-action="pick-hook" data-hook="all"><span class="cat-pill__dot"></span>All Types</button>
    ${HOOK_CATEGORIES.map((c) => `<button type="button" class="cat-pill ${hookFilter === c.id ? 'is-active' : ''}" data-action="pick-hook" data-hook="${c.id}"><span class="cat-pill__dot"></span>${esc(c.label)}</button>`).join('')}
  </div>`;

  const cards = loadingTopics
    ? '<div class="empty-state" style="grid-column:1/-1;">Generating 8 fresh AI topics...</div>'
    : topics
        .map((t) => {
          const vote = getVote(logs, 'topic', t.id);
          const selected = selectedId === t.id;
          const isGen = generatedIds.has(t.id);
          const styleBadge = getVisualStyleMeta(t.visualStyle).badge;
          const cls = ['topic-card', selected ? 'is-selected' : '', vote === 'up' ? 'is-liked' : '', vote === 'down' ? 'is-disliked' : ''].filter(Boolean).join(' ');
          return `
            <article class="${cls}" data-hook="${esc(t.hookCategory)}" data-situation="${esc(t.situationCategory)}">
              <div class="topic-card__body">
                <div class="topic-card__top">
                  <span class="topic-card__tag">${esc(getHookLabel(t.hookCategory))} · ${esc(styleBadge)}</span>
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
      <div class="remix-bar">
        <span class="remix-bar__label">Remix Lab</span>
        <button type="button" class="btn" data-action="reroll-voice" title="Swap Multi-Voice Cast & NPC Dialogue Ensemble">${Glyphs.mic(14)}<span>Voice</span></button><button type="button" class="btn" data-action="reroll-accent" title="Swap Regional Accent & Trending Slang">${Glyphs.fileText(14)}<span>Accent</span></button><button type="button" class="btn" data-action="reroll-twist" title="Swap Expectation-Subversion Twist Blueprint">${Glyphs.shuffle(14)}<span>Twist</span></button>
        <button type="button" class="btn" data-action="reroll-stack" title="Swap Book + Lens + Film Editing Stack">${Glyphs.film(14)}<span>Film</span></button><button type="button" class="btn" data-action="reroll-cast" title="Swap Gender, Profession & Everyday Props">${Glyphs.layers(14)}<span>Cast</span></button>
        <button type="button" class="btn" data-action="reroll-name" title="Cycle Funny Desi Character Name">${Glyphs.user(14)}<span>Name</span></button>
        <button type="button" class="btn" data-action="reroll-rig" title="Swap Camera & Lighting Rig">${Glyphs.camera(14)}<span>Camera</span></button>
        <button type="button" class="btn" data-action="reroll-punchline" title="Try Alternate Shot 6 Punchline">${Glyphs.zap(14)}<span>Punchline</span></button><button type="button" class="btn" data-action="reroll-promo" title="Inject Viral Product Marketing Gimmick">${Glyphs.sparkle(14)}<span>Promo</span></button>
      </div>
      <div class="prompt-stack">
        ${renderCodeRow('storyboard', 'Storyboard (3x2)', prompts.topicTitle, prompts.storyboardPrompt, sbVote, copiedTarget === 'storyboard')}
        ${renderCodeRow('video', 'Video Prompt', '5 Shots · 3 Dialogues', prompts.videoPrompt, vidVote, copiedTarget === 'video')}
        ${renderViralPackagingCard(activeTopic, prompts, copiedTarget === 'packaging')}
      </div>
    `;
  }

  return `
    <section class="section-card zuari-surface-elevated" id="section-topics">
      <div class="section-header">
        <div class="section-header__title-group"><span class="section-header__step">01</span><h2>Topics</h2></div>
        <div class="section-header__actions">
          <select id="filter-hook" class="compact-select" aria-label="Hook category">${hookOpts}</select>
          <select id="filter-situation" class="compact-select" aria-label="Situation category">${sitOpts}</select>
          <input type="text" id="seed-input" class="compact-input" placeholder="Search topic..." value="${esc(seedQuery)}" />
          <button type="button" class="btn btn--primary btn--icon" data-action="regenerate-topics" title="8 New Topics (Shortcut: R)">${Glyphs.refresh(15)}</button>
        </div>
      </div>
      ${trendChips}${catRail}${renderCustomIdeaBar(customDraft)}
      <div class="topics-grid">${cards}</div>
    </section>

    <section class="section-card zuari-surface-elevated" id="section-prompts">
      <div class="section-header">
        <div class="section-header__title-group"><span class="section-header__step">02</span><h2>Prompts</h2></div>
        <div class="section-header__actions">
          <select id="visual-style" class="compact-select" aria-label="Visual Engine Style" title="Switch Visual Engine">${styleOpts}</select>
          ${prompts ? `<button type="button" class="btn" data-action="copy-all" title="Copy Storyboard + Video + Viral Pack">${Glyphs.copy(14)}<span>Copy All</span></button><button type="button" class="btn btn--primary" data-action="make-sequel" title="Generate Part 2 Callback Sequel">${Glyphs.arrowRight(14)}<span>Part 2</span></button>` : ''}
        </div>
      </div>
      ${promptBody}
    </section>${renderCaptionsSection(activeTopic, prompts, copiedTarget)}
  `;
}
