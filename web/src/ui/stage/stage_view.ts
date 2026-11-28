import { COMEDY_BLUEPRINTS } from '../../engine/script/blueprints_comedy.ts';
import { compileScript } from '../../engine/script/script_compiler.ts';
import type { ScoredTopic } from '../../types.ts';
import { uiGlyphs } from '../glyphs.ts';
import { renderPacingTimeline } from './pacing_timeline.ts';
import { renderSafeZoneView } from './safe_zone_view.ts';
import { renderScriptCardView } from './script_card_view.ts';
import { renderScriptSavedBar } from './script_saved_bar.ts';
import { stageStore } from './stage_state.ts';
import { renderTeleprompterView } from './teleprompter_view.ts';

export const seedStageTopic = (txt: string): void => stageStore.seedTopic(txt);

export function renderStageView(opts?: {
  activeTopic?: ScoredTopic;
  onToast?: (msg: string) => void;
  onOpenInChat?: (topicText: string) => void;
}): HTMLElement {
  stageStore.bootStorage();
  stageStore.syncActiveTopic(opts?.activeTopic);

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
    bpSelect.appendChild(Object.assign(document.createElement('option'), { value: bp.id, selected: bp.id === stageStore.blueprintId, textContent: `${bp.name} · ${bp.style}` }));
  }
  const demoBtn = Object.assign(document.createElement('button'), { type: 'button', className: 'btn', title: 'Load a ready-to-rehearse 5-beat demo script' });
  demoBtn.innerHTML = `${uiGlyphs.play()}<span>Load Demo Script</span>`;
  const chatBtn = Object.assign(document.createElement('button'), { type: 'button', className: 'btn', title: 'Co-write in AI Chat' });
  chatBtn.innerHTML = `${uiGlyphs.chat()}<span>AI Chat</span>`;
  const saveBtn = Object.assign(document.createElement('button'), { type: 'button', className: 'btn' });
  saveBtn.innerHTML = `${uiGlyphs.save()}<span>Save Local</span>`;
  headerActions.append(bpSelect, demoBtn, chatBtn, saveBtn);
  header.append(titleGroup, headerActions);

  const form = Object.assign(document.createElement('form'), { className: 'script-composer-form' });
  const topicInput = Object.assign(document.createElement('input'), {
    type: 'text',
    className: 'compact-input script-topic-input',
    placeholder: 'Premise to compile into 5 retention beats...',
    value: stageStore.draftTopic,
  });
  topicInput.addEventListener('input', () => { stageStore.draftTopic = topicInput.value; });
  demoBtn.addEventListener('click', () => {
    const demoTopic = 'Society lift maintenance fee & Pigeon GST';
    topicInput.value = demoTopic;
    stageStore.seedTopic(demoTopic);
    renderSubpanels();
    opts?.onToast?.('Loaded 5-beat demo script');
  });
  chatBtn.addEventListener('click', () => opts?.onOpenInChat?.(topicInput.value));

  const genBtn = Object.assign(document.createElement('button'), { type: 'submit', className: 'btn btn--primary' });
  genBtn.innerHTML = `${uiGlyphs.spark()}<span>Compile 5-Beat</span>`;
  form.append(topicInput, genBtn);

  const split = Object.assign(document.createElement('div'), { className: 'script-split-pane' });
  const leftPane = Object.assign(document.createElement('div'), { className: 'script-pane-left' });
  const rightPane = Object.assign(document.createElement('div'), { className: 'script-pane-right' });
  const stage = Object.assign(document.createElement('div'), { className: 'script-stage' });

  const renderSubpanels = () => {
    let pacingEl = renderPacingTimeline(stageStore.script);
    const cardEl = renderScriptCardView(
      stageStore.script,
      stageStore.beatIdx,
      (idx) => { stageStore.beatIdx = idx; renderSubpanels(); },
      opts?.onToast,
      () => {
        const nextPacing = renderPacingTimeline(stageStore.script);
        pacingEl.replaceWith(nextPacing);
        pacingEl = nextPacing;
        void stageStore.persistCurrent();
      },
    );
    stage.replaceChildren(pacingEl, cardEl);
    rightPane.replaceChildren(
      renderTeleprompterView(stageStore.script),
      renderSafeZoneView(stageStore.script, stageStore.beatIdx, stageStore.platform, (p) => { stageStore.platform = p; }),
    );
  };

  const savedBar = renderScriptSavedBar((rec) => {
    stageStore.loadSaved(rec);
    topicInput.value = rec.topic;
    bpSelect.value = rec.blueprintId ?? rec.niche;
    renderSubpanels();
  }, opts?.onToast);

  bpSelect.addEventListener('change', () => {
    stageStore.blueprintId = bpSelect.value;
    stageStore.beatIdx = 0;
    stageStore.script = compileScript({ topic: topicInput.value, niche: stageStore.blueprintId as any });
    renderSubpanels();
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    stageStore.seedTopic(topicInput.value);
    renderSubpanels();
  });
  saveBtn.addEventListener('click', async () => {
    await stageStore.persistCurrent();
    await savedBar.refresh();
    opts?.onToast?.('Saved to Local IndexedDB Vault');
  });

  leftPane.append(form, stage);
  split.append(leftPane, rightPane);
  section.append(header, savedBar.element, split);
  renderSubpanels();
  return section;
}
