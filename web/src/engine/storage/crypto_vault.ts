import type { VaultEntry } from './storage_types';

const SESSION_KEY_PREFIX = 'absurd_studio_byok_';

function toB64(bytes: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < bytes.length; i += 1) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

function fromB64(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) out[i] = bin.charCodeAt(i);
  return out;
}

async function deriveAesKey(pin: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(pin),
    'PBKDF2',
    false,
    ['deriveKey'],
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt.buffer as ArrayBuffer, iterations: 100_000, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

export function setEphemeralKey(provider: string, apiKey: string): void {
  if (typeof sessionStorage === 'undefined') return;
  sessionStorage.setItem(`${SESSION_KEY_PREFIX}${provider}`, apiKey.trim());
}

export function getEphemeralKey(provider: string): string | null {
  if (typeof sessionStorage === 'undefined') return null;
  return sessionStorage.getItem(`${SESSION_KEY_PREFIX}${provider}`);
}

export function clearEphemeralKey(provider: string): void {
  if (typeof sessionStorage === 'undefined') return;
  sessionStorage.removeItem(`${SESSION_KEY_PREFIX}${provider}`);
}

export async function encryptSecretWithPin(
  id: string,
  label: string,
  secret: string,
  pin: string,
): Promise<VaultEntry> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveAesKey(pin, salt);
  const cipher = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(secret),
  );
  return {
    id,
    label,
    cipherTextB64: toB64(new Uint8Array(cipher)),
    ivB64: toB64(iv),
    saltB64: toB64(salt),
    updatedAt: Date.now(),
  };
}

export async function decryptSecretWithPin(entry: VaultEntry, pin: string): Promise<string> {
  const key = await deriveAesKey(pin, fromB64(entry.saltB64));
  const iv = fromB64(entry.ivB64);
  const cipher = fromB64(entry.cipherTextB64);
  const plain = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv.buffer as ArrayBuffer },
    key,
    cipher.buffer as ArrayBuffer,
  );
  return new TextDecoder().decode(plain);
}
