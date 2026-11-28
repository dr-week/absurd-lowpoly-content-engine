import type { CompiledScript } from '../../engine/script/script_compiler.ts';
import { uiGlyphs } from '../glyphs.ts';

export function renderPacingTimeline(script: CompiledScript): HTMLElement {
  const wrap = Object.assign(document.createElement('div'), { className: 'card-subpanel script-pacing-timeline' });
  const header = Object.assign(document.createElement('div'), { className: 'script-pacing-header' });

  const title = Object.assign(document.createElement('span'), { className: 'script-pacing-title' });
  title.innerHTML = `${uiGlyphs.clock()}<span>5-Beat Retention Pacing</span>`;

  const totalSec = script.totalDurationSec ?? script.totalSec;
  const totalWords = script.wordCount ?? script.totalWords;
  const wpm = totalSec > 0 ? Math.round((totalWords / totalSec) * 60) : 138;

  const stats = Object.assign(document.createElement('span'), {
    className: 'pill',
    textContent: `${totalSec}s · ${totalWords}w · ${wpm} WPM`,
  });
  header.append(title, stats);

  const track = Object.assign(document.createElement('div'), { className: 'script-pacing-track' });
  const total = Math.max(totalSec, 1);
  for (const beat of script.beats) {
    const pct = Math.max(12, Math.round((beat.actualSec / total) * 100));
    const seg = Object.assign(document.createElement('div'), {
      className: `script-pacing-seg is-${beat.id}`,
      title: `${beat.label}: ${beat.actualSec}s (${beat.wordCount} words)`,
      textContent: `${beat.id.toUpperCase()} · ${beat.actualSec}s`,
    });
    seg.style.flex = `${pct} 1 0%`;
    track.appendChild(seg);
  }

  wrap.append(header, track);
  return wrap;
}
