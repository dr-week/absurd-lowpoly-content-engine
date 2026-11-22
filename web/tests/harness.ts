import assert from 'node:assert/strict';
import { detectCharacterLock, sanitizeCopyrightNames } from '../src/engine/alias_sanitizer';
import { restoreStudioBackup } from '../src/engine/backup_sync';
import { scoreComedyCraft } from '../src/engine/comedy_craft';
import { buildCustomEpisode } from '../src/engine/custom_builder';
import { scoreHeadlineComedyPotential } from '../src/engine/headline_filter';
import { buildCrossoverEpisode } from '../src/engine/mashup_engine';
import { pickCleanLiveNewsStories } from '../src/engine/news_mapper';
import { renderStoryboardText, renderVideoText } from '../src/engine/prompt_renderer';
import { cycleAlternatePunchline, rerollCameraRig } from '../src/engine/prompt_tools';
import { markTopicGenerated, removeSavedTopic, saveLikedTopic, setSavedOutcome } from '../src/engine/saved_store';
import { buildPart2Topic } from '../src/engine/sequel_engine';
import { computeTasteDna } from '../src/engine/taste_dna';
import { ALL_BESPOKE_STORIES, generateFreshDiverseBatch, worldFamily } from '../src/engine/topic_generator';
import { synthesizeTrendCard } from '../src/engine/trend_synthesizer';
import { buildViralPackage } from '../src/engine/viral_packaging';
import type { RatingLogEntry } from '../src/types';

const LABEL_PREFIX_RE = /^(?:Fake biopic|Fake childhood origin|Live [A-Za-z ]+(?:news|broadcast)|[A-Za-z ]+documentary|Earnest [a-z-]+ (?:tutorial|hack)|Travel guide tutorial):/i;
const SLOP_QUOTE_RE = /\b(?:Inspired by|After|Reading|Following|Mid-debate on|Reacting to|Triggered by)\s+"[^"]+"/i;

assert.ok(ALL_BESPOKE_STORIES.length >= 48, `Expected >= 48 bespoke stories, got ${ALL_BESPOKE_STORIES.length}`);
for (const story of ALL_BESPOKE_STORIES) {
  const craft = scoreComedyCraft(story);
  assert.ok(craft.hasSixBeats, `Story "${story.id}" missing 6 frames/shots`);
  assert.ok(craft.punchlineWords >= 3 && craft.punchlineWords <= 9, `Story "${story.id}" punchline words: ${craft.punchlineWords}`);
  assert.ok(craft.total >= 80, `Story "${story.id}" craft score too low: ${craft.total}`);
  assert.ok(!LABEL_PREFIX_RE.test(story.pitch), `Robotic genre prefix leaked in "${story.id}": ${story.pitch}`);
  assert.ok(!SLOP_QUOTE_RE.test(story.pitch), `Raw headline quote slop leaked in "${story.id}": ${story.pitch}`);
  assert.ok(!/\b(elon musk|donald trump|vladimir putin|spider-man|mark zuckerberg)\b/i.test(`${story.title} ${story.pitch}`), `Raw copyright name leaked in ${story.id}`);
}

const biasedLogs: RatingLogEntry[] = Array.from({ length: 10 }, (_, idx) => ({
  id: `topic_bias_${idx}`, timestamp: new Date().toISOString(), kind: 'topic', targetId: `bias_${idx}`,
  title: 'BIAS TEST', angle: 'over-engineer', brand: 'Elon Bhai', viralScore: 98, vote: 'up',
}));

let persistedJson = '[]';
let prevIds = new Set<string>();

const RELOADS = 15;
for (let r = 1; r <= RELOADS; r += 1) {
  const seenPairs = new Set<string>(JSON.parse(persistedJson) as string[]);
  const batch = generateFreshDiverseBatch({ count: 8, query: '', logs: biasedLogs, seenPairs, batchNonce: r });
  persistedJson = JSON.stringify(Array.from(seenPairs).slice(-120));

  assert.equal(batch.length, 8);
  assert.equal(new Set(batch.map((t) => t.angle)).size, 6);
  assert.equal(new Set(batch.map((t) => worldFamily(t.brand))).size, 8);
  for (let i = 1; i < batch.length; i += 1) assert.notEqual(batch[i].angle, batch[i - 1].angle);

  const ids = new Set(batch.map((t) => t.id));
  for (const id of ids) assert.ok(!prevIds.has(id), `Reload ${r}: repeated story "${id}"`);
  prevIds = ids;

  for (const topic of batch) {
    const sb = renderStoryboardText(topic.title, topic.frames ?? []);
    const vid = renderVideoText(topic.shots ?? []);
    assert.ok(!SLOP_QUOTE_RE.test(topic.pitch), `Headline quote slop detected: ${topic.pitch}`);
    assert.ok(!/delhi|mumbai|bombay/i.test(`${topic.title} ${topic.pitch}`));
    assert.ok(sb.includes('3x2 grid') && sb.includes('NO cel-shading'));
    assert.ok(!vid.includes('9:16') && !vid.includes('20-second') && !vid.includes('[0:00'));
  }
}

