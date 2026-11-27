import { COMEDY_BLUEPRINTS } from '../engine/script/blueprints_comedy.ts';
import { compileScript, type CompiledScript } from '../engine/script/script_compiler.ts';
import { publishSync } from '../engine/storage/broadcast_sync.ts';
import { saveScript } from '../engine/storage/idb_script_store.ts';
import { ensureDefaultProfile, getActiveProfileId, requestStoragePersistence } from '../engine/storage/profile_manager.ts';
import type { ScoredTopic } from '../types.ts';
import { uiGlyphs } from './glyphs.ts';
import { renderPacingTimeline } from './pacing_timeline.ts';
import { renderSafeZoneView, type SafeZonePlatform } from './safe_zone_view.ts';
import { renderScriptCardView } from './script_card_view.ts';
import { renderScriptSavedBar } from './script_saved_bar.ts';
import { renderTeleprompterView } from './teleprompter_view.ts';

let lastSyncedTopicId: string | null = null;
let cachedDraftTopic = 'Society lift maintenance fee';
let cachedBlueprintId = COMEDY_BLUEPRINTS[0].id;
let cachedScript: CompiledScript | null = null;
let cachedBeatIdx = 0;
let cachedPlatform: SafeZonePlatform = 'reels';
let storageBooted = false;

export function seedStageTopic(topicText: string): void {
  cachedDraftTopic = topicText.trim() || cachedDraftTopic;
  cachedBeatIdx = 0;
  cachedScript = compileScript({ topic: cachedDraftTopic, blueprintId: cachedBlueprintId });
}

export function renderScriptChatSection(opts?: {
  activeTopic?: ScoredTopic;
  onToast?: (msg: string) => void;
  onOpenInChat?: (topicText: string) => void;
}): HTMLElement {
  if (!storageBooted) {
    storageBooted = true;
    void requestStoragePersistence();
    void ensureDefaultProfile().catch(() => {});
  }

  if (opts?.activeTopic && opts.activeTopic.id !== lastSyncedTopicId) {
    lastSyncedTopicId = opts.activeTopic.id;
    seedStageTopic(opts.activeTopic.title);
  } else if (!cachedScript) {
    cachedScript = compileScript({ topic: cachedDraftTopic, blueprintId: cachedBlueprintId });
  }

  const section = Object.assign(document.createElement('section'), {
    id: 'section-script-studio',
    className: 'section-card zuari-surface-liquid script-studio-section',
  });

  const header = Object.assign(document.createElement('div'), { className: 'section-header' });
  const titleGroup = Object.assign(document.createElement('div'), { className: 'section-header__title-group' });
  titleGroup.append(
    Object.assign(document.createElement('span'), { className: 'section-header__step', textContent: 'Stage' }),
    Object.assign(document.createElement('h2'), { textContent: '5-Beat Rehearsal, Teleprompter & 9:16 Safe-Zone' }),
  );

  const headerActions = Object.assign(document.createElement('div'), { className: 'section-header__actions' });
  const bpSelect = Object.assign(document.createElement('select'), { className: 'compact-select', ariaLabel: '5-Beat Comedy Blueprint' });
  for (const bp of COMEDY_BLUEPRINTS) {
    bpSelect.appendChild(Object.assign(document.createElement('option'), { value: bp.id, selected: bp.id === cachedBlueprintId, textContent: `${bp.name} · ${bp.style}` }));
  }
  const chatBtn = Object.assign(document.createElement('button'), { type: 'button', className: 'btn', title: 'Co-write in AI Chat' });
  chatBtn.append(uiGlyphs.chat(14), Object.assign(document.createElement('span'), { textContent: 'AI Chat' }));
  const saveBtn = Object.assign(document.createElement('button'), { type: 'button', className: 'btn' });
  saveBtn.append(uiGlyphs.save(14), Object.assign(document.createElement('span'), { textContent: 'Save Local' }));
  headerActions.append(bpSelect, chatBtn, saveBtn);
  header.append(titleGroup, headerActions);

  const form = Object.assign(document.createElement('form'), { className: 'script-composer-form' });
  const topicInput = Object.assign(document.createElement('input'), {
    type: 'text',
    className: 'compact-input script-topic-input',
    placeholder: 'Premise to compile into 5 retention beats...',
    value: cachedDraftTopic,
  });
  topicInput.addEventListener('input', () => { cachedDraftTopic = topicInput.value; });
  chatBtn.addEventListener('click', () => opts?.onOpenInChat?.(topicInput.value));

  const genBtn = Object.assign(document.createElement('button'), { type: 'submit', className: 'btn btn--primary' });
  genBtn.append(uiGlyphs.spark(14), Object.assign(document.createElement('span'), { textContent: 'Compile 5-Beat' }));
  form.append(topicInput, genBtn);

  const split = Object.assign(document.createElement('div'), { className: 'script-split-pane' });
  const leftPane = Object.assign(document.createElement('div'), { className: 'script-pane-left' });
  const rightPane = Object.assign(document.createElement('div'), { className: 'script-pane-right' });
  const stage = Object.assign(document.createElement('div'), { className: 'script-stage' });

  const renderAll = (script: CompiledScript) => {
    cachedScript = script;
    stage.replaceChildren(
      renderPacingTimeline(script),
      renderScriptCardView(script, cachedBeatIdx, (idx) => { cachedBeatIdx = idx; renderAll(script); }, opts?.onToast),
    );
    rightPane.replaceChildren(
      renderTeleprompterView(script),
      renderSafeZoneView(script, cachedBeatIdx, cachedPlatform, (p) => { cachedPlatform = p; }),
    );
  };

  const savedBar = renderScriptSavedBar((rec) => {
    cachedDraftTopic = rec.topic;
    cachedBlueprintId = rec.blueprintId;
    topicInput.value = rec.topic;
    bpSelect.value = rec.blueprintId;
    cachedBeatIdx = 0;
    renderAll(compileScript({ topic: rec.topic, blueprintId: rec.blueprintId }));
  }, opts?.onToast);

  bpSelect.addEventListener('change', () => {
    cachedBlueprintId = bpSelect.value;
    cachedBeatIdx = 0;
    renderAll(compileScript({ topic: topicInput.value, blueprintId: cachedBlueprintId }));
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    seedStageTopic(topicInput.value);
    renderAll(cachedScript!);
  });
  saveBtn.addEventListener('click', async () => {
    if (!cachedScript) return;
    const profileId = getActiveProfileId();
    const now = Date.now();
    await saveScript({ ...cachedScript, profileId, createdAt: now, updatedAt: now });
    publishSync({ type: 'script:saved', profileId, targetId: cachedScript.id });
    await savedBar.refresh();
    opts?.onToast?.('Saved to Local IndexedDB Vault');
  });

  leftPane.append(form, stage);
  split.append(leftPane, rightPane);
  section.append(header, savedBar.element, split);
  renderAll(cachedScript!);
  return section;
}
