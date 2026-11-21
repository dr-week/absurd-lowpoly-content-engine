import './styles/main.scss';
import { ALL_TOPICS } from './data';
import { generatePromptsForTopic } from './engine/prompt_renderer';
import { loadConfig, loadLogs } from './engine/telemetry';
import { evaluateTopics } from './engine/viral_evaluator';
import { Glyphs } from './glyphs';
import { renderAnalyticsView, renderLogsView } from './ui/analytics_view';
import { esc } from './ui/escape';
import { bindAppEvents, type AppState } from './ui/events';
import { renderAppShell } from './ui/shell';
import { renderStudioView } from './ui/studio_view';

const cfg0 = loadConfig();
const logs0 = loadLogs();

const state: AppState = {
  config: cfg0,
  activeTab: 'studio',
  drawerOpen: false,
  seedQuery: '',
  offset: 0,
  topics: evaluateTopics(ALL_TOPICS, logs0, cfg0.batchSize, '', 0),
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
  window.setTimeout(() => node.remove(), 1800);
}

function refreshTopics(): void {
  state.topics = evaluateTopics(ALL_TOPICS, state.logs, state.config.batchSize, state.seedQuery, state.offset);
}

async function selectTopic(id: string): Promise<void> {
  const topic = state.topics.find((t) => t.id === id);
  if (!topic) return;
  state.selectedId = topic.id;
  state.loading = true;
  render();
  state.prompts = await generatePromptsForTopic(topic, state.config);
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
      ? renderStudioView({
          topics: state.topics,
          logs: state.logs,
          selectedId: state.selectedId,
          prompts: state.prompts,
          loading: state.loading,
          seedQuery: state.seedQuery,
          batchSize: state.config.batchSize,
          copiedTarget: state.copiedTarget,
        })
      : state.activeTab === 'analytics'
        ? renderAnalyticsView(state.logs)
        : renderLogsView(state.logs);
  root.innerHTML = renderAppShell({
    config: state.config,
    activeTab: state.activeTab,
    drawerOpen: state.drawerOpen,
    logs: state.logs,
    surfaceHtml,
  });
  bindAppEvents(state, { render, refreshTopics, selectTopic, toast });
}

render();
