import type { NicheBlueprint } from './script_types';

export const SCIENCE_BLUEPRINT: NicheBlueprint = {
  niche: 'science',
  titlePrefix: 'Science Fact',
  beats: [
    {
      id: 'hook',
      label: '01 Hook',
      transition: 'Opening',
      targetSec: 3,
      template: 'If you think {topic} obeys common sense, [PAUSE - 1s] physics disagrees.',
      visualCue: '[VISUAL: LAB_MACRO_SHOT]',
    },
    {
      id: 'setup',
      label: '02 Setup',
      transition: 'Therefore',
      targetSec: 5,
      template: 'Therefore, at everyday scale, {topic} behaves predictably enough to ignore.',
      visualCue: '[VISUAL: SCALE_COMPARISON]',
    },
    {
      id: 'escalation',
      label: '03 Escalation',
      transition: 'But',
      targetSec: 6,
      template: 'But push the system past its threshold and the opposite effect takes over. [PAUSE - 1s]',
      visualCue: '[VISUAL: PHASE_SHIFT_ANIM]',
    },
    {
      id: 'climax',
      label: '04 Climax',
      transition: 'Therefore',
      targetSec: 4,
      template: 'Therefore, {topic} is the reason nature solves this problem without wasting energy.',
      visualCue: '[VISUAL: ENERGY_FLOW_DIAGRAM]',
    },
    {
      id: 'loop',
      label: '05 Loop',
      transition: 'And',
      targetSec: 2,
      template: 'Look closer next time, because—',
      visualCue: '[VISUAL: LOOP_END_CARD]',
    },
  ],
};
