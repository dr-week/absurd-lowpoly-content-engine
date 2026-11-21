import { buildViralPackage } from '../engine/viral_packaging';
import { Glyphs } from '../glyphs';
import type { GeneratedPrompts, ScoredTopic } from '../types';
import { esc } from './escape';

export function renderViralPackagingCard(
  topic: ScoredTopic | undefined,
  prompts: GeneratedPrompts,
  copied: boolean,
): string {
  if (!topic) return '';
  const pack = buildViralPackage(topic, prompts);
  return `
    <div class="prompt-row">
      <div class="code-block-card">
        <div class="code-block-card__header">
          <span class="code-block-card__label">Viral Pack</span>
          <span class="pill pill--positive">${esc(pack.loopStatus)}</span>
        </div>
        <pre id="code-packaging">${esc(pack.copyText)}</pre>
      </div>
      <aside class="side-rail" aria-label="Copy Viral Pack">
        <button type="button" class="vote-btn" data-action="copy-packaging" title="Copy Viral Pack">
          ${copied ? Glyphs.check(16) : Glyphs.copy(16)}
        </button>
      </aside>
    </div>
  `;
}
