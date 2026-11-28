import type { CompiledScript } from '../../engine/script/script_compiler.ts';
import { countSpokenWords, estimateSpokenSeconds } from '../../engine/script/pacing_calc.ts';
import { uiGlyphs } from '../glyphs.ts';

export type CopyMode = 'clean' | 'rehearsal' | 'json';

function copyPayload(script: CompiledScript, mode: CopyMode): string {
  if (mode === 'clean') return script.beats.map((b) => b.spokenText).join('\n\n');
  if (mode === 'rehearsal') return script.rehearsalText ?? script.beats.map((b) => `[${b.label}] ${b.spokenText}`).join('\n\n');
  return JSON.stringify(script, null, 2);
}

export function renderScriptCardView(
  script: CompiledScript,
  selectedBeatIdx = 0,
  onSelectBeat?: (idx: number) => void,
  onToast?: (msg: string) => void,
  onBeatEdit?: () => void,
): HTMLElement {
  const card = Object.assign(document.createElement('div'), { className: 'card-subpanel script-card-view' });
  const header = Object.assign(document.createElement('div'), { className: 'script-card-header' });
  const title = Object.assign(document.createElement('h3'), { className: 'script-card-title', textContent: script.title });
  const actions = Object.assign(document.createElement('div'), { className: 'script-copy-actions' });

  const modes: Array<{ id: CopyMode; label: string }> = [
    { id: 'clean', label: 'Clean' },
    { id: 'rehearsal', label: 'Rehearsal' },
    { id: 'json', label: 'JSON' },
  ];

  for (const m of modes) {
    const btn = Object.assign(document.createElement('button'), { type: 'button', className: 'btn copy-btn' });
    btn.innerHTML = `${uiGlyphs.copy()}<span>${m.label}</span>`;
    btn.addEventListener('click', async () => {
      await navigator.clipboard?.writeText(copyPayload(script, m.id));
      onToast?.(`Copied ${m.label} script`);
      btn.classList.add('is-copied');
      btn.innerHTML = `${uiGlyphs.check()}<span>Copied!</span>`;
      setTimeout(() => {
        btn.classList.remove('is-copied');
        btn.innerHTML = `${uiGlyphs.copy()}<span>${m.label}</span>`;
      }, 1500);
    });
    actions.appendChild(btn);
  }
  header.append(title, actions);

  const beatsList = Object.assign(document.createElement('div'), { className: 'script-beats-list' });
  script.beats.forEach((beat, idx) => {
    const row = Object.assign(document.createElement('div'), {
      className: `script-beat-row${idx === selectedBeatIdx ? ' is-selected' : ''}`,
      title: 'Click to preview this beat inside the 9:16 Safe-Zone frame',
    });
    row.addEventListener('click', () => onSelectBeat?.(idx));

    const meta = Object.assign(document.createElement('div'), { className: 'script-beat-meta' });
    const timingSpan = Object.assign(document.createElement('span'), { textContent: `${beat.actualSec}s · ${beat.wordCount}w` });
    meta.append(
      Object.assign(document.createElement('span'), { textContent: beat.label }),
      timingSpan,
    );

    const chips = Object.assign(document.createElement('div'), { className: 'script-cue-chips' });
    if (beat.visualCue) {
      chips.appendChild(Object.assign(document.createElement('span'), {
        className: 'pill pill--positive cue-chip',
        textContent: beat.visualCue,
      }));
    }

    const editor = Object.assign(document.createElement('textarea'), {
      className: 'script-beat-editor',
      value: beat.spokenText,
      rows: 2,
      ariaLabel: `${beat.label} spoken text`,
    });
    editor.addEventListener('click', (ev) => ev.stopPropagation());
    editor.addEventListener('input', () => {
      beat.spokenText = editor.value;
      beat.wordCount = countSpokenWords(beat.spokenText);
      beat.actualSec = estimateSpokenSeconds(beat.spokenText);
      timingSpan.textContent = `${beat.actualSec}s · ${beat.wordCount}w`;
      script.totalWords = script.beats.reduce((acc, b) => acc + b.wordCount, 0);
      script.totalSec = Number(script.beats.reduce((acc, b) => acc + b.actualSec, 0).toFixed(1));
      script.wordCount = script.totalWords;
      script.totalDurationSec = script.totalSec;
      onBeatEdit?.();
    });

    row.append(meta, editor, chips);
    beatsList.appendChild(row);
  });

  card.append(header, beatsList);
  return card;
}
