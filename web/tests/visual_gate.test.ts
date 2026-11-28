import { describe, it, expect } from 'vitest';
import { sanitizeAudioFirst, extractVisualCues } from '../src/engine/script/visual_gate';

describe('visual_gate', () => {
  it('strips [VISUAL: ...] tags when includeVisuals is false', () => {
    const raw = 'Lift is stuck [VISUAL: low-poly camera zoom] again [VISUAL: dramatic pan]';
    expect(sanitizeAudioFirst(raw, false)).toBe('Lift is stuck again');
  });

  it('preserves [VISUAL: ...] tags when includeVisuals is true', () => {
    const raw = '  Lift is stuck [VISUAL: low-poly camera zoom]  ';
    expect(sanitizeAudioFirst(raw, true)).toBe('Lift is stuck [VISUAL: low-poly camera zoom]');
  });

  it('extracts visual cue descriptions', () => {
    const raw = 'A [VISUAL: zoom in] B [VISUAL: wide shot]';
    expect(extractVisualCues(raw)).toEqual(['zoom in', 'wide shot']);
    expect(extractVisualCues('No cues here')).toEqual([]);
  });
});
