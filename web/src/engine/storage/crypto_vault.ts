const SESSION_KEY = 'absurd_vault_session_key';

const toB64 = (b: Uint8Array): string => btoa(String.fromCharCode(...b));

function fromB64(s: string): Uint8Array<ArrayBuffer> {
  const bin = atob(s);
  const out = new Uint8Array(new ArrayBuffer(bin.length));
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export function getOrCreateSessionSecret(): string {
  if (typeof sessionStorage === 'undefined') return 'ephemeral-fallback';
  let key = sessionStorage.getItem(SESSION_KEY);
  if (!key) {
    key = toB64(crypto.getRandomValues(new Uint8Array(32)));
    sessionStorage.setItem(SESSION_KEY, key);
  }
  return key;
}

export function clearSessionSecret(): void {
  if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem(SESSION_KEY);
}

async function deriveKey(pin: string, salt: Uint8Array<ArrayBuffer>): Promise<CryptoKey> {
  const base = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(pin),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' },
    base,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptSecret(
  plaintext: string,
  pin: string = getOrCreateSessionSecret()
): Promise<{ iv: string; ciphertext: string; salt: string }> {
  const salt = crypto.getRandomValues(new Uint8Array(new ArrayBuffer(16)));
  const iv = crypto.getRandomValues(new Uint8Array(new ArrayBuffer(12)));
  const key = await deriveKey(pin, salt);
  const buf = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(plaintext)
  );
  return { iv: toB64(iv), ciphertext: toB64(new Uint8Array(buf)), salt: toB64(salt) };
}

export async function decryptSecret(
  payload: { iv: string; ciphertext: string; salt: string },
  pin: string = getOrCreateSessionSecret()
): Promise<string> {
  const key = await deriveKey(pin, fromB64(payload.salt));
  const buf = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: fromB64(payload.iv) },
    key,
    fromB64(payload.ciphertext)
  );
  return new TextDecoder().decode(buf);
}
