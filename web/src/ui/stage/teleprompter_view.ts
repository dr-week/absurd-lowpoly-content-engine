import { parsePauseSeconds } from '../../engine/script/pacing_calc.ts';
import type { CompiledScript } from '../../engine/script/script_compiler.ts';
import { uiGlyphs } from '../glyphs.ts';

export function renderTeleprompterView(script: CompiledScript): HTMLElement {
  const wrap = Object.assign(document.createElement('div'), { className: 'card-subpanel teleprompter-panel' });
  let isPlaying = false;
  let isMirrored = false;
  let wpm = Math.max(100, Math.min(200, script.effectiveWpm || 138));
  let rafId = 0;
  let lastTs = 0;

  const controls = Object.assign(document.createElement('div'), { className: 'teleprompter-controls' });
  const leftBtns = Object.assign(document.createElement('div'), { className: 'vote-group' });

  const playBtn = Object.assign(document.createElement('button'), { type: 'button', className: 'btn btn--primary' });
  playBtn.append(uiGlyphs.play(13), Object.assign(document.createElement('span'), { textContent: 'Play' }));

  const resetBtn = Object.assign(document.createElement('button'), { type: 'button', className: 'btn btn--icon', title: 'Reset scroll to top' });
  resetBtn.appendChild(uiGlyphs.reset(14));

  const mirrorBtn = Object.assign(document.createElement('button'), { type: 'button', className: 'btn', title: 'Flip horizontally for beam-splitter glass' });
  mirrorBtn.append(uiGlyphs.mirror(13), Object.assign(document.createElement('span'), { textContent: 'Mirror' }));
  leftBtns.append(playBtn, resetBtn, mirrorBtn);

  const rightMeta = Object.assign(document.createElement('div'), { className: 'vote-group' });
  rightMeta.style.alignItems = 'center';

  const wpmLabel = Object.assign(document.createElement('label'), { className: 'teleprompter-wpm' });
  const wpmText = Object.assign(document.createElement('span'), { textContent: `${wpm} WPM` });
  const wpmInput = Object.assign(document.createElement('input'), { type: 'range', min: '90', max: '200', value: String(wpm) });
  wpmInput.addEventListener('input', () => {
    wpm = Number(wpmInput.value);
    wpmText.textContent = `${wpm} WPM`;
  });
  wpmLabel.append(wpmText, wpmInput);

  rightMeta.append(wpmLabel, Object.assign(document.createElement('span'), { className: 'pill', textContent: `Hold ${parsePauseSeconds(script.rehearsalText)}s` }));
  controls.append(leftBtns, rightMeta);

  const viewport = Object.assign(document.createElement('div'), { className: 'teleprompter-viewport' });
  const scroller = Object.assign(document.createElement('div'), { className: 'teleprompter-scroller', textContent: script.rehearsalText });
  viewport.append(Object.assign(document.createElement('div'), { className: 'teleprompter-eyeline' }), scroller);

  const stopPlayback = () => {
    isPlaying = false;
    cancelAnimationFrame(rafId);
    playBtn.replaceChildren(uiGlyphs.play(13), Object.assign(document.createElement('span'), { textContent: 'Play' }));
  };

  const tick = (ts: number) => {
    if (!isPlaying) return;
    if (lastTs > 0) {
      viewport.scrollTop += (wpm / 60) * 18 * ((ts - lastTs) / 1000);
      if (viewport.scrollTop + viewport.clientHeight >= viewport.scrollHeight - 2) return stopPlayback();
    }
    lastTs = ts;
    rafId = requestAnimationFrame(tick);
  };

  playBtn.addEventListener('click', () => {
    if (isPlaying) return stopPlayback();
    isPlaying = true;
    lastTs = 0;
    playBtn.replaceChildren(uiGlyphs.pause(13), Object.assign(document.createElement('span'), { textContent: 'Pause' }));
    rafId = requestAnimationFrame(tick);
  });
  resetBtn.addEventListener('click', () => { stopPlayback(); viewport.scrollTop = 0; });
  mirrorBtn.addEventListener('click', () => {
    isMirrored = !isMirrored;
    scroller.classList.toggle('is-mirrored', isMirrored);
    mirrorBtn.classList.toggle('btn--active', isMirrored);
  });

  wrap.append(controls, viewport);
  return wrap;
}
