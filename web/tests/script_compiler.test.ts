import { describe, it, expect } from 'vitest';
import { compileScript } from '../src/engine/script/script_compiler';

describe('script_compiler (5-Beat Retention Architecture)', () => {
  it('compiles 5 retention beats in order: hook, setup, escalation, climax, loop', () => {
    const compiled = compileScript({
      niche: 'tech',
      topic: 'IndexedDB sync',
      targetDurationSec: 20,
      includeVisuals: false,
    });

    expect(compiled.beats).toHaveLength(5);
    expect(compiled.beats.map((b) => b.id)).toEqual([
      'hook',
      'setup',
      'escalation',
      'climax',
      'loop',
    ]);
    expect(compiled.totalWords).toBeGreaterThan(0);
    expect(compiled.totalSec).toBeGreaterThan(0);
    expect(compiled.wordBudget).toBeGreaterThan(0);
  });

  it('respects audio-first gate when includeVisuals is false', () => {
    const compiled = compileScript({
      niche: 'history',
      topic: 'ancient clocks',
      includeVisuals: false,
    });
    for (const beat of compiled.beats) {
      expect(beat.spokenText).not.toMatch(/\[VISUAL:/i);
    }
  });
});
