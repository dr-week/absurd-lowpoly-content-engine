import { CHAT_STARTERS } from '../../engine/chat/chat_prompts.ts';
import type { ChatMessage } from '../../engine/storage/storage_types.ts';
import { uiGlyphs } from '../glyphs.ts';
import { extractSubjectLine } from './chat_state.ts';

export function renderChatStream(params: {
  messages: ChatMessage[];
  busy: boolean;
  onSendStarter: (prompt: string) => void;
  onSendToStudio: (ideaText: string) => void;
  onOpenInStage: (scriptTopic: string) => void;
  onToast: (msg: string) => void;
}): HTMLElement {
  const stream = Object.assign(document.createElement('div'), { className: 'chat-stream' });

  if (!params.messages.length) {
    const welcome = Object.assign(document.createElement('div'), { className: 'chat-welcome' });
    welcome.append(
      Object.assign(document.createElement('h2'), { textContent: 'Brainstorm, Punch Up & Script in Real Time' }),
      Object.assign(document.createElement('p'), { textContent: 'Co-write deadpan premises, Hinglish 5-beat reels, and A/B hooks—then send any reply straight to Prompt Studio or the Rehearsal Stage in one click.' }),
    );
    const grid = Object.assign(document.createElement('div'), { className: 'chat-starter-grid' });
    for (const st of CHAT_STARTERS) {
      const card = Object.assign(document.createElement('button'), { type: 'button', className: 'chat-starter-card' });
      card.append(Object.assign(document.createElement('strong'), { textContent: st.title }), Object.assign(document.createElement('span'), { textContent: st.sub }));
      card.addEventListener('click', () => params.onSendStarter(st.prompt));
      grid.appendChild(card);
    }
    welcome.appendChild(grid);
    stream.appendChild(welcome);
    return stream;
  }

  for (const msg of params.messages) {
    const item = Object.assign(document.createElement('div'), { className: `chat-msg is-${msg.role}` });
    item.appendChild(Object.assign(document.createElement('div'), { className: 'chat-msg__bubble', textContent: msg.content }));
    if (msg.role === 'assistant') {
      const actions = Object.assign(document.createElement('div'), { className: 'chat-msg__actions' });
      const stageBtn = Object.assign(document.createElement('button'), { type: 'button', className: 'pill pill--accent', textContent: 'Open in Stage' });
      stageBtn.style.cursor = 'pointer';
      stageBtn.prepend(uiGlyphs.stage(12));
      stageBtn.addEventListener('click', () => params.onOpenInStage(extractSubjectLine(msg.content)));

      const studioBtn = Object.assign(document.createElement('button'), { type: 'button', className: 'pill pill--positive', textContent: 'Send to Studio' });
      studioBtn.style.cursor = 'pointer';
      studioBtn.prepend(uiGlyphs.spark(12));
      studioBtn.addEventListener('click', () => params.onSendToStudio(extractSubjectLine(msg.content)));

      const copyBtn = Object.assign(document.createElement('button'), { type: 'button', className: 'pill', textContent: 'Copy' });
      copyBtn.style.cursor = 'pointer';
      copyBtn.prepend(uiGlyphs.copy(12));
      copyBtn.addEventListener('click', () => { void navigator.clipboard?.writeText(msg.content); params.onToast('Copied reply'); });

      actions.append(stageBtn, studioBtn, copyBtn);
      item.appendChild(actions);
    }
    stream.appendChild(item);
  }

  if (params.busy) stream.appendChild(Object.assign(document.createElement('div'), { className: 'pill', textContent: 'Writing comedy beats...' }));
  queueMicrotask(() => { stream.scrollTop = stream.scrollHeight; });
  return stream;
}
