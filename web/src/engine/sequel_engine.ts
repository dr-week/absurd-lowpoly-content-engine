import type { ScoredTopic } from '../types';

/**
 * Generates an escalated Part 2 / Sequel topic + 6-frame storyboard + 6-shot video script
 * that directly calls back Part 1's protagonist, world, and absurdity.
 */
export function buildPart2Topic(original: ScoredTopic): ScoredTopic {
  const cleanTitle = original.title.replace(/^PART\s*\d+:\s*/i, '').trim();
  const shortWorld = original.brand || 'World';
  const stamp = Date.now().toString(36).slice(-4);
  const partMatch = original.title.match(/^PART\s*(\d+):/i);
  const nextPart = partMatch ? Number(partMatch[1]) + 1 : 2;

  return {
    ...original,
    id: `${original.id}_p${nextPart}_${stamp}`,
    title: `PART ${nextPart}: ${cleanTitle}`,
    trendHook: `Part ${nextPart} Callback Sequel`,
    pitch: `After Part ${nextPart - 1} went viral, ${shortWorld} refuses to admit defeat and doubles the budget — triggering an even bigger chain reaction that brings back the exact same ₹10 problem.`,
    frames: [
      { frame: 1, position: 'Top Left', framing: 'Press conference wide shot', action: `Officials from ${shortWorld} point at a giant blurred screenshot of Part ${nextPart - 1} on a CRT monitor.`, caption: `Part ${nextPart - 1} ke baad meeting baithi.` },
      { frame: 2, position: 'Top Center', framing: 'Blueprint reveal shot', action: 'They unveil "VERSION 2.0" — triple the cranes, double the blinking red gauges, zero lessons learned.', caption: 'Is baar budget triple kar diya.' },
      { frame: 3, position: 'Top Right', framing: 'Assembly montage shot', action: 'Boxy technicians bolt glowing steel struts and oversized speakers onto the original Part 1 prop.', caption: 'Upgrade 2.0 full speed pe chala.' },
      { frame: 4, position: 'Bottom Left', framing: 'Wide disaster shot', action: 'The moment they press START, the entire room tilts 30 degrees while alarms blare calmly.', caption: 'Button dabate hi sab hil gaya.' },
      { frame: 5, position: 'Bottom Center', framing: 'Callback close-up', action: 'Through the smoke, the exact tiny problem from Part 1 sits completely untouched in the center.', caption: 'Purani dikkat abhi bhi wahin thi.' },
      { frame: 6, position: 'Bottom Right', framing: 'Deadpan press close-up', action: 'Spokesperson adjusts his glasses solemnly and holds up a folder labeled "PART 3 BUDGET".', caption: 'Part 3 mein pakka fix hoga.' },
    ],
    shots: [
      { shot: 1, visual: `Halogen press shot of ${shortWorld} officials staring stiffly at a CRT replay of Part ${nextPart - 1}.`, sfx: 'VHS rewind whine and click', hindi: 'पिछले कांड के बाद मीटिंग बैठी।' },
      { shot: 2, visual: 'Hard cut to a massive "VERSION 2.0" banner dropping over triple the original machinery.', sfx: 'Dramatic retro brass sting', hindi: 'इस बार बजट तीन गुना कर दिया।' },
      { shot: 3, visual: 'Fast cut to workers bolting glowing radar dishes onto the exact prop from Part 1.', sfx: 'Rapid wrench clicks and sparks', hindi: 'सिस्टम टू पॉइंट ज़ीरो तैयार हुआ।' },
      { shot: 4, visual: 'Wide shot as the floor tilts sharply sideways when someone taps the big red button.', sfx: 'Deep hydraulic groan and siren', hindi: 'बटन दबाते ही कमरा झुक गया।' },
      { shot: 5, visual: 'Smash-cut through pixelated smoke revealing the original tiny problem completely untouched.', sfx: 'Awkward cricket chirp', hindi: 'असली दिक्कत वहीं की वहीं थी।' },
      { shot: 6, visual: 'Direct lens close-up of the spokesperson holding up a thick "PART 3" budget folder.', sfx: 'Folder slap + bass drop, hard cut to black', hindi: 'बोले, पार्ट थ्री में पक्का फिक्स होगा।' },
    ],
  };
}
