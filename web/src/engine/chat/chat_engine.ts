import type { EngineConfig, ScoredTopic } from '../../types.ts';
import { compileScript } from '../script/script_compiler.ts';
import type { ChatMessage } from '../storage/storage_types.ts';

const POLLINATIONS_CHAT_URL = 'https://text.pollinations.ai/openai';
const EMOJI_RE = /[\p{Extended_Pictographic}\uFE0F]/gu;

function cleanReply(raw: string): string {
  return raw.replace(EMOJI_RE, '').replace(/\n{3,}/g, '\n\n').trim();
}

function buildSystemPrompt(activeTopic?: ScoredTopic): string {
  const ctx = activeTopic
    ? `Active Studio Topic: "${activeTopic.title}" — ${activeTopic.pitch} (Angle: ${activeTopic.angle}).`
    : 'No active studio topic selected yet.';
  return [
    'You are the Head Comedy Writer inside Absurd Studio (1998 PS1 low-poly deadpan Indian & global parody shorts).',
    'Write sharp, deadpan, visual-first comedy pitches, 20-second 5-Beat Reels scripts ([DEADPAN], [PAUSE:0.6s], [WHISPER], [CAMERA:zoom-in], [BEAT]), Hinglish dialogue passes, and A/B viral hooks.',
    'Use phonetic parody names when referencing figures (Elone Maask, Doland Trumpe, Moodi-G, Zuckerburge, Ambaani, Giga-Chaad, Salmaan Bhoi, Koohli).',
    'STRICT RULES: Zero emojis. Keep responses concise, structured with clean headings or numbered beats, ready to film or send to Storyboard Studio.',
    ctx,
  ].join(' ');
}

function buildOfflineReply(prompt: string, activeTopic?: ScoredTopic): string {
  const lower = prompt.toLowerCase();
  const subject = prompt
    .replace(/^(write|make|give me|create|punch up|convert|rewrite|pitch)\s+/i, '')
    .replace(/5-beat\s*(script|reel)?\s*(on|for|about)?/i, '')
    .trim() || activeTopic?.title || 'Society lift maintenance audit';

  if (lower.includes('hook')) {
    return [
      `3 Deadpan Hook Variants for: ${subject}`,
      `1. [DEADPAN] Nobody reads the notice board until "${subject}" becomes a felony. [PAUSE:0.5s]`,
      `2. [CAMERA:tight] At 6:42 AM, Uncleji declared martial law over ${subject}.`,
      `3. [WHISPER] Three engineers tried fixing ${subject}—two are now selling laminated forms.`,
    ].join('\n\n');
  }

  if (lower.includes('hinglish')) {
    return [
      `Hinglish Deadpan Pass — ${subject}`,
      `[01 Hook] [DEADPAN] Bhai sahab, ${subject} ka matter ab seedha Supreme Society Committee mein gaya hai. [PAUSE:0.6s]`,
      `[02 Setup] Subah 7 baje guard ne register khola aur mera naam red pen se underline kar diya.`,
      `[03 Escalation] [CAMERA:zoom-in] Secretary uncle ne laminated chart nikala [PAUSE:0.5s] aur bola posture ka GST alag lagega.`,
      `[04 Twist] [WHISPER] Pata chala yeh rule پچھلے Tuesday se mere hi Wi-Fi router pe chal raha tha. [BEAT]`,
      `[05 Payoff] [DEADPAN] Filhaal maine fine elaichi mein bhar diya hai. [PAUSE:0.8s]`,
    ].join('\n\n');
  }

  const compiled = compileScript({
    topic: subject.slice(0, 80),
    blueprintId: lower.includes('chaos') || lower.includes('roast') ? 'household-chaos' : 'absurd-deadpan',
  });
  return `${compiled.title} (${compiled.totalDurationSec}s · ${compiled.wordCount}w)\n\n${compiled.rehearsalText}`;
}

async function callByokChat(config: EngineConfig, system: string, history: ChatMessage[]): Promise<string> {
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
      messages: [{ role: 'system', content: system }, ...history.slice(-10).map((m) => ({ role: m.role, content: m.content }))],
    }),
  });
  if (!resp.ok) throw new Error(`LLM ${resp.status}`);
  const data = (await resp.json()) as { choices?: Array<{ message?: { content?: string } }> };
  return data.choices?.[0]?.message?.content ?? '';
}

export async function generateChatReply(
  config: EngineConfig,
  messages: ChatMessage[],
  activeTopic?: ScoredTopic,
): Promise<string> {
  const lastUser = [...messages].reverse().find((m) => m.role === 'user')?.content ?? '';
  const system = buildSystemPrompt(activeTopic);

  try {
    if (config.sourceMode === 'gemini' || config.sourceMode === 'groq' || config.sourceMode === 'openrouter') {
      const out = await callByokChat(config, system, messages);
      if (out.trim()) return cleanReply(out);
    }
    if (config.sourceMode !== 'standalone') {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 14000);
      try {
        const resp = await fetch(POLLINATIONS_CHAT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: ctrl.signal,
          body: JSON.stringify({
            model: 'openai-fast',
            messages: [{ role: 'system', content: system }, ...messages.slice(-8).map((m) => ({ role: m.role, content: m.content }))],
          }),
        });
        if (resp.ok) {
          const data = (await resp.json()) as { choices?: Array<{ message?: { content?: string } }> };
          const txt = data.choices?.[0]?.message?.content?.trim();
          if (txt) return cleanReply(txt);
        }
      } finally {
        clearTimeout(timer);
      }
    }
  } catch {
    // Graceful fallback to offline Writers' Room co-writer
  }

  return cleanReply(buildOfflineReply(lastUser, activeTopic));
}
