import { publishSync, subscribeSync } from '../engine/storage/broadcast_sync.ts';
import { deleteScript, listScriptsByProfile } from '../engine/storage/idb_script_store.ts';
import { getActiveProfileId } from '../engine/storage/profile_manager.ts';
import type { ScriptRecord } from '../engine/storage/storage_types.ts';
import { uiGlyphs } from './glyphs.ts';

export function renderScriptSavedBar(
  onLoadRecord: (rec: ScriptRecord) => void,
  onToast?: (msg: string) => void,
): { element: HTMLElement; refresh: () => Promise<void> } {
  const bar = document.createElement('div');
  bar.className = 'script-saved-bar';
  bar.hidden = true;

  const refresh = async (): Promise<void> => {
    try {
      const items = await listScriptsByProfile(getActiveProfileId());
      if (!items.length) {
        bar.hidden = true;
        return;
      }
      bar.hidden = false;
      const label = document.createElement('span');
      label.className = 'script-saved-bar__label';
      label.textContent = `Local Vault (${items.length})`;
      const chips: HTMLElement[] = [label];

      for (const rec of items.slice(0, 8)) {
        const chip = document.createElement('span');
        chip.className = 'script-saved-chip';

        const loadBtn = document.createElement('button');
        loadBtn.type = 'button';
        loadBtn.className = 'script-saved-chip__load';
        loadBtn.textContent = rec.topic;
        loadBtn.title = `Load "${rec.title}"`;
        loadBtn.addEventListener('click', () => {
          onLoadRecord(rec);
          onToast?.(`Loaded "${rec.topic}"`);
        });

        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.className = 'script-saved-chip__del';
        delBtn.title = 'Delete from IndexedDB';
        delBtn.appendChild(uiGlyphs.close(11));
        delBtn.addEventListener('click', async () => {
          await deleteScript(rec.id);
          publishSync({ type: 'script:deleted', profileId: rec.profileId, targetId: rec.id });
          onToast?.('Removed saved script');
          await refresh();
        });

        chip.append(loadBtn, delBtn);
        chips.push(chip);
      }
      bar.replaceChildren(...chips);
    } catch {
      bar.hidden = true;
    }
  };

  subscribeSync((msg) => {
    if (msg.type === 'script:saved' || msg.type === 'script:deleted') void refresh();
  });

  void refresh();
  return { element: bar, refresh };
}
