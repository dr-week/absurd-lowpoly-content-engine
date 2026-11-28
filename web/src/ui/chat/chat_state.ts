import { generateChatReply } from '../../engine/chat/chat_engine.ts';
import { publishSync, subscribeSync } from '../../engine/storage/broadcast_sync.ts';
import { deleteChatThread, listThreadsByProfile, saveChatThread } from '../../engine/storage/idb_chat_store.ts';
import { getActiveProfileId } from '../../engine/storage/profile_manager.ts';
import type { ChatThread } from '../../engine/storage/storage_types.ts';
import type { EngineConfig, ScoredTopic } from '../../types.ts';

export function extractSubjectLine(text: string): string {
  const first = text.split('\n').map((l) => l.replace(/\[[^\]]+\]/g, '').trim()).find(Boolean) ?? 'Custom Comedy Idea';
  return first.slice(0, 72);
}

class ChatStore {
  activeThread: ChatThread | null = null;
  threads: ChatThread[] = [];
  busy = false;
  private synced = false;

  ensureBound(onChange: () => void): void {
    if (!this.synced) {
      this.synced = true;
      subscribeSync((m) => {
        if (m.type === 'chat_updated') void this.reload(onChange);
      });
    }
    if (!this.threads.length) void this.reload(onChange);
  }

  async reload(onChange?: () => void): Promise<void> {
    const list = await listThreadsByProfile(getActiveProfileId()).catch(() => []);
    this.threads = list;
    if (!this.activeThread && list.length) this.activeThread = list[0];
    onChange?.();
  }

  seedPrompt(promptText: string): void {
    const profileId = getActiveProfileId();
    const now = Date.now();
    this.activeThread = {
      id: `thd_${now.toString(36)}`,
      profileId,
      title: extractSubjectLine(promptText),
      messages: [],
      updatedAt: now,
    };
  }

  async sendTurn(rawText: string, config: EngineConfig, activeTopic: ScoredTopic | undefined, onUpdate: () => void): Promise<void> {
    const text = rawText.trim();
    if (!text || this.busy) return;
    this.busy = true;
    const now = Date.now();
    const profileId = getActiveProfileId();
    if (!this.activeThread) this.seedPrompt(text);
    this.activeThread!.messages.push({ id: `m_${now}`, role: 'user', content: text, createdAt: now });
    onUpdate();

    try {
      const reply = await generateChatReply(config, this.activeThread!.messages, activeTopic);
      this.activeThread!.messages.push({ id: `m_${Date.now()}`, role: 'assistant', content: reply, createdAt: Date.now() });
      await saveChatThread(this.activeThread!).catch(() => {});
      this.threads = await listThreadsByProfile(profileId).catch(() => [this.activeThread!]);
      publishSync('chat_updated', this.activeThread!.id);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to generate reply';
      this.activeThread!.messages.push({
        id: `m_${Date.now()}`,
        role: 'system',
        content: `Error: ${msg}`,
        createdAt: Date.now(),
      });
    } finally {
      this.busy = false;
      onUpdate();
    }
  }

  async removeThread(id: string): Promise<void> {
    const profileId = getActiveProfileId();
    await deleteChatThread(id);
    publishSync('chat_updated', id);
    this.threads = await listThreadsByProfile(profileId).catch(() => []);
    if (this.activeThread?.id === id) this.activeThread = this.threads[0] ?? null;
  }
}

export const chatStore = new ChatStore();
