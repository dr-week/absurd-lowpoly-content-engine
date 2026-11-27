import { STORE_PROFILES, withStore } from './idb_conn.ts';
import type { StoragePersistenceStatus, StudioProfile } from './storage_types.ts';

const ACTIVE_PROFILE_KEY = 'absurd_active_profile_id';
const DEFAULT_PROFILE_ID = 'default-creator';

export async function requestStoragePersistence(): Promise<StoragePersistenceStatus> {
  if (typeof navigator === 'undefined' || !navigator.storage) {
    return { supported: false, persisted: false };
  }
  let persisted = false;
  if (typeof navigator.storage.persisted === 'function') {
    persisted = await navigator.storage.persisted();
  }
  if (!persisted && typeof navigator.storage.persist === 'function') {
    persisted = await navigator.storage.persist();
  }
  const estimate =
    typeof navigator.storage.estimate === 'function'
      ? await navigator.storage.estimate()
      : undefined;

  return {
    supported: true,
    persisted,
    usageBytes: estimate?.usage,
    quotaBytes: estimate?.quota,
  };
}

export function getActiveProfileId(): string {
  if (typeof localStorage === 'undefined') return DEFAULT_PROFILE_ID;
  return localStorage.getItem(ACTIVE_PROFILE_KEY) || DEFAULT_PROFILE_ID;
}

export function setActiveProfileId(profileId: string): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(ACTIVE_PROFILE_KEY, profileId);
  }
}

export async function ensureDefaultProfile(): Promise<StudioProfile> {
  const id = getActiveProfileId();
  const existing = await withStore<StudioProfile | undefined>(
    STORE_PROFILES,
    'readonly',
    (s) => s.get(id)
  );
  if (existing) return existing;

  const now = Date.now();
  const profile: StudioProfile = {
    id,
    name: 'Creator Studio',
    createdAt: now,
    updatedAt: now,
    persisted: false,
  };
  await withStore(STORE_PROFILES, 'readwrite', (s) => s.put(profile));
  return profile;
}
