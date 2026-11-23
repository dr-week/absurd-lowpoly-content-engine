import './styles/main.scss';
import { buildCustomEpisode } from './engine/custom_builder';
import { pullUnseenDailyEpisodes } from './engine/daily_pool';
import { generateFreshLiveNewsTopics } from './engine/free_ai';
import { generateLiveTopics } from './engine/live_ai';
import { loadLiveTrends, pickTrendChips } from './engine/live_feeds';
import { buildCrossoverEpisode } from './engine/mashup_engine';
import { generatePromptsForTopic } from './engine/prompt_renderer';
import { loadGeneratedIds, loadSaved, markTopicGenerated, saveLikedTopic } from './engine/saved_store';
import { buildPart2Topic } from './engine/sequel_engine';
import { computeTasteDna } from './engine/taste_dna';
import { loadConfig, loadLogs, loadSeenPairs, loadSeenTitles, saveSeenPairs, saveSeenTitles } from './engine/telemetry';
import { evaluateTopics } from './engine/viral_evaluator';
import { Glyphs } from './glyphs';
import type { ScoredTopic } from './types';
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
  config: cfg0, activeTab: 'studio', drawerOpen: false, openPanel: 'none', seedQuery: '', customDraft: '', hookFilter: 'all', situationFilter: 'all',
  visualStyle: 'ps1-1998', targetModel: 'veo-3-flow', marketingPlatform: 'reels', brandProduct: '', batchNonce: Date.now(), seenPairs: seen0, seenTitles: loadSeenTitles(), topics: initialTopics, liveTrends: [],
  loadingTopics: cfg0.sourceMode === 'live-free', selectedId: null, activeTopic: undefined, prompts: null,
  rigStep: 0, punchStep: 0, twistStep: 0, nameStep: 0, stackStep: 0, voiceStep: 0, castStep: 0, promoStep: 0, accentStep: 0, overlayStep: 0, loading: false, logs: logs0, saved: loadSaved(), generatedIds: loadGeneratedIds(),
  savedFilter: 'all', copiedTarget: null,
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

  if (mode === 'live-free' && !state.seedQuery.trim() && state.hookFilter === 'all' && state.situationFilter === 'all') {
    const daily = await pullUnseenDailyEpisodes(state.seenTitles, 8);
    if (daily.length >= 4) { state.topics = daily; rememberTitles(daily); state.loadingTopics = false; render(); toast('8 fresh Daily AI episodes'); return; }
  }

  if (mode === 'live-free' || (isByok && state.config.apiKey.trim())) {
    state.loadingTopics = true; render();
    try {
      const tasteSummary = computeTasteDna(state.logs, state.saved).promptSummary;
      state.topics = mode === 'live-free'
        ? await generateFreshLiveNewsTopics({ query: state.seedQuery, logs: state.logs, seenTitles: state.seenTitles, batchNonce: state.batchNonce, hookFilter: state.hookFilter, situationFilter: state.situationFilter, tasteSummary })
        : await generateLiveTopics(state.config, state.seedQuery, state.logs, [...Array.from(state.seenTitles).slice(-30), ...state.topics.map((t) => t.title)], state.liveTrends, state.hookFilter, state.situationFilter);
      rememberTitles(state.topics); state.loadingTopics = false; render(); toast('8 brand-new live topics'); return;
    } catch (err) {
      state.loadingTopics = false; toast(`Live fallback: ${err instanceof Error ? err.message : 'offline'}`);
    }
  }
  state.topics = evaluateTopics({ count: 8, query: state.seedQuery, logs: state.logs, seenPairs: state.seenPairs, batchNonce: state.batchNonce, hookFilter: state.hookFilter, situationFilter: state.situationFilter });
  saveSeenPairs(state.seenPairs); rememberTitles(state.topics); render(); toast('8 fresh topics');
}

