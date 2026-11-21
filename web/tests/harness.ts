import assert from 'node:assert/strict';
import { renderStoryboardText, renderVideoText } from '../src/engine/prompt_renderer';
import { generateFreshDiverseBatch } from '../src/engine/topic_generator';
import type { RatingLogEntry } from '../src/types';

// Automated Quality & Diversity Harness:
// Proves across 15 consecutive refreshes (120 generated topics) that:
// 1. Every batch returns exactly 8 unrelated topics (8 unique angles, 8 unique brands).
// 2. Heavy bias toward Zepto/Zomato in logs NEVER causes Zepto/Zomato clustering.
// 3. Zero topic overlap between consecutive refreshes (every refresh is 100% fresh).
// 4. Every rendered Video Prompt strictly omits duration, size/aspect ratio, and timestamps.

const biasedLogs: RatingLogEntry[] = Array.from({ length: 10 }, (_, idx) => ({
  id: `topic_zepto_${idx}`,
  timestamp: new Date().toISOString(),
  kind: 'topic',
  targetId: `zepto_${idx}`,
  title: 'ZEPTO TEST',
  angle: 'quick-commerce',
  brand: 'Zepto',
  viralScore: 95,
  vote: 'up',
}));

const seenPairs = new Set<string>();
let prevTitles = new Set<string>();
const allUniqueTitles = new Set<string>();

const REFRESHES = 15;
for (let r = 1; r <= REFRESHES; r += 1) {
  const batch = generateFreshDiverseBatch({
    count: 8,
    query: '',
    logs: biasedLogs,
    seenPairs,
    batchNonce: r,
  });

  assert.equal(batch.length, 8, `Refresh ${r}: expected 8 topics, got ${batch.length}`);

  const angles = new Set(batch.map((t) => t.angle));
  const brands = new Set(batch.map((t) => t.brand));
  const titles = new Set(batch.map((t) => t.title));

  assert.equal(angles.size, 8, `Refresh ${r}: expected 8 distinct angles, got ${angles.size}`);
  assert.equal(brands.size, 8, `Refresh ${r}: expected 8 distinct brands, got ${brands.size}`);
  assert.equal(titles.size, 8, `Refresh ${r}: expected 8 distinct titles, got ${titles.size}`);

  // Zero repeat from immediately preceding refresh
  for (const title of titles) {
    assert.ok(!prevTitles.has(title), `Refresh ${r}: repeated topic "${title}" from previous refresh`);
    allUniqueTitles.add(title);
  }
  prevTitles = titles;

  // Validate prompt output constraints on every generated topic
  for (const topic of batch) {
    const sb = renderStoryboardText(topic.title, topic.frames ?? []);
    const vid = renderVideoText(topic.shots ?? []);

    assert.ok(sb.includes('3x2 grid'), 'Storyboard missing 3x2 grid');
    assert.ok(sb.includes('NO cel-shading'), 'Storyboard missing NO cel-shading');
    assert.ok(!vid.includes('9:16'), `Video prompt leaked 9:16: ${topic.title}`);
    assert.ok(!vid.includes('20-second'), `Video prompt leaked 20-second: ${topic.title}`);
    assert.ok(!vid.includes('[0:00'), `Video prompt leaked timestamp: ${topic.title}`);
    assert.ok(vid.includes('Shot 1:') && vid.includes('Shot 6:'), 'Video prompt missing Shot 1..6');
  }
}

console.log(
  `HARNESS PASS: ${REFRESHES} refreshes × 8 topics = ${REFRESHES * 8} topics verified ` +
    `(${allUniqueTitles.size} unique titles, 8/8 unrelated angles & brands per batch, 0% consecutive repeats, 0 time/size leaks).`,
);
