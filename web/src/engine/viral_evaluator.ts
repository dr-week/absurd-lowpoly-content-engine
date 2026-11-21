import { generateFreshDiverseBatch } from './topic_generator';
import type { RatingLogEntry, ScoredTopic } from '../types';

export function evaluateTopics(params: {
  count: number;
  query: string;
  logs: RatingLogEntry[];
  seenPairs: Set<string>;
  batchNonce: number;
}): ScoredTopic[] {
  return generateFreshDiverseBatch(params);
}
