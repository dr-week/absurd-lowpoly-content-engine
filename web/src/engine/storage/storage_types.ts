export type SyncEventType =
  | 'script:saved'
  | 'script:deleted'
  | 'vault:updated'
  | 'profile:changed'
  | 'chat:updated';

export interface SyncMessage {
  type: SyncEventType;
  profileId: string;
  targetId?: string;
  timestamp: number;
}

export interface UserProfile {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  persisted?: boolean;
}

export type StudioProfile = UserProfile;

export interface UserSettings {
  profileId: string;
  defaultLanguage: string;
  defaultBlueprintId: string;
  teleprompterWpm: number;
  mirrorTeleprompter: boolean;
}

export interface ScriptRecord {
  id: string;
  profileId: string;
  title: string;
  topic: string;
  language: string;
  blueprintId: string;
  totalDurationSec: number;
  wordCount: number;
  beats: unknown[];
  cleanText: string;
  rehearsalText: string;
  createdAt: number;
  updatedAt: number;
}

export interface VaultRecord {
  id: string;
  profileId: string;
  label: string;
  iv: string;
  ciphertext: string;
  salt: string;
  createdAt: number;
  updatedAt: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: number;
}

export interface ChatThread {
  id: string;
  profileId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

export interface StoragePersistenceStatus {
  supported: boolean;
  persisted: boolean;
  usageBytes?: number;
  quotaBytes?: number;
}
