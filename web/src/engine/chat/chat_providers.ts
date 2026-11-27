import type { EngineConfig } from '../../types.ts';
import type { ChatMessage } from '../storage/storage_types.ts';

const POLLINATIONS_CHAT_URL = 'https://text.pollinations.ai/openai';

export async function callByokChatProvider(
  config: EngineConfig,
  system: string,
  history: ChatMessage[],
): Promise<string> {
  const key = config.apiKey.trim();
  if (!key) throw new Error('Missing API key');

  if (config.sourceMode === 'gemini') {
    const model = config.model.trim() || 'gemini-2.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;
    const contents = history.slice(-10).map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ system_instruction: { parts: [{ text: system }] }, contents }),
    });
    if (!resp.ok) throw new Error(`Gemini ${resp.status}`);
    const data = (await resp.json()) as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  }

  const base = config.sourceMode === 'groq' ? 'https://api.groq.com/openai/v1' : 'https://openrouter.ai/api/v1';
  const fallbackModel = config.sourceMode === 'groq' ? 'llama-3.3-70b-versatile' : 'google/gemini-2.5-flash';
  const resp = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: config.model.trim() || fallbackModel,
      messages: [
        { role: 'system', content: system },
        ...history.slice(-10).map((m) => ({ role: m.role, content: m.content })),
      ],
    }),
  });
  if (!resp.ok) throw new Error(`LLM ${resp.status}`);
  const data = (await resp.json()) as { choices?: Array<{ message?: { content?: string } }> };
  return data.choices?.[0]?.message?.content ?? '';
}

export async function callFreeChatProvider(
  system: string,
  history: ChatMessage[],
  timeoutMs = 14000,
): Promise<string> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const resp = await fetch(POLLINATIONS_CHAT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: ctrl.signal,
      body: JSON.stringify({
        model: 'openai-fast',
        messages: [
          { role: 'system', content: system },
          ...history.slice(-8).map((m) => ({ role: m.role, content: m.content })),
        ],
      }),
    });
    if (!resp.ok) throw new Error(`Free AI ${resp.status}`);
    const data = (await resp.json()) as { choices?: Array<{ message?: { content?: string } }> };
    return data.choices?.[0]?.message?.content?.trim() ?? '';
  } finally {
    clearTimeout(timer);
  }
}
