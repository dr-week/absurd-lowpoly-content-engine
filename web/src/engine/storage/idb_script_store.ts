import { openStudioDb, STORE_SCRIPTS } from './idb_conn';
import type { ScriptRecord } from './storage_types';

export async function saveScript(record: ScriptRecord): Promise<void> {
  const db = await openStudioDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_SCRIPTS, 'readwrite');
    tx.objectStore(STORE_SCRIPTS).put(record);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('Failed to save script'));
  });
}

export async function getScript(id: string): Promise<ScriptRecord | null> {
  const db = await openStudioDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_SCRIPTS, 'readonly');
    const req = tx.objectStore(STORE_SCRIPTS).get(id);
    req.onsuccess = () => resolve((req.result as ScriptRecord | undefined) ?? null);
    req.onerror = () => reject(req.error ?? new Error('Failed to load script'));
  });
}

export async function listScriptsByProfile(profileId: string): Promise<ScriptRecord[]> {
  const db = await openStudioDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_SCRIPTS, 'readonly');
    const idx = tx.objectStore(STORE_SCRIPTS).index('by_profile');
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
  const db = await openStudioDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_SCRIPTS, 'readwrite');
    tx.objectStore(STORE_SCRIPTS).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('Failed to delete script'));
  });
}
