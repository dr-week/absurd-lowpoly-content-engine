import { CHARACTER_ROSTER } from '../data/characters';
import type { GeneratedPrompts } from '../types';

export const DESI_NAME_VARIANTS: Record<string, readonly string[]> = {
  elon: ['Elone Maask', 'Elonesh', 'Elonu', 'Elonwa', 'Elone-Seth'],
  trump: ['Doland Trumpe', 'Trumpu', 'Trumpesh', 'Doland-Lal', 'Trumpwa'],
  spooder: ['Spooder-Maan', 'Spoodie', 'Spooder-Lal', 'Makad-Babu', 'Spooderwa'],
  hulk: ['Hulke', 'Hulkeshwar', 'Hulku', 'Hulkie', 'Hulkwa'],
  batman: ['Baatmaan', 'Batmahesh', 'Battu-Babu', 'Chamgadar-Lal', 'Batwa'],
  gandhi: ['Gaandhi-G', 'Bapu-Ji', 'Gaandhu-Babu', 'Dandi-Kaka'],
  putin: ['Putine', 'Putinder', 'Puttu', 'Putinwa', 'Putu Paaji'],
  modi: ['Moodi-G', 'Moodi-Kaka', 'Moodesh', 'Moodi-Babu'],
  zuck: ['Zuckerburge', 'Zucku-Babu', 'Zuckesh', 'Zuckwa', 'Zuckie'],
  ambani: ['Ambaani', 'Motabhai', 'Ambaanesh', 'Ambu-Seth'],
  gigachad: ['Giga-Chaad', 'Giga-Chaddha', 'Gigesh', 'Gigu-Paaji', 'Chaad-Seth'],
  doge: ['Dogee', 'Dogesh', 'Dogeshwar', 'Doggu', 'Dogwa'],
  sigma: ['Sigmaa', 'Sigmesh', 'Sigmu-Tau', 'Sigma-Seth', 'Sigwa'],
  puneet: ['Lorde Puneete', 'Puneetu', 'Puneetesh', 'Puneetwa'],
  dolly: ['Dolli Chai', 'Dollu-Chai', 'Chai-Raja', 'Dolli-Babu'],
  khali: ['Khaali', 'Khaali-Seth', 'Khaalu-Paaji', 'Khaalishwar'],
  salman: ['Salmaan Bhoi', 'Sallu-Bhoi', 'Bhoi-Jaan', 'Salmaanwa'],
  kohli: ['Koohli', 'Chiku-Babu', 'Koohlesh', 'Koohlu'],
  superman: ['Sooper-Babu', 'Sooperesh', 'Sooperwa', 'Soopie'],
  thor: ['Thoorwa', 'Thoresh', 'Thoor-Babu', 'Thorie'],
  ironman: ['Loha-Babu', 'Ironeshwar', 'Lohawa', 'Tin-Babu'],
  gta6: ['GTA-Sixe', 'Vice-Babu', 'GTA-Wa', 'Vice-Seth'],
};

const DESI_SUFFIXES = ['ie', 'u', 'esh', 'eshwar', 'wa', '-Lal', '-Babu', '-Seth'] as const;

export const DESI_NOMENCLATURE_GUIDE =
  'DESI PARODY NAMING RULE: Use funny Indian-style phonetic & suffix variations instead of exact real names: ' +
  '1) Cute-ify (-ie/-u: Hulkie, Trumpu, Elonu, Spoodie, Doggu); ' +
  '2) Classic-ify (-esh/-eshwar/-Lal/-Seth: Dogesh, Hulkeshwar, Batmahesh, Elone-Seth, Doland-Lal); ' +
  '3) Village-ify (-wa: Elonwa, Trumpwa, Hulkwa, Zuckwa); ' +
  '4) Honorifics (-Babu/-Paaji/-Kaka/-Seth: Makad-Babu, Putu Paaji, Ambu-Seth).';

/** Turns any word or character name into a funny Indian parody variant (e.g. "cute" -> "Cutie", "Iron" -> "Ironesh"). */
export function desiNameifyWord(word: string, step = 0): string {
  const clean = word.trim().replace(/[^a-zA-Z]/g, '');
  if (!clean) return 'Babua';
  const suffix = DESI_SUFFIXES[Math.abs(step) % DESI_SUFFIXES.length];
  const stem = clean.replace(/[aeiou]+$/i, '') || clean;
  const titled = stem.charAt(0).toUpperCase() + stem.slice(1).toLowerCase();
  return `${titled}${suffix}`;
}

export function pickDesiNameVariant(charId: string, step = 0): string {
  const list = DESI_NAME_VARIANTS[charId];
  if (!list?.length) return desiNameifyWord(charId, step);
  return list[Math.abs(step) % list.length];
}

/**
 * Cycles the active character's funny Indian parody name across both Storyboard and Video prompts
 * (e.g., Hulke -> Hulkeshwar -> Hulku -> Hulkie -> Hulkwa).
 */
export function cycleDesiCharacterName(
  prompts: GeneratedPrompts,
  step: number,
): { prompts: GeneratedPrompts; name: string } {
  const combined = `${prompts.topicTitle} ${prompts.storyboardPrompt} ${prompts.videoPrompt}`.toLowerCase();
  for (const preset of CHARACTER_ROSTER) {
    const variants = DESI_NAME_VARIANTS[preset.id] ?? [preset.parodyName];
    const matched = variants.find((v) => combined.includes(v.toLowerCase()));
    if (!matched) continue;
    const nextName = variants[Math.abs(step) % variants.length];
    const rx = new RegExp(`\\b${matched.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'gi');
    const swap = (txt: string): string =>
      txt.replace(rx, (m) => (m === m.toUpperCase() && m.length > 2 ? nextName.toUpperCase() : nextName));
    return {
      name: nextName,
      prompts: {
        ...prompts,
        topicTitle: swap(prompts.topicTitle),
        storyboardPrompt: swap(prompts.storyboardPrompt),
        videoPrompt: swap(prompts.videoPrompt),
      },
    };
  }
  return { prompts, name: 'No character lock' };
}
