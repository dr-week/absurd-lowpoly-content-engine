import { computeAnalytics } from '../engine/telemetry';
import { Glyphs } from '../glyphs';
import type { ActiveTab, EngineConfig, RatingLogEntry } from '../types';
import { esc } from './escape';

export function renderAppShell(params: {
  config: EngineConfig;
  activeTab: ActiveTab;
  drawerOpen: boolean;
  logs: RatingLogEntry[];
  savedCount: number;
  surfaceHtml: string;
}): string {
  const { config, activeTab, drawerOpen, logs, savedCount, surfaceHtml } = params;
  const stats = computeAnalytics(logs);
  const isLiveAi = config.sourceMode === 'gemini' || config.sourceMode === 'groq' || config.sourceMode === 'openrouter';

  return `
    <div class="app-shell">
      <header class="ambient-header zuari-surface-frosted">
        <div class="ambient-header__inner">
          <div class="ambient-header__brand">
            <div class="brand-mark">${Glyphs.layers(16)}</div>
            <h1>Absurd Studio</h1>
          </div>
          <div class="vote-group" role="navigation" aria-label="Primary Workspaces">
            <button type="button" class="btn ${activeTab === 'chat' ? 'btn--active' : ''}" data-action="tab" data-tab="chat">${Glyphs.messageSquare(14)}<span>AI Chat</span></button>
            <button type="button" class="btn ${activeTab === 'studio' ? 'btn--active' : ''}" data-action="tab" data-tab="studio">${Glyphs.sparkle(14)}<span>Studio</span></button>
            <button type="button" class="btn ${activeTab === 'stage' ? 'btn--active' : ''}" data-action="tab" data-tab="stage">${Glyphs.stage(14)}<span>Stage</span></button>
          </div>
          <div class="ambient-header__metrics">
            <span class="pill" title="${stats.totalVotes} votes logged">${esc(config.sourceMode)} · <strong>${stats.approvalRate}%</strong></span>
            <button type="button" class="btn btn--icon" data-action="export-jsonl" title="Download JSONL Logs">${Glyphs.download(15)}</button>
            <button type="button" class="btn btn--icon" data-action="toggle-theme" title="Theme">${config.theme === 'studio' ? Glyphs.moon(15) : Glyphs.sun(15)}</button>
            <button type="button" class="btn btn--icon" data-action="open-drawer" title="Settings">${Glyphs.sliders(15)}</button>
          </div>
        </div>
      </header>

      <main class="surface-main" id="surface-main">${surfaceHtml}</main>

      <nav class="dock-plane zuari-surface-liquid" aria-label="Navigation">
        <button type="button" class="dock-btn ${activeTab === 'chat' ? 'is-active' : ''}" data-action="tab" data-tab="chat" title="AI Chat Writers' Room">${Glyphs.messageSquare(16)}<span>Chat</span></button>
        <button type="button" class="dock-btn ${activeTab === 'studio' ? 'is-active' : ''}" data-action="tab" data-tab="studio" title="Prompt Studio">${Glyphs.sparkle(16)}<span>Studio</span></button>
        <button type="button" class="dock-btn ${activeTab === 'stage' ? 'is-active' : ''}" data-action="tab" data-tab="stage" title="Teleprompter & Safe-Zone Stage">${Glyphs.stage(16)}<span>Stage</span></button>
        <button type="button" class="dock-btn ${activeTab === 'saved' ? 'is-active' : ''}" data-action="tab" data-tab="saved" title="Saved">${Glyphs.bookmark(16)}<span>Saved${savedCount > 0 ? ` · ${savedCount}` : ''}</span></button>
        <button type="button" class="dock-btn ${activeTab === 'analytics' ? 'is-active' : ''}" data-action="tab" data-tab="analytics" title="Viral">${Glyphs.barChart(16)}<span>Viral</span></button>
        <button type="button" class="dock-btn ${activeTab === 'logs' ? 'is-active' : ''}" data-action="tab" data-tab="logs" title="Logs">${Glyphs.fileText(16)}<span>Logs</span></button>
      </nav>

      <div class="drawer-backdrop ${drawerOpen ? 'is-open' : ''}" id="drawer-backdrop">
        <aside class="drawer-panel" role="dialog" aria-label="Settings">
          <div class="section-header">
            <div class="section-header__title-group"><span class="section-header__step">Config</span><h2>Settings</h2></div>
            <button type="button" class="btn btn--icon" data-action="close-drawer" aria-label="Close">${Glyphs.close(16)}</button>
          </div>

          <div class="field-group">
            <label for="cfg-theme">Theme</label>
            <select id="cfg-theme">
              <option value="studio" ${config.theme === 'studio' ? 'selected' : ''}>Studio (Liquid Light)</option>
              <option value="noir" ${config.theme === 'noir' ? 'selected' : ''}>Noir (Liquid Dark)</option>
            </select>
          </div>

          <div class="field-group">
            <label for="cfg-source">AI Engine</label>
            <select id="cfg-source">
              <option value="live-free" ${config.sourceMode === 'live-free' ? 'selected' : ''}>Live News + Free AI (Infinite, no key)</option>
              <option value="chrome-nano" ${config.sourceMode === 'chrome-nano' ? 'selected' : ''}>Chrome Built-in AI (Gemini Nano, $0 On-Device)</option>
              <option value="standalone" ${config.sourceMode === 'standalone' ? 'selected' : ''}>Curated Comedy Vault (104 stories, instant)</option>
              <option value="gemini" ${config.sourceMode === 'gemini' ? 'selected' : ''}>Gemini API (Free key, live AI)</option>
              <option value="groq" ${config.sourceMode === 'groq' ? 'selected' : ''}>Groq API (Free key, live AI)</option>
              <option value="openrouter" ${config.sourceMode === 'openrouter' ? 'selected' : ''}>OpenRouter (Any AI, live)</option>
              <option value="backend" ${config.sourceMode === 'backend' ? 'selected' : ''}>Local FastAPI Backend</option>
            </select>
          </div>

          ${
            isLiveAi
              ? `<div class="field-group">
                  <label for="cfg-api-key">API Key (saved only in your browser)</label>
                  <input id="cfg-api-key" type="password" placeholder="Paste key..." value="${esc(config.apiKey)}" />
                </div>
                <div class="field-group">
                  <label for="cfg-model">Model</label>
                  <input id="cfg-model" type="text" placeholder="gemini-2.5-flash" value="${esc(config.model)}" />
                </div>`
              : ''
          }

          ${
            config.sourceMode === 'backend'
              ? `<div class="field-group">
                  <label for="cfg-backend-url">Backend URL</label>
                  <input id="cfg-backend-url" type="text" value="${esc(config.backendUrl)}" />
                </div>`
              : ''
          }

          <div class="field-group">
            <label>Cross-Device Sync (Saved, Done & History)</label>
            <div class="vote-group">
              <button type="button" class="btn" data-action="export-backup">${Glyphs.download(14)}<span>Backup JSON</span></button>
              <label class="btn" for="restore-backup-input" style="cursor:pointer;"><span>Restore</span></label>
              <input id="restore-backup-input" type="file" accept=".json,application/json" hidden />
            </div>
          </div>
        </aside>
      </div>

      <div class="toast-plane" id="toast-plane" aria-live="polite"></div>
    </div>
  `;
}
