// Global + Goa + Science + Politics + Universal Everyday randomization dictionaries (zero Delhi/Mumbai hardcoding)

export const INDIAN_PROPS: readonly string[] = [
  'steel tiffin box', 'faded QR standee', 'plastic beach chair', 'broken umbrella',
  'vintage clipboard', 'rubber flip-flop', 'cracked smartphone', 'stainless steel flask',
  'microscope slide', 'translation earpiece', 'wireless mic', 'wooden podium gavel',
  'astronaut helmet', 'protein shaker', 'security tray', 'boarding pass',
  'barber spray bottle', 'glowing USB drive',
];

export const INDIAN_LOCATIONS: readonly string[] = [
  'Goan beach shack', 'river ferry deck', 'aerospace research chamber', 'UN assembly hall',
  'prime-time TV studio', 'underground collider tunnel', 'deep-sea submarine cabin',
  'Martian habitat airlock', 'airport security lane', 'minimalist keynote stage',
  'university sleep lab', 'luxury villa foyer',
];

export const DEADPAN_REACTIONS: readonly string[] = [
  'OTP batao, rating 5 dena.', 'Peer review mein pass ho jayega.', 'Committee agle mahine milegi.',
  'Season mein rate double hai boss.', 'Market fundamentals strong hain.', 'Sample size abhi chhota hai.',
  'Link bio mein hai bro.', 'Oxygen bill extra aayega.', 'Set hai? Gel laga doon?',
  'Sir, zero processing fee hai.', 'Seed round oversubscribed hai.', 'Break ke baad bhi yahi chalega.',
];

export const SURREAL_MODIFIERS: readonly string[] = [
  'at 12fps jerky speed', 'with zero rotation', 'while ignoring gravity',
  'leaving a neat rectangular cutout', 'inside thick grey fog', 'like a rigid statue',
  'while cameras keep rolling unbothered', 'in dead silence',
];

export function pickRandom<T>(list: readonly T[], rng: () => number = Math.random): T {
  return list[Math.floor(rng() * list.length)];
}
