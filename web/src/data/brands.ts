import type { BrandSignal } from '../types';

// Live India Brand-in-News & Social Marketing Spend Signals (Nov 2026)
export const BRAND_SIGNALS: Record<string, BrandSignal> = {
  Zepto: {
    brand: 'Zepto',
    spendHeat: 96,
    hook: '10-min Q-comm meme wars',
    agencyStyle: 'High-velocity Reels + quirky OOH',
  },
  Blinkit: {
    brand: 'Blinkit',
    spendHeat: 94,
    hook: 'Zomato-Blinkit festive & heatwave banter',
    agencyStyle: 'Moment marketing + creator collabs',
  },
  Zomato: {
    brand: 'Zomato',
    spendHeat: 95,
    hook: 'Playful OOH + viral push notifications',
    agencyStyle: 'Sarcastic brevity + city meme pages',
  },
  Airbnb: {
    brand: 'Airbnb',
    spendHeat: 92,
    hook: 'K3G Raichand Mansion campaign (Nov 2026)',
    agencyStyle: 'Nostalgia Bollywood creator stunt',
  },
  Paytm: {
    brand: 'Paytm',
    spendHeat: 88,
    hook: 'Soundbox ubiquity across Tier 1-3 streets',
    agencyStyle: 'Hyper-local street audio recall',
  },
  Ola: {
    brand: 'Ola',
    spendHeat: 86,
    hook: 'Cab cancellation & pin-location rage memes',
    agencyStyle: 'Organic commuter frustration trend',
  },
  Truecaller: {
    brand: 'Truecaller',
    spendHeat: 82,
    hook: 'Spam loan call & robocall fatigue',
    agencyStyle: 'Everyday utility comedy',
  },
  Netflix: {
    brand: 'Netflix',
    spendHeat: 91,
    hook: '10-year India creator campaigns & memes',
    agencyStyle: 'Real-time comment-section banter',
  },
  Local: {
    brand: 'Local',
    spendHeat: 76,
    hook: 'Evergreen Indian street & family friction',
    agencyStyle: 'High-share relatable regional Reels',
  },
};

export function getBrandHeat(brand: string): number {
  return BRAND_SIGNALS[brand]?.spendHeat ?? 72;
}
