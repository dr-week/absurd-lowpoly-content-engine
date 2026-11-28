export type ScriptNiche = 'tech' | 'history' | 'growth' | 'science';

export interface ScriptRecord {
  id: string;
  profileId: string;
  title: string;
  niche: ScriptNiche;
  blueprintId?: string;
  topic: string;
  durationSec: number;
  wordCount: number;
  beats: ScriptBeatRecord[];
  createdAt: number;
  updatedAt: number;
}

export interface ScriptBeatRecord {
  id: string;
  label: string;
  transition: string;
  spokenText: string;
  visualCue?: string;
  targetSec: number;
}

export interface VaultEntry {
  id: string;
  label: string;
  cipherTextB64: string;
  ivB64: string;
  saltB64: string;
  updatedAt: number;
}

export interface StudioProfile {
  id: string;
  name: string;
  persisted: boolean;
  createdAt: number;
}

export type SyncMessageType =
  | 'script_saved'
  | 'script_deleted'
  | 'chat_updated'
  | 'vault_updated'
  | 'profile_changed';

export interface SyncMessage {
  type: SyncMessageType;
  payloadId: string;
  senderId: string;
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: number;
}

export interface ChatThread {
  id: string;
  profileId: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: number;
}
