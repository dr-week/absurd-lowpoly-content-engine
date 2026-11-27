import { generateChatReply } from '../engine/chat/chat_engine.ts';
import { publishSync, subscribeSync } from '../engine/storage/broadcast_sync.ts';
import { listThreadsByProfile, saveChatThread } from '../engine/storage/idb_chat_store.ts';
import { getActiveProfileId } from '../engine/storage/profile_manager.ts';
import type { ChatThread } from '../engine/storage/storage_types.ts';
import type { EngineConfig, ScoredTopic } from '../types.ts';
import { renderChatSidebar } from './chat_sidebar.ts';
import { extractSubjectLine, renderChatStream } from './chat_stream.ts';
import { uiGlyphs } from './glyphs.ts';

const SLASH_CHIPS = [
  { label: '5-Beat Script', prefix: 'Write a 20s 5-Beat script on: ' },
  { label: 'Hinglish Pass', prefix: 'Convert into deadpan Hinglish with cues: ' },
  { label: 'Punch Up Twist', prefix: 'Heighten the escalation and twist for: ' },
  { label: '3 Hooks', prefix: 'Give me 3 cold-open hooks for: ' },
];

let activeThread: ChatThread | null = null;
let cachedThreads: ChatThread[] = [];
let busy = false;
let syncBound = false;

export function seedChatPrompt(promptText: string): void {
  const profileId = getActiveProfileId();
  const now = Date.now();
  activeThread = { id: `thd_${now.toString(36)}`, profileId, title: extractSubjectLine(promptText), messages: [], createdAt: now, updatedAt: now };
}

export function renderChatView(opts: {
  config: EngineConfig;
  activeTopic?: ScoredTopic;
  initialDraft?: string;
  onSendToStudio: (ideaText: string) => void;
  onOpenInStage: (scriptTopic: string) => void;
  onJumpTab: (tab: 'studio' | 'stage') => void;
  onToast: (msg: string) => void;
}): HTMLElement {
  const wrap = Object.assign(document.createElement('section'), { className: 'zuari-surface-liquid chat-workspace', id: 'section-ai-chat' });

  const rerender = () => {
    const host = document.getElementById('section-ai-chat');
    if (host) host.replaceWith(renderChatView({ ...opts, initialDraft: '' }));
  };

  if (!syncBound) {
    syncBound = true;
    subscribeSync((m) => { if (m.type === 'chat:updated') void listThreadsByProfile(getActiveProfileId()).then((l) => { cachedThreads = l; rerender(); }); });
  }
  if (!cachedThreads.length) {
    void listThreadsByProfile(getActiveProfileId()).then((l) => { if (l.length && !cachedThreads.length) { cachedThreads = l; if (!activeThread) activeThread = l[0]; rerender(); } });
  }

  const sidebar = renderChatSidebar({
    threads: cachedThreads,
    activeThreadId: activeThread?.id ?? null,
    onNewChat: () => { activeThread = null; rerender(); },
    onSelectThread: (t) => { activeThread = t; rerender(); },
    onDeletedThread: async (id) => {
      cachedThreads = await listThreadsByProfile(getActiveProfileId());
      if (activeThread?.id === id) activeThread = cachedThreads[0] ?? null;
      opts.onToast('Thread deleted');
      rerender();
    },
  });

  const main = Object.assign(document.createElement('div'), { className: 'chat-main' });
  const topbar = Object.assign(document.createElement('div'), { className: 'chat-topbar' });
  const titleBox = Object.assign(document.createElement('div'), { className: 'chat-topbar__title' });
  titleBox.append(uiGlyphs.chat(16), document.createTextNode(activeThread?.title ?? "AI Comedy Writers' Room"));

  const shortcuts = Object.assign(document.createElement('div'), { className: 'chat-topbar__shortcuts' });
  if (opts.activeTopic) {
    shortcuts.appendChild(Object.assign(document.createElement('span'), { className: 'pill pill--accent', textContent: `Context: ${opts.activeTopic.title.slice(0, 28)}` }));
  }
  const toStudioBtn = Object.assign(document.createElement('button'), { type: 'button', className: 'btn', textContent: 'Prompt Studio' });
  toStudioBtn.prepend(uiGlyphs.spark(13));
  toStudioBtn.addEventListener('click', () => opts.onJumpTab('studio'));
  const toStageBtn = Object.assign(document.createElement('button'), { type: 'button', className: 'btn', textContent: 'Stage & Teleprompter' });
  toStageBtn.prepend(uiGlyphs.stage(13));
  toStageBtn.addEventListener('click', () => opts.onJumpTab('stage'));
  shortcuts.append(toStudioBtn, toStageBtn);
  topbar.append(titleBox, shortcuts);

  const sendMessage = async (rawText: string) => {
    const text = rawText.trim();
    if (!text || busy) return;
    busy = true;
    const now = Date.now();
    const profileId = getActiveProfileId();
    if (!activeThread) {
      activeThread = { id: `thd_${now.toString(36)}`, profileId, title: extractSubjectLine(text), messages: [], createdAt: now, updatedAt: now };
    }
    activeThread.messages.push({ id: `m_${now}`, role: 'user', content: text, createdAt: now });
    rerender();
    const reply = await generateChatReply(opts.config, activeThread.messages, opts.activeTopic);
    activeThread.messages.push({ id: `m_${Date.now()}`, role: 'assistant', content: reply, createdAt: Date.now() });
    await saveChatThread(activeThread).catch(() => {});
    cachedThreads = await listThreadsByProfile(profileId).catch(() => [activeThread!]);
    publishSync({ type: 'chat:updated', profileId, targetId: activeThread.id });
    busy = false;
    rerender();
  };

  const stream = renderChatStream({
    messages: activeThread?.messages ?? [],
    busy,
    onSendStarter: (p) => void sendMessage(p),
    onSendToStudio: opts.onSendToStudio,
    onOpenInStage: opts.onOpenInStage,
    onToast: opts.onToast,
  });

  const dock = Object.assign(document.createElement('form'), { className: 'chat-composer-dock' });
  const slashBar = Object.assign(document.createElement('div'), { className: 'chat-slash-bar' });
  const input = Object.assign(document.createElement('textarea'), {
    placeholder: opts.activeTopic ? `Ask to riff on "${opts.activeTopic.title}" or any new idea...` : 'Ask for premises, 5-beat scripts, Hinglish rewrites, or punch-ups...',
    value: opts.initialDraft ?? '',
  });
  for (const ch of SLASH_CHIPS) {
    const chip = Object.assign(document.createElement('button'), { type: 'button', className: 'pill', textContent: `/ ${ch.label}` });
    chip.style.cursor = 'pointer';
    chip.addEventListener('click', () => {
      input.value = `${ch.prefix}${input.value.trim() || opts.activeTopic?.title || ''}`;
      input.focus();
    });
    slashBar.appendChild(chip);
  }
  const row = Object.assign(document.createElement('div'), { className: 'chat-composer-row' });
  const sendBtn = Object.assign(document.createElement('button'), { type: 'submit', className: 'btn btn--primary', disabled: busy });
  sendBtn.append(uiGlyphs.send(14), Object.assign(document.createElement('span'), { textContent: busy ? '...' : 'Send' }));
  input.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' && !ev.shiftKey) { ev.preventDefault(); void sendMessage(input.value); } });
  dock.addEventListener('submit', (ev) => { ev.preventDefault(); void sendMessage(input.value); });
  row.append(input, sendBtn);
  dock.append(slashBar, row);
  main.append(topbar, stream, dock);
  wrap.append(sidebar, main);
  return wrap;
}
