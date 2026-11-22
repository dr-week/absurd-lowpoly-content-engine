import { Glyphs } from '../glyphs';
import type { GeneratedPrompts, ScoredTopic } from '../types';
import { getHookLabel } from '../engine/taxonomy';
import { esc } from './escape';

export interface ShortCaptionPack {
  captions: readonly { label: string; text: string }[];
  hashtags: readonly string[];
  allText: string;
}

function cleanTag(raw: string): string {
  const s = raw.replace(/[^a-zA-Z0-9]+/g, '');
  return s ? `#${s.toLowerCase()}` : '#comedy';
}

export function buildShortCaptionPack(topic: ScoredTopic): ShortCaptionPack {
  const shortTitle = topic.title.replace(/^(?:PART\s*\d+|CROSSOVER):\s*/i, '').trim();
  const concise = shortTitle.length > 52 ? `${shortTitle.slice(0, 49).trim()}...` : shortTitle;
  const captions = [
    { label: 'Short Hook', text: `Wait for the ending: ${concise.toLowerCase()}.` },
    { label: 'Deadpan', text: `Nobody expected this to escalate so fast.` },
    { label: 'Question', text: `Would you stay calm or walk away? Comment below.` },
  ] as const;

  const hashtags = Array.from(
    new Set([
      '#shorts',
      '#reels',
      '#comedy',
      '#animation',
      '#plottwist',
      cleanTag(getHookLabel(topic.hookCategory)),
    ]),
  ).slice(0, 6);

  const allText = `${captions[0].text}\n\n${hashtags.join(' ')}`;
  return { captions, hashtags, allText };
}

export function renderCaptionsSection(
  topic: ScoredTopic | undefined,
  prompts: GeneratedPrompts | null,
  copiedTarget: string | null,
): string {
  if (!topic || !prompts) {
    return `
      <section class="section-card zuari-surface-elevated" id="section-captions">
        <div class="section-header">
          <div class="section-header__title-group"><span class="section-header__step">03</span><h2>Captions &amp; Hashtags</h2></div>
        </div>
        <div class="empty-state">Select a topic above to generate short captions &amp; simple hashtags</div>
      </section>
    `;
  }

  const pack = buildShortCaptionPack(topic);
  const rows = pack.captions
    .map(
      (c, i) => `
        <div class="caption-row">
          <span class="pill">${esc(c.label)}</span>
          <span class="caption-row__text">${esc(c.text)}</span>
          <button type="button" class="btn btn--icon" data-action="copy-text" data-copy-id="cap-${i}" data-text="${esc(c.text)}" title="Copy caption">${copiedTarget === `cap-${i}` ? Glyphs.check(14) : Glyphs.copy(14)}</button>
        </div>
      `,
    )
    .join('');

  const tagsStr = pack.hashtags.join(' ');
  const tagPills = pack.hashtags.map((t) => `<span class="pill pill--accent">${esc(t)}</span>`).join('');

  return `
    <section class="section-card zuari-surface-elevated" id="section-captions">
      <div class="section-header">
        <div class="section-header__title-group"><span class="section-header__step">03</span><h2>Captions &amp; Hashtags</h2></div>
        <div class="section-header__actions">
          <button type="button" class="btn" data-action="copy-text" data-copy-id="tags" data-text="${esc(tagsStr)}" title="Copy Hashtags">${copiedTarget === 'tags' ? Glyphs.check(14) : Glyphs.copy(14)}<span>Copy Tags</span></button>
          <button type="button" class="btn btn--primary" data-action="copy-text" data-copy-id="cap-all" data-text="${esc(pack.allText)}" title="Copy Caption + Hashtags">${copiedTarget === 'cap-all' ? Glyphs.check(14) : Glyphs.copy(14)}<span>Copy Ready Post</span></button>
        </div>
      </div>
      <div class="caption-list">${rows}</div>
      <div class="hashtag-strip">${tagPills}</div>
    </section>
  `;
}
