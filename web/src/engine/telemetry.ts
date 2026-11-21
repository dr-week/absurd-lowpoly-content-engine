import type {
  AngleStat,
  EngineConfig,
  RatingLogEntry,
  TargetKind,
  TasteAnalytics,
  VoteValue,
} from '../types';

const LOGS_KEY = 'absurd_studio_logs_v2';
const CFG_KEY = 'absurd_studio_cfg_v3';

export const DEFAULT_CONFIG: EngineConfig = {
  theme: 'studio',
  sourceMode: 'standalone',
  backendUrl: 'http://localhost:8000',
  batchSize: 8,
};

export function loadConfig(): EngineConfig {
  try {
    const raw = localStorage.getItem(CFG_KEY);
    return raw ? { ...DEFAULT_CONFIG, ...(JSON.parse(raw) as Partial<EngineConfig>) } : { ...DEFAULT_CONFIG };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

export function saveConfig(cfg: EngineConfig): void {
  localStorage.setItem(CFG_KEY, JSON.stringify(cfg));
}

export function loadLogs(): RatingLogEntry[] {
  try {
    const raw = localStorage.getItem(LOGS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as RatingLogEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveLogs(logs: RatingLogEntry[]): void {
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
}

export function upsertVote(
  logs: RatingLogEntry[],
  params: Omit<RatingLogEntry, 'id' | 'timestamp'>,
): RatingLogEntry[] {
  const idx = logs.findIndex((e) => e.kind === params.kind && e.targetId === params.targetId);
  const entry: RatingLogEntry = {
    ...params,
    id: `${params.kind}_${params.targetId}`,
    timestamp: new Date().toISOString(),
  };
  const next = [...logs];
  if (idx >= 0) next[idx] = entry;
  else next.unshift(entry);
  saveLogs(next);
  return next;
}

export function getVote(logs: RatingLogEntry[], kind: TargetKind, targetId: string): VoteValue | null {
  return logs.find((e) => e.kind === kind && e.targetId === targetId)?.vote ?? null;
}

export function computeAnalytics(logs: RatingLogEntry[]): TasteAnalytics {
  const byKind: Record<TargetKind, { up: number; down: number }> = {
    topic: { up: 0, down: 0 },
    storyboard: { up: 0, down: 0 },
    video: { up: 0, down: 0 },
  };
  const angleMap = new Map<string, { up: number; down: number }>();
  let upVotes = 0;
  let downVotes = 0;

  for (const e of logs) {
    if (e.vote === 'up') {
      upVotes += 1;
      byKind[e.kind].up += 1;
    } else {
      downVotes += 1;
      byKind[e.kind].down += 1;
    }
    const cur = angleMap.get(e.angle) ?? { up: 0, down: 0 };
    if (e.vote === 'up') cur.up += 1;
    else cur.down += 1;
    angleMap.set(e.angle, cur);
  }

  const byAngle: AngleStat[] = Array.from(angleMap.entries())
    .map(([angle, c]) => ({
      angle,
      up: c.up,
      down: c.down,
      rate: c.up + c.down > 0 ? Math.round((c.up / (c.up + c.down)) * 100) : 0,
    }))
    .sort((a, b) => b.rate - a.rate || b.up - a.up);

  const totalVotes = upVotes + downVotes;
  return {
    totalVotes,
    upVotes,
    downVotes,
    approvalRate: totalVotes > 0 ? Math.round((upVotes / totalVotes) * 100) : 0,
    byKind,
    byAngle,
  };
}

function triggerDownload(filename: string, content: string, mime: string): void {
  const url = URL.createObjectURL(new Blob([content], { type: mime }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function exportJsonl(logs: RatingLogEntry[]): void {
  const stamp = new Date().toISOString().slice(0, 10);
  triggerDownload(`absurd-logs-${stamp}.jsonl`, `${logs.map((l) => JSON.stringify(l)).join('\n')}\n`, 'application/x-ndjson');
}

export function exportJson(logs: RatingLogEntry[]): void {
  const stamp = new Date().toISOString().slice(0, 10);
  const payload = { exported_at: new Date().toISOString(), analytics: computeAnalytics(logs), logs };
  triggerDownload(`absurd-analysis-${stamp}.json`, JSON.stringify(payload, null, 2), 'application/json');
}
