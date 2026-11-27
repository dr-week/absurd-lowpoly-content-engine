import { COMEDY_BLUEPRINTS } from '../../engine/script/blueprints_comedy.ts';
import { compileScript, type CompiledScript } from '../../engine/script/script_compiler.ts';
import { publishSync } from '../../engine/storage/broadcast_sync.ts';
import { saveScript } from '../../engine/storage/idb_script_store.ts';
import { ensureDefaultProfile, getActiveProfileId, requestStoragePersistence } from '../../engine/storage/profile_manager.ts';
import type { ScriptRecord } from '../../engine/storage/storage_types.ts';
import type { ScoredTopic } from '../../types.ts';

export type SafeZonePlatform = 'reels' | 'tiktok' | 'shorts';

class StageStore {
  private lastSyncedTopicId: string | null = null;
  private booted = false;
  draftTopic = 'Society lift maintenance fee';
  blueprintId = COMEDY_BLUEPRINTS[0].id;
  script: CompiledScript = compileScript({ topic: this.draftTopic, blueprintId: this.blueprintId });
  beatIdx = 0;
  platform: SafeZonePlatform = 'reels';

  bootStorage(): void {
    if (this.booted) return;
    this.booted = true;
    void requestStoragePersistence();
    void ensureDefaultProfile().catch(() => {});
  }

  seedTopic(topicText: string): void {
    this.draftTopic = topicText.trim() || this.draftTopic;
    this.beatIdx = 0;
    this.script = compileScript({ topic: this.draftTopic, blueprintId: this.blueprintId });
  }

  syncActiveTopic(activeTopic?: ScoredTopic): void {
    if (activeTopic && activeTopic.id !== this.lastSyncedTopicId) {
      this.lastSyncedTopicId = activeTopic.id;
      this.seedTopic(activeTopic.title);
    }
  }

  loadSaved(rec: ScriptRecord): void {
    this.draftTopic = rec.topic;
    this.blueprintId = rec.blueprintId;
    this.beatIdx = 0;
    this.script = compileScript({ topic: rec.topic, blueprintId: rec.blueprintId });
  }

  async persistCurrent(): Promise<void> {
    const profileId = getActiveProfileId();
    const now = Date.now();
    await saveScript({ ...this.script, profileId, createdAt: now, updatedAt: now });
    publishSync({ type: 'script:saved', profileId, targetId: this.script.id });
  }
}

export const stageStore = new StageStore();
