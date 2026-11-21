import { BRAND_SIGNALS } from '../data/brands';
import { computeAnalytics } from '../engine/telemetry';
import { Glyphs } from '../glyphs';
import type { RatingLogEntry } from '../types';
import { esc } from './escape';

export function renderAnalyticsView(logs: RatingLogEntry[]): string {
  const s = computeAnalytics(logs);

  const angleBars = s.byAngle.length
    ? s.byAngle
        .map(
          (r) => `
            <div class="bar-row">
              <span>${esc(r.angle)}</span>
              <div class="bar-row__track"><div class="bar-row__fill" style="width:${r.rate}%"></div></div>
              <span>${r.up}/${r.down} (${r.rate}%)</span>
            </div>
          `,
        )
        .join('')
    : '<div class="empty-state">No ratings yet</div>';

  const brandRows = Object.values(BRAND_SIGNALS)
    .sort((a, b) => b.spendHeat - a.spendHeat)
    .slice(0, 6)
    .map(
      (b) => `
        <div class="bar-row">
          <span>${esc(b.brand)}</span>
          <div class="bar-row__track"><div class="bar-row__fill" style="width:${b.spendHeat}%"></div></div>
          <span>${b.spendHeat}</span>
        </div>
      `,
    )
    .join('');

  return `
    <section class="section-card zuari-surface-elevated">
      <div class="section-header">
        <div class="section-header__title-group">
          <span class="section-header__step">Evaluator</span>
          <h2>Viral & Taste</h2>
        </div>
        <button type="button" class="btn btn--primary" data-action="export-json" title="Export JSON">
          ${Glyphs.download(15)}
          <span>JSON</span>
        </button>
      </div>

      <div class="metrics-grid">
        <div class="metric-box"><div class="metric-box__label">Rated</div><div class="metric-box__value">${s.totalVotes}</div></div>
        <div class="metric-box"><div class="metric-box__label">Approval</div><div class="metric-box__value">${s.approvalRate}%</div></div>
        <div class="metric-box"><div class="metric-box__label">Topics</div><div class="metric-box__value">${s.byKind.topic.up}/${s.byKind.topic.down}</div></div>
        <div class="metric-box"><div class="metric-box__label">Prompts</div><div class="metric-box__value">${s.byKind.storyboard.up + s.byKind.video.up}/${s.byKind.storyboard.down + s.byKind.video.down}</div></div>
      </div>

      <div class="card-subpanel">
        <div class="subpanel-title">Taste Signal</div>
        <div class="bar-list">${angleBars}</div>
      </div>

      <div class="card-subpanel">
        <div class="subpanel-title">Brand Heat (India)</div>
        <div class="bar-list">${brandRows}</div>
      </div>
    </section>
  `;
}

export function renderLogsView(logs: RatingLogEntry[]): string {
  const rows = logs.length
    ? logs
        .map(
          (e) => `
            <tr>
              <td>${esc(e.timestamp.slice(0, 19).replace('T', ' '))}</td>
              <td><span class="topic-card__tag">${esc(e.kind)}</span></td>
              <td>${esc(e.title)}</td>
              <td>${esc(e.brand)}</td>
              <td>${e.viralScore}</td>
              <td><span class="pill ${e.vote === 'up' ? 'pill--positive' : ''}">${e.vote === 'up' ? 'UP' : 'DOWN'}</span></td>
            </tr>
          `,
        )
        .join('')
    : '<tr><td colspan="6" class="empty-cell">No logs yet</td></tr>';

  return `
    <section class="section-card zuari-surface-elevated">
      <div class="section-header">
        <div class="section-header__title-group">
          <span class="section-header__step">Dataset</span>
          <h2>Logs</h2>
        </div>
        <div class="section-header__actions">
          <button type="button" class="btn btn--primary" data-action="export-jsonl" title="Download JSONL">
            ${Glyphs.download(15)}<span>JSONL</span>
          </button>
          <button type="button" class="btn" data-action="export-json" title="Download JSON">
            ${Glyphs.download(15)}<span>JSON</span>
          </button>
          <button type="button" class="btn btn--icon" data-action="clear-logs" title="Clear Logs">
            ${Glyphs.trash(15)}
          </button>
        </div>
      </div>
      <div class="log-table-wrap">
        <table class="log-table">
          <thead><tr><th>Time</th><th>Type</th><th>Title</th><th>Brand</th><th>Score</th><th>Vote</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </section>
  `;
}
