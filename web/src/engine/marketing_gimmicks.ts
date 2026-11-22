import type { GeneratedPrompts } from '../types';

export interface MarketingGimmick {
  id: string;
  label: string;
  mechanism: string;
  ctaBait: string;
  directive: string;
}

export const MARKETING_GIMMICKS: readonly MarketingGimmick[] = [
  {
    id: 'trojan-chaos-reveal',
    label: 'Trojan-Horse Chaos Reveal',
    mechanism: '80% unrelated street chaos/near-crash -> Shot 5 reveals [YOUR PRODUCT] spotless -> Shot 6 crowd asks where to buy it.',
    ctaBait: 'Pause at Shot 5 — would you actually wear/use this? Comment LINK.',
    directive:
      'Marketing Gimmick (Trojan-Horse Reveal): Hide [YOUR PRODUCT] completely during Shots 1-4 chaos, then whip-pan in Shot 5 showing [YOUR PRODUCT] spotless while shocked NPCs demand to know where he got it.',
  },
  {
    id: 'reverse-anti-ad',
    label: 'Reverse-Psychology Anti-Ad',
    mechanism: 'Angry deadpan founder warns viewers "DO NOT BUY [YOUR PRODUCT]" because it works too well and ruins his peace.',
    ctaBait: 'He literally begged us not to buy it. Should we sell it out anyway?',
    directive:
      'Marketing Gimmick (Anti-Ad Reverse Psychology): Have the lead angrily warn viewers NOT to buy [YOUR PRODUCT] while accidentally demonstrating an absurd superpower of [YOUR PRODUCT] in every beat.',
  },
  {
    id: 'absurd-torture-test',
    label: 'Absurd Street Torture Test',
    mechanism: 'Subject [YOUR PRODUCT] to outrageous street physics (auto-rickshaw wheel, boiling chai splash, concrete drop) -> zero damage.',
    ctaBait: 'What should we test [YOUR PRODUCT] against next? Most liked comment wins.',
    directive:
      'Marketing Gimmick (Absurd Durability Test): Put [YOUR PRODUCT] through escalating street torture (chutney splash, scooter tire, 3-story drop) and reveal [YOUR PRODUCT] completely unscratched in Shot 6.',
  },
  {
    id: 'undercover-bounty',
    label: 'Undercover Street Bounty',
    mechanism: 'Disguised scout secretly rewards anyone spotted holding [YOUR PRODUCT] with an absurd VIP upgrade -> instant FOMO.',
    ctaBait: 'If we spot you with [YOUR PRODUCT] in your city, what upgrade do you want?',
    directive:
      'Marketing Gimmick (Secret Street Bounty): Stage an undercover scout rewarding the one calm person using [YOUR PRODUCT] with an absurd VIP reward while jealous NPCs scramble to find it.',
  },
  {
    id: 'banned-by-committee',
    label: 'Fake "Banned By Committee"',
    mechanism: 'Breaking-news / CCTV skit where a serious local committee tries to ban [YOUR PRODUCT] for being "unfairly overpowered".',
    ctaBait: 'Should [YOUR PRODUCT] stay legal or be banned? Vote YES or NO.',
    directive:
      'Marketing Gimmick (Fake Ban Controversy): Frame [YOUR PRODUCT] as an "unfairly overpowered" contraband item that a stern local committee tries to confiscate—only for the committee head to keep one.',
  },
  {
    id: 'rival-sabotage-backfire',
    label: 'Rival Sabotage Backfire',
    mechanism: 'Jealous rival tries to expose a flaw in [YOUR PRODUCT] on camera -> accidentally proves its quality -> secretly orders 3.',
    ctaBait: 'Tag a hater who secretly uses the exact thing they roast.',
    directive:
      'Marketing Gimmick (Sabotage Backfire): Show a jealous rival NPC trying to break or mock [YOUR PRODUCT] on camera, failing hilariously, and secretly whispering an order for three units in Shot 6.',
  },
  {
    id: 'cheap-vs-luxury-flex',
    label: '₹499 vs ₹2 Lakh Showdown',
    mechanism: 'Deadpan side-by-side street test where budget [YOUR PRODUCT] humiliates an overpriced ₹2 lakh status item.',
    ctaBait: 'Honest answer: ₹499 smart pick or ₹2 lakh ego tax?',
    directive:
      'Marketing Gimmick (Status Showdown): Pit affordable [YOUR PRODUCT] directly against an absurdly overpriced ₹2 lakh luxury item until the luxury owner begs to swap in Shot 6.',
  },
  {
    id: 'hidden-flaw-comment-bait',
    label: 'Comment-Bait "Hidden Detail"',
    mechanism: 'Plant one tiny absurd typo or suspicious price tag on [YOUR PRODUCT] in Shot 2 so viewers pause, rewatch, and argue in comments.',
    ctaBait: '99% of people missed the wild detail on [YOUR PRODUCT] in Shot 2. Did you catch it?',
    directive:
      'Marketing Gimmick (Rewatch Comment-Bait): Plant one hilarious, blink-and-you-miss-it detail or absurdly low price sticker on [YOUR PRODUCT] in Shot 2 that triggers instant rewatches and comment debates.',
  },
];

const GIMMICK_RE = /Marketing Gimmick \([^)]+\):[^.]+\./;

export function pickMarketingGimmick(seed = 0): MarketingGimmick {
  return MARKETING_GIMMICKS[Math.abs(seed) % MARKETING_GIMMICKS.length];
}

export function detectActiveGimmick(promptText: string, fallbackSeed = 0): MarketingGimmick {
  const match = promptText.match(GIMMICK_RE);
  if (match) {
    const found = MARKETING_GIMMICKS.find((g) => g.directive === match[0]);
    if (found) return found;
  }
  return pickMarketingGimmick(fallbackSeed);
}

export function cycleMarketingGimmick(
  prompts: GeneratedPrompts,
  step: number,
): { prompts: GeneratedPrompts; label: string } {
  const g = pickMarketingGimmick(step);
  const inject = (text: string): string => {
    if (GIMMICK_RE.test(text)) return text.replace(GIMMICK_RE, g.directive);
    if (/(Strictly NO 2D cartoon art)/.test(text)) return text.replace(/(Strictly NO 2D cartoon art)/, `${g.directive} $1`);
    const nl = text.indexOf('\n');
    return nl > 0 ? `${text.slice(0, nl)} ${g.directive}${text.slice(nl)}` : `${text} ${g.directive}`;
  };
  return {
    label: g.label,
    prompts: {
      ...prompts,
      storyboardPrompt: inject(prompts.storyboardPrompt),
      videoPrompt: inject(prompts.videoPrompt),
    },
  };
}
