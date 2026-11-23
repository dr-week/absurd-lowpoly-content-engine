/**
 * Chrome Built-in AI (Gemini Nano / Prompt API) On-Device Adapter.
 * Enables $0-cost, offline-capable local browser inference when available in Chrome 138+.
 */

interface ChromeLanguageModelSession {
  prompt(input: string): Promise<string>;
  destroy?: () => void;
}

interface ChromeLanguageModelApi {
  availability?: () => Promise<string>;
  create: (opts?: { systemPrompt?: string }) => Promise<ChromeLanguageModelSession>;
}

function getChromeLanguageModel(): ChromeLanguageModelApi | null {
  if (typeof globalThis === 'undefined') return null;
  const g = globalThis as unknown as {
    LanguageModel?: ChromeLanguageModelApi;
    ai?: { languageModel?: ChromeLanguageModelApi };
  };
  return g.LanguageModel ?? g.ai?.languageModel ?? null;
}

export async function isChromeNanoAvailable(): Promise<boolean> {
  const api = getChromeLanguageModel();
  if (!api) return false;
  if (!api.availability) return true;
  try {
    const status = await api.availability();
    return status === 'available' || status === 'readily' || status === 'downloadable';
  } catch {
    return false;
  }
}

export async function generateWithChromeNano(systemPrompt: string, userPrompt: string): Promise<string> {
  const api = getChromeLanguageModel();
  if (!api) throw new Error('Chrome Built-in AI (Gemini Nano) not available in this browser');
  const session = await api.create({ systemPrompt });
  try {
    return await session.prompt(userPrompt);
  } finally {
    session.destroy?.();
  }
}
