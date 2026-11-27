const SESSION_KEY_STORAGE = 'absurd_vault_session_key';

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function fromBase64(b64: string): Uint8Array<ArrayBuffer> {
  const binary = atob(b64);
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function getOrCreateSessionSecret(): string {
  if (typeof sessionStorage === 'undefined') return 'ephemeral-fallback';
  let secret = sessionStorage.getItem(SESSION_KEY_STORAGE);
  if (!secret) {
    const raw = crypto.getRandomValues(new Uint8Array(32));
    secret = toBase64(raw);
    sessionStorage.setItem(SESSION_KEY_STORAGE, secret);
  }
  return secret;
}

export function clearSessionSecret(): void {
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.removeItem(SESSION_KEY_STORAGE);
  }
}

async function deriveAesKey(passphrase: string, salt: Uint8Array<ArrayBuffer>): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptSecret(
  plaintext: string,
  passphrase: string = getOrCreateSessionSecret()
): Promise<{ iv: string; ciphertext: string; salt: string }> {
  const salt = new Uint8Array(new ArrayBuffer(16));
  crypto.getRandomValues(salt);
  const iv = new Uint8Array(new ArrayBuffer(12));
  crypto.getRandomValues(iv);
  const key = await deriveAesKey(passphrase, salt);
  const encoded = new TextEncoder().encode(plaintext);
  const buf = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);
  return {
    iv: toBase64(iv),
    ciphertext: toBase64(new Uint8Array(buf)),
    salt: toBase64(salt),
  };
}

export async function decryptSecret(
  payload: { iv: string; ciphertext: string; salt: string },
  passphrase: string = getOrCreateSessionSecret()
): Promise<string> {
  const salt = fromBase64(payload.salt);
  const iv = fromBase64(payload.iv);
  const ciphertext = fromBase64(payload.ciphertext);
  const key = await deriveAesKey(passphrase, salt);
  const buf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
  return new TextDecoder().decode(buf);
}
