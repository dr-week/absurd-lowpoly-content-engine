import { renderGlyph } from './glyphs';

export type SafeZonePlatform = 'reels' | 'tiktok' | 'shorts';

export function renderSafeZoneView(platform: SafeZonePlatform, previewText: string): string {
  const labels: Record<SafeZonePlatform, string> = {
    reels: 'IG Reels 9:16',
    tiktok: 'TikTok 9:16',
    shorts: 'YT Shorts 9:16',
  };

  return `<div class="safe-zone-card">
    <div class="safe-zone-toolbar">
      <span class="safe-zone-title">${renderGlyph('shield')} ${labels[platform]}</span>
      <div class="safe-zone-tabs" role="tablist">
        <button type="button" class="sz-tab ${platform === 'reels' ? 'is-active' : ''}" data-sz="reels">Reels</button>
        <button type="button" class="sz-tab ${platform === 'tiktok' ? 'is-active' : ''}" data-sz="tiktok">TikTok</button>
        <button type="button" class="sz-tab ${platform === 'shorts' ? 'is-active' : ''}" data-sz="shorts">Shorts</button>
      </div>
    </div>
    <div class="safe-zone-frame is-${platform}">
      <div class="sz-top-danger">Status / Camera Notch</div>
      <div class="sz-safe-center">${previewText}</div>
      <div class="sz-right-rail">Likes / Share</div>
      <div class="sz-bottom-danger">Captions &amp; Audio Bar</div>
    </div>
  </div>`;
}
