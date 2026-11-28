import type { NicheBlueprint } from './script_types';

export const HISTORY_BLUEPRINT: NicheBlueprint = {
  niche: 'history',
  titlePrefix: 'Hidden History',
  beats: [
    {
      id: 'hook',
      label: '01 Hook',
      transition: 'Opening',
      targetSec: 3,
      template: 'In history books, {topic} looks like an accident. [PAUSE - 1s] It was not.',
      visualCue: '[VISUAL: ARCHIVE_PHOTO_PUSH]',
    },
    {
      id: 'setup',
      label: '02 Setup',
      transition: 'Therefore',
      targetSec: 5,
      template: 'Therefore, every rival empire assumed {topic} would collapse within a single season.',
      visualCue: '[VISUAL: MAP_BORDER_DRAW]',
    },
    {
      id: 'escalation',
      label: '03 Escalation',
      transition: 'But',
      targetSec: 6,
      template: 'But a single overlooked supply route flipped the entire balance overnight. [PAUSE - 1s]',
      visualCue: '[VISUAL: ROUTE_HIGHLIGHT_PULSE]',
    },
    {
      id: 'climax',
      label: '04 Climax',
      transition: 'Therefore',
      targetSec: 4,
      template: 'Therefore, {topic} rewrote the rules of power for the next two centuries.',
      visualCue: '[VISUAL: TIMELINE_SNAP_CUT]',
    },
    {
      id: 'loop',
      label: '05 Loop',
      transition: 'And',
      targetSec: 2,
      template: 'And that is the exact reason why—',
      visualCue: '[VISUAL: LOOP_END_CARD]',
    },
  ],
};
