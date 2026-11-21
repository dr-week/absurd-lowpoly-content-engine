import assert from 'node:assert/strict';
import { scoreComedyCraft } from '../src/engine/comedy_craft';
import { renderStoryboardText, renderVideoText } from '../src/engine/prompt_renderer';
import { ALL_BESPOKE_STORIES, generateFreshDiverseBatch, worldFamily } from '../src/engine/topic_generator';
import { markTopicGenerated, removeSavedTopic, saveLikedTopic } from '../src/engine/saved_store';
import { synthesizeTrendCard } from '../src/engine/trend_synthesizer';
import type { RatingLogEntry } from '../src/types';

// Top-1% Anti-Pattern, Comedy Craft & F5-Reload Persistence Harness:
// 1. All 36 bespoke stories pass Comedy Craft scoring & have ZERO robotic "[Genre Label]:" pitch prefixes.
// 2. Across 15 simulated F5 reloads (120 cards): 6/6 formats/batch, 0/8 consecutive repeats,
//    ZERO world/brand-family collisions per batch (e.g. max 1 Goa!), and ZERO adjacent same-format cards.
// 3. Trend chip synthesis rotates across 3 distinct comedy mechanisms.

const LABEL_PREFIX_RE = /^(?:Fake biopic|Fake childhood origin|Live [A-Za-z ]+(?:news|broadcast)|[A-Za-z ]+documentary|Earnest [a-z-]+ (?:tutorial|hack)|Travel guide tutorial):/i;

assert.ok(ALL_BESPOKE_STORIES.length >= 36, `Expected >= 36 bespoke stories, got ${ALL_BESPOKE_STORIES.length}`);
for (const story of ALL_BESPOKE_STORIES) {
  const craft = scoreComedyCraft(story);
  assert.ok(craft.hasSixBeats, `Story "${story.id}" missing 6 frames/shots`);
  assert.ok(craft.punchlineWords >= 3 && craft.punchlineWords <= 9, `Story "${story.id}" punchline words: ${craft.punchlineWords}`);
  assert.ok(craft.total >= 80, `Story "${story.id}" craft score too low: ${craft.total}`);
  assert.ok(!LABEL_PREFIX_RE.test(story.pitch), `Robotic genre prefix leaked in "${story.id}": ${story.pitch}`);
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

const RELOADS = 15;
for (let r = 1; r <= RELOADS; r += 1) {
  const seenPairs = new Set<string>(JSON.parse(persistedJson) as string[]);
  const batch = generateFreshDiverseBatch({ count: 8, query: '', logs: biasedLogs, seenPairs, batchNonce: r });
  persistedJson = JSON.stringify(Array.from(seenPairs).slice(-120));

  assert.equal(batch.length, 8, `Reload ${r}: expected 8 topics`);
  assert.equal(new Set(batch.map((t) => t.angle)).size, 6, `Reload ${r}: expected 6/6 distinct story formats`);
  assert.equal(new Set(batch.map((t) => worldFamily(t.brand))).size, 8, `Reload ${r}: world/brand family collided in same batch!`);

  for (let i = 1; i < batch.length; i += 1) {
    assert.notEqual(batch[i].angle, batch[i - 1].angle, `Reload ${r}: adjacent same-format cards at ${i - 1},${i}`);
  }

  const ids = new Set(batch.map((t) => t.id));
  assert.equal(ids.size, 8);
  for (const id of ids) assert.ok(!prevIds.has(id), `Reload ${r}: repeated story "${id}" from previous reload`);
  prevIds = ids;

  for (const topic of batch) {
    const sb = renderStoryboardText(topic.title, topic.frames ?? []);
    const vid = renderVideoText(topic.shots ?? []);
    assert.ok(!topic.pitch.includes('deadpans "'), `Mad-Libs clone detected: ${topic.title}`);
    assert.ok(!/delhi|mumbai|bombay/i.test(`${topic.title} ${topic.pitch}`), `City lock-in leaked: ${topic.title}`);
    assert.ok(sb.includes('3x2 grid') && sb.includes('NO cel-shading'));
    assert.ok(!vid.includes('9:16') && !vid.includes('20-second') && !vid.includes('[0:00'));
  }
}

assert.equal(new Set([0, 1, 2].map((n) => synthesizeTrendCard('Anthropic', n).angle)).size, 3);

// Verify Saved (Thumbs Up) -> Pending -> Generated via Arrow (Done) -> Remove lifecycle
const sample = generateFreshDiverseBatch({ count: 8, query: '', logs: [], seenPairs: new Set(), batchNonce: 777 })[0];
let savedList = saveLikedTopic([], new Set(), sample);
assert.equal(savedList.length, 1);
assert.equal(savedList[0].generated, false, 'Newly liked topic should start as Pending (generated: false)');
const afterGen = markTopicGenerated(savedList, new Set(), sample.id);
assert.equal(afterGen.saved[0].generated, true, 'Arrow-generated topic must flip to Done (generated: true)');
assert.ok(afterGen.generatedIds.has(sample.id));
savedList = removeSavedTopic(afterGen.saved, sample.id);
assert.equal(savedList.length, 0);

console.log(
  `HARNESS PASS: ${ALL_BESPOKE_STORIES.length} stories × ${RELOADS} F5 reloads = ${RELOADS * 8} cards ` +
    `(6/6 formats, 8/8 unique worlds, 0 adjacent same-format, 0/8 repeats, 0 genre-prefix clichés, Saved/Pending/Done verified).`,
);
