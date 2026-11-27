import type { ChatThread } from '../../engine/storage/storage_types.ts';
import { uiGlyphs } from '../glyphs.ts';

export function renderChatSidebar(params: {
  threads: ChatThread[];
  activeThreadId: string | null;
  onNewChat: () => void;
  onSelectThread: (thread: ChatThread) => void;
  onDeleteThread: (id: string) => void;
}): HTMLElement {
  const aside = Object.assign(document.createElement('aside'), { className: 'chat-sidebar' });
  aside.setAttribute('aria-label', 'Chat Threads');

  const top = Object.assign(document.createElement('div'), { className: 'chat-sidebar__top' });
  const newBtn = Object.assign(document.createElement('button'), {
    type: 'button',
    className: 'btn btn--primary chat-sidebar__new-btn',
  });
  newBtn.append(uiGlyphs.plus(14), Object.assign(document.createElement('span'), { textContent: 'New Chat' }));
  newBtn.addEventListener('click', params.onNewChat);
  top.appendChild(newBtn);

  const label = Object.assign(document.createElement('div'), {
    className: 'chat-sidebar__section-label',
    textContent: params.threads.length ? `Recent Chats (${params.threads.length})` : 'Recent Chats',
  });

  const list = Object.assign(document.createElement('div'), { className: 'chat-sidebar__list' });
  if (!params.threads.length) {
    const empty = Object.assign(document.createElement('div'), {
      className: 'chat-thread-item__meta',
      textContent: 'No saved threads yet. Start chatting to auto-save locally.',
    });
    empty.style.padding = '8px 6px';
    list.appendChild(empty);
  } else {
    for (const t of params.threads) {
      const row = Object.assign(document.createElement('div'), {
        className: `chat-thread-item${t.id === params.activeThreadId ? ' is-active' : ''}`,
      });
      const selectBtn = Object.assign(document.createElement('button'), {
        type: 'button',
        className: 'chat-thread-item__select',
      });
      selectBtn.append(
        Object.assign(document.createElement('span'), { className: 'chat-thread-item__title', textContent: t.title || 'Untitled Chat' }),
        Object.assign(document.createElement('span'), { className: 'chat-thread-item__meta', textContent: `${t.messages.length} msgs` }),
      );
      selectBtn.addEventListener('click', () => params.onSelectThread(t));

      const delBtn = Object.assign(document.createElement('button'), {
        type: 'button',
        className: 'chat-thread-item__del',
        title: 'Delete thread',
      });
      delBtn.appendChild(uiGlyphs.close(12));
      delBtn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        params.onDeleteThread(t.id);
      });

      row.append(selectBtn, delBtn);
      list.appendChild(row);
    }
  }

  aside.append(top, label, list);
  return aside;
}
