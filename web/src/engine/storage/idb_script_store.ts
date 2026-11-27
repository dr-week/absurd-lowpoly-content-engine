import { STORE_SCRIPTS, openStudioDb, withStore } from './idb_conn.ts';
import type { ScriptRecord } from './storage_types.ts';

export async function saveScript(record: ScriptRecord): Promise<ScriptRecord> {
  const updated: ScriptRecord = {
    ...record,
    updatedAt: Date.now(),
  };
  await withStore(STORE_SCRIPTS, 'readwrite', (store) => store.put(updated));
  return updated;
}

export async function getScript(id: string): Promise<ScriptRecord | undefined> {
  return withStore<ScriptRecord | undefined>(STORE_SCRIPTS, 'readonly', (store) =>
    store.get(id)
  );
}

export async function listScriptsByProfile(profileId: string): Promise<ScriptRecord[]> {
  const db = await openStudioDb();
  return new Promise<ScriptRecord[]>((resolve, reject) => {
    const tx = db.transaction(STORE_SCRIPTS, 'readonly');
    const store = tx.objectStore(STORE_SCRIPTS);
    const idx = store.index('profileId');
    const req = idx.getAll(profileId);
    req.onsuccess = () => {
      const items = (req.result as ScriptRecord[]) ?? [];
      items.sort((a, b) => b.updatedAt - a.updatedAt);
      resolve(items);
    };
    req.onerror = () => reject(req.error ?? new Error('Failed to list scripts'));
  });
}

export async function deleteScript(id: string): Promise<void> {
  await withStore(STORE_SCRIPTS, 'readwrite', (store) => store.delete(id));
}
