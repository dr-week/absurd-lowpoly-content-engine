import './styles/main.scss';
import { generateFreshLiveNewsTopics } from './engine/free_ai';
import { generateLiveTopics } from './engine/live_ai';
import { loadLiveTrends, pickTrendChips } from './engine/live_feeds';
import { generatePromptsForTopic } from './engine/prompt_renderer';
import { loadGeneratedIds, loadSaved, markTopicGenerated } from './engine/saved_store';
import { computeTasteDna } from './engine/taste_dna';
import { loadConfig, loadLogs, loadSeenPairs, loadSeenTitles, saveSeenPairs, saveSeenTitles } from './engine/telemetry';
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
const seenTitles = loadSeenTitles();
const initialTopics = evaluateTopics({ count: 8, query: '', logs: logs0, seenPairs: seen0, batchNonce: Date.now() });
saveSeenPairs(seen0);

const state: AppState = {
  config: cfg0,
  activeTab: 'studio',
  drawerOpen: false,
  seedQuery: '',
  hookFilter: 'all',
  situationFilter: 'all',
  batchNonce: Date.now(),
  seenPairs: seen0,
  seenTitles,
  topics: initialTopics,
  liveTrends: [],
  loadingTopics: cfg0.sourceMode === 'live-free',
  selectedId: null,
  prompts: null,
  rigStep: 0,
  punchStep: 0,
  loading: false,
  logs: logs0,
  saved: loadSaved(),
  generatedIds: loadGeneratedIds(),
  savedFilter: 'all',
  copiedTarget: null,
};

function rememberTitles(topics: { title: string }[]): void {
  for (const t of topics) state.seenTitles.add(t.title.trim().toLowerCase());
  saveSeenTitles(state.seenTitles);
}

function toast(msg: string): void {
  const host = document.getElementById('toast-plane');
  if (!host) return;
  const node = document.createElement('div');
  node.className = 'toast-item zuari-surface-frosted';
  node.innerHTML = `${Glyphs.check(14)}<span>${esc(msg)}</span>`;
  host.appendChild(node);
  window.setTimeout(() => node.remove(), 2000);
}

let allLiveTrendPool: string[] = [];

async function refreshTopics(): Promise<void> {
  if (allLiveTrendPool.length > 6 && !state.seedQuery.trim()) state.liveTrends = pickTrendChips(allLiveTrendPool, 6);
  const mode = state.config.sourceMode;
  const isByok = mode === 'gemini' || mode === 'groq' || mode === 'openrouter';

  if (mode === 'live-free' || (isByok && state.config.apiKey.trim())) {
    state.loadingTopics = true;
    render();
    try {
      const tasteSummary = computeTasteDna(state.logs, state.saved).promptSummary;
      if (mode === 'live-free') {
        state.topics = await generateFreshLiveNewsTopics({ query: state.seedQuery, logs: state.logs, seenTitles: state.seenTitles, batchNonce: state.batchNonce, hookFilter: state.hookFilter, situationFilter: state.situationFilter, tasteSummary });
      } else {
        const avoid = [...Array.from(state.seenTitles).slice(-30), ...state.topics.map((t) => t.title)];
        state.topics = await generateLiveTopics(state.config, state.seedQuery, state.logs, avoid, state.liveTrends, state.hookFilter, state.situationFilter);
      }
      rememberTitles(state.topics);
      state.loadingTopics = false;
      render();
      toast('8 brand-new live topics');
      return;
    } catch (err) {
      state.loadingTopics = false;
      toast(`Live fallback: ${err instanceof Error ? err.message : 'offline'}`);
    }
  }
  state.topics = evaluateTopics({ count: 8, query: state.seedQuery, logs: state.logs, seenPairs: state.seenPairs, batchNonce: state.batchNonce, hookFilter: state.hookFilter, situationFilter: state.situationFilter });
  saveSeenPairs(state.seenPairs);
  rememberTitles(state.topics);
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
    surfaceHtml = renderStudioView({ topics: state.topics, logs: state.logs, generatedIds: state.generatedIds, selectedId: state.selectedId, prompts: state.prompts, loadingTopics: state.loadingTopics, loading: state.loading, seedQuery: state.seedQuery, hookFilter: state.hookFilter, situationFilter: state.situationFilter, liveTrends: state.liveTrends, copiedTarget: state.copiedTarget });
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
if (state.config.sourceMode === 'live-free') void refreshTopics();
