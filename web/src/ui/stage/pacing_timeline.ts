import type { CompiledScript } from '../../engine/script/script_compiler.ts';
import { uiGlyphs } from '../glyphs.ts';

export function renderPacingTimeline(script: CompiledScript): HTMLElement {
  const wrap = Object.assign(document.createElement('div'), { className: 'card-subpanel script-pacing-timeline' });
  const header = Object.assign(document.createElement('div'), { className: 'script-pacing-header' });

  const title = Object.assign(document.createElement('span'), { className: 'script-pacing-title' });
  title.append(uiGlyphs.clock(14), document.createTextNode('5-Beat Retention Pacing'));

  const stats = Object.assign(document.createElement('span'), {
    className: 'pill',
    textContent: `${script.totalDurationSec}s · ${script.wordCount}w · ${script.effectiveWpm} WPM`,
  });
  header.append(title, stats);

  const track = Object.assign(document.createElement('div'), { className: 'script-pacing-track' });
  const total = Math.max(script.totalDurationSec, 1);
  for (const beat of script.beats) {
    const pct = Math.max(12, Math.round((beat.estimatedSec / total) * 100));
    const seg = Object.assign(document.createElement('div'), {
      className: `script-pacing-seg is-${beat.role}`,
      title: `${beat.label}: ${beat.estimatedSec}s (${beat.wordCount} words)`,
      textContent: `${beat.role.toUpperCase()} · ${beat.estimatedSec}s`,
    });
    seg.style.flex = `${pct} 1 0%`;
    track.appendChild(seg);
  }

  wrap.append(header, track);
  return wrap;
}
