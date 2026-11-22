import type { GeneratedPrompts } from '../types';

export interface AccentProfile {
  id: string;
  label: string;
  region: 'global' | 'india';
  languageFlavor: string;
  trendingWords: readonly string[];
  directive: string;
}

export const ACCENT_PROFILES: readonly AccentProfile[] = [
  {
    id: 'uk-london', label: 'UK London / British Dry', region: 'global', languageFlavor: 'East London slang & dry British deadpan',
    trendingWords: ['Innit', 'Bruv', 'Mad ting', 'Proper peak', 'Cheers mate'],
    directive: 'Accent & Dialect (UK London): Characters speak crisp East London / British deadpan English weaving trending words like "Bruv", "Innit", "Mad ting", and "Proper peak".',
  },
  {
    id: 'nyc-brooklyn', label: 'NYC Brooklyn Street', region: 'global', languageFlavor: 'Fast New York Brooklyn street cadence',
    trendingWords: ['Deadass', 'Yo', 'Wildin', 'No cap', 'Are you buggin'],
    directive: 'Accent & Dialect (NYC Brooklyn): Characters speak fast expressive New York Brooklyn street English weaving trending slang like "Deadass", "Yo", "Wildin", and "No cap".',
  },
  {
    id: 'japanese-tokyo', label: 'Tokyo Japanese Dramatic', region: 'global', languageFlavor: 'Expressive Tokyo Japanese / anime-deadpan cadence',
    trendingWords: ['Nani?!', 'Yabai', 'Sugoi', 'Majide?!', 'Daijoubu'],
    directive: 'Accent & Dialect (Tokyo Japanese): Characters speak crisp Japanese-accented dialogue with dramatic anime-deadpan timing, dropping trending words like "Nani?!", "Yabai", "Majide?!", and "Sugoi".',
  },
  {
    id: 'korean-seoul', label: 'Seoul Korean Expressive', region: 'global', languageFlavor: 'K-drama expressive Seoul Korean cadence',
    trendingWords: ['Aigoo', 'Daebak', 'Jinjja?!', 'Aish', 'Fighting'],
    directive: 'Accent & Dialect (Seoul Korean): Characters speak expressive Seoul Korean-inflected cadence with sharp comedic sighs, weaving trending words like "Aigoo", "Daebak", "Jinjja?!", and "Aish".',
  },
  {
    id: 'spanish-latin', label: 'Latin Spanish Dramatic', region: 'global', languageFlavor: 'Telenovela / street Latin Spanish rhythm',
    trendingWords: ['No manches', 'Órale', 'Dale', 'Tranquilo', 'Qué pasa'],
    directive: 'Accent & Dialect (Latin Spanish): Characters speak rapid dramatic Latin Spanish-inflected cadence weaving trending phrases like "No manches", "Órale", "Dale", and "Tranquilo".',
  },
  {
    id: 'french-paris', label: 'Parisian French Deadpan', region: 'global', languageFlavor: 'Aloof Parisian French sigh & chic sarcasm',
    trendingWords: ['Oh là là', 'C’est la vie', 'Incroyable', 'Magnifique', 'Voilà'],
    directive: 'Accent & Dialect (Parisian French): Characters speak aloof, chic Parisian French-accented deadpan with dramatic shrugs, weaving phrases like "Oh là là", "Incroyable", and "C’est la vie".',
  },
  {
    id: 'italian-rome', label: 'Italian Expressive', region: 'global', languageFlavor: 'Passionate Italian hand-gesture rhythm',
    trendingWords: ['Mamma mia', 'Basta', 'Bellissimo', 'Dai', 'Che casino'],
    directive: 'Accent & Dialect (Italian Expressive): Characters speak passionate melodic Italian-accented cadence with wild hand gestures, weaving words like "Mamma mia", "Basta", "Dai", and "Che casino".',
  },
  {
    id: 'arabic-habibi', label: 'Gulf Arabic / Habibi Swag', region: 'global', languageFlavor: 'Warm high-status Arabic-English street swag',
    trendingWords: ['Habibi', 'Wallah', 'Yalla', 'Khalas', 'Mashallah'],
    directive: 'Accent & Dialect (Gulf Arabic Swag): Characters speak warm confident Gulf Arabic-inflected cadence weaving trending words like "Habibi", "Wallah", "Yalla", and "Khalas".',
  },
  {
    id: 'haryanvi', label: 'Haryanvi Swagger', region: 'india', languageFlavor: 'Haryanvi-inflected Hindi bass drawl',
    trendingWords: ['Systumm', 'Bawaal', 'Ghani tez', 'Chhora'],
    directive: 'Accent & Dialect (Haryanvi Swagger): Characters speak bold Haryanvi-inflected Hindi with fearless bass drawl, weaving trending slang like "Systumm", "Bawaal", and "Ghani tez".',
  },
  {
    id: 'deccani', label: 'Hyderabadi Deccani', region: 'india', languageFlavor: 'Relaxed Hyderabadi Deccani drawl',
    trendingWords: ['Hau miyaan', 'Baigan', 'Nakko', 'Kirraak'],
    directive: 'Accent & Dialect (Hyderabadi Deccani): Characters speak relaxed Hyderabadi Deccani with dry exaggeration, dropping trending phrases like "Hau miyaan", "Baigan", "Nakko", and "Kirraak".',
  },
  {
    id: 'purvanchali', label: 'UP / Bihari Deadpan', region: 'india', languageFlavor: 'Lyrical Purvanchali Hindi sarcasm',
    trendingWords: ['Bhaukaal', 'Gardaa', 'Lallantop', 'Ka be'],
    directive: 'Accent & Dialect (UP / Bihari Deadpan): Characters speak lyrical Purvanchali Hindi with calm sarcastic understatement, weaving trending words like "Bhaukaal", "Gardaa", and "Lallantop".',
  },
  {
    id: 'punjabi', label: 'Punjabi Hearty', region: 'india', languageFlavor: 'Booming musical Punjabi-Hindi',
    trendingWords: ['Paaji', 'Siraa', 'Kaim aa', 'Veere'],
    directive: 'Accent & Dialect (Punjabi Hearty): Characters speak booming musical Punjabi-inflected Hindi, naturally weaving trending words like "Paaji", "Siraa", "Kaim aa", and "Veere".',
  },
  {
    id: 'tanglish', label: 'South-Indian Tanglish', region: 'india', languageFlavor: 'Crisp rhythmic Tamil-English / Hinglish',
    trendingWords: ['Macha', 'Anna', 'Vera level', 'Ayyo', 'Scene illa'],
    directive: 'Accent & Dialect (South-Indian Tanglish): Characters speak crisp rhythmic South-Indian English and Hinglish, weaving trending words like "Macha", "Anna", "Vera level", and "Ayyo".',
  },
  {
    id: 'genz-global', label: 'Gen-Z Global Slang', region: 'global', languageFlavor: 'Ultra-casual global internet deadpan',
    trendingWords: ['Bro literally', 'Delulu', 'Cooked', 'Aura minus', 'No cap'],
    directive: 'Accent & Dialect (Gen-Z Global): Characters speak ultra-casual deadpan internet slang mixing viral catchphrases like "Bro literally", "Delulu", "Cooked", and "Aura minus".',
  },
];

const ACCENT_RE = /Accent & Dialect \([^)]+\):[^.]+\./;

export function pickAccentProfile(seed = 0): AccentProfile {
  return ACCENT_PROFILES[Math.abs(seed) % ACCENT_PROFILES.length];
}

export function cycleAccentProfile(
  prompts: GeneratedPrompts,
  step: number,
): { prompts: GeneratedPrompts; label: string } {
  const a = pickAccentProfile(step);
  const inject = (text: string): string => {
    if (ACCENT_RE.test(text)) return text.replace(ACCENT_RE, a.directive);
    if (/(Audio:)/.test(text)) return text.replace(/(Audio:)/, `${a.directive} $1`);
    const nl = text.indexOf('\n');
    return nl > 0 ? `${text.slice(0, nl)} ${a.directive}${text.slice(nl)}` : `${text} ${a.directive}`;
  };
  return { label: a.label, prompts: { ...prompts, videoPrompt: inject(prompts.videoPrompt) } };
}
