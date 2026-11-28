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
      template: 'everyone gets {topic} completely wrong. [PAUSE - 1s]',
      visualCue: '[VISUAL: PS1 wireframe zoom]',
    },
    {
      id: 'setup',
      label: '02 Setup',
      transition: 'Therefore',
      targetSec: 4,
      template: 'Teams ship bloated stacks before measuring.',
      visualCue: '[VISUAL: Low-poly server rack]',
    },
    {
      id: 'escalation',
      label: '03 Escalation',
      transition: 'But',
      targetSec: 5,
      template: 'Every network hop doubles tail latency.',
      visualCue: '[VISUAL: Red latency spike]',
    },
    {
      id: 'climax',
      label: '04 Climax',
      transition: 'Therefore',
      targetSec: 5,
      template: 'Keep state local and sync asynchronously. [PAUSE - 1s]',
      visualCue: '[VISUAL: Local DB glow]',
    },
    {
      id: 'loop',
      label: '05 Loop',
      transition: 'Seamless Loop',
      targetSec: 3,
      template: 'And that is the exact reason',
      visualCue: '[VISUAL: Snap cut to 01]',
    },
  ],
};
