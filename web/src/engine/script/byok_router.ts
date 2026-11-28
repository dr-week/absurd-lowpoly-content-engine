import type { CompiledScript } from './script_types';
import { countSpokenWords, estimateSpokenSeconds } from './pacing_calc';
import { buildByokScriptPrompt } from './script_compiler';
import { compileWithGemini } from './gemini_compiler';

export type ByokProvider = 'gemini' | 'groq' | 'openrouter';

const ENDPOINTS: Record<Exclude<ByokProvider, 'gemini'>, string> = {
  groq: 'https://api.groq.com/openai/v1/chat/completions',
  openrouter: 'https://openrouter.ai/api/v1/chat/completions',
};

export async function compileWithByokOrFallback(
  provider: ByokProvider,
  apiKey: string,
  skeleton: CompiledScript,
  model?: string,
): Promise<CompiledScript> {
  if (!apiKey.trim()) return skeleton;
  try {
    if (provider === 'gemini') return await compileWithGemini(apiKey, skeleton, model || 'gemini-2.5-flash');
    const res = await fetch(ENDPOINTS[provider], {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey.trim()}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: model || (provider === 'groq' ? 'llama-3.3-70b-versatile' : 'openai/gpt-4o-mini'),
        response_format: { type: 'json_object' },
        messages: [{ role: 'user', content: buildByokScriptPrompt(skeleton) }],
      }),
    });
    if (!res.ok) return skeleton;
    const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const raw = data.choices?.[0]?.message?.content;
    if (!raw) return skeleton;
    const parsed = JSON.parse(raw) as { beats?: Array<{ spokenText?: string }> };
    const beats = skeleton.beats.map((b, i) => {
      const spokenText = parsed.beats?.[i]?.spokenText?.trim() || b.spokenText;
      return { ...b, spokenText, wordCount: countSpokenWords(spokenText), actualSec: estimateSpokenSeconds(spokenText) };
    });
    const totalWords = beats.reduce((acc, b) => acc + b.wordCount, 0);
    const totalSec = Number(beats.reduce((acc, b) => acc + b.actualSec, 0).toFixed(1));
    return { ...skeleton, beats, totalWords, totalSec, wordCount: totalWords, totalDurationSec: totalSec };
  } catch {
    return skeleton;
  }
}
