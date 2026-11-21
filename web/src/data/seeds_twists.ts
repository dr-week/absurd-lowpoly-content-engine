import { TWIST_SEEDS_A } from './seeds_twists_a';
import { TWIST_SEEDS_B } from './seeds_twists_b';

export interface TwistSeed {
  key: string;
  titleTag: string;
  pitchVerb: string;
  joltAction: string;
  joltCaption: string;
  joltHindi: string;
  joltSfx: string;
  chaosAction: string;
  chaosCaption: string;
  chaosHindi: string;
  chaosSfx: string;
  calmAction: string;
  calmCaption: string;
  calmHindi: string;
}

export const TWIST_SEEDS: TwistSeed[] = [...TWIST_SEEDS_A, ...TWIST_SEEDS_B];
