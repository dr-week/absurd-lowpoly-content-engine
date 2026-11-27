import { COMEDY_BLUEPRINTS } from '../engine/script/blueprints_comedy.ts';
import { compileScript, type CompiledScript } from '../engine/script/script_compiler.ts';
import { publishSync } from '../engine/storage/broadcast_sync.ts';
import { saveScript } from '../engine/storage/idb_script_store.ts';
import { getActiveProfileId } from '../engine/storage/profile_manager.ts';
import { uiGlyphs } from './glyphs.ts';
import { renderPacingTimeline } from './pacing_timeline.ts';
import { renderSafeZoneView } from './safe_zone_view.ts';
import { renderScriptCardView } from './script_card_view.ts';
import { renderTeleprompterView } from './teleprompter_view.ts';

export function renderScriptChatSection(): HTMLElement {
  const section = document.createElement('section');
  section.id = 'section-script-studio';
  section.className = 'script-studio-section';

  const split = document.createElement('div');
  split.className = 'script-split-pane';

  const leftPane = document.createElement('div');
  leftPane.className = 'script-pane-left';

  const rightPane = document.createElement('div');
  rightPane.className = 'script-pane-right';

  const form = document.createElement('form');
  form.className = 'script-composer-form';

  const topicInput = document.createElement('input');
  topicInput.type = 'text';
  topicInput.className = 'script-topic-input';
  topicInput.placeholder = 'Topic (e.g. Society lift maintenance fee)';
  topicInput.value = 'Society lift maintenance fee';

  const bpSelect = document.createElement('select');
  bpSelect.className = 'script-blueprint-select';
  for (const bp of COMEDY_BLUEPRINTS) {
    const opt = document.createElement('option');
    opt.value = bp.id;
    opt.textContent = bp.name;
    bpSelect.appendChild(opt);
  }

  const genBtn = document.createElement('button');
  genBtn.type = 'submit';
  genBtn.className = 'script-generate-btn';
  genBtn.append(uiGlyphs.spark(), document.createTextNode(' Compile 5-Beat Script'));

  const saveBtn = document.createElement('button');
  saveBtn.type = 'button';
  saveBtn.className = 'script-save-btn';
  saveBtn.append(uiGlyphs.save(), document.createTextNode(' Save Local'));

  form.append(topicInput, bpSelect, genBtn, saveBtn);

  const stage = document.createElement('div');
  stage.className = 'script-stage';

  let currentScript: CompiledScript = compileScript({
    topic: topicInput.value,
    blueprintId: bpSelect.value,
  });

  const renderAll = (script: CompiledScript) => {
    currentScript = script;
    stage.replaceChildren(
      renderPacingTimeline(script),
      renderScriptCardView(script)
    );
    rightPane.replaceChildren(
      renderTeleprompterView(script),
      renderSafeZoneView(script)
    );
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    renderAll(
      compileScript({
        topic: topicInput.value,
        blueprintId: bpSelect.value,
      })
    );
  });

  saveBtn.addEventListener('click', async () => {
    const profileId = getActiveProfileId();
    const now = Date.now();
    await saveScript({
      ...currentScript,
      profileId,
      createdAt: now,
      updatedAt: now,
    });
    publishSync({ type: 'script:saved', profileId, targetId: currentScript.id });
    saveBtn.textContent = 'Saved';
    setTimeout(() => {
      saveBtn.replaceChildren(uiGlyphs.save(), document.createTextNode(' Save Local'));
    }, 1200);
  });

  leftPane.append(form, stage);
  split.append(leftPane, rightPane);
  section.appendChild(split);

  renderAll(currentScript);
  return section;
}
