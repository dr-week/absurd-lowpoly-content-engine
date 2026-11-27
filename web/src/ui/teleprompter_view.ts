import { parsePauseSeconds } from '../engine/script/pacing_calc.ts';
import type { CompiledScript } from '../engine/script/script_compiler.ts';
import { uiGlyphs } from './glyphs.ts';

export function renderTeleprompterView(script: CompiledScript): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'teleprompter-panel';

  let isPlaying = false;
  let isMirrored = false;
  let wpm = Math.max(100, script.effectiveWpm || 138);
  let rafId = 0;
  let lastTs = 0;

  const controls = document.createElement('div');
  controls.className = 'teleprompter-controls';

  const playBtn = document.createElement('button');
  playBtn.type = 'button';
  playBtn.className = 'teleprompter-btn';
  playBtn.append(uiGlyphs.play(), document.createTextNode(' Play'));

  const mirrorBtn = document.createElement('button');
  mirrorBtn.type = 'button';
  mirrorBtn.className = 'teleprompter-btn';
  mirrorBtn.append(uiGlyphs.mirror(), document.createTextNode(' Mirror'));

  const wpmLabel = document.createElement('label');
  wpmLabel.className = 'teleprompter-wpm';
  wpmLabel.textContent = `WPM: ${wpm} `;
  const wpmInput = document.createElement('input');
  wpmInput.type = 'range';
  wpmInput.min = '90';
  wpmInput.max = '200';
  wpmInput.value = String(wpm);
  wpmInput.addEventListener('input', () => {
    wpm = Number(wpmInput.value);
    wpmLabel.firstChild!.textContent = `WPM: ${wpm} `;
  });
  wpmLabel.appendChild(wpmInput);

  const pauseBadge = document.createElement('span');
  pauseBadge.className = 'teleprompter-pause-badge';
  const totalPause = parsePauseSeconds(script.rehearsalText);
  pauseBadge.textContent = `Pauses: ${totalPause}s`;

  controls.append(playBtn, mirrorBtn, wpmLabel, pauseBadge);

  const viewport = document.createElement('div');
  viewport.className = 'teleprompter-viewport';

  const eyeline = document.createElement('div');
  eyeline.className = 'teleprompter-eyeline';

  const scroller = document.createElement('div');
  scroller.className = 'teleprompter-scroller';
  scroller.textContent = script.rehearsalText;

  viewport.append(eyeline, scroller);

  const tick = (ts: number) => {
    if (!isPlaying) return;
    if (lastTs > 0) {
      const dt = (ts - lastTs) / 1000;
      const pxPerSec = (wpm / 60) * 18;
      viewport.scrollTop += pxPerSec * dt;
    }
    lastTs = ts;
    rafId = requestAnimationFrame(tick);
  };

  playBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    playBtn.replaceChildren(
      isPlaying ? uiGlyphs.pause() : uiGlyphs.play(),
      document.createTextNode(isPlaying ? ' Pause' : ' Play')
    );
    if (isPlaying) {
      lastTs = 0;
      rafId = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(rafId);
    }
  });

  mirrorBtn.addEventListener('click', () => {
    isMirrored = !isMirrored;
    scroller.classList.toggle('is-mirrored', isMirrored);
    mirrorBtn.classList.toggle('is-active', isMirrored);
  });

  wrap.append(controls, viewport);
  return wrap;
}
