import { cycleDirectorsStack } from '../data/creative_matrix';
import { exportStudioBackup, restoreStudioBackup } from '../engine/backup_sync';
import { cycleDesiCharacterName } from '../engine/desi_nomenclature';
import { cycleVoiceEnsemble } from '../engine/dialogue_theater';
import { cycleAlternatePunchline, exportSavedMarkdown, rerollCameraRig, switchPromptVisualStyle } from '../engine/prompt_tools';
import { removeSavedTopic, saveLikedTopic, setSavedOutcome } from '../engine/saved_store';
import { exportJson, exportJsonl, saveConfig, saveLogs, upsertVote } from '../engine/telemetry';
import { cycleTwistBlueprint } from '../engine/twist_architect';
import { buildViralPackage } from '../engine/viral_packaging';
import type { ActiveTab, EngineConfig, GeneratedPrompts, HookCategory, OutcomeTag, RatingLogEntry, SavedFilter, SavedItem, ScoredTopic, SituationCategory, VisualStyle, VoteValue } from '../types';

export interface AppState {
  config: EngineConfig;
  activeTab: ActiveTab;
  drawerOpen: boolean;
  seedQuery: string;
  customDraft: string;
  hookFilter: HookCategory | 'all';
  situationFilter: SituationCategory | 'all';
  visualStyle: VisualStyle;
  batchNonce: number;
  seenPairs: Set<string>;
  seenTitles: Set<string>;
  topics: ScoredTopic[];
  liveTrends: string[];
  loadingTopics: boolean;
  selectedId: string | null;
  activeTopic?: ScoredTopic;
  prompts: GeneratedPrompts | null;
  rigStep: number;
  punchStep: number;
  twistStep: number;
  nameStep: number;
  stackStep: number;
  voiceStep: number;
  loading: boolean;
  logs: RatingLogEntry[];
  saved: SavedItem[];
  generatedIds: Set<string>;
  savedFilter: SavedFilter;
  copiedTarget: 'storyboard' | 'video' | 'packaging' | null;
}

