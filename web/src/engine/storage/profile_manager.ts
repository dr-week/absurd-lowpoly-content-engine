import { openStudioDb, STORE_PROFILES } from './idb_conn';
import type { StudioProfile } from './storage_types';

const DEFAULT_PROFILE_ID = 'default_creator';

export async function requestPersistentStorage(): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.storage?.persist) {
    return false;
  }
  try {
    const already = await navigator.storage.persisted();
    if (already) return true;
    return await navigator.storage.persist();
  } catch {
    return false;
  }
}

export async function ensureDefaultProfile(): Promise<StudioProfile> {
  const db = await openStudioDb();
  const existing = await new Promise<StudioProfile | null>((resolve, reject) => {
    const tx = db.transaction(STORE_PROFILES, 'readonly');
    const req = tx.objectStore(STORE_PROFILES).get(DEFAULT_PROFILE_ID);
    req.onsuccess = () => resolve((req.result as StudioProfile | undefined) ?? null);
    req.onerror = () => reject(req.error ?? new Error('Failed to read profile'));
  });
  if (existing) return existing;

  const persisted = await requestPersistentStorage();
  const profile: StudioProfile = {
    id: DEFAULT_PROFILE_ID,
    name: 'Creator Studio',
    persisted,
    createdAt: Date.now(),
  };
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_PROFILES, 'readwrite');
    tx.objectStore(STORE_PROFILES).put(profile);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('Failed to save profile'));
  });
  return profile;
}
