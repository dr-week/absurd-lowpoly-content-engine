import type { CompiledScript } from '../engine/script/script_compiler.ts';
import { uiGlyphs } from './glyphs.ts';

export function renderPacingTimeline(script: CompiledScript): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'script-pacing-timeline';

  const header = document.createElement('div');
  header.className = 'script-pacing-header';

  const title = document.createElement('span');
  title.className = 'script-pacing-title';
  title.append(uiGlyphs.clock(), document.createTextNode(' 5-Beat Pacing'));

  const stats = document.createElement('span');
  stats.className = 'script-pacing-stats';
  stats.textContent = `${script.totalDurationSec}s | ${script.wordCount}w | ${script.effectiveWpm} WPM`;

  header.append(title, stats);

  const track = document.createElement('div');
  track.className = 'script-pacing-track';

  const total = Math.max(script.totalDurationSec, 1);
  for (const beat of script.beats) {
    const seg = document.createElement('div');
    seg.className = `script-pacing-seg is-${beat.role}`;
    const pct = Math.max(10, Math.round((beat.estimatedSec / total) * 100));
    seg.style.width = `${pct}%`;
    seg.title = `${beat.label}: ${beat.estimatedSec}s (${beat.wordCount} words)`;

    const lbl = document.createElement('span');
    lbl.textContent = `${beat.role.toUpperCase()} ${beat.estimatedSec}s`;
    seg.appendChild(lbl);
    track.appendChild(seg);
  }

  wrap.append(header, track);
  return wrap;
}