async function generateFor(topic: ScoredTopic, switchStudio: boolean): Promise<void> {
  if (switchStudio) state.activeTab = 'studio';
  state.visualStyle = topic.visualStyle ?? 'ps1-1998';
  state.selectedId = topic.id; state.activeTopic = topic; state.loading = true;
  Object.assign(state, markTopicGenerated(state.saved, state.generatedIds, topic.id));
  render();
  try { state.prompts = await generatePromptsForTopic(topic, state.config, state.visualStyle); }
  catch (err) { toast(`Prompt error: ${err instanceof Error ? err.message : 'failed'}`); }
  state.loading = false; render();
  document.getElementById('section-prompts')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function selectTopic(id: string, fromSaved = false): Promise<void> {
  const topic = state.topics.find((t) => t.id === id) ?? state.saved.find((s) => s.topic.id === id)?.topic;
  if (topic) await generateFor(topic, fromSaved);
}

async function createSequel(topic: ScoredTopic): Promise<void> {
  const sequel = buildPart2Topic(topic);
  rememberTitles([sequel]); await generateFor(sequel, true); toast(sequel.title);
}

async function createMashup(): Promise<void> {
  const mash = buildCrossoverEpisode(state.saved.map((s) => s.topic));
  if (!mash) return;
  rememberTitles([mash]); await generateFor(mash, true); toast(mash.title);
}

async function runCustomIdea(): Promise<void> {
  if (!state.customDraft.trim()) { toast('Type an idea first'); return; }
  const custom = buildCustomEpisode(state.customDraft, state.hookFilter);
  state.saved = saveLikedTopic(state.saved, state.generatedIds, custom);
  state.customDraft = '';
  rememberTitles([custom]); await generateFor(custom, true); toast('Created & Saved');
}

function render(): void {
  const root = document.getElementById('app');
  if (!root) return;
  document.documentElement.setAttribute('data-theme', state.config.theme);
  const surfaceHtml =
    state.activeTab === 'studio'
      ? renderStudioView({ topics: state.topics, logs: state.logs, generatedIds: state.generatedIds, selectedId: state.selectedId, activeTopic: state.activeTopic, prompts: state.prompts, visualStyle: state.visualStyle, targetModel: state.targetModel, marketingPlatform: state.marketingPlatform, brandProduct: state.brandProduct, loadingTopics: state.loadingTopics, loading: state.loading, seedQuery: state.seedQuery, customDraft: state.customDraft, hookFilter: state.hookFilter, situationFilter: state.situationFilter, liveTrends: state.liveTrends, copiedTarget: state.copiedTarget, openPanel: state.openPanel })
      : state.activeTab === 'saved'
        ? renderSavedView({ saved: state.saved, filter: state.savedFilter, selectedId: state.selectedId })
        : state.activeTab === 'analytics'
          ? renderAnalyticsView(state.logs, state.saved)
          : renderLogsView(state.logs);
  root.innerHTML = renderAppShell({ config: state.config, activeTab: state.activeTab, drawerOpen: state.drawerOpen, logs: state.logs, savedCount: state.saved.length, surfaceHtml });
  bindAppEvents(state, { render, refreshTopics, selectTopic, createSequel, createMashup, runCustomIdea, toast });
}

window.addEventListener('keydown', (ev) => {
  const tag = (ev.target as HTMLElement | null)?.tagName;
  if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA' || ev.metaKey || ev.ctrlKey || ev.altKey) return;
  if (ev.key.toLowerCase() === 'r' && state.activeTab === 'studio') { state.batchNonce += 1; void refreshTopics(); }
  const digit = Number(ev.key);
  if (digit >= 1 && digit <= 8 && state.activeTab === 'studio' && state.topics[digit - 1]) {
    void selectTopic(state.topics[digit - 1].id, false);
  }
});

render();
void loadLiveTrends().then((feed) => {
  if (feed?.keywords?.length) { allLiveTrendPool = feed.keywords; state.liveTrends = pickTrendChips(allLiveTrendPool, 6); render(); }
});
if (state.config.sourceMode === 'live-free') void refreshTopics();
