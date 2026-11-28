import type { CompiledScript } from '../../engine/script/script_compiler.ts';
import { uiGlyphs } from '../glyphs.ts';
import type { SafeZonePlatform } from './stage_state.ts';

export function renderSafeZoneView(
  script: CompiledScript,
  beatIdx = 0,
  initialPlatform: SafeZonePlatform = 'reels',
  onPlatformChange?: (p: SafeZonePlatform) => void,
): HTMLElement {
  const container = Object.assign(document.createElement('div'), { className: 'card-subpanel safe-zone-panel' });
  const toolbar = Object.assign(document.createElement('div'), { className: 'safe-zone-toolbar' });

  const heading = Object.assign(document.createElement('span'), { className: 'safe-zone-heading' });
  heading.innerHTML = `${uiGlyphs.frame()}<span>9:16 Safe-Zone HUD</span>`;

  const tabs = Object.assign(document.createElement('div'), { className: 'safe-zone-tabs' });
  const stage = Object.assign(document.createElement('div'), { className: 'safe-zone-stage' });
  const frame = Object.assign(document.createElement('div'), { className: `safe-zone-frame is-${initialPlatform}` });

  const activeBeat = script.beats[beatIdx] ?? script.beats[0];
  frame.append(
    Object.assign(document.createElement('div'), { className: 'safe-zone-dead-top', textContent: 'TOP UI / NOTCH' }),
    Object.assign(document.createElement('div'), { className: 'safe-zone-center', textContent: activeBeat?.spokenText ?? script.topic }),
    Object.assign(document.createElement('div'), { className: 'safe-zone-dead-right', textContent: 'ACTIONS' }),
    Object.assign(document.createElement('div'), { className: 'safe-zone-dead-bottom', textContent: 'CAPTION & AUDIO' }),
  );
  stage.appendChild(frame);

  const platforms: Array<{ id: SafeZonePlatform; label: string }> = [
    { id: 'reels', label: 'Reels' },
    { id: 'tiktok', label: 'TikTok' },
    { id: 'shorts', label: 'Shorts' },
  ];

  for (const p of platforms) {
    const btn = Object.assign(document.createElement('button'), {
      type: 'button',
      className: `pill ${p.id === initialPlatform ? 'pill--accent' : ''}`.trim(),
      textContent: p.label,
    });
    btn.style.cursor = 'pointer';
    btn.addEventListener('click', () => {
      tabs.querySelectorAll('button').forEach((b) => b.classList.remove('pill--accent'));
      btn.classList.add('pill--accent');
      frame.className = `safe-zone-frame is-${p.id}`;
      onPlatformChange?.(p.id);
    });
    tabs.appendChild(btn);
  }

  toolbar.append(heading, tabs);
  container.append(toolbar, stage);
  return container;
}
