import type { EngineConfig, ScoredTopic } from '../../types.ts';
import type { ChatMessage } from '../storage/storage_types.ts';
import { buildChatSystemPrompt, buildOfflineCowriterReply } from './chat_prompts.ts';
import { callByokChatProvider, callFreeChatProvider } from './chat_providers.ts';

const EMOJI_RE = /[\p{Extended_Pictographic}\uFE0F]/gu;

export function sanitizeChatText(raw: string): string {
  return raw.replace(EMOJI_RE, '').replace(/\n{3,}/g, '\n\n').trim();
}

export async function generateChatReply(
  config: EngineConfig,
  messages: ChatMessage[],
  activeTopic?: ScoredTopic,
): Promise<string> {
  const lastUser = [...messages].reverse().find((m) => m.role === 'user')?.content ?? '';
  const system = buildChatSystemPrompt(activeTopic);

  try {
    if (config.sourceMode === 'gemini' || config.sourceMode === 'groq' || config.sourceMode === 'openrouter') {
      const out = await callByokChatProvider(config, system, messages);
      if (out.trim()) return sanitizeChatText(out);
    }
    if (config.sourceMode !== 'standalone') {
      const freeOut = await callFreeChatProvider(system, messages);
      if (freeOut) return sanitizeChatText(freeOut);
    }
  } catch {
    // Fall back to deterministic offline comedy co-writer
  }

  return sanitizeChatText(buildOfflineCowriterReply(lastUser, activeTopic));
}
