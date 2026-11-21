import './styles/main.scss';
import { generateLiveTopics } from './engine/live_ai';
import { generatePromptsForTopic } from './engine/prompt_renderer';
import { loadConfig, loadLogs, loadSeenPairs, saveSeenPairs } from './engine/telemetry';
import { evaluateTopics } from './engine/viral_evaluator';
import { Glyphs } from './glyphs';
import { renderAnalyticsView, renderLogsView } from './ui/analytics_view';
import { esc } from './ui/escape';
import { bindAppEvents, type AppState } from './ui/events';
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
  loadingTopics: false,
  selectedId: null,
  prompts: null,
  loading: false,
  logs: logs0,
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

async function refreshTopics(): Promise<void> {
  const isLive = state.config.sourceMode === 'gemini' || state.config.sourceMode === 'groq' || state.config.sourceMode === 'openrouter';
  if (isLive && state.config.apiKey.trim()) {
    state.loadingTopics = true;
    render();
    try {
      const avoid = [...state.topics.map((t) => t.title), ...state.logs.map((l) => l.title)];
      state.topics = await generateLiveTopics(state.config, state.seedQuery, state.logs, avoid);
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

async function selectTopic(id: string): Promise<void> {
  const topic = state.topics.find((t) => t.id === id);
  if (!topic) return;
  state.selectedId = topic.id;
  state.loading = true;
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
  const surfaceHtml =
    state.activeTab === 'studio'
      ? renderStudioView({ topics: state.topics, logs: state.logs, selectedId: state.selectedId, prompts: state.prompts, loadingTopics: state.loadingTopics, loading: state.loading, seedQuery: state.seedQuery, copiedTarget: state.copiedTarget })
      : state.activeTab === 'analytics'
        ? renderAnalyticsView(state.logs)
        : renderLogsView(state.logs);
  root.innerHTML = renderAppShell({ config: state.config, activeTab: state.activeTab, drawerOpen: state.drawerOpen, logs: state.logs, surfaceHtml });
  bindAppEvents(state, { render, refreshTopics, selectTopic, toast });
}

render();
