import type { NicheBlueprint } from './script_types';

export const GROWTH_BLUEPRINT: NicheBlueprint = {
  niche: 'growth',
  titlePrefix: 'Creator Growth',
  beats: [
    {
      id: 'hook',
      label: '01 Hook',
      transition: 'Opening',
      targetSec: 3,
      template: 'most creators stall on {topic}. [PAUSE - 1s]',
      visualCue: '[VISUAL: Retention graph]',
    },
    {
      id: 'setup',
      label: '02 Setup',
      transition: 'Therefore',
      targetSec: 4,
      template: 'They polish visuals before fixing pacing.',
      visualCue: '[VISUAL: Timeline scrub]',
    },
    {
      id: 'escalation',
      label: '03 Escalation',
      transition: 'But',
      targetSec: 5,
      template: 'Viewers swipe away in two seconds.',
      visualCue: '[VISUAL: Swipe-up arrow]',
    },
    {
      id: 'climax',
      label: '04 Climax',
      transition: 'Therefore',
      targetSec: 5,
      template: 'Cut filler and front-load the tension. [PAUSE - 1s]',
      visualCue: '[VISUAL: Scissors cut]',
    },
    {
      id: 'loop',
      label: '05 Loop',
      transition: 'Seamless Loop',
      targetSec: 3,
      template: 'Otherwise you become why',
      visualCue: '[VISUAL: Snap cut to 01]',
    },
  ],
};
