import type { GeneratedPrompts } from '../types';

export interface LuganContrastBlueprint {
  id: string;
  label: string;
  splitCards: string;
  recurringCast: string;
  directive: string;
}

export const LUGAN_RECURRING_CAST =
  'Recurring Stylized 3D Cast: Straight-Man Lead (clean matte hoodie, wide expressive eyes), Chaotic Hype-Bro (backward cap, grinning smugly), and Stern Dad (tucked polo shirt, clenched jaw).';

export const LUGAN_CONTRAST_BLUEPRINTS: readonly LuganContrastBlueprint[] = [
  {
    id: 'country-vs-country',
    label: 'Country vs Country Contrast',
    splitCards: '"GERMANY" -> "UK" -> "ITALY" -> "STREET WORLD"',
    recurringCast: '4 distinct global stylized 3D drivers with unmistakable accents and vehicles',
    directive:
      'Lugan Contrast Format (Country vs Country): Flash bold crisp white on-screen country title cards between shots ("GERMANY", "UK", "ITALY", "LOCAL STREET") escalating from laser precision to absurd airborne slapstick physics.',
  },
  {
    id: 'alone-vs-bro',
    label: 'Alone vs With Bro',
    splitCards: '"ALONE" -> SMASH CUT -> "WITH BRO"',
    recurringCast: LUGAN_RECURRING_CAST,
    directive:
      'Lugan Contrast Format (Alone vs With Bro): Shots 1-2 show peaceful solo routine under bold title card "ALONE", then hard smash-cut to "WITH BRO" where Chaotic Hype-Bro escalates a tiny moment into rocket-launch slapstick.',
  },
  {
    id: 'alone-vs-dad',
    label: 'Alone vs With Dad',
    splitCards: '"ALONE" -> SMASH CUT -> "WITH DAD"',
    recurringCast: LUGAN_RECURRING_CAST,
    directive:
      'Lugan Contrast Format (Alone vs With Dad): Shots 1-2 show relaxed solo mastery under title card "ALONE", then hard smash-cut to "WITH DAD" where Stern Dad turns a 10 km/h task into a high-stakes boss fight.',
  },
  {
    id: 'broke-vs-rich',
    label: 'Broke vs Rich Buddy',
    splitCards: '"BROKE" -> SMASH CUT -> "RICH"',
    recurringCast: LUGAN_RECURRING_CAST,
    directive:
      'Lugan Contrast Format (Broke vs Rich): Contrast duct-tape survival improvisation against effortless absurd over-spending using rapid whip-pan transitions and deadpan buddy banter.',
  },
  {
    id: 'pov-bro-pickup',
    label: 'POV: Bro Picks You Up',
    splitCards: '"POV: BRO PICKS YOU UP"',
    recurringCast: LUGAN_RECURRING_CAST,
    directive:
      'Lugan Contrast Format (POV Bro Pickup): Hold first-person passenger-seat POV as Chaotic Hype-Bro arrives in a ridiculously modified beat-up vehicle held together by tape and pure confidence.',
  },
];

const LUGAN_RE = /Lugan Contrast Format \([^)]+\):[^.]+\./;

export function applyLuganContrastMode(
  prompts: GeneratedPrompts,
  step: number,
): { prompts: GeneratedPrompts; label: string } {
  const bp = LUGAN_CONTRAST_BLUEPRINTS[Math.abs(step) % LUGAN_CONTRAST_BLUEPRINTS.length];
  const inject = (text: string): string => {
    if (LUGAN_RE.test(text)) return text.replace(LUGAN_RE, bp.directive);
    if (/(Strictly NO 2D cartoon art)/.test(text)) return text.replace(/(Strictly NO 2D cartoon art)/, `${bp.directive} $1`);
    const nl = text.indexOf('\n');
    return nl > 0 ? `${text.slice(0, nl)} ${bp.directive}${text.slice(nl)}` : `${text} ${bp.directive}`;
  };
  return {
    label: bp.label,
    prompts: { ...prompts, storyboardPrompt: inject(prompts.storyboardPrompt), videoPrompt: inject(prompts.videoPrompt) },
  };
}
