import { STORE_VAULT, openStudioDb, withStore } from './idb_conn.ts';
import type { VaultRecord } from './storage_types.ts';

export async function saveVaultRecord(record: VaultRecord): Promise<VaultRecord> {
  const updated: VaultRecord = {
    ...record,
    updatedAt: Date.now(),
  };
  await withStore(STORE_VAULT, 'readwrite', (store) => store.put(updated));
  return updated;
}

export async function getVaultRecord(id: string): Promise<VaultRecord | undefined> {
  return withStore<VaultRecord | undefined>(STORE_VAULT, 'readonly', (store) =>
    store.get(id)
  );
}

export async function listVaultByProfile(profileId: string): Promise<VaultRecord[]> {
  const db = await openStudioDb();
  return new Promise<VaultRecord[]>((resolve, reject) => {
    const tx = db.transaction(STORE_VAULT, 'readonly');
    const store = tx.objectStore(STORE_VAULT);
    const idx = store.index('profileId');
    const req = idx.getAll(profileId);
    req.onsuccess = () => resolve((req.result as VaultRecord[]) ?? []);
    req.onerror = () => reject(req.error ?? new Error('Failed to list vault records'));
  });
}

export async function deleteVaultRecord(id: string): Promise<void> {
  await withStore(STORE_VAULT, 'readwrite', (store) => store.delete(id));
}
