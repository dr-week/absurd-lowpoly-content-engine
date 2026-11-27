import { parsePauseSeconds } from '../engine/script/pacing_calc.ts';
import type { CompiledScript } from '../engine/script/script_compiler.ts';
import { uiGlyphs } from './glyphs.ts';

export function renderTeleprompterView(script: CompiledScript): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'card-subpanel teleprompter-panel';

  let isPlaying = false;
  let isMirrored = false;
  let wpm = Math.max(100, Math.min(200, script.effectiveWpm || 138));
  let rafId = 0;
  let lastTs = 0;

  const controls = document.createElement('div');
  controls.className = 'teleprompter-controls';

  const leftBtns = document.createElement('div');
  leftBtns.className = 'vote-group';

  const playBtn = document.createElement('button');
  playBtn.type = 'button';
  playBtn.className = 'btn btn--primary';
  playBtn.append(uiGlyphs.play(13), Object.assign(document.createElement('span'), { textContent: 'Play' }));

  const resetBtn = document.createElement('button');
  resetBtn.type = 'button';
  resetBtn.className = 'btn btn--icon';
  resetBtn.title = 'Reset scroll to top';
  resetBtn.appendChild(uiGlyphs.reset(14));

  const mirrorBtn = document.createElement('button');
  mirrorBtn.type = 'button';
  mirrorBtn.className = 'btn';
  mirrorBtn.title = 'Flip horizontally for beam-splitter glass';
  mirrorBtn.append(uiGlyphs.mirror(13), Object.assign(document.createElement('span'), { textContent: 'Mirror' }));

  leftBtns.append(playBtn, resetBtn, mirrorBtn);

  const rightMeta = document.createElement('div');
  rightMeta.className = 'vote-group';
  rightMeta.style.alignItems = 'center';

  const wpmLabel = document.createElement('label');
  wpmLabel.className = 'teleprompter-wpm';
  const wpmText = document.createElement('span');
  wpmText.textContent = `${wpm} WPM`;
  const wpmInput = document.createElement('input');
  wpmInput.type = 'range';
  wpmInput.min = '90';
  wpmInput.max = '200';
  wpmInput.value = String(wpm);
  wpmInput.addEventListener('input', () => {
    wpm = Number(wpmInput.value);
    wpmText.textContent = `${wpm} WPM`;
  });
  wpmLabel.append(wpmText, wpmInput);

  const pauseBadge = document.createElement('span');
  pauseBadge.className = 'pill';
  pauseBadge.textContent = `Hold ${parsePauseSeconds(script.rehearsalText)}s`;

  rightMeta.append(wpmLabel, pauseBadge);
  controls.append(leftBtns, rightMeta);

  const viewport = document.createElement('div');
  viewport.className = 'teleprompter-viewport';

  const eyeline = document.createElement('div');
  eyeline.className = 'teleprompter-eyeline';

  const scroller = document.createElement('div');
  scroller.className = 'teleprompter-scroller';
  scroller.textContent = script.rehearsalText;

  viewport.append(eyeline, scroller);

  const stopPlayback = () => {
    isPlaying = false;
    cancelAnimationFrame(rafId);
    playBtn.replaceChildren(
      uiGlyphs.play(13),
      Object.assign(document.createElement('span'), { textContent: 'Play' }),
    );
  };

  const tick = (ts: number) => {
    if (!isPlaying) return;
    if (lastTs > 0) {
      const dt = (ts - lastTs) / 1000;
      viewport.scrollTop += (wpm / 60) * 18 * dt;
      if (viewport.scrollTop + viewport.clientHeight >= viewport.scrollHeight - 2) {
        stopPlayback();
        return;
      }
    }
    lastTs = ts;
    rafId = requestAnimationFrame(tick);
  };

  playBtn.addEventListener('click', () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      isPlaying = true;
      lastTs = 0;
      playBtn.replaceChildren(
        uiGlyphs.pause(13),
        Object.assign(document.createElement('span'), { textContent: 'Pause' }),
      );
      rafId = requestAnimationFrame(tick);
    }
  });

  resetBtn.addEventListener('click', () => {
    stopPlayback();
    viewport.scrollTop = 0;
  });

  mirrorBtn.addEventListener('click', () => {
    isMirrored = !isMirrored;
    scroller.classList.toggle('is-mirrored', isMirrored);
    mirrorBtn.classList.toggle('btn--active', isMirrored);
  });

  wrap.append(controls, viewport);
  return wrap;
}
