import { describe, it, expect } from 'vitest';
import {
  encryptSecretWithPin,
  decryptSecretWithPin,
} from '../src/engine/storage/crypto_vault';

describe('crypto_vault (AES-256-GCM)', () => {
  it('round-trips a secret with the correct PIN', async () => {
    const secret = 'sk-test-byok-secret-12345';
    const pin = '4920';
    const entry = await encryptSecretWithPin('key_1', 'Gemini Key', secret, pin);

    expect(entry.id).toBe('key_1');
    expect(entry.label).toBe('Gemini Key');
    expect(entry.cipherTextB64).toBeTruthy();
    expect(entry.cipherTextB64).not.toContain(secret);

    const decrypted = await decryptSecretWithPin(entry, pin);
    expect(decrypted).toBe(secret);
  });

  it('rejects decryption with an incorrect PIN', async () => {
    const entry = await encryptSecretWithPin('key_2', 'OpenAI', 'sk-secret', '1234');
    await expect(decryptSecretWithPin(entry, '9999')).rejects.toThrow();
  });
});
