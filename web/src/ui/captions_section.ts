import { buildGrowthMarketingPack, PLATFORM_OPTIONS } from '../engine/marketing_growth';
import { buildReelOverlays } from '../engine/reel_overlays';
import { Glyphs } from '../glyphs';
import type { GeneratedPrompts, MarketingPlatform, ScoredTopic } from '../types';
import { esc } from './escape';

export function renderCaptionsSection(
  topic: ScoredTopic | undefined,
  prompts: GeneratedPrompts | null,
  copiedTarget: string | null,
  platform: MarketingPlatform = 'reels',
  brandProduct = '',
): string {
  if (!topic || !prompts) {
    return `
      <section class="section-card zuari-surface-elevated" id="section-captions">
        <div class="section-header">
          <div class="section-header__title-group"><span class="section-header__step">03</span><h2>Growth, Hooks &amp; Captions</h2></div>
        </div>
        <div class="empty-state">Select a topic above to unlock A/B hooks, native Reels overlays, DM-share triggers &amp; stealth brand cameos</div>
      </section>
    `;
  }

  const pack = buildGrowthMarketingPack(topic, platform, brandProduct);
  const overlays = buildReelOverlays(topic).slice(0, 4);
  const platTabs = PLATFORM_OPTIONS.map(
    (p) => `<button type="button" class="pill ${platform === p.id ? 'pill--accent' : ''}" data-action="pick-platform" data-platform="${p.id}" style="cursor:pointer;">${esc(p.label)}</button>`,
  ).join('');

  const hookRows = pack.hooks
    .map(
      (h) => `
        <div class="caption-row">
          <span class="pill">Hook ${h.variant} · ${esc(h.angle)}</span>
          <span class="caption-row__text">${esc(h.text)}</span>
          <button type="button" class="btn btn--icon" data-action="copy-text" data-copy-id="hook-${h.variant}" data-text="${esc(h.text)}" title="Copy Hook ${h.variant}">${copiedTarget === `hook-${h.variant}` ? Glyphs.check(14) : Glyphs.copy(14)}</button>
        </div>
      `,
    )
    .join('');

  const overlayRows = overlays
    .map(
      (o) => `
        <div class="caption-row">
          <span class="pill pill--accent">${esc(o.label)}</span>
          <span class="caption-row__text">${esc(o.topText)}</span>
          <button type="button" class="btn btn--icon" data-action="copy-text" data-copy-id="ov-${o.id}" data-text="${esc(o.topText)}" title="${esc(o.editorNote)}">${copiedTarget === `ov-${o.id}` ? Glyphs.check(14) : Glyphs.copy(14)}</button>
        </div>
      `,
    )
    .join('');

  const growthRows = `
    <div class="caption-row">
      <span class="pill pill--positive">DM Share</span>
      <span class="caption-row__text">${esc(pack.dmShareTrigger)}</span>
      <button type="button" class="btn btn--icon" data-action="copy-text" data-copy-id="dm-share" data-text="${esc(pack.dmShareTrigger)}" title="Copy DM Share Trigger">${copiedTarget === 'dm-share' ? Glyphs.check(14) : Glyphs.copy(14)}</button>
    </div>
    <div class="caption-row">
      <span class="pill">Comment Trap</span>
      <span class="caption-row__text">${esc(pack.pinnedCommentTrap)}</span>
      <button type="button" class="btn btn--icon" data-action="copy-text" data-copy-id="pin-trap" data-text="${esc(pack.pinnedCommentTrap)}" title="Copy Pinned Comment">${copiedTarget === 'pin-trap' ? Glyphs.check(14) : Glyphs.copy(14)}</button>
    </div>
  `;

  const brandBlock = pack.brandPlacement
    ? `<div class="caption-row"><span class="pill pill--positive">Stealth Cameo</span><span class="caption-row__text">${esc(pack.brandPlacement.propLine)}</span><button type="button" class="btn btn--icon" data-action="copy-text" data-copy-id="brand-prop" data-text="${esc(pack.brandPlacement.propLine)}" title="Copy Prop Direction">${copiedTarget === 'brand-prop' ? Glyphs.check(14) : Glyphs.copy(14)}</button></div>`
    : '';

  const tagsStr = pack.platformPost.hashtags.join(' ');
  const tagPills = pack.platformPost.hashtags.map((t) => `<span class="pill pill--accent">${esc(t)}</span>`).join('');

  return `
    <section class="section-card zuari-surface-elevated" id="section-captions">
      <div class="section-header">
        <div class="section-header__title-group"><span class="section-header__step">03</span><h2>Growth, Overlays &amp; Captions</h2></div>
        <div class="section-header__actions">
          <div class="vote-group">${platTabs}</div>
          <button type="button" class="btn" data-action="copy-text" data-copy-id="tags" data-text="${esc(tagsStr)}" title="Copy Hashtags">${copiedTarget === 'tags' ? Glyphs.check(14) : Glyphs.copy(14)}<span>Tags</span></button>
          <button type="button" class="btn btn--primary" data-action="copy-text" data-copy-id="cap-all" data-text="${esc(pack.platformPost.fullCopy)}" title="Copy Ready ${esc(pack.platformPost.label)} Post">${copiedTarget === 'cap-all' ? Glyphs.check(14) : Glyphs.copy(14)}<span>Copy ${esc(pack.platformPost.label)}</span></button>
        </div>
      </div>
      <div class="control-tray__row">
        <span class="control-tray__label">Sponsor</span>
        <input type="text" id="brand-product-input" class="compact-input" style="flex:1; min-width:180px; width:auto;" placeholder="Optional: type your product/app for stealth comedy placement..." value="${esc(brandProduct)}" />
      </div>
      <div class="caption-list">${hookRows}${overlayRows}${growthRows}${brandBlock}</div>
      <div class="hashtag-strip">${tagPills}</div>
    </section>
  `;
}
