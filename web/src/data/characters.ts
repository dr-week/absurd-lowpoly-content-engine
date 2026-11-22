export interface CharacterPreset {
  id: string;
  label: string;
  parodyName: string;
  rawAliases: readonly string[];
  visualLock: string;
  starter: string;
}

export const CHARACTER_ROSTER: readonly CharacterPreset[] = [
  {
    id: 'elon',
    label: 'Elon Bhai',
    parodyName: 'Elon Bhai',
    rawAliases: ['elon musk', 'elon'],
    visualLock: 'Elon Bhai (blocky tech mogul in matte-black leather jacket with stiff cropped dark hair)',
    starter: 'Elon Bhai builds an orbital rocket rig for ',
  },
  {
    id: 'trump',
    label: 'Doland Bhau',
    parodyName: 'Doland Bhau',
    rawAliases: ['donald trump', 'trump'],
    visualLock: 'Doland Bhau (boxy tycoon in oversized navy suit, long red tie past the belt, and bright swept yellow polygon hair)',
    starter: 'Doland Bhau slaps a 200% tariff on ',
  },
  {
    id: 'gandhi',
    label: 'Bapu-G',
    parodyName: 'Bapu-G',
    rawAliases: ['mahatma gandhi', 'gandhiji', 'gandhi'],
    visualLock: 'Bapu-G (bald elderly ascetic in round wire-frame pixel glasses, white khadi dhoti, and wooden walking stick)',
    starter: 'Bapu-G silently protests ',
  },
  {
    id: 'putin',
    label: 'Putinder',
    parodyName: 'Putinder',
    rawAliases: ['vladimir putin', 'putin'],
    visualLock: 'Putinder (stern wide-shouldered leader in dark olive trench coat at an absurdly long 40-foot table)',
    starter: 'Putinder opens an underground bunker silo for ',
  },
  {
    id: 'modi',
    label: 'Modi-G',
    parodyName: 'Modi-G',
    rawAliases: ['narendra modi', 'modi'],
    visualLock: 'Modi-G (white-bearded statesman in crisp saffron waistcoat, white kurta, and rimless rectangular glasses)',
    starter: 'Modi-G holds a televised ribbon-cutting for ',
  },
  {
    id: 'zuck',
    label: 'Zucku Bhai',
    parodyName: 'Zucku Bhai',
    rawAliases: ['mark zuckerberg', 'zuckerberg'],
    visualLock: 'Zucku Bhai (robotic pale tech CEO in plain grey t-shirt with unblinking pixel eyes and bulky VR visor)',
    starter: 'Zucku Bhai replaces a normal tea stall with ',
  },
  {
    id: 'ambani',
    label: 'Motabhai',
    parodyName: 'Motabhai',
    rawAliases: ['mukesh ambani', 'ambani'],
    visualLock: 'Motabhai (smiling billionaire industrialist in maroon velvet waistcoat holding a golden router)',
    starter: 'Motabhai buys an entire planet just to install ',
  },
  {
    id: 'gigachad',
    label: 'Giga-Chaddha',
    parodyName: 'Giga-Chaddha',
    rawAliases: ['gigachad', 'giga chad'],
    visualLock: 'Giga-Chaddha (ultra-chiseled monochrome bodybuilder with 90-degree hexagonal polygon jawline in a white tank top)',
    starter: 'Giga-Chaddha refuses to blink while lifting ',
  },
  {
    id: 'doge',
    label: 'Doge-esh',
    parodyName: 'Doge-esh',
    rawAliases: ['doge', 'cheems'],
    visualLock: 'Doge-esh (blocky low-poly yellow Shiba dog sitting cross-legged on a plastic stool with deadpan side-eye)',
    starter: 'Doge-esh takes over as chief safety officer for ',
  },
  {
    id: 'spooder',
    label: 'Spooder-Bhai',
    parodyName: 'Spooder-Bhai',
    rawAliases: ['spider-man', 'spiderman', 'peter parker'],
    visualLock: 'Spooder-Bhai (knockoff red-and-blue webbed suit hero wearing yellow rubber chappals and carrying a steel tiffin)',
    starter: 'Spooder-Bhai gets his web stuck on a ceiling fan while ',
  },
  {
    id: 'sigma',
    label: 'Sigma Tauji',
    parodyName: 'Sigma Tauji',
    rawAliases: ['patrick bateman', 'sigma male'],
    visualLock: 'Sigma Tauji (sharp pinstriped suit executive in clear raincoat nodding solemnly in headphones at 4 AM)',
    starter: 'Sigma Tauji wakes up at 3:45 AM to optimize ',
  },
  {
    id: 'goa',
    label: 'Goa Uncle-G',
    parodyName: 'Goa Uncle-G',
    rawAliases: ['goa uncle'],
    visualLock: 'Goa Uncle-G (sunburned retired uncle in floral shirt, oversized dark sunglasses, and flip-flops)',
    starter: 'Goa Uncle-G invents a 10-Gbps beach hack for ',
  },
];
