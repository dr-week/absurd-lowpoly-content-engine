export const DB_NAME = 'absurd_script_studio_v1';
export const DB_VERSION = 2;

export const STORE_SCRIPTS = 'scripts';
export const STORE_VAULT = 'vault';
export const STORE_PROFILES = 'profiles';
export const STORE_THREADS = 'threads';

let dbPromise: Promise<IDBDatabase> | null = null;

export function openStudioDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  if (typeof indexedDB === 'undefined') {
    return Promise.reject(new Error('IndexedDB is unavailable in this environment.'));
  }

  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_SCRIPTS)) {
        const scripts = db.createObjectStore(STORE_SCRIPTS, { keyPath: 'id' });
        scripts.createIndex('profileId', 'profileId', { unique: false });
        scripts.createIndex('updatedAt', 'updatedAt', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORE_VAULT)) {
        const vault = db.createObjectStore(STORE_VAULT, { keyPath: 'id' });
        vault.createIndex('profileId', 'profileId', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORE_PROFILES)) {
        db.createObjectStore(STORE_PROFILES, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_THREADS)) {
        const threads = db.createObjectStore(STORE_THREADS, { keyPath: 'id' });
        threads.createIndex('profileId', 'profileId', { unique: false });
        threads.createIndex('updatedAt', 'updatedAt', { unique: false });
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => {
      dbPromise = null;
      reject(req.error ?? new Error('Failed to open IndexedDB.'));
    };
  });

  return dbPromise;
}

export async function withStore<T>(
  storeName: string,
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const db = await openStudioDb();
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const req = fn(tx.objectStore(storeName));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error(`IDB request failed on ${storeName}`));
  });
}
