import type { TopicOption } from '../types';
import { CULTURE_TOPICS } from './topics_culture';
import { QCOMM_TOPICS } from './topics_qcomm';
import { URBAN_TOPICS } from './topics_urban';

export const ALL_TOPICS: TopicOption[] = [
  ...QCOMM_TOPICS,
  ...URBAN_TOPICS,
  ...CULTURE_TOPICS,
];
