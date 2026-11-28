import { openStudioDb, STORE_VAULT } from './idb_conn';
import type { VaultEntry } from './storage_types';

export async function saveVaultEntry(entry: VaultEntry): Promise<void> {
  const db = await openStudioDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_VAULT, 'readwrite');
    tx.objectStore(STORE_VAULT).put(entry);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('Failed to save vault entry'));
  });
}

export async function getVaultEntry(id: string): Promise<VaultEntry | null> {
  const db = await openStudioDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_VAULT, 'readonly');
    const req = tx.objectStore(STORE_VAULT).get(id);
    req.onsuccess = () => resolve((req.result as VaultEntry | undefined) ?? null);
    req.onerror = () => reject(req.error ?? new Error('Failed to read vault entry'));
  });
}

export async function deleteVaultEntry(id: string): Promise<void> {
  const db = await openStudioDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_VAULT, 'readwrite');
    tx.objectStore(STORE_VAULT).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('Failed to delete vault entry'));
  });
}
