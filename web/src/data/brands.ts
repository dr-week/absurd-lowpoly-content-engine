import type { BrandSignal } from '../types';

// Global + Goa + Science + Politics + Modern Culture Viral Heat Signals
export const BRAND_SIGNALS: Record<string, BrandSignal> = {
  'Goa Shack': { brand: 'Goa Shack', spendHeat: 93, hook: 'Goa tourist & coastal lifestyle viral reels', agencyStyle: 'Relatable travel satire' },
  'Goa Ferry': { brand: 'Goa Ferry', spendHeat: 89, hook: 'Goan scooter & river ferry culture', agencyStyle: 'Deadpan regional comedy' },
  'NASA Study': { brand: 'NASA Study', spendHeat: 94, hook: 'Space & zero-gravity research headlines', agencyStyle: 'Absurd science explainer' },
  'Sleep Study': { brand: 'Sleep Study', spendHeat: 91, hook: 'Viral university psychology/sleep studies', agencyStyle: 'Deadpan weird science' },
  'Quantum Lab': { brand: 'Quantum Lab', spendHeat: 90, hook: 'Particle physics & weird lab breakthroughs', agencyStyle: 'Sci-fi deadpan twist' },
  'Ocean Research': { brand: 'Ocean Research', spendHeat: 87, hook: 'Deep-sea creature & submarine discoveries', agencyStyle: 'Curiosity hook' },
  'UN Summit': { brand: 'UN Summit', spendHeat: 92, hook: 'World diplomacy & global summit bloopers', agencyStyle: 'Political satire' },
  'Live Debate': { brand: 'Live Debate', spendHeat: 95, hook: 'Chaotic prime-time news panels', agencyStyle: 'High-energy media satire' },
  'Central Bank': { brand: 'Central Bank', spendHeat: 86, hook: 'Global inflation & interest rate memes', agencyStyle: 'Deadpan economy humor' },
  'AI Demo Day': { brand: 'AI Demo Day', spendHeat: 96, hook: 'AI startup launches & founder hype', agencyStyle: 'Tech culture parody' },
  'Mars Colony': { brand: 'Mars Colony', spendHeat: 92, hook: 'Billionaire space colonization news', agencyStyle: 'Surreal sci-fi satire' },
  'Alpha Podcast': { brand: 'Alpha Podcast', spendHeat: 91, hook: '4 AM cold-plunge hustle podcast memes', agencyStyle: 'Creator parody' },
  '10-Min App': { brand: '10-Min App', spendHeat: 95, hook: '3 AM express delivery absurdity', agencyStyle: 'High-speed visual gag' },
  'Airport Check': { brand: 'Airport Check', spendHeat: 88, hook: 'Universal airport security stress', agencyStyle: 'Relatable global humor' },
  'Barber Chair': { brand: 'Barber Chair', spendHeat: 89, hook: 'Universal haircut betrayal', agencyStyle: 'Deadpan visual twist' },
  'Fitness Lab': { brand: 'Fitness Lab', spendHeat: 87, hook: 'Cheap protein & gym bro satire', agencyStyle: 'Fitness parody' },
  'Spam Call': { brand: 'Spam Call', spendHeat: 85, hook: 'Robocall & loan spam absurdity', agencyStyle: 'Creepy-funny tech' },
  'Luxury Villa': { brand: 'Luxury Villa', spendHeat: 90, hook: 'Discount coupon vs luxury Airbnb', agencyStyle: 'Lifestyle contrast' },
};

export function getBrandHeat(brand: string): number {
  return BRAND_SIGNALS[brand]?.spendHeat ?? 82;
}
