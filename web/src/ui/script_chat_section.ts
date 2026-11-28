import { compileScript } from '../engine/script/script_compiler';
import { insertCueAtEnd } from '../engine/script/delivery_cues';
import type { CompiledScript } from '../engine/script/script_types';
import { renderChatComposer, type ComposerState } from './chat_composer_view';
import { renderChatThread, type ChatTurn } from './chat_thread_view';
import { renderPacingTimeline } from './pacing_timeline';
import { renderSafeZoneView, type SafeZonePlatform } from './safe_zone_view';
import { formatScriptForCopy, renderScriptCard, type CopyMode } from './script_card_view';
import { renderTeleprompterView, type TeleprompterState } from './teleprompter_view';

export function mountScriptChatSection(container: HTMLElement): void {
  const composer: ComposerState = { niche: 'tech', durationSec: 20, includeVisuals: false };
  const tp: TeleprompterState = { wpm: 140, mirrored: false, playing: false, pauseCountdownSec: 0 };
  let safeZone: SafeZonePlatform = 'reels';
  let currentScript: CompiledScript = compileScript({
    niche: composer.niche,
    topic: 'local-first sync engines',
    targetDurationSec: composer.durationSec,
    includeVisuals: composer.includeVisuals,
  });
  const turns: ChatTurn[] = [
    { id: 't0', role: 'assistant', niche: 'tech', text: `Compiled 5-beat script: ${currentScript.title}` },
  ];
  let scrollTimer: number | null = null;

  const stopScroll = () => {
    if (scrollTimer !== null) {
      window.clearInterval(scrollTimer);
      scrollTimer = null;
    }
  };

  const render = () => {
    const fullText = currentScript.beats.map((b) => b.spokenText).join(' ');
    container.innerHTML = `<section class="studio-section-02" aria-label="Universal Script Studio">
      <div class="studio-split-pane">
        <div class="studio-pane-left">
          ${renderChatThread(turns)}
          ${renderChatComposer(composer)}
        </div>
        <div class="studio-pane-right">
          ${renderPacingTimeline(currentScript)}
          ${renderScriptCard(currentScript)}
          ${renderTeleprompterView(tp, fullText)}
          ${renderSafeZoneView(safeZone, currentScript.beats[0]?.spokenText ?? '')}
        </div>
      </div>
    </section>`;
    bindEvents();
  };

  const bindEvents = () => {
    container.querySelector('#studio-chat-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const topicEl = container.querySelector<HTMLInputElement>('#studio-topic-input');
      const nicheEl = container.querySelector<HTMLSelectElement>('#studio-niche-select');
      const durEl = container.querySelector<HTMLInputElement>('#studio-duration-input');
      const visEl = container.querySelector<HTMLInputElement>('#studio-visuals-toggle');
      composer.niche = (nicheEl?.value as ComposerState['niche']) ?? 'tech';
      composer.durationSec = Number(durEl?.value ?? 20);
      composer.includeVisuals = Boolean(visEl?.checked);
      const topic = topicEl?.value.trim() || 'local-first sync engines';
      turns.push({ id: `u_${Date.now()}`, role: 'user', niche: composer.niche, text: topic });
      currentScript = compileScript({
        niche: composer.niche,
        topic,
        targetDurationSec: composer.durationSec,
        includeVisuals: composer.includeVisuals,
      });
      turns.push({ id: `a_${Date.now()}`, role: 'assistant', niche: composer.niche, text: currentScript.title });
      render();
    });

    container.querySelectorAll<HTMLButtonElement>('[data-sz]').forEach((btn) => {
      btn.addEventListener('click', () => {
        safeZone = (btn.dataset.sz as SafeZonePlatform) ?? 'reels';
        render();
      });
    });

    container.querySelectorAll<HTMLButtonElement>('[data-copy-mode]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const mode = (btn.dataset.copyMode as CopyMode) ?? 'clean';
        void navigator.clipboard?.writeText(formatScriptForCopy(currentScript, mode));
      });
    });

    container.querySelectorAll<HTMLButtonElement>('[data-cue-tag]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tag = btn.dataset.cueTag ?? '';
        const last = currentScript.beats[currentScript.beats.length - 1];
        if (last && tag) {
          last.spokenText = insertCueAtEnd(last.spokenText, tag);
          render();
        }
      });
    });

    container.querySelector('#tp-mirror-btn')?.addEventListener('click', () => {
      tp.mirrored = !tp.mirrored;
      render();
    });

    container.querySelector('#tp-wpm-range')?.addEventListener('input', (e) => {
      tp.wpm = Number((e.target as HTMLInputElement).value);
    });

    container.querySelector('#tp-play-btn')?.addEventListener('click', () => {
      tp.playing = !tp.playing;
      stopScroll();
      if (tp.playing) {
        scrollTimer = window.setInterval(() => {
          const vp = container.querySelector<HTMLElement>('#tp-viewport');
          if (vp) vp.scrollTop += Math.max(1, Math.round(tp.wpm / 70));
        }, 50);
      }
      render();
    });
  };

  render();
}
