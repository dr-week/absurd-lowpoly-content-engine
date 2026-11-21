import assert from 'node:assert/strict';
import { renderStoryboardText, renderVideoText } from '../src/engine/prompt_renderer';
import { generateFreshDiverseBatch } from '../src/engine/topic_generator';
import type { RatingLogEntry } from '../src/types';

// Automated Quality, Diversity & F5-Reload Persistence Harness:
// Proves across 15 simulated browser reloads (120 topics) that:
// 1. Every batch returns exactly 8 unrelated topics (8 unique angles, 8 unique brands).
// 2. ZERO brand/domain overlap AND ZERO title overlap between consecutive refreshes/reloads!
// 3. Heavy Zepto log bias NEVER causes Zepto/quick-commerce clustering.
// 4. Serializing & rehydrating seenPairs (simulating F5 reload) preserves 0/8 overlap.
// 5. Every rendered Video Prompt strictly omits duration, size/aspect ratio, and timestamps.

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

let persistedJson = '[]';
let prevTitles = new Set<string>();
let prevBrands = new Set<string>();
const allUniqueTitles = new Set<string>();

const RELOADS = 15;
for (let r = 1; r <= RELOADS; r += 1) {
  // Simulate full browser F5 reload by rehydrating seenPairs from serialized JSON
  const seenPairs = new Set<string>(JSON.parse(persistedJson) as string[]);

  const batch = generateFreshDiverseBatch({
    count: 8,
    query: '',
    logs: biasedLogs,
    seenPairs,
    batchNonce: r,
  });

  // Simulate saving back to localStorage
  persistedJson = JSON.stringify(Array.from(seenPairs).slice(-160));

  assert.equal(batch.length, 8, `Reload ${r}: expected 8 topics, got ${batch.length}`);

  const angles = new Set(batch.map((t) => t.angle));
  const brands = new Set(batch.map((t) => t.brand));
  const titles = new Set(batch.map((t) => t.title));

  assert.equal(angles.size, 8, `Reload ${r}: expected 8 distinct angles, got ${angles.size}`);
  assert.equal(brands.size, 8, `Reload ${r}: expected 8 distinct brands, got ${brands.size}`);
  assert.equal(titles.size, 8, `Reload ${r}: expected 8 distinct titles, got ${titles.size}`);

  // STRICT: 0/8 brand overlap AND 0/8 title overlap vs immediately preceding reload!
  for (const brand of brands) {
    assert.ok(!prevBrands.has(brand), `Reload ${r}: repeated brand "${brand}" from previous batch`);
  }
  for (const title of titles) {
    assert.ok(!prevTitles.has(title), `Reload ${r}: repeated title "${title}" from previous batch`);
    allUniqueTitles.add(title);
  }
  prevBrands = brands;
  prevTitles = titles;

  for (const topic of batch) {
    const sb = renderStoryboardText(topic.title, topic.frames ?? []);
    const vid = renderVideoText(topic.shots ?? []);
    assert.ok(!/delhi|mumbai|bombay/i.test(`${topic.title} ${topic.pitch}`), `City lock-in leaked: ${topic.title}`);
    assert.ok(!/holding\b.*\bholding\b/i.test(topic.pitch), `Double-holding grammar bug: ${topic.pitch}`);
    assert.ok(!sb.includes('Ye kya ho gaya?'), 'Hardcoded Frame 3 caption leaked');
    assert.ok(sb.includes('3x2 grid') && sb.includes('NO cel-shading'));
    assert.ok(!vid.includes('9:16') && !vid.includes('20-second') && !vid.includes('[0:00'));
    assert.ok(vid.includes('Shot 1:') && vid.includes('Shot 6:'));
  }
}

console.log(
  `HARNESS PASS: ${RELOADS} F5 reloads × 8 topics = ${RELOADS * 8} topics verified ` +
    `(${allUniqueTitles.size} unique titles, 0/8 brand overlap between reloads, 0/8 title overlap, 0 time/size leaks).`,
);
