import './styles/main.scss';
import { generateLiveTopics } from './engine/live_ai';
import { loadLiveTrends } from './engine/live_feeds';
import { generatePromptsForTopic } from './engine/prompt_renderer';
import { loadGeneratedIds, loadSaved, markTopicGenerated } from './engine/saved_store';
import { loadConfig, loadLogs, loadSeenPairs, saveSeenPairs } from './engine/telemetry';
import { evaluateTopics } from './engine/viral_evaluator';
import { Glyphs } from './glyphs';
import { renderAnalyticsView, renderLogsView } from './ui/analytics_view';
import { esc } from './ui/escape';
import { bindAppEvents, type AppState } from './ui/events';
import { renderSavedView } from './ui/saved_view';
import { renderAppShell } from './ui/shell';
import { renderStudioView } from './ui/studio_view';

const cfg0 = loadConfig();
const logs0 = loadLogs();
const seen0 = loadSeenPairs();
const initialTopics = evaluateTopics({ count: 8, query: '', logs: logs0, seenPairs: seen0, batchNonce: Date.now() });
saveSeenPairs(seen0);

const state: AppState = {
  config: cfg0,
  activeTab: 'studio',
  drawerOpen: false,
  seedQuery: '',
  batchNonce: Date.now(),
  seenPairs: seen0,
  topics: initialTopics,
  liveTrends: [],
  loadingTopics: false,
  selectedId: null,
  prompts: null,
  loading: false,
  logs: logs0,
  saved: loadSaved(),
  generatedIds: loadGeneratedIds(),
  savedFilter: 'all',
  copiedTarget: null,
};

function toast(msg: string): void {
  const host = document.getElementById('toast-plane');
  if (!host) return;
  const node = document.createElement('div');
  node.className = 'toast-item zuari-surface-frosted';
  node.innerHTML = `${Glyphs.check(14)}<span>${esc(msg)}</span>`;
  host.appendChild(node);
  window.setTimeout(() => node.remove(), 2000);
}

const CHIP_NOISE = new Set(['accuses', 'announces', 'claims', 'warns', "didn't", 'cremated', 'convicted', 'criminal', 'detained', 'conning', 'deadlock', 'close', 'dependent']);
let allLiveTrendPool: string[] = [];

function pickTrendChips(pool: string[], count = 6): string[] {
  const clean = pool.filter((k) => !CHIP_NOISE.has(k.toLowerCase()));
  const arr = [...(clean.length >= count ? clean : pool)];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, count);
}

async function refreshTopics(): Promise<void> {
  if (allLiveTrendPool.length > 6 && !state.seedQuery.trim()) {
    state.liveTrends = pickTrendChips(allLiveTrendPool, 6);
  }
  const isLive = state.config.sourceMode === 'gemini' || state.config.sourceMode === 'groq' || state.config.sourceMode === 'openrouter';
  if (isLive && state.config.apiKey.trim()) {
    state.loadingTopics = true;
    render();
    try {
      const avoid = [...state.topics.map((t) => t.title), ...state.logs.map((l) => l.title)];
      state.topics = await generateLiveTopics(state.config, state.seedQuery, state.logs, avoid, state.liveTrends);
      state.loadingTopics = false;
      render();
      toast('8 fresh AI topics');
      return;
    } catch (err) {
      state.loadingTopics = false;
      toast(`AI error: ${err instanceof Error ? err.message : 'fallback'}`);
    }
  }
  state.topics = evaluateTopics({ count: 8, query: state.seedQuery, logs: state.logs, seenPairs: state.seenPairs, batchNonce: state.batchNonce });
  saveSeenPairs(state.seenPairs);
  render();
  toast('8 fresh topics');
}

async function selectTopic(id: string, fromSaved = false): Promise<void> {
  const topic = state.topics.find((t) => t.id === id) ?? state.saved.find((s) => s.topic.id === id)?.topic;
  if (!topic) return;
  if (fromSaved) state.activeTab = 'studio';
  state.selectedId = topic.id;
  state.loading = true;
  const marked = markTopicGenerated(state.saved, state.generatedIds, topic.id);
  state.saved = marked.saved;
  state.generatedIds = marked.generatedIds;
  render();
  try {
    state.prompts = await generatePromptsForTopic(topic, state.config);
  } catch (err) {
    toast(`Prompt error: ${err instanceof Error ? err.message : 'failed'}`);
  }
  state.loading = false;
  render();
  document.getElementById('section-prompts')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function render(): void {
  const root = document.getElementById('app');
  if (!root) return;
  document.documentElement.setAttribute('data-theme', state.config.theme);
  let surfaceHtml = '';
  if (state.activeTab === 'studio') {
    surfaceHtml = renderStudioView({ topics: state.topics, logs: state.logs, generatedIds: state.generatedIds, selectedId: state.selectedId, prompts: state.prompts, loadingTopics: state.loadingTopics, loading: state.loading, seedQuery: state.seedQuery, liveTrends: state.liveTrends, copiedTarget: state.copiedTarget });
  } else if (state.activeTab === 'saved') {
    surfaceHtml = renderSavedView({ saved: state.saved, filter: state.savedFilter, selectedId: state.selectedId });
  } else if (state.activeTab === 'analytics') {
    surfaceHtml = renderAnalyticsView(state.logs);
  } else {
    surfaceHtml = renderLogsView(state.logs);
  }
  root.innerHTML = renderAppShell({ config: state.config, activeTab: state.activeTab, drawerOpen: state.drawerOpen, logs: state.logs, savedCount: state.saved.length, surfaceHtml });
  bindAppEvents(state, { render, refreshTopics, selectTopic, toast });
}

render();
void loadLiveTrends().then((feed) => {
  if (feed?.keywords?.length) {
    allLiveTrendPool = feed.keywords;
    state.liveTrends = pickTrendChips(allLiveTrendPool, 6);
    render();
  }
});
