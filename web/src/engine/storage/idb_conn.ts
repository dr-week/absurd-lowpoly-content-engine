export const IDB_NAME = 'absurd_script_studio_v1';
export const IDB_VERSION = 1;
export const STORE_SCRIPTS = 'scripts';
export const STORE_VAULT = 'vault';
export const STORE_PROFILES = 'profiles';
export const STORE_THREADS = 'threads';

let dbPromise: Promise<IDBDatabase> | null = null;

export function openStudioDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB unavailable in this environment'));
      return;
    }

    const req = indexedDB.open(IDB_NAME, IDB_VERSION);

    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_SCRIPTS)) {
        const s = db.createObjectStore(STORE_SCRIPTS, { keyPath: 'id' });
        s.createIndex('by_profile', 'profileId', { unique: false });
        s.createIndex('by_updated', 'updatedAt', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORE_VAULT)) {
        db.createObjectStore(STORE_VAULT, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_PROFILES)) {
        db.createObjectStore(STORE_PROFILES, { keyPath: 'id' });
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => {
      dbPromise = null;
      reject(req.error ?? new Error('Failed to open IndexedDB'));
    };
  });

  return dbPromise;
}

export function resetDbCacheForTests(): void {
  dbPromise = null;
}

export async function withStore<T>(
  storeName: string,
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T> | void,
): Promise<T> {
  const db = await openStudioDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const req = fn(tx.objectStore(storeName));
    tx.oncomplete = () => resolve((req ? req.result : undefined) as T);
    tx.onerror = () => reject(tx.error ?? new Error(`IDB error on ${storeName}`));
  });
}
