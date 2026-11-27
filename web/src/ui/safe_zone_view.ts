import type { CompiledScript } from '../engine/script/script_compiler.ts';
import { uiGlyphs } from './glyphs.ts';

export type SafeZonePlatform = 'reels' | 'tiktok' | 'shorts';

export function renderSafeZoneView(script: CompiledScript): HTMLElement {
  const container = document.createElement('div');
  container.className = 'safe-zone-panel';

  const toolbar = document.createElement('div');
  toolbar.className = 'safe-zone-toolbar';

  const heading = document.createElement('span');
  heading.className = 'safe-zone-heading';
  heading.append(uiGlyphs.frame(), document.createTextNode(' 9:16 Safe Zone'));

  const tabs = document.createElement('div');
  tabs.className = 'safe-zone-tabs';

  const frame = document.createElement('div');
  frame.className = 'safe-zone-frame is-reels';

  const overlayTop = document.createElement('div');
  overlayTop.className = 'safe-zone-dead-top';
  overlayTop.textContent = 'HEADER / CAMERA NOTCH';

  const centerText = document.createElement('div');
  centerText.className = 'safe-zone-center';
  centerText.textContent = script.beats[0]?.cleanText ?? script.topic;

  const overlayRight = document.createElement('div');
  overlayRight.className = 'safe-zone-dead-right';
  overlayRight.textContent = 'ACTIONS';

  const overlayBottom = document.createElement('div');
  overlayBottom.className = 'safe-zone-dead-bottom';
  overlayBottom.textContent = 'CAPTIONS & CTA ZONE';

  frame.append(overlayTop, centerText, overlayRight, overlayBottom);

  const platforms: Array<{ id: SafeZonePlatform; label: string }> = [
    { id: 'reels', label: 'IG Reels' },
    { id: 'tiktok', label: 'TikTok' },
    { id: 'shorts', label: 'Shorts' },
  ];

  platforms.forEach((p, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `safe-zone-tab${idx === 0 ? ' is-active' : ''}`;
    btn.textContent = p.label;
    btn.addEventListener('click', () => {
      tabs.querySelectorAll('button').forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      frame.className = `safe-zone-frame is-${p.id}`;
    });
    tabs.appendChild(btn);
  });

  toolbar.append(heading, tabs);
  container.append(toolbar, frame);
  return container;
}
