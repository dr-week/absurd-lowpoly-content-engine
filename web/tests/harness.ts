import assert from 'node:assert/strict';
import { scoreComedyCraft } from '../src/engine/comedy_craft';
import { renderStoryboardText, renderVideoText } from '../src/engine/prompt_renderer';
import { ALL_BESPOKE_STORIES, generateFreshDiverseBatch } from '../src/engine/topic_generator';
import { synthesizeTrendCard } from '../src/engine/trend_synthesizer';
import type { RatingLogEntry } from '../src/types';

// Top-1% Comedy Craft, 6-Format Diversity & F5-Reload Persistence Harness:
// 1. Verifies all 36 bespoke stories pass Comedy Craft scoring (6 beats, crisp punchline <= 9 words, zero city lock-in).
// 2. Proves across 15 simulated browser F5 reloads (120 cards) that every batch covers 6/6 formats with 0/8 consecutive repeats.
// 3. Proves live trend chip synthesis rotates across 3 distinct comedy mechanisms (breaking-news, fake-tutorial, petty-spiral).

assert.ok(ALL_BESPOKE_STORIES.length >= 36, `Expected >= 36 bespoke stories, got ${ALL_BESPOKE_STORIES.length}`);
for (const story of ALL_BESPOKE_STORIES) {
  const craft = scoreComedyCraft(story);
  assert.ok(craft.hasSixBeats, `Story "${story.id}" missing 6 frames/shots`);
  assert.ok(craft.punchlineWords >= 3 && craft.punchlineWords <= 9, `Story "${story.id}" punchline too long/short: ${craft.punchlineWords} words`);
  assert.ok(craft.total >= 80, `Story "${story.id}" craft score too low: ${craft.total}`);
}

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
  assert.equal(new Set(batch.map((t) => t.angle)).size, 6, `Reload ${r}: expected all 6 distinct story formats`);

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

const trendAngles = new Set([0, 1, 2].map((n) => synthesizeTrendCard('Anthropic', n).angle));
assert.equal(trendAngles.size, 3, 'Trend synthesizer must rotate across 3 distinct comedy formats');

console.log(
  `HARNESS PASS: ${ALL_BESPOKE_STORIES.length} comedy-crafted stories verified; ` +
    `${RELOADS} F5 reloads × 8 = ${RELOADS * 8} cards (6/6 formats/batch, 0/8 repeats, 3 rotating trend mechanisms, 0 time/size leaks).`,
);
