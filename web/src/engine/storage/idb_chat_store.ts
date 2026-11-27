import { STORE_THREADS, openStudioDb, withStore } from './idb_conn.ts';
import type { ChatThread } from './storage_types.ts';

export async function saveChatThread(thread: ChatThread): Promise<ChatThread> {
  const updated: ChatThread = { ...thread, updatedAt: Date.now() };
  await withStore(STORE_THREADS, 'readwrite', (s) => s.put(updated));
  return updated;
}

export async function getChatThread(id: string): Promise<ChatThread | undefined> {
  return withStore<ChatThread | undefined>(STORE_THREADS, 'readonly', (s) => s.get(id));
}

export async function listThreadsByProfile(profileId: string): Promise<ChatThread[]> {
  const db = await openStudioDb();
  return new Promise<ChatThread[]>((resolve, reject) => {
    const tx = db.transaction(STORE_THREADS, 'readonly');
    const req = tx.objectStore(STORE_THREADS).index('profileId').getAll(profileId);
    req.onsuccess = () => {
      const list = (req.result as ChatThread[]) ?? [];
      list.sort((a, b) => b.updatedAt - a.updatedAt);
      resolve(list);
    };
    req.onerror = () => reject(req.error ?? new Error('Failed to list chat threads'));
  });
}

export async function deleteChatThread(id: string): Promise<void> {
  await withStore(STORE_THREADS, 'readwrite', (s) => s.delete(id));
}
