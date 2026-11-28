import type { NicheBlueprint } from './script_types';

export const TECH_BLUEPRINT: NicheBlueprint = {
  niche: 'tech',
  titlePrefix: 'Tech Breakdown',
  beats: [
    {
      id: 'hook',
      label: '01 Hook',
      transition: 'Opening',
      targetSec: 3,
      template: 'Everyone thinks {topic} is magic, [PAUSE - 1s] until you see what happens under the hood.',
      visualCue: '[VISUAL: TIGHT_CUT_TERMINAL_FLASH]',
    },
    {
      id: 'setup',
      label: '02 Setup',
      transition: 'Therefore',
      targetSec: 5,
      template: 'Therefore, most teams ship {topic} with default settings and wonder why latency spikes.',
      visualCue: '[VISUAL: LATENCY_GRAPH_SPIKE]',
    },
    {
      id: 'escalation',
      label: '03 Escalation',
      transition: 'But',
      targetSec: 6,
      template: 'But the real bottleneck is not CPU—it is the hidden round-trip you never profiled. [PAUSE - 1s]',
      visualCue: '[VISUAL: NETWORK_WATERFALL_ZOOM]',
    },
    {
      id: 'climax',
      label: '04 Climax',
      transition: 'Therefore',
      targetSec: 4,
      template: 'Therefore, one local-first cache layer cuts {topic} response time by ninety percent.',
      visualCue: '[VISUAL: BEFORE_AFTER_BENCHMARK]',
    },
    {
      id: 'loop',
      label: '05 Loop',
      transition: 'And',
      targetSec: 2,
      template: 'Save this before your next deploy, because that is why—',
      visualCue: '[VISUAL: LOOP_END_CARD]',
    },
  ],
};
