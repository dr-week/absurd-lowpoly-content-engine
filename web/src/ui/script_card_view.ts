import type { CompiledScript } from '../engine/script/script_compiler.ts';
import { uiGlyphs } from './glyphs.ts';

export type CopyMode = 'clean' | 'rehearsal' | 'json';

function copyPayload(script: CompiledScript, mode: CopyMode): string {
  if (mode === 'clean') return script.cleanText;
  if (mode === 'rehearsal') return script.rehearsalText;
  return JSON.stringify(script, null, 2);
}

export function renderScriptCardView(script: CompiledScript): HTMLElement {
  const card = document.createElement('div');
  card.className = 'script-card-view';

  const header = document.createElement('div');
  header.className = 'script-card-header';

  const title = document.createElement('h3');
  title.className = 'script-card-title';
  title.textContent = script.title;

  const actions = document.createElement('div');
  actions.className = 'script-copy-actions';

  const modes: Array<{ id: CopyMode; label: string }> = [
    { id: 'clean', label: 'Copy Clean' },
    { id: 'rehearsal', label: 'Copy Rehearsal' },
    { id: 'json', label: 'Copy JSON' },
  ];

  for (const m of modes) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'script-copy-btn';
    btn.append(uiGlyphs.copy(), document.createTextNode(` ${m.label}`));
    btn.addEventListener('click', async () => {
      const text = copyPayload(script, m.id);
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      }
      const orig = btn.textContent;
      btn.textContent = 'Copied';
      setTimeout(() => {
        btn.replaceChildren(uiGlyphs.copy(), document.createTextNode(` ${m.label}`));
        void orig;
      }, 1200);
    });
    actions.appendChild(btn);
  }

  header.append(title, actions);

  const beatsList = document.createElement('div');
  beatsList.className = 'script-beats-list';

  for (const beat of script.beats) {
    const row = document.createElement('div');
    row.className = 'script-beat-row';

    const meta = document.createElement('div');
    meta.className = 'script-beat-meta';
    meta.textContent = `${beat.label} (${beat.estimatedSec}s / ${beat.wordCount}w)`;

    const body = document.createElement('p');
    body.className = 'script-beat-text';
    body.textContent = beat.text;

    const chips = document.createElement('div');
    chips.className = 'script-cue-chips';
    for (const cue of beat.cues) {
      const chip = document.createElement('span');
      chip.className = `script-cue-chip is-${cue.type.toLowerCase()}`;
      chip.textContent = cue.value ? `${cue.type}: ${cue.value}` : cue.type;
      chips.appendChild(chip);
    }

    row.append(meta, body, chips);
    beatsList.appendChild(row);
  }

  card.append(header, beatsList);
  return card;
}
