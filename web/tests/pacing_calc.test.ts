import { describe, it, expect } from 'vitest';
import {
  WORDS_PER_SEC,
  PAUSE_1S_PENALTY_WORDS,
  PAUSE_2S_PENALTY_WORDS,
  countSpokenWords,
  countPausePenaltyWords,
  computeWordBudget,
  estimateSpokenSeconds,
  parsePauseSeconds,
} from '../src/engine/script/pacing_calc';

describe('pacing_calc', () => {
  it('uses 2.3 words/sec baseline', () => {
    expect(WORDS_PER_SEC).toBe(2.3);
    expect(PAUSE_1S_PENALTY_WORDS).toBe(2.5);
    expect(PAUSE_2S_PENALTY_WORDS).toBe(5.0);
  });

  it('counts spoken words while stripping bracketed cues', () => {
    expect(countSpokenWords('')).toBe(0);
    expect(countSpokenWords('[PAUSE - 1s]')).toBe(0);
    expect(countSpokenWords('Hello world [PAUSE - 1s] [VISUAL: zoom] test')).toBe(3);
  });

  it('computes pause penalty words for 1s and 2s pauses', () => {
    expect(countPausePenaltyWords('No pauses here')).toBe(0);
    expect(countPausePenaltyWords('One [PAUSE - 1s] pause')).toBe(2.5);
    expect(countPausePenaltyWords('Two [PAUSE - 1s] and [PAUSE - 2s]')).toBe(7.5);
  });

  it('computes word budget with pause penalties and floor of 1', () => {
    expect(computeWordBudget(20)).toBe(46);
    expect(computeWordBudget(20, '[PAUSE - 1s] [PAUSE - 2s]')).toBe(39);
    expect(computeWordBudget(1, '[PAUSE - 2s] [PAUSE - 2s]')).toBe(1);
  });

  it('estimates spoken seconds including pause durations', () => {
    // 23 words = 10.0s + 1s pause = 11.0s
    const words23 = Array.from({ length: 23 }, (_, i) => `w${i}`).join(' ');
    expect(estimateSpokenSeconds(`${words23} [PAUSE - 1s]`)).toBe(11);
  });

  it('parses pause seconds from tag', () => {
    expect(parsePauseSeconds('[PAUSE - 1s]')).toBe(1);
    expect(parsePauseSeconds('[PAUSE - 2.5s]')).toBe(2.5);
    expect(parsePauseSeconds('no tag')).toBe(0);
  });
});
