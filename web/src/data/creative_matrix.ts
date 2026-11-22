import type { GeneratedPrompts } from '../types';

export interface BookFramework {
  book: string;
  author: string;
  principle: string;
}

export interface DirectorsStack {
  label: string;
  book: string;
  lens: string;
  perspective: string;
  editMethod: string;
  directive: string;
}

export const BOOK_FRAMEWORKS: readonly BookFramework[] = [
  { book: 'The Comic Toolbox', author: 'John Vorhaus', principle: 'Comic Opposites: pair the most serious status with the tiniest petty problem' },
  { book: 'Truth in Comedy', author: 'Charna Halpern & Del Close', principle: 'Game of the Scene: heighten one unusual thing logically & callback Shot 1' },
  { book: 'Story', author: 'Robert McKee', principle: 'Value Charge Shift: flip + to - on every beat via Expectation vs Reality gap' },
  { book: 'Save the Cat!', author: 'Blake Snyder', principle: 'Instant Empathy Hook: open mid-conflict in 1 second with zero exposition' },
  { book: 'In the Blink of an Eye', author: 'Walter Murch', principle: 'Rule of Six: cut right on the emotional reaction beat (51% emotion priority)' },
  { book: 'Understanding Comics', author: 'Scott McCloud', principle: 'Gutter Closure: let the audience connect the comedic leap between frames' },
  { book: 'Contagious', author: 'Jonah Berger', principle: 'STEPPS Shareability: high-arousal humor + social currency drives shares' },
  { book: 'Hooked', author: 'Nir Eyal', principle: 'Variable Reward Loop: unpredictable endings keep viewers binge-watching' },
  { book: 'Directing the Story', author: 'Francis Glebas', principle: 'Silhouette Staging: every frame reads clearly in 0.5s without explanation' },
  { book: 'Into the Woods', author: 'John Yorke', principle: 'Micro-Arc Symmetry: Shot 6 mirrors Shot 1 with inverted power/status' },
];

export const DIRECTORS_STACKS: readonly DirectorsStack[] = [
  {
    label: 'Macro -> Wide + Smash Cut',
    book: 'Story (Robert McKee)',
    lens: '100mm Macro Probe Lens',
    perspective: 'Extreme Macro -> Wide Zoom-Out Reveal',
    editMethod: 'Smash Cut + Beat of Silence',
    directive: 'Director Stack: Shoot Shots 1-4 on a 100mm macro probe lens hiding context, then smash-cut wide with a beat of dead silence.',
  },
  {
    label: 'Anamorphic + Whip-Pan Match',
    book: 'Save the Cat! (Blake Snyder)',
    lens: 'Anamorphic Cinema 2.39:1',
    perspective: 'Over-the-Shoulder Confrontation',
    editMethod: 'Whip-Pan Match Cut',
    directive: 'Director Stack: Frame Shots 1-3 on anamorphic cinema glass for serious thriller energy, then whip-pan match-cut into deadpan comedy.',
  },
  {
    label: 'Bodycam POV + J-Cut Lead',
    book: 'Hooked (Nir Eyal)',
    lens: 'Wide GoPro Bodycam POV',
    perspective: 'First-Person POV Immersion',
    editMethod: 'J-Cut Audio Lead',
    directive: 'Director Stack: Use first-person bodycam POV with J-cut SFX leading every visual cut 0.3s early for relentless forward momentum.',
  },
  {
    label: 'Symmetrical Tripod + Kuleshov',
    book: 'The Comic Toolbox (John Vorhaus)',
    lens: '35mm Deadpan Prime',
    perspective: 'Symmetrical Wes-Anderson Static',
    editMethod: 'Kuleshov Deadpan Reaction Cut',
    directive: 'Director Stack: Hold symmetrical static tripod frames and use Kuleshov reaction cuts between blank unblinking faces and absurd props.',
  },
  {
    label: 'Dutch Tilt + Freeze Scratch',
    book: 'In the Blink of an Eye (Walter Murch)',
    lens: '24mm Wide Dynamic Lens',
    perspective: '15-Degree Dutch Tilt Suspense',
    editMethod: 'Freeze-Frame Record Scratch',
    directive: 'Director Stack: Apply subtle 15-degree Dutch tilt during peak tension and halt motion on a freeze-frame beat right before the twist.',
  },
  {
    label: 'Overhead God-Eye + Callback',
    book: 'Into the Woods (John Yorke)',
    lens: 'Tilt-Shift Overhead Drone',
    perspective: 'Bird-Eye God-View Overhead',
    editMethod: 'Shot 1 -> Shot 6 Mirror Symmetry',
    directive: 'Director Stack: Frame key beats from overhead bird-eye perspective so Shot 6 visually mirrors Shot 1 with inverted power.',
  },
];

const STACK_RE = /Director Stack:[^.]+\./;

export function pickDirectorsStack(seed = 0): DirectorsStack {
  return DIRECTORS_STACKS[Math.abs(seed) % DIRECTORS_STACKS.length];
}

export function cycleDirectorsStack(
  prompts: GeneratedPrompts,
  step: number,
): { prompts: GeneratedPrompts; label: string } {
  const stack = pickDirectorsStack(step);
  const inject = (text: string): string => {
    if (STACK_RE.test(text)) return text.replace(STACK_RE, stack.directive);
    return text.replace(/(Strictly NO 2D cartoon art)/, `${stack.directive} $1`);
  };
  return {
    label: stack.label,
    prompts: {
      ...prompts,
      storyboardPrompt: inject(prompts.storyboardPrompt),
      videoPrompt: inject(prompts.videoPrompt),
    },
  };
}
