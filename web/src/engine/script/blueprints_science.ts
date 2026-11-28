import type { NicheBlueprint } from './script_types';

export const SCIENCE_BLUEPRINT: NicheBlueprint = {
  niche: 'science',
  titlePrefix: 'Science Myth',
  beats: [
    {
      id: 'hook',
      label: '01 Hook',
      transition: 'Opening',
      targetSec: 3,
      template: 'intuition fails completely with {topic}. [PAUSE - 1s]',
      visualCue: '[VISUAL: Atom wireframe]',
    },
    {
      id: 'setup',
      label: '02 Setup',
      transition: 'Therefore',
      targetSec: 4,
      template: 'Our brains expect linear everyday cause.',
      visualCue: '[VISUAL: Straight line]',
    },
    {
      id: 'escalation',
      label: '03 Escalation',
      transition: 'But',
      targetSec: 5,
      template: 'Nature scales exponentially under extreme pressure.',
      visualCue: '[VISUAL: Curve spike]',
    },
    {
      id: 'climax',
      label: '04 Climax',
      transition: 'Therefore',
      targetSec: 5,
      template: 'Test the math before trusting instincts. [PAUSE - 1s]',
      visualCue: '[VISUAL: Lab readout]',
    },
    {
      id: 'loop',
      label: '05 Loop',
      transition: 'Seamless Loop',
      targetSec: 3,
      template: 'And that is why',
      visualCue: '[VISUAL: Snap cut to 01]',
    },
  ],
};
