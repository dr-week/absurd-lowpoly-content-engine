import { publishSync } from '../engine/storage/broadcast_sync.ts';
import { deleteChatThread } from '../engine/storage/idb_chat_store.ts';
import type { ChatThread } from '../engine/storage/storage_types.ts';
import { uiGlyphs } from './glyphs.ts';

export function renderChatSidebar(params: {
  threads: ChatThread[];
  activeThreadId: string | null;
  onNewChat: () => void;
  onSelectThread: (thread: ChatThread) => void;
  onDeletedThread: (deletedId: string) => Promise<void>;
}): HTMLElement {
  const aside = document.createElement('aside');
  aside.className = 'chat-sidebar';
  aside.setAttribute('aria-label', 'Chat Threads');

  const top = document.createElement('div');
  top.className = 'chat-sidebar__top';
  const newBtn = document.createElement('button');
  newBtn.type = 'button';
  newBtn.className = 'btn btn--primary chat-sidebar__new-btn';
  newBtn.append(
    uiGlyphs.plus(14),
    Object.assign(document.createElement('span'), { textContent: 'New Chat' }),
  );
  newBtn.addEventListener('click', params.onNewChat);
  top.appendChild(newBtn);

  const label = Object.assign(document.createElement('div'), {
    className: 'chat-sidebar__section-label',
    textContent: params.threads.length ? `Recent Chats (${params.threads.length})` : 'Recent Chats',
  });

  const list = document.createElement('div');
  list.className = 'chat-sidebar__list';

  if (!params.threads.length) {
    const empty = Object.assign(document.createElement('div'), {
      className: 'chat-thread-item__meta',
      textContent: 'No saved threads yet. Start chatting to auto-save locally.',
    });
    empty.style.padding = '8px 6px';
    list.appendChild(empty);
  } else {
    for (const t of params.threads) {
      const row = document.createElement('div');
      row.className = `chat-thread-item${t.id === params.activeThreadId ? ' is-active' : ''}`;

      const selectBtn = document.createElement('button');
      selectBtn.type = 'button';
      selectBtn.className = 'chat-thread-item__select';
      const title = Object.assign(document.createElement('span'), {
        className: 'chat-thread-item__title',
        textContent: t.title || 'Untitled Chat',
      });
      const meta = Object.assign(document.createElement('span'), {
        className: 'chat-thread-item__meta',
        textContent: `${t.messages.length} msgs`,
      });
      selectBtn.append(title, meta);
      selectBtn.addEventListener('click', () => params.onSelectThread(t));

      const delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'chat-thread-item__del';
      delBtn.title = 'Delete thread';
      delBtn.appendChild(uiGlyphs.close(12));
      delBtn.addEventListener('click', async (ev) => {
        ev.stopPropagation();
        await deleteChatThread(t.id);
        publishSync({ type: 'chat:updated', profileId: t.profileId, targetId: t.id });
        await params.onDeletedThread(t.id);
      });

      row.append(selectBtn, delBtn);
      list.appendChild(row);
    }
  }

  aside.append(top, label, list);
  return aside;
}
