import type { ScoredTopic } from '../types';
import { cryptoRng, cryptoShuffle } from './randomizer';

/**
 * Fuses two saved/liked concepts into a brand-new crossover episode
 * (e.g., World A protagonist dropped into World B situation) with full 6-frame/6-shot scripts.
 */
export function buildCrossoverEpisode(pool: readonly ScoredTopic[]): ScoredTopic | null {
  if (pool.length < 2) return null;
  const [a, b] = cryptoShuffle(pool, cryptoRng);
  const stamp = Date.now().toString(36).slice(-4);
  const titleA = a.brand || a.title.split(/\s+/).slice(0, 2).join(' ');
  const titleB = b.brand || b.title.split(/\s+/).slice(0, 2).join(' ');

  return {
    id: `mashup_${stamp}_${a.id.slice(0, 8)}_${b.id.slice(0, 8)}`,
    title: `CROSSOVER: ${titleA.toUpperCase()} MEETS ${titleB.toUpperCase()}`,
    angle: 'petty-spiral',
    brand: `${titleA} × ${titleB}`,
    trendHook: 'Crossover Mashup',
    pitch: `Two viral worlds collide: ${titleA} walks straight into ${titleB}'s crisis — escalating both problems into a single ₹20 standoff.`,
    brandHeat: Math.max(a.brandHeat, b.brandHeat),
    viralScore: Math.min(99, Math.max(a.viralScore, b.viralScore) + 3),
    hookCategory: a.hookCategory,
    situationCategory: b.situationCategory,
    frames: [
      { frame: 1, position: 'Top Left', framing: 'Flat wide shot', action: `${titleA} arrives calmly inside ${titleB}'s chaotic setting carrying one tiny prop.`, caption: `${titleA} seedha ${titleB} pahunch gaya.` },
      { frame: 2, position: 'Top Center', framing: 'Two-shot close-up', action: `Both characters inspect the problem seriously and immediately blame each other's budget.`, caption: 'Dono ne ek-doosre ko blame kiya.' },
      { frame: 3, position: 'Top Right', framing: 'Upgrade montage shot', action: `They weld both worlds' signature machines together into one wobbling 50-foot contraption.`, caption: 'Dono ke system jod diye gaye.' },
      { frame: 4, position: 'Bottom Left', framing: 'Low-angle chaos shot', action: 'Switching it on freezes the ceiling lights while a giant pixel warning blinks "OVERKILL 900%".', caption: 'Overkill 900 percent pahunch gaya.' },
      { frame: 5, position: 'Bottom Center', framing: 'Table close-up', action: 'Smoke clears to reveal both heroes staring silently at one untouched ₹20 bill.', caption: 'Aakhir mein baat 20 rupaye pe ruki.' },
      { frame: 6, position: 'Bottom Right', framing: 'Deadpan lens close-up', action: `Both nod solemnly at the camera and sign a joint contract for "CROSSOVER PART 2".`, caption: 'Part 2 mein bill split karenge.' },
    ],
    shots: [
      { shot: 1, visual: `Static wide shot as ${titleA} walks rigidly into ${titleB}'s world holding one small prop.`, sfx: 'Heavy footsteps and ambient hum', hindi: `${titleA} सीधा ${titleB} पहुँच गया।` },
      { shot: 2, visual: 'Hard cut to both characters staring deadpan and pointing fingers stiffly.', sfx: 'Awkward silence and dry click', hindi: 'दोनों ने एक-दूसरे को ज़िम्मेदार बताया।' },
      { shot: 3, visual: 'Fast cut to workers bolting both worlds’ machines into one towering wobbling rig.', sfx: 'Rapid wrench clicks and welding buzz', hindi: 'दोनों के सिस्टम एक साथ जोड़ दिए।' },
      { shot: 4, visual: 'Low worm-eye shot as overhead lights flicker under a giant "OVERKILL 900%" display.', sfx: 'Rising turbine roar and retro alarm', hindi: 'ओवरकिल नौ सौ प्रतिशत पहुँच गया।' },
      { shot: 5, visual: 'Smash-cut through pixelated smoke to a single untouched ₹20 note on the desk.', sfx: 'Dry paper flutter', hindi: 'आख़िर में बात बीस रुपये पे रुकी।' },
      { shot: 6, visual: 'Direct lens two-shot as both sign a folder labeled "CROSSOVER PART 2" calmly.', sfx: 'Stamp thump + bass drop, hard cut to black', hindi: 'बोले, पार्ट टू में बिल बाँट लेंगे।' },
    ],
  };
}
