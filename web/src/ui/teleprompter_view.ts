import { renderGlyph } from './glyphs';

export interface TeleprompterState {
  wpm: number;
  mirrored: boolean;
  playing: boolean;
  pauseCountdownSec: number;
}

export function highlightPauseTokens(text: string): string {
  return text.replace(
    /(\[PAUSE\s*-\s*\d+s\])/gi,
    '<span class="tp-pause-badge">$1</span>',
  );
}

export function renderTeleprompterView(
  state: TeleprompterState,
  scriptText: string,
): string {
  const countdownHtml =
    state.pauseCountdownSec > 0
      ? `<div class="tp-pause-overlay">HOLD ${state.pauseCountdownSec}s</div>`
      : '';

  return `<div class="teleprompter-card ${state.mirrored ? 'is-mirrored' : ''}">
    <div class="tp-toolbar">
      <button type="button" class="tp-btn" id="tp-play-btn">
        ${renderGlyph(state.playing ? 'pause' : 'play')}
        <span>${state.playing ? 'Pause' : 'Roll'}</span>
      </button>
      <label class="tp-wpm-control">
        <span>${state.wpm} WPM</span>
        <input type="range" id="tp-wpm-range" min="110" max="180" step="5" value="${state.wpm}" />
      </label>
      <button type="button" class="tp-btn ${state.mirrored ? 'is-active' : ''}" id="tp-mirror-btn">
        ${renderGlyph('mirror')} <span>Mirror</span>
      </button>
    </div>
    <div class="tp-viewport" id="tp-viewport">
      <div class="tp-eyeline-band" aria-hidden="true"></div>
      ${countdownHtml}
      <div class="tp-scroll-text" id="tp-scroll-text">
        ${highlightPauseTokens(scriptText)}
      </div>
    </div>
  </div>`;
}
