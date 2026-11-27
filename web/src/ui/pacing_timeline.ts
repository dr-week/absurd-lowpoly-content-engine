import type { CompiledScript } from '../engine/script/script_compiler.ts';
import { uiGlyphs } from './glyphs.ts';

export function renderPacingTimeline(script: CompiledScript): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'card-subpanel script-pacing-timeline';

  const header = document.createElement('div');
  header.className = 'script-pacing-header';

  const title = document.createElement('span');
  title.className = 'script-pacing-title';
  title.append(uiGlyphs.clock(14), document.createTextNode('5-Beat Retention Pacing'));

  const stats = document.createElement('span');
  stats.className = 'pill';
  stats.textContent = `${script.totalDurationSec}s · ${script.wordCount}w · ${script.effectiveWpm} WPM`;

  header.append(title, stats);

  const track = document.createElement('div');
  track.className = 'script-pacing-track';

  const total = Math.max(script.totalDurationSec, 1);
  for (const beat of script.beats) {
    const seg = document.createElement('div');
    seg.className = `script-pacing-seg is-${beat.role}`;
    const pct = Math.max(12, Math.round((beat.estimatedSec / total) * 100));
    seg.style.flex = `${pct} 1 0%`;
    seg.title = `${beat.label}: ${beat.estimatedSec}s (${beat.wordCount} words)`;
    seg.textContent = `${beat.role.toUpperCase()} · ${beat.estimatedSec}s`;
    track.appendChild(seg);
  }

  wrap.append(header, track);
  return wrap;
}
