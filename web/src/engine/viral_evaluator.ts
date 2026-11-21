import { getBrandHeat } from '../data/brands';
import type { RatingLogEntry, ScoredTopic, TopicOption } from '../types';

/**
 * Evaluates each topic's viral score (0-100) by combining:
 * 1. Brand-in-News & Marketing Spend Heat (45%)
 * 2. User Taste Signal from Thumbs Up / Thumbs Down logs on angle & brand (40%)
 * 3. Novelty / Unrated Exploration Bonus (15%)
 */
export function evaluateTopics(
  pool: TopicOption[],
  logs: RatingLogEntry[],
  count: number,
  query: string,
  offset: number,
): ScoredTopic[] {
  const angleBias = new Map<string, number>();
  const brandBias = new Map<string, number>();
  const votedIds = new Map<string, 'up' | 'down'>();

  for (const entry of logs) {
    const delta = entry.vote === 'up' ? 12 : -14;
    angleBias.set(entry.angle, (angleBias.get(entry.angle) ?? 0) + delta);
    brandBias.set(entry.brand, (brandBias.get(entry.brand) ?? 0) + delta * 0.6);
    if (entry.kind === 'topic') votedIds.set(entry.targetId, entry.vote);
  }

  let filtered = [...pool];
  const q = query.trim().toLowerCase();
  if (q) {
    const hits = filtered.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.brand.toLowerCase().includes(q) ||
        t.angle.toLowerCase().includes(q) ||
        t.pitch.toLowerCase().includes(q),
    );
    if (hits.length > 0) filtered = hits;
  }

  const rotated = filtered.map((_, i) => filtered[(i + offset) % filtered.length]);

  const scored: ScoredTopic[] = rotated.map((topic) => {
    const brandHeat = getBrandHeat(topic.brand);
    const tasteDelta = (angleBias.get(topic.angle) ?? 0) + (brandBias.get(topic.brand) ?? 0);
    const prevVote = votedIds.get(topic.id);
    const votePenalty = prevVote === 'down' ? -25 : prevVote === 'up' ? 8 : 5;
    const rawScore = Math.round(brandHeat * 0.72 + 16 + tasteDelta * 0.45 + votePenalty);
    return {
      ...topic,
      brandHeat,
      viralScore: Math.max(15, Math.min(99, rawScore)),
    };
  });

  scored.sort((a, b) => b.viralScore - a.viralScore);
  return scored.slice(0, Math.min(count, scored.length));
}
