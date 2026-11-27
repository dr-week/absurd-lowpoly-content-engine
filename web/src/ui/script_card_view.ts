import type { CompiledScript } from '../engine/script/script_compiler.ts';
import { uiGlyphs } from './glyphs.ts';

export type CopyMode = 'clean' | 'rehearsal' | 'json';

function copyPayload(script: CompiledScript, mode: CopyMode): string {
  if (mode === 'clean') return script.cleanText;
  if (mode === 'rehearsal') return script.rehearsalText;
  return JSON.stringify(script, null, 2);
}

export function renderScriptCardView(
  script: CompiledScript,
  selectedBeatIdx = 0,
  onSelectBeat?: (idx: number) => void,
  onToast?: (msg: string) => void,
): HTMLElement {
  const card = document.createElement('div');
  card.className = 'card-subpanel script-card-view';

  const header = document.createElement('div');
  header.className = 'script-card-header';

  const title = document.createElement('h3');
  title.className = 'script-card-title';
  title.textContent = script.title;

  const actions = document.createElement('div');
  actions.className = 'script-copy-actions';

  const modes: Array<{ id: CopyMode; label: string }> = [
    { id: 'clean', label: 'Clean' },
    { id: 'rehearsal', label: 'Rehearsal' },
    { id: 'json', label: 'JSON' },
  ];

  for (const m of modes) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn';
    const labelSpan = document.createElement('span');
    labelSpan.textContent = m.label;
    btn.append(uiGlyphs.copy(13), labelSpan);
    btn.addEventListener('click', async () => {
      const text = copyPayload(script, m.id);
      if (navigator.clipboard) await navigator.clipboard.writeText(text);
      onToast?.(`Copied ${m.label} script`);
      btn.replaceChildren(uiGlyphs.check(13), Object.assign(document.createElement('span'), { textContent: 'Copied' }));
      setTimeout(() => {
        btn.replaceChildren(uiGlyphs.copy(13), Object.assign(document.createElement('span'), { textContent: m.label }));
      }, 1200);
    });
    actions.appendChild(btn);
  }

  header.append(title, actions);

  const beatsList = document.createElement('div');
  beatsList.className = 'script-beats-list';

  script.beats.forEach((beat, idx) => {
    const row = document.createElement('div');
    row.className = `script-beat-row${idx === selectedBeatIdx ? ' is-selected' : ''}`;
    row.title = 'Click to preview this beat inside the 9:16 Safe-Zone frame';
    row.addEventListener('click', () => onSelectBeat?.(idx));

    const meta = document.createElement('div');
    meta.className = 'script-beat-meta';
    const leftMeta = document.createElement('span');
    leftMeta.textContent = beat.label;
    const rightMeta = document.createElement('span');
    rightMeta.textContent = `${beat.estimatedSec}s · ${beat.wordCount}w`;
    meta.append(leftMeta, rightMeta);

    const body = document.createElement('p');
    body.className = 'script-beat-text';
    body.textContent = beat.text;

    const chips = document.createElement('div');
    chips.className = 'script-cue-chips';
    for (const cue of beat.cues) {
      const chip = document.createElement('span');
      const accent = cue.type === 'PAUSE' || cue.type === 'BEAT' ? 'pill--accent' : cue.type === 'CAMERA' ? 'pill--positive' : '';
      chip.className = `pill ${accent}`.trim();
      chip.textContent = cue.value ? `${cue.type}: ${cue.value}` : cue.type;
      chips.appendChild(chip);
    }

    row.append(meta, body, chips);
    beatsList.appendChild(row);
  });

  card.append(header, beatsList);
  return card;
}
