import { cycleDirectorsStack } from '../data/creative_matrix';
import { cycleAccentProfile } from '../engine/accent_engine';
import { exportStudioBackup, restoreStudioBackup } from '../engine/backup_sync';
import { cycleSituationCast } from '../engine/character_variability';
import { cycleDesiCharacterName } from '../engine/desi_nomenclature';
import { cycleVoiceEnsemble } from '../engine/dialogue_theater';
import { cycleMarketingGimmick } from '../engine/marketing_gimmicks';
import { cycleAlternatePunchline, exportSavedMarkdown, rerollCameraRig, switchPromptVisualStyle } from '../engine/prompt_tools';
import { cycleReelOverlay } from '../engine/reel_overlays';
import { removeSavedTopic, saveLikedTopic, setSavedOutcome } from '../engine/saved_store';
import { exportJson, exportJsonl, saveConfig, saveLogs, upsertVote } from '../engine/telemetry';
import { cycleTwistBlueprint } from '../engine/twist_architect';
import { buildViralPackage } from '../engine/viral_packaging';
import { backupToDriveAppData, restoreFromDriveAppData, signInWithGoogle, signOutGoogle } from '../engine/storage/google_drive_sync';
import type { ActiveTab, EngineConfig, GeneratedPrompts, HookCategory, MarketingPlatform, OutcomeTag, RatingLogEntry, SavedFilter, SavedItem, ScoredTopic, SituationCategory, TargetVideoModel, VisualStyle, VoteValue } from '../types';

