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
    id: 'elon', label: 'Elone Maask', parodyName: 'Elone Maask',
    rawAliases: ['elon musk', 'elon bhai', 'elone', 'elon'],
    visualLock: 'Elone Maask (blocky parody tech mogul in shiny silver-foil vest over a wrinkled kurta, crooked visor shades, and neon sneakers)',
    starter: 'Elone Maask builds an orbital rocket rig for ',
  },
  {
    id: 'trump', label: 'Doland Trumpe', parodyName: 'Doland Trumpe',
    rawAliases: ['donald trump', 'doland trump', 'doland bhau', 'trumpe', 'trump'],
    visualLock: 'Doland Trumpe (boxy parody tycoon in oversized mustard-yellow safari suit, checkered knee-length tie, and towering orange-gold pompadour)',
    starter: 'Doland Trumpe slaps a 200% tariff on ',
  },
  {
    id: 'spooder', label: 'Spooder-Maan', parodyName: 'Spooder-Maan',
    rawAliases: ['spider-man', 'spiderman', 'peter parker', 'spooder-bhai'],
    visualLock: 'Spooder-Maan (bootleg parody hero in faded orange-and-purple pajama suit with lopsided eye lenses, checkered gym shorts over tights, and yellow rubber chappals)',
    starter: 'Spooder-Maan gets his web stuck on a ceiling fan while ',
  },
  {
    id: 'hulk', label: 'Hulke', parodyName: 'Hulke',
    rawAliases: ['incredible hulk', 'bruce banner', 'hulk'],
    visualLock: 'Hulke (giant pastel-mint-green parody strongman wearing an unbuttoned floral Hawaiian shirt, red gamcha towel around neck, and tiny pink flip-flops)',
    starter: 'Hulke gets stuck inside a tiny auto-rickshaw because ',
  },
  {
    id: 'batman', label: 'Baatmaan', parodyName: 'Baatmaan',
    rawAliases: ['batman', 'bruce wayne'],
    visualLock: 'Baatmaan (bootleg night vigilante in a lopsided cardboard mask, maroon bedsheet tied as a cape, striped pajama pants, and rubber sandals)',
    starter: 'Baatmaan argues with a society watchman at 2 AM over ',
  },
  {
    id: 'gandhi', label: 'Gaandhi-G', parodyName: 'Gaandhi-G',
    rawAliases: ['mahatma gandhi', 'gandhiji', 'bapu-g', 'gandhi'],
    visualLock: 'Gaandhi-G (bald parody elder in neon-rimmed round pixel glasses, white khadi dhoti with chunky retro sneakers, and bamboo stick with bicycle bell)',
    starter: 'Gaandhi-G silently protests ',
  },
  {
    id: 'putin', label: 'Putine', parodyName: 'Putine',
    rawAliases: ['vladimir putin', 'putinder', 'putin'],
    visualLock: 'Putine (stern wide-shouldered parody leader in bright floral puffer vest over an olive tracksuit at a 40-foot plastic folding table)',
    starter: 'Putine opens an underground bunker silo for ',
  },
  {
    id: 'modi', label: 'Moodi-G', parodyName: 'Moodi-G',
    rawAliases: ['narendra modi', 'modi-g', 'modiji', 'modi'],
    visualLock: 'Moodi-G (white-bearded parody statesman in bright checkerboard sleeveless waistcoat over white kurta, tinted aviators, holding giant gold scissors)',
    starter: 'Moodi-G holds a televised ribbon-cutting for ',
  },
  {
    id: 'zuck', label: 'Zuckerburge', parodyName: 'Zuckerburge',
    rawAliases: ['mark zuckerberg', 'zuckerberg', 'zucku bhai', 'zuck'],
    visualLock: 'Zuckerburge (robotic pale parody CEO in neon-green cotton tee with cardboard VR headset strapped on by rubber bands and unblinking eyes)',
    starter: 'Zuckerburge replaces a normal tea stall with ',
  },
  {
    id: 'ambani', label: 'Ambaani', parodyName: 'Ambaani',
    rawAliases: ['mukesh ambani', 'motabhai', 'ambani'],
    visualLock: 'Ambaani (smiling parody tycoon in glittery maroon sequined waistcoat and gold shades carrying a six-antenna glowing router)',
    starter: 'Ambaani buys an entire planet just to install ',
  },
  {
    id: 'gigachad', label: 'Giga-Chaad', parodyName: 'Giga-Chaad',
    rawAliases: ['gigachad', 'giga chad', 'giga-chaddha'],
    visualLock: 'Giga-Chaad (monochrome parody bodybuilder with 90-degree hexagonal polygon jawline in a local-gym vest, red plastic shorts, and steel bottle)',
    starter: 'Giga-Chaad refuses to blink while lifting ',
  },
  {
    id: 'doge', label: 'Dogee', parodyName: 'Dogee',
    rawAliases: ['doge-esh', 'cheems', 'doge'],
    visualLock: 'Dogee (blocky yellow Shiba dog wearing tiny black sunglasses, white baniyan vest, and plastic gold chain sitting on a plastic stool)',
    starter: 'Dogee takes over as chief safety officer for ',
  },
  {
    id: 'sigma', label: 'Sigmaa', parodyName: 'Sigmaa',
    rawAliases: ['patrick bateman', 'sigma male', 'sigma tauji'],
    visualLock: 'Sigmaa (parody executive in polka-dot clear raincoat over a shiny suit, giant 1990s foam headphones, and blue bathroom slippers)',
    starter: 'Sigmaa wakes up at 3:45 AM to optimize ',
  },
  {
    id: 'puneet', label: 'Lorde Puneete', parodyName: 'Lorde Puneete',
    rawAliases: ['puneet superstar', 'lord puneet', 'puneet'],
    visualLock: 'Lorde Puneete (wild-haired street comedian in torn fluorescent-yellow shirt covered in white talcum powder wearing a lopsided plastic toy crown)',
    starter: 'Lorde Puneete pours two buckets of talcum powder on ',
  },
  {
    id: 'dolly', label: 'Dolli Chai', parodyName: 'Dolli Chai',
    rawAliases: ['dolly chaiwala', 'dolly chai'],
    visualLock: 'Dolli Chai (flamboyant parody tea vendor in oversized neon-pink star sunglasses, glittery vest, and LED sneakers flipping a brass kettle)',
    starter: 'Dolli Chai serves a 360-degree flying cutting chai to ',
  },
  {
    id: 'khali', label: 'Khaali', parodyName: 'Khaali',
    rawAliases: ['the great khali', 'great khali', 'khali'],
    visualLock: 'Khaali (7-foot-3 parody giant wrestler in a tiny polka-dot kitchen apron over his singlet holding a microscopic plastic teacup)',
    starter: 'Khaali accidentally crushes a steel door while trying to ',
  },
  {
    id: 'salman', label: 'Salmaan Bhoi', parodyName: 'Salmaan Bhoi',
    rawAliases: ['salman khan', 'selmon bhoi', 'salman bhoi'],
    visualLock: 'Salmaan Bhoi (muscular parody star in sparkly turquoise-sequined shirt, giant oversized plastic bracelet, and crooked mirrored aviators)',
    starter: 'Salmaan Bhoi defies all laws of physics by ',
  },
  {
    id: 'kohli', label: 'Koohli', parodyName: 'Koohli',
    rawAliases: ['virat kohli', 'kohli'],
    visualLock: 'Koohli (intense bearded parody cricketer in neon-orange gully-cricket jersey, bright red headband, swinging a wooden tennis-ball bat)',
    starter: 'Koohli stares down an umpire for 20 minutes over ',
  },
  {
    id: 'superman', label: 'Sooper-Babu', parodyName: 'Sooper-Babu',
    rawAliases: ['superman', 'clark kent'],
    visualLock: 'Sooper-Babu (parallel-dimension parody hero in purple tracksuit, lime-green bedsheet cape, bright yellow shorts on the outside, and spectacles)',
    starter: 'Sooper-Babu gets stuck in traffic because ',
  },
  {
    id: 'thor', label: 'Thoorwa', parodyName: 'Thoorwa',
    rawAliases: ['thor odinson', 'thor'],
    visualLock: 'Thoorwa (parallel-dimension parody thunder god in pastel-teal tunic, shiny tin helmet, holding a giant wooden roti-belan instead of a hammer)',
    starter: 'Thoorwa tries to summon lightning just to ',
  },
  {
    id: 'ironman', label: 'Loha-Babu', parodyName: 'Loha-Babu',
    rawAliases: ['iron man', 'ironman', 'tony stark'],
    visualLock: 'Loha-Babu (parallel-dimension parody armored inventor in rusty orange-and-teal tin-bucket suit with a glowing LED bicycle headlamp on his chest)',
    starter: 'Loha-Babu runs out of battery at 1% while ',
  },
  {
    id: 'gta6', label: 'GTA-Sixe', parodyName: 'GTA-Sixe',
    rawAliases: ['gta 6', 'gta6', 'gta vi', 'gta-vi bhai', 'vice city'],
    visualLock: 'GTA-Sixe (parallel-dimension getaway driver in pineapple-print Hawaiian shirt, khaki cargo shorts, chunky gold chain, and white socks with chappals)',
    starter: 'During a 5-star GTA-Sixe police chase, everyone stops for ',
  },
];
