import { exportJson, exportJsonl, saveConfig, saveLogs, upsertVote } from '../engine/telemetry';
import type { ActiveTab, EngineConfig, GeneratedPrompts, RatingLogEntry, ScoredTopic, VoteValue } from '../types';

export interface AppState {
  config: EngineConfig;
  activeTab: ActiveTab;
  drawerOpen: boolean;
  seedQuery: string;
  batchNonce: number;
  seenPairs: Set<string>;
  topics: ScoredTopic[];
  selectedId: string | null;
  prompts: GeneratedPrompts | null;
  loading: boolean;
  logs: RatingLogEntry[];
  copiedTarget: 'storyboard' | 'video' | null;
}

export function bindAppEvents(
  state: AppState,
  hooks: {
    render: () => void;
    refreshTopics: () => void;
    selectTopic: (id: string) => Promise<void>;
    toast: (msg: string) => void;
  },
): void {
  const root = document.getElementById('app');
  if (!root) return;

  root.querySelectorAll<HTMLElement>('[data-action]').forEach((el) => {
    el.addEventListener('click', () => {
      const a = el.dataset.action;
      if (a === 'tab' && el.dataset.tab) { state.activeTab = el.dataset.tab as ActiveTab; hooks.render(); return; }
      if (a === 'toggle-theme') { state.config.theme = state.config.theme === 'studio' ? 'noir' : 'studio'; saveConfig(state.config); hooks.render(); return; }
      if (a === 'open-drawer') { state.drawerOpen = true; hooks.render(); return; }
      if (a === 'close-drawer') { state.drawerOpen = false; hooks.render(); return; }
      if (a === 'regenerate-topics') { state.batchNonce += 1; hooks.refreshTopics(); hooks.render(); hooks.toast('8 fresh topics'); return; }
      if (a === 'select-topic' && el.dataset.id) { void hooks.selectTopic(el.dataset.id); return; }
      if (a === 'vote-topic' && el.dataset.id && el.dataset.vote) {
        const t = state.topics.find((x) => x.id === el.dataset.id);
        if (!t) return;
        state.logs = upsertVote(state.logs, { kind: 'topic', targetId: t.id, title: t.title, angle: t.angle, brand: t.brand, viralScore: t.viralScore, vote: el.dataset.vote as VoteValue, contentSnapshot: t.pitch });
        hooks.render();
        hooks.toast(el.dataset.vote === 'up' ? 'Liked' : 'Disliked');
        return;
      }
      if (a === 'vote-prompt' && el.dataset.kind && el.dataset.vote && state.prompts) {
        const kind = el.dataset.kind as 'storyboard' | 'video';
        const score = state.topics.find((x) => x.id === state.prompts?.topicId)?.viralScore ?? 80;
        state.logs = upsertVote(state.logs, { kind, targetId: state.prompts.topicId, title: state.prompts.topicTitle, angle: state.prompts.angle, brand: state.prompts.brand, viralScore: score, vote: el.dataset.vote as VoteValue, contentSnapshot: kind === 'storyboard' ? state.prompts.storyboardPrompt : state.prompts.videoPrompt });
        hooks.render();
        hooks.toast(el.dataset.vote === 'up' ? 'Prompt liked' : 'Prompt disliked');
        return;
      }
      if (a === 'copy-prompt' && el.dataset.kind && state.prompts) {
        const kind = el.dataset.kind as 'storyboard' | 'video';
        void navigator.clipboard.writeText(kind === 'storyboard' ? state.prompts.storyboardPrompt : state.prompts.videoPrompt).then(() => {
          state.copiedTarget = kind;
          hooks.render();
          hooks.toast('Copied');
          window.setTimeout(() => { state.copiedTarget = null; hooks.render(); }, 1200);
        });
        return;
      }
      if (a === 'export-jsonl') { exportJsonl(state.logs); hooks.toast('Exported JSONL'); return; }
      if (a === 'export-json') { exportJson(state.logs); hooks.toast('Exported JSON'); return; }
      if (a === 'clear-logs') { state.logs = []; saveLogs([]); hooks.render(); hooks.toast('Cleared'); }
    });
  });

  document.getElementById('seed-input')?.addEventListener('input', (ev) => {
    state.seedQuery = (ev.target as HTMLInputElement).value;
    state.batchNonce += 1;
    hooks.refreshTopics();
    hooks.render();
    const inp = document.getElementById('seed-input') as HTMLInputElement | null;
    if (inp) { inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); }
  });
  document.getElementById('batch-size-select')?.addEventListener('change', (ev) => {
    state.config.batchSize = Number((ev.target as HTMLSelectElement).value) || 8;
    saveConfig(state.config);
    state.batchNonce += 1;
    hooks.refreshTopics();
    hooks.render();
  });
  document.getElementById('drawer-backdrop')?.addEventListener('click', (ev) => {
    if ((ev.target as HTMLElement).id === 'drawer-backdrop') { state.drawerOpen = false; hooks.render(); }
  });
  document.getElementById('cfg-theme')?.addEventListener('change', (ev) => { state.config.theme = (ev.target as HTMLSelectElement).value as EngineConfig['theme']; saveConfig(state.config); hooks.render(); });
  document.getElementById('cfg-source')?.addEventListener('change', (ev) => { state.config.sourceMode = (ev.target as HTMLSelectElement).value as EngineConfig['sourceMode']; saveConfig(state.config); hooks.render(); });
  document.getElementById('cfg-backend-url')?.addEventListener('change', (ev) => { state.config.backendUrl = (ev.target as HTMLInputElement).value.trim() || 'http://localhost:8000'; saveConfig(state.config); hooks.toast('Saved'); });
}
