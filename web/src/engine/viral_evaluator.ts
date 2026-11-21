import { generateFreshDiverseBatch } from './topic_generator';
import type { HookCategory, RatingLogEntry, ScoredTopic, SituationCategory } from '../types';

export function evaluateTopics(params: {
  count: number;
  query: string;
  logs: RatingLogEntry[];
  seenPairs: Set<string>;
  batchNonce: number;
  hookFilter?: HookCategory | 'all';
  situationFilter?: SituationCategory | 'all';
}): ScoredTopic[] {
  return generateFreshDiverseBatch(params);
}
