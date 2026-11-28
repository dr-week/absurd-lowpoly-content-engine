import type { NicheBlueprint } from './script_types';

export const HISTORY_BLUEPRINT: NicheBlueprint = {
  niche: 'history',
  titlePrefix: 'History Lore',
  beats: [
    {
      id: 'hook',
      label: '01 Hook',
      transition: 'Opening',
      targetSec: 3,
      template: 'textbooks hide the truth about {topic}. [PAUSE - 1s]',
      visualCue: '[VISUAL: Parchment low-poly]',
    },
    {
      id: 'setup',
      label: '02 Setup',
      transition: 'Therefore',
      targetSec: 4,
      template: 'Scribes copied one rumor for centuries.',
      visualCue: '[VISUAL: Candlelit desk]',
    },
    {
      id: 'escalation',
      label: '03 Escalation',
      transition: 'But',
      targetSec: 5,
      template: 'Excavations proved the timeline was backwards.',
      visualCue: '[VISUAL: Relic wireframe]',
    },
    {
      id: 'climax',
      label: '04 Climax',
      transition: 'Therefore',
      targetSec: 5,
      template: 'Primary ledgers beat dramatic imperial myths. [PAUSE - 1s]',
      visualCue: '[VISUAL: Ledger close-up]',
    },
    {
      id: 'loop',
      label: '05 Loop',
      transition: 'Seamless Loop',
      targetSec: 3,
      template: 'Which explains why modern',
      visualCue: '[VISUAL: Snap cut to 01]',
    },
  ],
};
