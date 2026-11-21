import type { RatingLogEntry, SavedItem } from '../types';
import { saveGeneratedIds, saveSaved } from './saved_store';
import { saveLogs, saveSeenPairs, saveSeenTitles } from './telemetry';

export interface StudioBackupPayload {
  version: 1;
  exportedAt: string;
  saved: SavedItem[];
  generatedIds: string[];
  logs: RatingLogEntry[];
  seenTitles: string[];
  seenPairs: string[];
}

export function exportStudioBackup(params: {
  saved: SavedItem[];
  generatedIds: Set<string>;
  logs: RatingLogEntry[];
  seenTitles: Set<string>;
  seenPairs: Set<string>;
}): void {
  const payload: StudioBackupPayload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    saved: params.saved,
    generatedIds: Array.from(params.generatedIds),
    logs: params.logs,
    seenTitles: Array.from(params.seenTitles),
    seenPairs: Array.from(params.seenPairs),
  };
  const stamp = payload.exportedAt.slice(0, 10);
  const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `absurd-studio-backup-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function restoreStudioBackup(jsonText: string): {
  saved: SavedItem[];
  generatedIds: Set<string>;
  logs: RatingLogEntry[];
  seenTitles: Set<string>;
  seenPairs: Set<string>;
} {
  const parsed = JSON.parse(jsonText) as Partial<StudioBackupPayload>;
  if (!parsed || typeof parsed !== 'object') throw new Error('Invalid backup file');

  const saved = Array.isArray(parsed.saved) ? parsed.saved : [];
  const generatedIds = new Set(Array.isArray(parsed.generatedIds) ? parsed.generatedIds : []);
  const logs = Array.isArray(parsed.logs) ? parsed.logs : [];
  const seenTitles = new Set(Array.isArray(parsed.seenTitles) ? parsed.seenTitles : []);
  const seenPairs = new Set(Array.isArray(parsed.seenPairs) ? parsed.seenPairs : []);

  if (typeof localStorage !== 'undefined') {
    saveSaved(saved);
    saveGeneratedIds(generatedIds);
    saveLogs(logs);
    saveSeenTitles(seenTitles);
    saveSeenPairs(seenPairs);
  }

  return { saved, generatedIds, logs, seenTitles, seenPairs };
}
