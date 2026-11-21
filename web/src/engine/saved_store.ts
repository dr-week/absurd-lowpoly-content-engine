import type { OutcomeTag, SavedItem, ScoredTopic } from '../types';

const SAVED_KEY = 'absurd_studio_saved_v1';
const GENERATED_KEY = 'absurd_studio_generated_v1';

function hasStorage(): boolean {
  return typeof localStorage !== 'undefined';
}

export function loadSaved(): SavedItem[] {
  if (!hasStorage()) return [];
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as SavedItem[]) : [];
  } catch {
    return [];
  }
}

export function saveSaved(items: SavedItem[]): void {
  if (hasStorage()) localStorage.setItem(SAVED_KEY, JSON.stringify(items));
}

export function loadGeneratedIds(): Set<string> {
  if (!hasStorage()) return new Set();
  try {
    const raw = localStorage.getItem(GENERATED_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? (parsed as string[]) : []);
  } catch {
    return new Set();
  }
}

export function saveGeneratedIds(ids: Set<string>): void {
  if (hasStorage()) localStorage.setItem(GENERATED_KEY, JSON.stringify(Array.from(ids).slice(-240)));
}

export function saveLikedTopic(items: SavedItem[], generatedIds: Set<string>, topic: ScoredTopic): SavedItem[] {
  const existing = items.find((i) => i.topic.id === topic.id);
  const generated = Boolean(existing?.generated || generatedIds.has(topic.id));
  const entry: SavedItem = {
    topic,
    savedAt: existing?.savedAt ?? new Date().toISOString(),
    generated,
    generatedAt: existing?.generatedAt,
  };
  const next = existing
    ? items.map((i) => (i.topic.id === topic.id ? entry : i))
    : [entry, ...items];
  saveSaved(next);
  return next;
}

export function removeSavedTopic(items: SavedItem[], topicId: string): SavedItem[] {
  const next = items.filter((i) => i.topic.id !== topicId);
  saveSaved(next);
  return next;
}

export function markTopicGenerated(
  items: SavedItem[],
  generatedIds: Set<string>,
  topicId: string,
): { saved: SavedItem[]; generatedIds: Set<string> } {
  const nextIds = new Set(generatedIds);
  nextIds.add(topicId);
  saveGeneratedIds(nextIds);

  const now = new Date().toISOString();
  const nextSaved = items.map((i) =>
    i.topic.id === topicId ? { ...i, generated: true, generatedAt: i.generatedAt ?? now } : i,
  );
  saveSaved(nextSaved);
  return { saved: nextSaved, generatedIds: nextIds };
}

export function setSavedOutcome(items: SavedItem[], topicId: string, outcome: OutcomeTag): SavedItem[] {
  const next = items.map((i) =>
    i.topic.id === topicId ? { ...i, outcome: i.outcome === outcome ? undefined : outcome } : i,
  );
  saveSaved(next);
  return next;
}
