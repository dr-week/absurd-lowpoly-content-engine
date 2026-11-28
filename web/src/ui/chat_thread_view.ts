import type { ScriptNiche } from '../engine/storage/storage_types';

export interface ChatTurn {
  id: string;
  role: 'user' | 'assistant';
  niche?: ScriptNiche;
  text: string;
}

function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function renderChatThread(turns: ChatTurn[]): string {
  if (turns.length === 0) {
    return `<div class="chat-thread-empty">
      Enter a topic below and pick a niche to compile a 5-Beat Retention Script.
    </div>`;
  }

  return `<div class="chat-thread">${turns
    .map((t) => {
      const badge = t.niche ? `<span class="chat-niche-badge">${t.niche}</span>` : '';
      return `<div class="chat-turn is-${t.role}">
        <div class="chat-turn-meta">${t.role === 'user' ? 'Creator' : 'Studio Engine'} ${badge}</div>
        <div class="chat-turn-body">${escapeHtml(t.text)}</div>
      </div>`;
    })
    .join('')}</div>`;
}
