import type { TopicOption } from '../types';
import { sanitizeTopic } from './alias_sanitizer';

/**
 * Clean 3-Mode Trend-Chip Synthesizer (Zero Raw-Headline Slicing):
 * When a user clicks a single-word live trend chip (e.g. "anthropic", "mars", "climate")
 * that doesn't match an existing story in the 48-story vault, pairs it with one of our
 * parody meme characters and a concrete physical object — never broken sentence fragments.
 */
export function synthesizeTrendCard(query: string, batchNonce: number): TopicOption {
  const label = query.trim().slice(0, 20);
  const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, '_');
  const mode = Math.abs(batchNonce) % 3;

  if (mode === 0) {
    return sanitizeTopic({
      id: `trend_${slug}_${batchNonce}`,
      title: `ELON BHAI BUILDS A 40-FOOT RIG FOR ${label.toUpperCase()}`,
      angle: 'over-engineer',
      brand: 'Elon Bhai',
      trendHook: `Trend: ${label}`,
      pitch: `To solve one minor question about ${label}, Elon Bhai bolts 12 radar dishes onto a study desk; after 3 hours of roaring fans, the printer outputs a single word: "MAYBE".`,
      frames: [
        { frame: 1, position: 'Top Left', framing: 'Broadcast studio shot', action: `Elon Bhai points seriously at a blinking monitor displaying "${label.toUpperCase()}".`, caption: `${label} pe bada sawal utha.` },
        { frame: 2, position: 'Top Center', framing: 'Lab wide shot', action: 'Ten engineers bolt glowing radars and steel pipes onto one tiny wooden desk.', caption: '40 foot ka analyzer bana diya.' },
        { frame: 3, position: 'Top Right', framing: 'Gauge close-up', action: 'Pressure dials hit red while cooling fans roar across the concrete floor.', caption: 'System full overload pe chala.' },
        { frame: 4, position: 'Bottom Left', framing: 'Wide control room', action: 'Overhead lights dim as an old dot-matrix printer spits out one single sheet.', caption: '3 ghante baad report nikli.' },
        { frame: 5, position: 'Bottom Center', framing: 'Paper close-up', action: `The official printout reads in bold bitmap font: "${label.toUpperCase()}: MAYBE".`, caption: 'Report mein sirf "shayad" likha.' },
        { frame: 6, position: 'Bottom Right', framing: 'Studio close-up', action: 'Elon Bhai folds the paper neatly and nods with complete engineering pride.', caption: 'Next version Mars pe test hoga.' },
      ],
      shots: [
        { shot: 1, visual: `Wide lab shot of Elon Bhai pointing seriously at "${label.toUpperCase()}" on a CRT monitor.`, sfx: 'Sci-fi alert chime', hindi: `एलन भाई ने ${label} पर रिसर्च शुरू की।` },
        { shot: 2, visual: 'Hard cut to engineers welding giant radar dishes around one tiny wooden desk.', sfx: 'Wrench ratchets and hydraulic hiss', hindi: 'चालीस फुट का एनालाइज़र बना दिया।' },
        { shot: 3, visual: 'Close-up of gauges spinning into red as overhead lamps flicker.', sfx: 'Rising turbine hum', hindi: 'पूरा सिस्टम ओवरलोड हो गया।' },
        { shot: 4, visual: 'Wide control-room cut as an old printer spits out one single sheet.', sfx: 'Noisy dot-matrix printer buzz', hindi: 'तीन घंटे बाद एक पन्ना निकला।' },
        { shot: 5, visual: `Smash-cut to printout reading "${label.toUpperCase()}: MAYBE" in crisp bitmap font.`, sfx: 'Dry paper snap', hindi: 'रिपोर्ट में सिर्फ़ शायद लिखा था।' },
        { shot: 6, visual: 'Direct lens shot of Elon Bhai folding the paper with solemn pride.', sfx: 'Bass drop, instant hard cut to black', hindi: 'बोले, अगला वर्ज़न मंगल पर बनेगा।' },
      ],
    });
  }

  if (mode === 1) {
    return sanitizeTopic({
      id: `trend_${slug}_${batchNonce}`,
      title: `SIGMA TAUJI’S 3-STEP GUIDE TO ${label.toUpperCase()}`,
      angle: 'fake-tutorial',
      brand: 'Sigma Tauji',
      trendHook: `Rule of Three: ${label}`,
      pitch: `Sigma Tauji teaches ${label} in 3 steps: Step 1 buy a ₹50 notebook, Step 2 draw a serious triangle, Step 3 quietly admit you also googled it five minutes ago.`,
      frames: [
        { frame: 1, position: 'Top Left', framing: 'Whiteboard studio shot', action: `Sigma Tauji taps a whiteboard reading "MASTER ${label.toUpperCase()} IN 3 STEPS".`, caption: `Aaj ${label} 3 step mein seekho.` },
        { frame: 2, position: 'Top Center', framing: 'Desk close-up', action: 'Step 1: he places a crisp ₹50 notebook and blue pen symmetrically on the desk.', caption: 'Step 1: 50 rupaye ki copy lo.' },
        { frame: 3, position: 'Top Right', framing: 'Board close-up', action: 'Step 2: he draws three serious arrows pointing to a glowing pyramid.', caption: 'Step 2: Ek serious pyramid banao.' },
        { frame: 4, position: 'Bottom Left', framing: 'Over-shoulder shot', action: 'Step 3: he spins his CRT monitor around — showing a search tab asking what it means.', caption: 'Step 3: Google khol ke padh lo.' },
        { frame: 5, position: 'Bottom Center', framing: 'Audience wide shot', action: 'Twenty students stare stiffly at the screen, then start taking serious notes anyway.', caption: 'Sabne bina soche note kar liya.' },
        { frame: 6, position: 'Bottom Right', framing: 'Direct lens close-up', action: 'Sigma Tauji closes the ₹50 notebook and holds up a QR code for his ₹999 masterclass.', caption: 'Masterclass link bio mein hai.' },
      ],
      shots: [
        { shot: 1, visual: `Flat classroom shot of Sigma Tauji tapping "${label.toUpperCase()}" on a whiteboard.`, sfx: 'Sharp marker tap', hindi: `तीन स्टेप में ${label} समझो।` },
        { shot: 2, visual: 'Close-up of a ₹50 notebook and blue pen snapping neatly onto a desk.', sfx: 'Crisp paper slap', hindi: 'स्टेप वन: पचास की कॉपी लो।' },
        { shot: 3, visual: 'Hard cut to Sigma Tauji drawing three dramatic arrows into a giant pyramid.', sfx: 'Fast squeaky marker lines', hindi: 'स्टेप टू: बड़ा पिरामिड बनाओ।' },
        { shot: 4, visual: 'Smash-cut spinning his CRT monitor to show an open search tab asking what it means.', sfx: 'Retro mouse click', hindi: 'स्टेप थ्री: गूगल करके देख लो।' },
        { shot: 5, visual: 'Wide cut to twenty boxy students frantically scribbling notes with zero doubt.', sfx: 'Chorus of fast pencils', hindi: 'सबने गंभीरता से नोट कर लिया।' },
        { shot: 6, visual: 'Direct lens close-up of Sigma Tauji holding up a ₹999 masterclass QR code.', sfx: 'Chime + bass hit, hard cut to black', hindi: 'मास्टरक्लास का लिंक बायो में है।' },
      ],
    });
  }

  return sanitizeTopic({
    id: `trend_${slug}_${batchNonce}`,
    title: `DOLAND BHAU HALTS SUMMIT OVER ${label.toUpperCase()}`,
    angle: 'petty-spiral',
    brand: 'Doland Bhau',
    trendHook: `Status Reversal: ${label}`,
    pitch: `Doland Bhau and twenty world leaders halt a major treaty to debate ${label} for 6 hours — only to realize nobody in the room can spell it without autocorrect.`,
    frames: [
      { frame: 1, position: 'Top Left', framing: 'Summit hall wide shot', action: `Doland Bhau slams a wooden gavel as "${label.toUpperCase()}" flashes on a 40-foot screen.`, caption: `Summit mein ${label} mudda bana.` },
      { frame: 2, position: 'Top Center', framing: 'Delegate close-up', action: 'First diplomat adjusts his earpiece and confidently pronounces it completely wrong.', caption: 'Pehle neta ne galat bola.' },
      { frame: 3, position: 'Top Right', framing: 'Table pan shot', action: 'Two more leaders interrupt with two even wilder pronunciations as tension rises.', caption: 'Sabne alag-alag naam bola.' },
      { frame: 4, position: 'Bottom Left', framing: 'Wide hall shot', action: 'Translators panic inside glass booths while red lights blink across the summit desk.', caption: 'Translators ka system hang hua.' },
      { frame: 5, position: 'Bottom Center', framing: 'Podium close-up', action: 'Doland Bhau pulls out a ₹20 pocket dictionary and flips through it in dead silence.', caption: '20 rupaye ki dictionary nikali.' },
      { frame: 6, position: 'Bottom Right', framing: 'Deadpan wide shot', action: 'All twenty leaders silently vote to rename the topic "ITEM #4" and adjourn for samosas.', caption: 'Naam badal ke "Item 4" rakha.' },
    ],
    shots: [
      { shot: 1, visual: `Grand summit shot as Doland Bhau points at "${label.toUpperCase()}" on a 40-foot screen.`, sfx: 'Heavy wooden gavel bang', hindi: `समिट में ${label} पर बहस छिड़ी।` },
      { shot: 2, visual: 'Close-up of a diplomat adjusting his earpiece and mispronouncing it loudly.', sfx: 'Microphone feedback chirp', hindi: 'पहले नेता ने ग़लत नाम बोला।' },
      { shot: 3, visual: 'Fast cut between two leaders arguing over completely wrong syllables.', sfx: 'Overlapping stern murmurs', hindi: 'तीन देशों में नाम पे झगड़ा हुआ।' },
      { shot: 4, visual: 'Wide cut to translators freezing inside glass booths under blinking red lamps.', sfx: 'Retro error buzzer', hindi: 'सारे ट्रांसलेटर हैंग हो गए।' },
      { shot: 5, visual: 'Close-up of Doland Bhau flipping a tiny ₹20 dictionary in awkward silence.', sfx: 'Rapid paper page flips', hindi: 'बीस की डिक्शनरी निकाली गई।' },
      { shot: 6, visual: 'Direct wide shot of twenty leaders voting to rename it "ITEM 4" and stand for lunch.', sfx: 'Gavel tap + bass drop, hard cut to black', hindi: 'नाम बदलकर आइटम चार रख दिया।' },
    ],
  });
}
