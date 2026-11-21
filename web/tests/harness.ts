import assert from 'node:assert/strict';
import { renderStoryboardText, renderVideoText } from '../src/engine/prompt_renderer';
import { generateFreshDiverseBatch } from '../src/engine/topic_generator';
import type { RatingLogEntry } from '../src/types';

// Top-1% Anti-Pattern, 6-Format Diversity & F5-Reload Persistence Harness:
// Proves across 15 simulated browser F5 reloads (120 cards) that:
// 1. Every batch returns 8 cards covering ALL 6 structurally different story formats.
// 2. ZERO card repeats between consecutive F5 reloads (0/8 overlap).
// 3. ZERO Mad-Libs clone skeletons ("deadpans \""), ZERO Delhi/Mumbai lock-in, ZERO time/size leaks.
// 4. Clicking any custom live trend chip (e.g. "Anthropic") synthesizes a breaking-news card cleanly.

const biasedLogs: RatingLogEntry[] = Array.from({ length: 10 }, (_, idx) => ({
  id: `topic_bias_${idx}`,
  timestamp: new Date().toISOString(),
  kind: 'topic',
  targetId: `bias_${idx}`,
  title: 'BIAS TEST',
  angle: 'over-engineer',
  brand: 'Elon Musk',
  viralScore: 98,
  vote: 'up',
}));

let persistedJson = '[]';
let prevIds = new Set<string>();
const allSeenIds = new Set<string>();

const RELOADS = 15;
for (let r = 1; r <= RELOADS; r += 1) {
  const seenPairs = new Set<string>(JSON.parse(persistedJson) as string[]);
  const batch = generateFreshDiverseBatch({
    count: 8,
    query: '',
    logs: biasedLogs,
    seenPairs,
    batchNonce: r,
  });
  persistedJson = JSON.stringify(Array.from(seenPairs).slice(-120));

  assert.equal(batch.length, 8, `Reload ${r}: expected 8 topics`);
  const formats = new Set(batch.map((t) => t.angle));
  assert.equal(formats.size, 6, `Reload ${r}: expected all 6 distinct story formats, got ${formats.size}`);

  const ids = new Set(batch.map((t) => t.id));
  assert.equal(ids.size, 8, `Reload ${r}: duplicate card inside same batch`);
  for (const id of ids) {
    assert.ok(!prevIds.has(id), `Reload ${r}: repeated story "${id}" from previous reload`);
    allSeenIds.add(id);
  }
  prevIds = ids;

  for (const topic of batch) {
    const sb = renderStoryboardText(topic.title, topic.frames ?? []);
    const vid = renderVideoText(topic.shots ?? []);
    assert.ok(!topic.pitch.includes('deadpans "'), `Mad-Libs clone detected: ${topic.title}`);
    assert.ok(!/delhi|mumbai|bombay/i.test(`${topic.title} ${topic.pitch}`), `City lock-in leaked: ${topic.title}`);
    assert.ok(sb.includes('3x2 grid') && sb.includes('NO cel-shading'));
    assert.ok(!vid.includes('9:16') && !vid.includes('20-second') && !vid.includes('[0:00'));
    assert.ok(vid.includes('Shot 1:') && vid.includes('Shot 6:'));
  }
}

const trendBatch = generateFreshDiverseBatch({
  count: 8,
  query: 'Anthropic',
  logs: [],
  seenPairs: new Set<string>(),
  batchNonce: 99,
});
assert.equal(trendBatch.length, 8);
assert.ok(trendBatch.some((t) => t.title.includes('ANTHROPIC')), 'Custom trend chip failed to synthesize');
assert.equal(new Set(trendBatch.map((t) => t.angle)).size, 6, 'Custom trend batch lost 6-format diversity');

console.log(
  `HARNESS PASS: ${RELOADS} F5 reloads × 8 topics = ${RELOADS * 8} cards verified ` +
    `(${allSeenIds.size} bespoke stories, 6/6 distinct story formats per batch, 0/8 consecutive repeats, 0 Mad-Libs clones, 0 time/size leaks).`,
);
