import type { CompiledScript } from './script_types';
import { countSpokenWords, estimateSpokenSeconds } from './pacing_calc';
import { buildByokScriptPrompt } from './script_compiler';

export async function compileWithGemini(
  apiKey: string,
  skeleton: CompiledScript,
  model = 'gemini-2.5-flash',
): Promise<CompiledScript> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey.trim())}`;
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: buildByokScriptPrompt(skeleton) }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            beats: {
              type: 'ARRAY',
              items: {
                type: 'OBJECT',
                properties: {
                  id: { type: 'STRING' },
                  spokenText: { type: 'STRING' },
                },
                required: ['id', 'spokenText'],
              },
            },
          },
          required: ['beats'],
        },
      },
    }),
  });
  if (!res.ok) throw new Error(`Gemini API error (${res.status})`);
  const data = (await res.json()) as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
  const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawJson) throw new Error('Empty Gemini response');
  const parsed = JSON.parse(rawJson) as { beats: Array<{ id: string; spokenText: string }> };

  const beats = skeleton.beats.map((b, i) => {
    const spokenText = parsed.beats[i]?.spokenText?.trim() || b.spokenText;
    return {
      ...b,
      spokenText,
      wordCount: countSpokenWords(spokenText),
      actualSec: estimateSpokenSeconds(spokenText),
    };
  });
  const totalWords = beats.reduce((acc, b) => acc + b.wordCount, 0);
  const totalSec = Number(beats.reduce((acc, b) => acc + b.actualSec, 0).toFixed(1));
  return { ...skeleton, beats, totalWords, totalSec, wordCount: totalWords, totalDurationSec: totalSec };
}
