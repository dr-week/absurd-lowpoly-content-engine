import { describe, it, expect } from 'vitest';
import {
  compileScript,
  normalizeTopic,
  buildByokScriptPrompt,
} from '../src/engine/script/script_compiler';
import type { ScriptNiche } from '../src/engine/storage/storage_types';

describe('script_compiler (5-Beat Retention Architecture)', () => {
  it('normalizes leading question prefixes and trailing punctuation', () => {
    expect(normalizeTopic('why SQLite beats microservices?')).toBe('SQLite beats microservices');
    expect(normalizeTopic('How IndexedDB sync works!')).toBe('IndexedDB sync works');
    expect(normalizeTopic('the reason caches fail.')).toBe('caches fail');
  });

  it('compiles 5 retention beats in order and stays within 20s word budget across all 4 niches', () => {
    const niches: ScriptNiche[] = ['tech', 'history', 'growth', 'science'];
    for (const niche of niches) {
      const compiled = compileScript({
        niche,
        topic: 'SQLite vs microservices',
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
      expect(compiled.totalWords).toBeLessThanOrEqual(43);
      expect(compiled.totalSec).toBeGreaterThan(0);
    }
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

  it('builds a strict BYOK JSON prompt with wordBudget and 5 beats', () => {
    const compiled = compileScript({ niche: 'tech', topic: 'Web Crypto' });
    const prompt = JSON.parse(buildByokScriptPrompt(compiled));
    expect(prompt.wordBudget).toBe(compiled.wordBudget);
    expect(prompt.beats).toHaveLength(5);
  });
});
