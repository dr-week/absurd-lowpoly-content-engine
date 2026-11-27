import type { ScriptBlueprint } from './blueprints_types.ts';

export const COMEDY_BLUEPRINTS: ScriptBlueprint[] = [
  {
    id: 'absurd-deadpan',
    name: 'Absurd Deadpan',
    style: 'Dry 1998 PS1-era literalism',
    beats: [
      {
        role: 'hook',
        label: '01 Hook',
        targetSec: 3,
        promptHint: 'State the absurd premise as mundane fact.',
        template: '[DEADPAN] Nobody warned me about {topic}, [PAUSE:0.6s] so I brought a plastic chair.',
      },
      {
        role: 'setup',
        label: '02 Setup',
        targetSec: 4,
        promptHint: 'Establish the everyday Indian context.',
        template: 'At 7 AM, everyone acts like {topic} is completely normal.',
      },
      {
        role: 'escalation',
        label: '03 Escalation',
        targetSec: 5,
        promptHint: 'Double down with hyper-specific detail.',
        template: '[CAMERA:zoom-in] Then Uncleji pulled out a laminated chart [PAUSE:0.6s] and started grading my posture.',
      },
      {
        role: 'twist',
        label: '04 Twist',
        targetSec: 4,
        promptHint: 'Flip the logic unexpectedly.',
        template: '[WHISPER] Turns out {topic} was never optional. [BEAT] It was on the Aadhaar card.',
      },
      {
        role: 'payoff',
        label: '05 Payoff',
        targetSec: 4,
        promptHint: 'Sharp button line before loop.',
        template: '[DEADPAN] Anyway, I paid the fine inelaichi. [PAUSE:0.8s]',
      },
    ],
  },
  {
    id: 'household-chaos',
    name: 'Household Chaos',
    style: 'High-tempo domestic escalation',
    beats: [
      {
        role: 'hook',
        label: '01 Hook',
        targetSec: 3,
        promptHint: 'Open mid-argument.',
        template: '[CAMERA:tight] Do not mention {topic} in this house [PAUSE:0.5s] unless you want a 40-minute lecture.',
      },
      {
        role: 'setup',
        label: '02 Setup',
        targetSec: 4,
        promptHint: 'Show the innocent trigger.',
        template: 'I only asked one simple question about {topic} before tea.',
      },
      {
        role: 'escalation',
        label: '03 Escalation',
        targetSec: 5,
        promptHint: 'Stack three rapid-fire reactions.',
        template: 'Mummy paused the serial, [PAUSE:0.4s] Dad checked the electricity meter, and the pressure cooker whistled.',
      },
      {
        role: 'twist',
        label: '04 Twist',
        targetSec: 4,
        promptHint: 'Reveal the real culprit.',
        template: '[WHISPER] Even the neighbour knew {topic} was my fault [BEAT] from last Tuesday.',
      },
      {
        role: 'payoff',
        label: '05 Payoff',
        targetSec: 4,
        promptHint: 'Deadpan exit.',
        template: '[DEADPAN] Next time I am moving to a low-poly cave. [PAUSE:0.8s]',
      },
    ],
  },
];

export function getBlueprintById(id?: string): ScriptBlueprint {
  return COMEDY_BLUEPRINTS.find((bp) => bp.id === id) ?? COMEDY_BLUEPRINTS[0];
}
