import type { SyncMessage, SyncMessageType } from './storage_types';

const CHANNEL_NAME = 'absurd_script_studio_bus';
const TAB_ID = `tab_${Math.random().toString(36).slice(2, 10)}`;

export type SyncListener = (msg: SyncMessage) => void;

export class StudioBroadcastBus {
  private channel: BroadcastChannel | null = null;
  private listeners = new Set<SyncListener>();

  constructor() {
    if (typeof BroadcastChannel !== 'undefined') {
      this.channel = new BroadcastChannel(CHANNEL_NAME);
      this.channel.onmessage = (ev: MessageEvent<SyncMessage>) => {
        if (!ev.data || ev.data.senderId === TAB_ID) return;
        this.listeners.forEach((fn) => fn(ev.data));
      };
    }
  }

  publish(type: SyncMessageType, payloadId: string): void {
    if (!this.channel) return;
    const msg: SyncMessage = {
      type,
      payloadId,
      senderId: TAB_ID,
      timestamp: Date.now(),
    };
    this.channel.postMessage(msg);
  }

  subscribe(listener: SyncListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  close(): void {
    this.listeners.clear();
    this.channel?.close();
    this.channel = null;
  }
}

export const studioBus = new StudioBroadcastBus();