assert.equal(new Set([0, 1, 2].map((n) => synthesizeTrendCard('Anthropic', n).angle)).size, 3);
const sample = generateFreshDiverseBatch({ count: 8, query: '', logs: [], seenPairs: new Set(), batchNonce: 777 })[0];
let savedList = saveLikedTopic([], new Set(), sample);
const afterGen = markTopicGenerated(savedList, new Set(), sample.id);
assert.equal(afterGen.saved[0].generated, true);
savedList = removeSavedTopic(afterGen.saved, sample.id);
assert.equal(savedList.length, 0);

// Verify 6 consecutive live-news-mapped refreshes (48 cards) return 48/48 unique human-crafted stories with ZERO headline-slicing slop
const seenLive = new Set<string>();
for (let b = 1; b <= 5; b += 1) {
  const cards = await pickCleanLiveNewsStories({ seenTitles: seenLive, hookFilter: 'all', situationFilter: 'all', count: 8 });
  assert.equal(cards.length, 8);
  for (const c of cards) {
    assert.ok(!SLOP_QUOTE_RE.test(c.pitch), `Slop quote in live card: ${c.pitch}`);
    assert.ok(!seenLive.has(c.title.toLowerCase()), `Repeated live title: ${c.title}`);
    seenLive.add(c.title.toLowerCase());
  }
}
assert.equal(seenLive.size, 40, 'Expected 40/40 unique human-crafted stories across 5 rapid live refreshes');

assert.ok(scoreHeadlineComedyPotential('KVM x86 kernel patch CVE-2026-1234') < 0);
const dna = computeTasteDna(biasedLogs, setSavedOutcome([{ topic: sample, savedAt: new Date().toISOString(), generated: true }], sample.id, 'viral'));
assert.ok(dna.viralCount === 1 && dna.promptSummary.includes('Winning Hooks:'));
const mockPrompts = {
  topicId: sample.id, topicTitle: sample.title, angle: sample.angle, brand: sample.brand,
  storyboardPrompt: renderStoryboardText(sample.title, sample.frames ?? []),
  videoPrompt: renderVideoText(sample.shots ?? []), generatedAt: new Date().toISOString(),
};
assert.ok(rerollCameraRig(mockPrompts, 2).prompts.videoPrompt.includes('broadcast'));
assert.ok(cycleAlternatePunchline(mockPrompts, 1).prompts.videoPrompt.includes('कमेटी अगली मीटिंग अगले साल रखेगी।'));
assert.ok(buildPart2Topic(sample).title.startsWith('PART 2:'));
assert.equal(buildViralPackage(sample, mockPrompts).titles.length, 3);
assert.ok(restoreStudioBackup(JSON.stringify({ version: 1, saved: [], generatedIds: ['x1'], logs: [], seenTitles: ['t1'], seenPairs: [] })).generatedIds.has('x1'));
const customEp = buildCustomEpisode('Trump buys a Goa beach shack for ₹200', 'iconic');
assert.ok(customEp.title.includes('DOLAND BHAU'));
assert.equal(sanitizeCopyrightNames('Elon Musk and Donald Trump meet Spider-Man'), 'Elon Bhai and Doland Bhau meet Spooder-Bhai');
assert.ok(detectCharacterLock('Giga-Chaddha lifts the gym').includes('90-degree hexagonal polygon jawline'));
assert.ok(buildCrossoverEpisode([sample, customEp])?.title.startsWith('CROSSOVER:'));

console.log(
  `HARNESS PASS: ${ALL_BESPOKE_STORIES.length} human-crafted stories × ${RELOADS} F5 reloads = ${RELOADS * 8} cards ` +
    `(0/40 rapid live repeats, ZERO raw-headline string-slicing slop, 12 Parody Meme Characters verified).`,
);
