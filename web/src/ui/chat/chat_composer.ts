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
    const micBtn = Object.assign(document.createElement('button'), {
      type: 'button',
      className: 'btn btn--icon',
      title: 'Voice Dictation (Web Speech API)',
      ariaLabel: 'Voice Dictation',
    });
    micBtn.innerHTML = uiGlyphs.chat();
    micBtn.addEventListener('click', () => {
      startVoiceDictation((transcript) => {
        input.value = input.value ? `${input.value} ${transcript}` : transcript;
        input.focus();
      });
    });
    row.appendChild(micBtn);
  }
  row.append(input, sendBtn);
  dock.append(slashBar, row);
  return dock;
}
