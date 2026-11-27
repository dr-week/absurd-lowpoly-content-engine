import type { SyncMessage } from './storage_types.ts';

export const SYNC_CHANNEL_NAME = 'absurd_script_studio_bus';

let sharedChannel: BroadcastChannel | null = null;

function getChannel(): BroadcastChannel | null {
  if (typeof BroadcastChannel === 'undefined') return null;
  if (!sharedChannel) {
    sharedChannel = new BroadcastChannel(SYNC_CHANNEL_NAME);
  }
  return sharedChannel;
}

export function publishSync(
  msg: Omit<SyncMessage, 'timestamp'>
): void {
  const ch = getChannel();
  if (!ch) return;
  const payload: SyncMessage = {
    ...msg,
    timestamp: Date.now(),
  };
  ch.postMessage(payload);
}

export function subscribeSync(
  handler: (msg: SyncMessage) => void
): () => void {
  const ch = getChannel();
  if (!ch) return () => {};

  const listener = (event: MessageEvent<SyncMessage>) => {
    if (event.data && typeof event.data.type === 'string') {
      handler(event.data);
    }
  };
  ch.addEventListener('message', listener);
  return () => ch.removeEventListener('message', listener);
}
