import { CHAT_SLASH_CHIPS } from '../../engine/chat/chat_prompts.ts';
import { isSpeechDictationSupported, startVoiceDictation } from '../../engine/speech_dictation.ts';
import type { ScoredTopic } from '../../types.ts';
import { uiGlyphs } from '../glyphs.ts';

export function renderChatComposer(params: {
  activeTopic?: ScoredTopic;
  initialDraft?: string;
  busy: boolean;
  onSubmit: (text: string) => void;
}): HTMLElement {
  const dock = Object.assign(document.createElement('form'), { className: 'chat-composer-dock' });
  const slashBar = Object.assign(document.createElement('div'), { className: 'chat-slash-bar' });

  const input = Object.assign(document.createElement('textarea'), {
    placeholder: params.activeTopic
      ? `Ask to riff on "${params.activeTopic.title}" or any new idea...`
      : 'Ask for premises, 5-beat scripts, Hinglish rewrites, or punch-ups...',
    value: params.initialDraft ?? '',
  });

  for (const ch of CHAT_SLASH_CHIPS) {
    const chip = Object.assign(document.createElement('button'), {
      type: 'button',
      className: 'pill',
      textContent: `/ ${ch.label}`,
    });
    chip.style.cursor = 'pointer';
    chip.addEventListener('click', () => {
      input.value = `${ch.prefix}${input.value.trim() || params.activeTopic?.title || ''}`;
      input.focus();
    });
    slashBar.appendChild(chip);
  }

  const row = Object.assign(document.createElement('div'), { className: 'chat-composer-row' });
  const sendBtn = Object.assign(document.createElement('button'), {
    type: 'submit',
    className: 'btn btn--primary',
    disabled: params.busy,
  });
  sendBtn.innerHTML = `${uiGlyphs.send()}<span>${params.busy ? '...' : 'Send'}</span>`;

  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' && !ev.shiftKey) {
      ev.preventDefault();
      params.onSubmit(input.value);
    }
  });
  dock.addEventListener('submit', (ev) => {
    ev.preventDefault();
    params.onSubmit(input.value);
  });

  if (isSpeechDictationSupported()) {
    const micBtn = Object.assign(document.createElement('button'), { type: 'button', className: 'btn', title: 'Voice Dictation', ariaLabel: 'Voice Dictation' });
    micBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>';
    micBtn.addEventListener('click', () => {
      startVoiceDictation(
        (txt) => { input.value = input.value ? `${input.value} ${txt}` : txt; input.focus(); },
        () => {},
      );
    });
    row.append(input, micBtn, sendBtn);
  } else {
    row.append(input, sendBtn);
  }
  dock.append(slashBar, row);
  return dock;
}
