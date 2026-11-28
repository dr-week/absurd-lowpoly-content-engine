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
      template: 'Your {topic} videos are dying at second three, [PAUSE - 1s] and it is not the algorithm.',
      visualCue: '[VISUAL: RETENTION_DROP_CHART]',
    },
    {
      id: 'setup',
      label: '02 Setup',
      transition: 'Therefore',
      targetSec: 5,
      template: 'Therefore, viewers swipe away before you even reach your main point on {topic}.',
      visualCue: '[VISUAL: SWIPE_UP_GESTURE]',
    },
    {
      id: 'escalation',
      label: '03 Escalation',
      transition: 'But',
      targetSec: 6,
      template: 'But when you replace filler intros with a causal therefore-but chain, [PAUSE - 1s] retention locks.',
      visualCue: '[VISUAL: FLAT_RETENTION_CURVE]',
    },
    {
      id: 'climax',
      label: '04 Climax',
      transition: 'Therefore',
      targetSec: 4,
      template: 'Therefore, your next {topic} short earns twice the watch time in half the words.',
      visualCue: '[VISUAL: WATCH_TIME_COUNTER]',
    },
    {
      id: 'loop',
      label: '05 Loop',
      transition: 'And',
      targetSec: 2,
      template: 'Steal this structure right now, because—',
      visualCue: '[VISUAL: LOOP_END_CARD]',
    },
  ],
};
