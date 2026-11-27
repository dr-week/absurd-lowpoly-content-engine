import type { CompiledScript } from '../engine/script/script_compiler.ts';
import { uiGlyphs } from './glyphs.ts';

export type SafeZonePlatform = 'reels' | 'tiktok' | 'shorts';

export function renderSafeZoneView(
  script: CompiledScript,
  beatIdx = 0,
  initialPlatform: SafeZonePlatform = 'reels',
  onPlatformChange?: (p: SafeZonePlatform) => void,
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'card-subpanel safe-zone-panel';

  const toolbar = document.createElement('div');
  toolbar.className = 'safe-zone-toolbar';

  const heading = document.createElement('span');
  heading.className = 'safe-zone-heading';
  heading.append(uiGlyphs.frame(14), document.createTextNode('9:16 Safe-Zone HUD'));

  const tabs = document.createElement('div');
  tabs.className = 'safe-zone-tabs';

  const stage = document.createElement('div');
  stage.className = 'safe-zone-stage';

  const frame = document.createElement('div');
  frame.className = `safe-zone-frame is-${initialPlatform}`;

  const overlayTop = document.createElement('div');
  overlayTop.className = 'safe-zone-dead-top';
  overlayTop.textContent = 'TOP UI / NOTCH';

  const activeBeat = script.beats[beatIdx] ?? script.beats[0];
  const centerText = document.createElement('div');
  centerText.className = 'safe-zone-center';
  centerText.textContent = activeBeat?.cleanText ?? script.topic;

  const overlayRight = document.createElement('div');
  overlayRight.className = 'safe-zone-dead-right';
  overlayRight.textContent = 'ACTIONS';

  const overlayBottom = document.createElement('div');
  overlayBottom.className = 'safe-zone-dead-bottom';
  overlayBottom.textContent = 'CAPTION & AUDIO';

  frame.append(overlayTop, centerText, overlayRight, overlayBottom);
  stage.appendChild(frame);

  const platforms: Array<{ id: SafeZonePlatform; label: string }> = [
    { id: 'reels', label: 'Reels' },
    { id: 'tiktok', label: 'TikTok' },
    { id: 'shorts', label: 'Shorts' },
  ];

  for (const p of platforms) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `pill ${p.id === initialPlatform ? 'pill--accent' : ''}`.trim();
    btn.style.cursor = 'pointer';
    btn.textContent = p.label;
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
