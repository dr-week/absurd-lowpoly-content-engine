import { DOMAIN_SEEDS_A } from './seeds_domains_a';
import { DOMAIN_SEEDS_B } from './seeds_domains_b';

export interface DomainSeed {
  angle: string;
  brand: string;
  setting: string;
  protagonist: string;
  trigger: string;
  triggerHindi: string;
  triggerCaption: string;
  payoffSpeaker: string;
  payoffLine: string;
  payoffHindi: string;
}

export const DOMAIN_SEEDS: DomainSeed[] = [...DOMAIN_SEEDS_A, ...DOMAIN_SEEDS_B];