export interface AppState {
  config: EngineConfig; activeTab: ActiveTab; drawerOpen: boolean; openPanel: 'none' | 'filters' | 'custom'; seedQuery: string; customDraft: string;
  hookFilter: HookCategory | 'all'; situationFilter: SituationCategory | 'all'; visualStyle: VisualStyle; targetModel: TargetVideoModel; marketingPlatform: MarketingPlatform; brandProduct: string;
  batchNonce: number; seenPairs: Set<string>; seenTitles: Set<string>; topics: ScoredTopic[]; liveTrends: string[];
  loadingTopics: boolean; selectedId: string | null; activeTopic?: ScoredTopic; prompts: GeneratedPrompts | null;
  rigStep: number; punchStep: number; twistStep: number; nameStep: number; stackStep: number; voiceStep: number; castStep: number; promoStep: number; accentStep: number; overlayStep: number;
  loading: boolean; logs: RatingLogEntry[]; saved: SavedItem[]; generatedIds: Set<string>; savedFilter: SavedFilter; copiedTarget: string | null;
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
      if (a === 'jump-chat') { state.activeTab = 'chat'; hooks.render(); return; }
      if (a === 'jump-stage') { state.activeTab = 'stage'; hooks.render(); return; }
      if (a === 'toggle-theme') { state.config.theme = state.config.theme === 'studio' ? 'noir' : 'studio'; saveConfig(state.config); hooks.render(); return; }
      if (a === 'open-drawer') { state.drawerOpen = true; hooks.render(); return; }
      if (a === 'close-drawer') { state.drawerOpen = false; hooks.render(); return; }
      if (a === 'drive-signin') {
        const cid = (document.getElementById('cfg-google-client-id') as HTMLInputElement | null)?.value.trim() ?? '';
        void signInWithGoogle(cid).then(() => hooks.toast('Signed in with Google')).catch((e: unknown) => hooks.toast(e instanceof Error ? e.message : 'Sign-in failed'));
        return;
      }
      if (a === 'drive-backup') {
        void backupToDriveAppData({ saved: state.saved, logs: state.logs }).then(() => hooks.toast('Backed up to Drive')).catch((e: unknown) => hooks.toast(e instanceof Error ? e.message : 'Backup failed'));
        return;
      }
      if (a === 'drive-restore') {
        void restoreFromDriveAppData().then(() => hooks.toast('Restored from Drive')).catch((e: unknown) => hooks.toast(e instanceof Error ? e.message : 'Restore failed'));
        return;
      }
      if (a === 'drive-signout') { signOutGoogle(); hooks.toast('Signed out of Google'); return; }
      if (a === 'toggle-panel' && el.dataset.panel) { const p = el.dataset.panel as 'filters' | 'custom'; state.openPanel = state.openPanel === p ? 'none' : p; hooks.render(); return; }
      if (a === 'clear-filters') { state.hookFilter = 'all'; state.situationFilter = 'all'; state.seedQuery = ''; state.batchNonce += 1; void hooks.refreshTopics(); return; }
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
      if (a === 'copy-text' && el.dataset.text) {
        const cid = el.dataset.copyId ?? 'text';
        void navigator.clipboard.writeText(el.dataset.text).then(() => { state.copiedTarget = cid; hooks.render(); hooks.toast('Copied'); window.setTimeout(() => { state.copiedTarget = null; hooks.render(); }, 1200); });
        return;
      }
      if (a === 'reroll-voice' && state.prompts) { const out = cycleVoiceEnsemble(state.prompts, (state.voiceStep += 1)); state.prompts = out.prompts; hooks.render(); hooks.toast(`Voice: ${out.label}`); return; }
      if (a === 'reroll-accent' && state.prompts) { const out = cycleAccentProfile(state.prompts, (state.accentStep += 1)); state.prompts = out.prompts; hooks.render(); hooks.toast(`Accent: ${out.label}`); return; }
      if (a === 'reroll-twist' && state.prompts) { const out = cycleTwistBlueprint(state.prompts, (state.twistStep += 1)); state.prompts = out.prompts; hooks.render(); hooks.toast(`Twist: ${out.label}`); return; }
      if (a === 'reroll-stack' && state.prompts) { const out = cycleDirectorsStack(state.prompts, (state.stackStep += 1)); state.prompts = out.prompts; hooks.render(); hooks.toast(`Film: ${out.label}`); return; }
      if (a === 'reroll-cast' && state.prompts) { const out = cycleSituationCast(state.prompts, (state.castStep += 1)); state.prompts = out.prompts; hooks.render(); hooks.toast(`Cast: ${out.label}`); return; }
      if (a === 'reroll-name' && state.prompts) { const out = cycleDesiCharacterName(state.prompts, (state.nameStep += 1)); state.prompts = out.prompts; hooks.render(); hooks.toast(`Name: ${out.name}`); return; }
      if (a === 'reroll-rig' && state.prompts) { const out = rerollCameraRig(state.prompts, (state.rigStep += 1)); state.prompts = out.prompts; hooks.render(); hooks.toast(`Camera: ${out.rigLabel}`); return; }
      if (a === 'reroll-punchline' && state.prompts) { const out = cycleAlternatePunchline(state.prompts, (state.punchStep += 1)); state.prompts = out.prompts; hooks.render(); hooks.toast(`Punchline: ${out.style}`); return; }
      if (a === 'reroll-promo' && state.prompts) { const out = cycleMarketingGimmick(state.prompts, (state.promoStep += 1)); state.prompts = out.prompts; hooks.render(); hooks.toast(`Promo: ${out.label}`); return; }
      if (a === 'reroll-overlay' && state.prompts) { const out = cycleReelOverlay(state.prompts, state.activeTopic, (state.overlayStep += 1)); state.prompts = out.prompts; hooks.render(); hooks.toast(`Overlay: ${out.label}`); return; }
      if (a === 'pick-platform' && el.dataset.platform) { state.marketingPlatform = el.dataset.platform as MarketingPlatform; hooks.render(); return; }
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
  document.getElementById('brand-product-input')?.addEventListener('change', (ev) => { state.brandProduct = (ev.target as HTMLInputElement).value; hooks.render(); });
  document.getElementById('seed-input')?.addEventListener('change', (ev) => { state.seedQuery = (ev.target as HTMLInputElement).value; state.batchNonce += 1; void hooks.refreshTopics(); });
  document.getElementById('filter-hook')?.addEventListener('change', (ev) => { state.hookFilter = (ev.target as HTMLSelectElement).value as HookCategory | 'all'; state.batchNonce += 1; void hooks.refreshTopics(); });
  document.getElementById('filter-situation')?.addEventListener('change', (ev) => { state.situationFilter = (ev.target as HTMLSelectElement).value as SituationCategory | 'all'; state.batchNonce += 1; void hooks.refreshTopics(); });
  document.getElementById('target-model')?.addEventListener('change', (ev) => { state.targetModel = (ev.target as HTMLSelectElement).value as TargetVideoModel; hooks.render(); hooks.toast(`Model: ${state.targetModel}`); });
  document.getElementById('visual-style')?.addEventListener('change', (ev) => { state.visualStyle = (ev.target as HTMLSelectElement).value as VisualStyle; if (state.prompts) state.prompts = switchPromptVisualStyle(state.prompts, state.visualStyle); hooks.render(); hooks.toast(`Style: ${state.visualStyle}`); });
  document.getElementById('drawer-backdrop')?.addEventListener('click', (ev) => { if ((ev.target as HTMLElement).id === 'drawer-backdrop') { state.drawerOpen = false; hooks.render(); } });
  document.getElementById('cfg-theme')?.addEventListener('change', (ev) => { state.config.theme = (ev.target as HTMLSelectElement).value as EngineConfig['theme']; saveConfig(state.config); hooks.render(); });
  document.getElementById('cfg-source')?.addEventListener('change', (ev) => { state.config.sourceMode = (ev.target as HTMLSelectElement).value as EngineConfig['sourceMode']; saveConfig(state.config); hooks.render(); });
  document.getElementById('cfg-api-key')?.addEventListener('input', (ev) => { state.config.apiKey = (ev.target as HTMLInputElement).value.trim(); saveConfig(state.config); });
  document.getElementById('cfg-model')?.addEventListener('input', (ev) => { state.config.model = (ev.target as HTMLInputElement).value.trim(); saveConfig(state.config); });
  document.getElementById('cfg-backend-url')?.addEventListener('input', (ev) => { state.config.backendUrl = (ev.target as HTMLInputElement).value.trim() || 'http://localhost:8000'; saveConfig(state.config); });
}
