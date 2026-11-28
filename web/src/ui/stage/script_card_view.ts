import type { CompiledScript } from '../../engine/script/script_compiler.ts';
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
    const btn = Object.assign(document.createElement('button'), { type: 'button', className: 'btn' });
    btn.innerHTML = `${uiGlyphs.copy()}<span>${m.label}</span>`;
    btn.addEventListener('click', async () => {
      await navigator.clipboard?.writeText(copyPayload(script, m.id));
      onToast?.(`Copied ${m.label} script`);
      btn.innerHTML = `${uiGlyphs.check()}<span>Copied</span>`;
      setTimeout(() => { btn.innerHTML = `${uiGlyphs.copy()}<span>${m.label}</span>`; }, 1200);
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
    meta.append(
      Object.assign(document.createElement('span'), { textContent: beat.label }),
      Object.assign(document.createElement('span'), { textContent: `${beat.actualSec}s · ${beat.wordCount}w` }),
    );

    const chips = Object.assign(document.createElement('div'), { className: 'script-cue-chips' });
    if (beat.visualCue) {
      chips.appendChild(Object.assign(document.createElement('span'), {
        className: 'pill pill--positive',
        textContent: beat.visualCue,
      }));
    }

    row.append(meta, Object.assign(document.createElement('p'), { className: 'script-beat-text', textContent: beat.spokenText }), chips);
    beatsList.appendChild(row);
  });

  card.append(header, beatsList);
  return card;
}
