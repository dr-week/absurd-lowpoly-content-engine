export interface StoryArcBlueprint {
  id: string;
  name: string;
  principle: string;
  beats: readonly [string, string, string, string, string];
  actingCues: readonly [string, string, string, string, string];
}

/**
 * Master Screenwriting & Comedy Craft Architecture:
 * Combines Trey Parker/Matt Stone ("THEREFORE / BUT"), Keith Johnstone (Status Reversal),
 * Judy Carter / John Vorhaus (Setup -> Expectation -> Snap-Turn -> Punch-Word Last),
 * and Buster Keaton (Deadpan Visual Understatement) for <10s 5-shot scripts.
 */
export const STORY_ARC_BLUEPRINTS: readonly StoryArcBlueprint[] = [
  {
    id: 'therefore-but-snap',
    name: 'THEREFORE / BUT Causal Snap',
    principle: 'Zero "and then" filler—every shot reverses or escalates the previous beat, ending on a punch-word-last callback.',
    beats: [
      'HOOK — Cold-Open Want',
      'THEREFORE — Bold Escalation',
      'BUT — Silent Visual Reversal',
      'HOLD — Deadpan Micro-Tension',
      'PAYOFF — Callback Punchline',
    ],
    actingCues: [
      'confident focused micro-expression',
      'doubling down with raised chin',
      'sudden physical freeze and widened eyes',
      'silent deadpan blink holding eye contact',
      'dry straight-faced nod before instant cut',
    ],
  },
  {
    id: 'status-reversal',
    name: 'Keith Johnstone Status Reversal',
    principle: 'Arrogant high-status flex collides with an unbothered low-key counterpart who wins without raising their voice.',
    beats: [
      'HOOK — High-Status Flex',
      'BUT — Unbothered Deadpan Block',
      'THEREFORE — Silent Scramble',
      'HOLD — Total Composure Crack',
      'PAYOFF — Calm Mic-Drop',
    ],
    actingCues: [
      'smug posture and crisp hand gesture',
      'barely glancing up, flat unimpressed eyes',
      'frantic silent double-take',
      'slow defeated shoulder drop',
      'calm unbothered glance to lens',
    ],
  },
  {
    id: 'misdirection-trap',
    name: 'Cinematic Misdirection Trap',
    principle: 'Frame a tiny trivial problem like a life-or-death thriller until Shot 5 shatters the illusion with mundane reality.',
    beats: [
      'HOOK — High-Stakes Illusion',
      'THEREFORE — Intense Commitment',
      'BUT — Silent Context Reveal',
      'HOLD — Awkward Reality Sink-In',
      'PAYOFF — Petty Punch-Word',
    ],
    actingCues: [
      'narrowed eyes and clenched jaw',
      'sweating brow with dramatic focus',
      'wide reveal exposing the tiny absurd prop',
      'awkward frozen silence, slow eye-twitch',
      'deadpan shrug, instant cut to black',
    ],
  },
  {
    id: 'deadpan-understatement',
    name: 'Keaton Deadpan Understatement',
    principle: 'Catastrophic physical absurdity erupts around the protagonist while everyone responds with calm bureaucratic politeness.',
    beats: [
      'HOOK — Normal Anchor',
      'BUT — Impossible Physics Shift',
      'THEREFORE — Silent Chaos Peak',
      'HOLD — Unbothered Calm Pause',
      'PAYOFF — Bureaucratic Punchline',
    ],
    actingCues: [
      'ordinary relaxed everyday stance',
      'tiny eyebrows lift, zero panic',
      'chaotic physical motion around still face',
      'calmly adjusting collar amid chaos',
      'polite flat expression on final word',
    ],
  },
  {
    id: 'karma-rewatch-loop',
    name: 'Instant Karma Rewatch Loop',
    principle: 'Smug shortcut in Shot 1 triggers an immediate boomerang in Shot 5 that loops seamlessly back to Shot 1.',
    beats: [
      'HOOK — Smug Shortcut',
      'THEREFORE — Premature Victory',
      'BUT — Silent Karma Trigger',
      'HOLD — Realization Freeze',
      'PAYOFF — Loop-Back Verdict',
    ],
    actingCues: [
      'sly side-smirk and quick gesture',
      'proud chest-out celebration',
      'split-second physical twist mid-frame',
      'frozen blink as victory evaporates',
      'flat resigned stare straight at camera',
    ],
  },
];

export function pickStoryArc(seed = 0): StoryArcBlueprint {
  return STORY_ARC_BLUEPRINTS[Math.abs(seed) % STORY_ARC_BLUEPRINTS.length];
}

export function formatStorySpineHeader(arc: StoryArcBlueprint): string {
  return `Story Craft (${arc.name}): ${arc.principle} Strictly <10s rhythm—punch-word LAST, zero filler.`;
}

export const MASTER_SCRIPT_RULES =
  'MASTER SCREENWRITING RULES: 1) Use THEREFORE/BUT causality between every shot (NEVER "and then"); ' +
  '2) Show subtext through physical micro-acting (eye-twitch, slow blink, frozen posture) instead of explaining the joke; ' +
  '3) Put the comic reveal word LAST in Shot 5 (<= 6 Hindi words) and call back Shot 1 for >100% rewatch loops.';
