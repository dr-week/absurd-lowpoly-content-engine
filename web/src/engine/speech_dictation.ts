interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((ev: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((ev: { error?: string }) => void) | null;
  start(): void;
  stop(): void;
}

export function isSpeechDictationSupported(): boolean {
  if (typeof window === 'undefined') return false;
  const w = window as unknown as Record<string, unknown>;
  return Boolean(w.SpeechRecognition || w.webkitSpeechRecognition);
}

export function startVoiceDictation(
  onTranscript: (text: string) => void,
  onError?: (msg: string) => void,
  lang = 'en-IN',
): () => void {
  const w = window as unknown as Record<string, new () => SpeechRecognitionLike>;
  const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
  if (!Ctor) {
    onError?.('Web Speech API not supported in this browser');
    return () => {};
  }
  const rec = new Ctor();
  rec.lang = lang;
  rec.interimResults = false;
  rec.maxAlternatives = 1;
  rec.onresult = (ev) => {
    const transcript = ev.results?.[0]?.[0]?.transcript?.trim();
    if (transcript) onTranscript(transcript);
  };
  rec.onerror = (ev) => onError?.(ev.error ?? 'Speech recognition error');
  rec.start();
  return () => rec.stop();
}
