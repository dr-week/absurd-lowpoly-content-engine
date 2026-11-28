import type { EngineConfig, ScoredTopic } from '../../types.ts';
import { uiGlyphs } from '../glyphs.ts';
import { renderChatComposer } from './chat_composer.ts';
import { renderChatSidebar } from './chat_sidebar.ts';
import { chatStore } from './chat_state.ts';
import { renderChatStream } from './chat_stream.ts';

export const seedChatPrompt = (txt: string): void => chatStore.seedPrompt(txt);

export function renderChatView(opts: {
  config: EngineConfig;
  activeTopic?: ScoredTopic;
  initialDraft?: string;
  onSendToStudio: (ideaText: string) => void;
  onOpenInStage: (scriptTopic: string) => void;
  onJumpTab: (tab: 'studio' | 'stage') => void;
  onToast: (msg: string) => void;
}): HTMLElement {
  const wrap = Object.assign(document.createElement('section'), {
    className: 'zuari-surface-liquid chat-workspace',
    id: 'section-ai-chat',
  });

  const rerender = () => {
    const host = document.getElementById('section-ai-chat');
    if (host) host.replaceWith(renderChatView({ ...opts, initialDraft: '' }));
  };

  chatStore.ensureBound(rerender);

  const sidebar = renderChatSidebar({
    threads: chatStore.threads,
    activeThreadId: chatStore.activeThread?.id ?? null,
    onNewChat: () => { chatStore.activeThread = null; rerender(); },
    onSelectThread: (t) => { chatStore.activeThread = t; rerender(); },
    onDeleteThread: (id) => { void chatStore.removeThread(id).then(() => { opts.onToast('Thread deleted'); rerender(); }); },
  });

  const main = Object.assign(document.createElement('div'), { className: 'chat-main' });
  const topbar = Object.assign(document.createElement('div'), { className: 'chat-topbar' });
  const titleBox = Object.assign(document.createElement('div'), { className: 'chat-topbar__title' });
  titleBox.innerHTML = `${uiGlyphs.chat()}<span>${chatStore.activeThread?.title ?? "AI Comedy Writers' Room"}</span>`;

  const shortcuts = Object.assign(document.createElement('div'), { className: 'chat-topbar__shortcuts' });
  const isByok = opts.config.sourceMode === 'gemini' || opts.config.sourceMode === 'groq' || opts.config.sourceMode === 'openrouter';
  const modePill = Object.assign(document.createElement('button'), {
    type: 'button',
    className: `pill ${isByok ? 'pill--positive' : ''}`.trim(),
    title: 'Open BYOK & Key Vault Settings',
    textContent: isByok ? `BYOK (${opts.config.sourceMode})` : 'Local Blueprint',
  });
  modePill.style.cursor = 'pointer';
  modePill.insertAdjacentHTML('afterbegin', uiGlyphs.shield());
  modePill.addEventListener('click', () => document.querySelector<HTMLElement>('[data-action="open-drawer"]')?.click());
  shortcuts.appendChild(modePill);

  if (opts.activeTopic) {
    shortcuts.appendChild(Object.assign(document.createElement('span'), { className: 'pill pill--accent', textContent: `Context: ${opts.activeTopic.title.slice(0, 28)}` }));
  }
  const toStudioBtn = Object.assign(document.createElement('button'), { type: 'button', className: 'btn', textContent: 'Prompt Studio' });
  toStudioBtn.insertAdjacentHTML('afterbegin', uiGlyphs.spark());
  toStudioBtn.addEventListener('click', () => opts.onJumpTab('studio'));
  const toStageBtn = Object.assign(document.createElement('button'), { type: 'button', className: 'btn', textContent: 'Stage & Teleprompter' });
  toStageBtn.insertAdjacentHTML('afterbegin', uiGlyphs.stage());
  toStageBtn.addEventListener('click', () => opts.onJumpTab('stage'));
  shortcuts.append(toStudioBtn, toStageBtn);
  topbar.append(titleBox, shortcuts);

  const onSend = (txt: string) => void chatStore.sendTurn(txt, opts.config, opts.activeTopic, rerender);
  const onRegenerate = () => {
    const lastUser = [...(chatStore.activeThread?.messages ?? [])].reverse().find((m) => m.role === 'user');
    if (lastUser) void chatStore.sendTurn(lastUser.content, opts.config, opts.activeTopic, rerender);
  };

  const stream = renderChatStream({
    messages: chatStore.activeThread?.messages ?? [],
    busy: chatStore.busy,
    onSendStarter: onSend,
    onRegenerate,
    onSendToStudio: opts.onSendToStudio,
    onOpenInStage: opts.onOpenInStage,
    onToast: opts.onToast,
  });

  const composer = renderChatComposer({
    activeTopic: opts.activeTopic,
    initialDraft: opts.initialDraft,
    busy: chatStore.busy,
    onSubmit: onSend,
  });

  main.append(topbar, stream, composer);
  wrap.append(sidebar, main);
  return wrap;
}