export function bindAppEvents(
  state: AppState,
  hooks: {
    render: () => void;
    refreshTopics: () => Promise<void>;
    selectTopic: (id: string, fromSaved?: boolean) => Promise<void>;
    createSequel: (topic: ScoredTopic) => Promise<void>;
    createMashup: () => Promise<void>;
    runCustomIdea: () => Promise<void>;
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
      if (a === 'regenerate-topics') { state.batchNonce += 1; void hooks.refreshTopics(); return; }
      if (a === 'pick-hook' && el.dataset.hook) { const next = el.dataset.hook as HookCategory | 'all'; state.hookFilter = state.hookFilter === next ? 'all' : next; state.batchNonce += 1; void hooks.refreshTopics(); return; }
      if (a === 'pick-trend' && el.dataset.trend) { state.seedQuery = state.seedQuery === el.dataset.trend ? '' : el.dataset.trend; state.batchNonce += 1; void hooks.refreshTopics(); return; }
      if (a === 'pick-char' && el.dataset.starter) { state.customDraft = el.dataset.starter; hooks.render(); document.getElementById('custom-idea-input')?.focus(); return; }
      if (a === 'run-custom-idea') { void hooks.runCustomIdea(); return; }
      if (a === 'select-topic' && el.dataset.id) { void hooks.selectTopic(el.dataset.id, false); return; }
      if (a === 'select-saved' && el.dataset.id) { void hooks.selectTopic(el.dataset.id, true); return; }
      if (a === 'saved-filter' && el.dataset.filter) { state.savedFilter = el.dataset.filter as SavedFilter; hooks.render(); return; }
      if (a === 'remove-saved' && el.dataset.id) { state.saved = removeSavedTopic(state.saved, el.dataset.id); hooks.render(); hooks.toast('Removed'); return; }
      if (a === 'set-outcome' && el.dataset.id && el.dataset.outcome) {
        state.saved = setSavedOutcome(state.saved, el.dataset.id, el.dataset.outcome as OutcomeTag);
        hooks.render(); hooks.toast(`Marked ${el.dataset.outcome}`); return;
      }
      if (a === 'make-sequel' && state.activeTopic) { void hooks.createSequel(state.activeTopic); return; }
      if (a === 'make-mashup') { void hooks.createMashup(); return; }
      if (a === 'sequel-saved' && el.dataset.id) {
        const found = state.saved.find((s) => s.topic.id === el.dataset.id)?.topic;
        if (found) void hooks.createSequel(found);
        return;
      }
      if (a === 'vote-topic' && el.dataset.id && el.dataset.vote) {
        const t = state.topics.find((x) => x.id === el.dataset.id);
        if (!t) return;
        const vote = el.dataset.vote as VoteValue;
        state.logs = upsertVote(state.logs, { kind: 'topic', targetId: t.id, title: t.title, angle: t.angle, brand: t.brand, viralScore: t.viralScore, vote, contentSnapshot: t.pitch });
        state.saved = vote === 'up' ? saveLikedTopic(state.saved, state.generatedIds, t) : removeSavedTopic(state.saved, t.id);
        hooks.render(); hooks.toast(vote === 'up' ? 'Saved' : 'Disliked'); return;
      }
      if (a === 'vote-prompt' && el.dataset.kind && el.dataset.vote && state.prompts) {
        const kind = el.dataset.kind as 'storyboard' | 'video';
        const score = state.activeTopic?.viralScore ?? 85;
        state.logs = upsertVote(state.logs, { kind, targetId: state.prompts.topicId, title: state.prompts.topicTitle, angle: state.prompts.angle, brand: state.prompts.brand, viralScore: score, vote: el.dataset.vote as VoteValue, contentSnapshot: kind === 'storyboard' ? state.prompts.storyboardPrompt : state.prompts.videoPrompt });
        hooks.render(); hooks.toast(el.dataset.vote === 'up' ? 'Prompt liked' : 'Prompt disliked'); return;
      }
      if (a === 'copy-prompt' && el.dataset.kind && state.prompts) {
        const kind = el.dataset.kind as 'storyboard' | 'video';
        void navigator.clipboard.writeText(kind === 'storyboard' ? state.prompts.storyboardPrompt : state.prompts.videoPrompt).then(() => {
          state.copiedTarget = kind; hooks.render(); hooks.toast('Copied');
          window.setTimeout(() => { state.copiedTarget = null; hooks.render(); }, 1200);
        }); return;
      }
      if (a === 'copy-packaging' && state.prompts && state.activeTopic) {
        void navigator.clipboard.writeText(buildViralPackage(state.activeTopic, state.prompts).copyText).then(() => { state.copiedTarget = 'packaging'; hooks.render(); hooks.toast('Copied Viral Pack'); window.setTimeout(() => { state.copiedTarget = null; hooks.render(); }, 1200); });
        return;
      }
      if (a === 'copy-all' && state.prompts) {
        const pack = state.activeTopic ? `\n\n---\n\n${buildViralPackage(state.activeTopic, state.prompts).copyText}` : '';
        void navigator.clipboard.writeText(`${state.prompts.storyboardPrompt}\n\n---\n\n${state.prompts.videoPrompt}${pack}`).then(() => hooks.toast('Copied Full Bundle'));
        return;
      }
      if (a === 'reroll-voice' && state.prompts) { const out = cycleVoiceEnsemble(state.prompts, (state.voiceStep += 1)); state.prompts = out.prompts; hooks.render(); hooks.toast(`Voice: ${out.label}`); return; }
      if (a === 'reroll-twist' && state.prompts) { const out = cycleTwistBlueprint(state.prompts, (state.twistStep += 1)); state.prompts = out.prompts; hooks.render(); hooks.toast(`Twist: ${out.label}`); return; }
      if (a === 'reroll-stack' && state.prompts) { const out = cycleDirectorsStack(state.prompts, (state.stackStep += 1)); state.prompts = out.prompts; hooks.render(); hooks.toast(`Film: ${out.label}`); return; }
      if (a === 'reroll-name' && state.prompts) { const out = cycleDesiCharacterName(state.prompts, (state.nameStep += 1)); state.prompts = out.prompts; hooks.render(); hooks.toast(`Name: ${out.name}`); return; }
      if (a === 'reroll-rig' && state.prompts) { const out = rerollCameraRig(state.prompts, (state.rigStep += 1)); state.prompts = out.prompts; hooks.render(); hooks.toast(`Camera: ${out.rigLabel}`); return; }
      if (a === 'reroll-punchline' && state.prompts) { const out = cycleAlternatePunchline(state.prompts, (state.punchStep += 1)); state.prompts = out.prompts; hooks.render(); hooks.toast(`Punchline: ${out.style}`); return; }
      if (a === 'export-saved-md') { exportSavedMarkdown(state.saved); hooks.toast('Exported Saved .md'); return; }
      if (a === 'export-backup') { exportStudioBackup(state); hooks.toast('Backup downloaded'); return; }
      if (a === 'export-jsonl') { exportJsonl(state.logs); hooks.toast('Exported JSONL'); return; }
      if (a === 'export-json') { exportJson(state.logs); hooks.toast('Exported JSON'); return; }
      if (a === 'clear-logs') { state.logs = []; saveLogs([]); hooks.render(); hooks.toast('Cleared'); }
    });
  });

  document.getElementById('restore-backup-input')?.addEventListener('change', (ev) => {
    const file = (ev.target as HTMLInputElement).files?.[0];
    if (!file) return;
    void file.text().then((txt) => { Object.assign(state, restoreStudioBackup(txt), { drawerOpen: false }); hooks.render(); hooks.toast('Studio restored'); }).catch(() => hooks.toast('Invalid backup JSON'));
  });
  const customInput = document.getElementById('custom-idea-input') as HTMLInputElement | null;
  customInput?.addEventListener('input', () => { state.customDraft = customInput.value; });
  customInput?.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') void hooks.runCustomIdea(); });
  document.getElementById('seed-input')?.addEventListener('change', (ev) => { state.seedQuery = (ev.target as HTMLInputElement).value; state.batchNonce += 1; void hooks.refreshTopics(); });
  document.getElementById('filter-hook')?.addEventListener('change', (ev) => { state.hookFilter = (ev.target as HTMLSelectElement).value as HookCategory | 'all'; state.batchNonce += 1; void hooks.refreshTopics(); });
  document.getElementById('filter-situation')?.addEventListener('change', (ev) => { state.situationFilter = (ev.target as HTMLSelectElement).value as SituationCategory | 'all'; state.batchNonce += 1; void hooks.refreshTopics(); });
  document.getElementById('visual-style')?.addEventListener('change', (ev) => { state.visualStyle = (ev.target as HTMLSelectElement).value as VisualStyle; if (state.prompts) state.prompts = switchPromptVisualStyle(state.prompts, state.visualStyle); hooks.render(); hooks.toast(`Style: ${state.visualStyle}`); });
  document.getElementById('drawer-backdrop')?.addEventListener('click', (ev) => { if ((ev.target as HTMLElement).id === 'drawer-backdrop') { state.drawerOpen = false; hooks.render(); } });
  document.getElementById('cfg-theme')?.addEventListener('change', (ev) => { state.config.theme = (ev.target as HTMLSelectElement).value as EngineConfig['theme']; saveConfig(state.config); hooks.render(); });
  document.getElementById('cfg-source')?.addEventListener('change', (ev) => { state.config.sourceMode = (ev.target as HTMLSelectElement).value as EngineConfig['sourceMode']; saveConfig(state.config); hooks.render(); });
  document.getElementById('cfg-api-key')?.addEventListener('input', (ev) => { state.config.apiKey = (ev.target as HTMLInputElement).value.trim(); saveConfig(state.config); });
  document.getElementById('cfg-model')?.addEventListener('input', (ev) => { state.config.model = (ev.target as HTMLInputElement).value.trim(); saveConfig(state.config); });
  document.getElementById('cfg-backend-url')?.addEventListener('input', (ev) => { state.config.backendUrl = (ev.target as HTMLInputElement).value.trim() || 'http://localhost:8000'; saveConfig(state.config); });
}
