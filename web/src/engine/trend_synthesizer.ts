import { LIVE_ARCHETYPES } from '../data/live_archetypes';
import type { TopicOption } from '../types';
import { cryptoRng, cryptoShuffle } from './randomizer';

/**
 * Multi-template Live Trend Synthesizer:
 * Rotates across 3 structurally distinct comedy mechanisms (Broken Assumption,
 * Rule of Three, Status Reversal) whenever a user clicks an unmatched live trend chip.
 */
export function synthesizeTrendCard(query: string, batchNonce: number): TopicOption {
  const label = query.trim().slice(0, 24);
  const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, '_');
  const mode = Math.abs(batchNonce) % 3;

  if (mode === 0) {
    return {
      id: `trend_${slug}_${batchNonce}`,
      title: `BREAKING: ${label.toUpperCase()} OVER-ENGINEERED`,
      angle: 'breaking-news',
      brand: label,
      trendHook: `Live Trend: ${label}`,
      pitch: `Engineers build a 40-foot orbital rig to analyze "${label}"; after 3 hours of glowing radars, the printer spits out a single word: "MAYBE".`,
      frames: [
        { frame: 1, position: 'Top Left', framing: 'Broadcast studio shot', action: `Anchor unveils a breaking alert on "${label}" behind a flashing red ticker.`, caption: `${label} pe breaking alert aayi.` },
        { frame: 2, position: 'Top Center', framing: 'Lab wide shot', action: `Ten engineers bolt glowing radars and steel pipes onto one tiny monitor showing "${label}".`, caption: '40 foot ka analyzer bana diya.' },
        { frame: 3, position: 'Top Right', framing: 'Gauge close-up', action: 'Pressure dials hit red while cooling fans roar across the concrete lab floor.', caption: 'System full overload pe chala.' },
        { frame: 4, position: 'Bottom Left', framing: 'Wide control room', action: 'Overhead lights dim as an old dot-matrix printer spits out one single sheet.', caption: '3 ghante baad report nikli.' },
        { frame: 5, position: 'Bottom Center', framing: 'Paper close-up', action: `The official printout reads in bold bitmap font: "${label.toUpperCase()}: MAYBE".`, caption: 'Report mein sirf "shayad" likha.' },
        { frame: 6, position: 'Bottom Right', framing: 'Studio close-up', action: 'Anchor folds the paper neatly and nods with complete journalistic pride.', caption: 'Update agle bulletin mein denge.' },
      ],
      shots: [
        { shot: 1, visual: `Halogen broadcast shot of anchor announcing breaking news on "${label}".`, sfx: 'Urgent 1998 TV news sting', hindi: `ब्रेकिंग न्यूज़ में ${label} छाया रहा।` },
        { shot: 2, visual: 'Hard cut to engineers welding giant radar dishes around one tiny monitor.', sfx: 'Wrench ratchets and hydraulic hiss', hindi: 'चालीस फुट का एनालाइज़र बना दिया।' },
        { shot: 3, visual: 'Close-up of gauges spinning into red as overhead lamps flicker.', sfx: 'Rising turbine hum', hindi: 'पूरा सिस्टम ओवरलोड हो गया।' },
        { shot: 4, visual: 'Wide control-room cut as an old printer spits out one single sheet.', sfx: 'Noisy dot-matrix printer buzz', hindi: 'तीन घंटे बाद एक पन्ना निकला।' },
        { shot: 5, visual: `Smash-cut to printout reading "${label.toUpperCase()}: MAYBE" in crisp bitmap font.`, sfx: 'Dry paper snap', hindi: 'रिपोर्ट में सिर्फ़ शायद लिखा था।' },
        { shot: 6, visual: 'Direct lens shot of anchor folding the paper with solemn pride.', sfx: 'News sting + bass drop, hard cut to black', hindi: 'अपडेट अगले बुलेटिन में देंगे।' },
      ],
    };
  }

  if (mode === 1) {
    return {
      id: `trend_${slug}_${batchNonce}`,
      title: `3-STEP EXPERT GUIDE TO ${label.toUpperCase()}`,
      angle: 'fake-tutorial',
      brand: label,
      trendHook: `Rule of Three: ${label}`,
      pitch: `A deadpan guru teaches "${label}" in 3 steps: Step 1 buy a ₹50 notebook, Step 2 draw a pyramid, Step 3 quietly admit you also googled "${label}" five minutes ago.`,
      frames: [
        { frame: 1, position: 'Top Left', framing: 'Whiteboard studio shot', action: `Deadpan guru in glasses taps a whiteboard reading "MASTER ${label.toUpperCase()} IN 3 STEPS".`, caption: `Aaj ${label} 3 step mein seekho.` },
        { frame: 2, position: 'Top Center', framing: 'Desk close-up', action: 'Step 1: he places a crisp ₹50 notebook and blue pen symmetrically on the desk.', caption: 'Step 1: 50 rupaye ki copy lo.' },
        { frame: 3, position: 'Top Right', framing: 'Board close-up', action: 'Step 2: he draws three serious arrows pointing to a glowing triangle.', caption: 'Step 2: Ek serious pyramid banao.' },
        { frame: 4, position: 'Bottom Left', framing: 'Over-shoulder shot', action: 'Step 3: he spins his CRT monitor around — it shows a fresh search tab asking what it means.', caption: 'Step 3: Google khol ke padh lo.' },
        { frame: 5, position: 'Bottom Center', framing: 'Audience wide shot', action: 'Twenty students stare stiffly at the screen, then start taking serious notes anyway.', caption: 'Sabne bina soche note kar liya.' },
        { frame: 6, position: 'Bottom Right', framing: 'Direct lens close-up', action: 'Guru closes the ₹50 notebook and holds up a QR code for his ₹999 masterclass.', caption: 'Masterclass link bio mein hai.' },
      ],
      shots: [
        { shot: 1, visual: `Flat classroom shot of a guru tapping "${label.toUpperCase()}" on a whiteboard.`, sfx: 'Sharp marker tap', hindi: `तीन स्टेप में ${label} समझो।` },
        { shot: 2, visual: 'Close-up of a ₹50 notebook and blue pen snapping neatly onto a desk.', sfx: 'Crisp paper slap', hindi: 'स्टेप वन: पचास की कॉपी लो।' },
        { shot: 3, visual: 'Hard cut to the guru drawing three dramatic arrows into a giant pyramid.', sfx: 'Fast squeaky marker lines', hindi: 'स्टेप टू: बड़ा पिरामिड बनाओ।' },
        { shot: 4, visual: 'Smash-cut spinning his CRT monitor to show an open search tab asking what it means.', sfx: 'Retro dial-up mouse click', hindi: 'स्टेप थ्री: गूगल करके देख लो।' },
        { shot: 5, visual: 'Wide cut to twenty boxy students frantically scribbling notes with zero doubt.', sfx: 'Chorus of fast pencils', hindi: 'सबने गंभीरता से नोट कर लिया।' },
        { shot: 6, visual: 'Direct lens close-up of the guru holding up a ₹999 masterclass QR code.', sfx: 'Chime + bass hit, hard cut to black', hindi: 'मास्टरक्लास का लिंक बायो में है।' },
      ],
    };
  }

  return {
    id: `trend_${slug}_${batchNonce}`,
    title: `GLOBAL SUMMIT HALTS OVER ${label.toUpperCase()}`,
    angle: 'petty-spiral',
    brand: label,
    trendHook: `Status Reversal: ${label}`,
    pitch: `Twenty world leaders halt a major treaty to debate "${label}" for 6 hours — only to realize nobody in the room can pronounce it correctly.`,
    frames: [
      { frame: 1, position: 'Top Left', framing: 'Summit hall wide shot', action: `Chairperson slams a wooden gavel and projects "${label.toUpperCase()}" onto a 40-foot screen.`, caption: `Summit mein ${label} mudda bana.` },
      { frame: 2, position: 'Top Center', framing: 'Delegate close-up', action: 'First diplomat adjusts his earpiece and confidently pronounces it completely wrong.', caption: 'Pehle neta ne galat bola.' },
      { frame: 3, position: 'Top Right', framing: 'Table pan shot', action: 'Two more leaders interrupt with two even wilder pronunciations as tension rises.', caption: 'Sabne alag-alag naam bola.' },
      { frame: 4, position: 'Bottom Left', framing: 'Wide hall shot', action: 'Translators panic inside glass booths while red lights blink across the summit desk.', caption: 'Translators ka system hang hua.' },
      { frame: 5, position: 'Bottom Center', framing: 'Podium close-up', action: 'Chairperson pulls out a ₹20 pocket dictionary and flips through it in dead silence.', caption: '20 rupaye ki dictionary nikali.' },
      { frame: 6, position: 'Bottom Right', framing: 'Deadpan wide shot', action: 'All twenty leaders silently vote to rename the topic "ITEM #4" and adjourn for lunch.', caption: 'Naam badal ke "Item 4" rakha.' },
    ],
    shots: [
      { shot: 1, visual: `Grand summit shot as "${label.toUpperCase()}" flashes across a 40-foot screen.`, sfx: 'Heavy wooden gavel bang', hindi: `समिट में ${label} पर बहस छिड़ी।` },
      { shot: 2, visual: 'Close-up of a diplomat adjusting his earpiece and mispronouncing it loudly.', sfx: 'Microphone feedback chirp', hindi: 'पहले नेता ने ग़लत नाम बोला।' },
      { shot: 3, visual: 'Fast cut between two leaders arguing over completely wrong syllables.', sfx: 'Overlapping stern murmurs', hindi: 'तीन देशों में नाम पे झगड़ा हुआ।' },
      { shot: 4, visual: 'Wide cut to translators freezing inside glass booths under blinking red lamps.', sfx: 'Retro error buzzer', hindi: 'सारे ट्रांसलेटर हैंग हो गए।' },
      { shot: 5, visual: 'Close-up of the chairperson flipping a tiny ₹20 dictionary in awkward silence.', sfx: 'Rapid paper page flips', hindi: 'बीस की डिक्शनरी निकाली गई।' },
      { shot: 6, visual: 'Direct wide shot of twenty leaders voting to rename it "ITEM 4" and stand for lunch.', sfx: 'Gavel tap + bass drop, hard cut to black', hindi: 'नाम बदलकर आइटम चार रख दिया।' },
    ],
  };
}

const USED_ARCH_KEY = 'absurd_studio_used_arch_v1';

function loadUsedArchetypes(): Set<string> {
  if (typeof localStorage === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(USED_ARCH_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? (parsed as string[]) : []);
  } catch {
    return new Set();
  }
}

function saveUsedArchetypes(used: Set<string>): void {
  if (typeof localStorage !== 'undefined') localStorage.setItem(USED_ARCH_KEY, JSON.stringify(Array.from(used)));
}

function cleanSubject(headline: string): string {
  const words = headline.replace(/\([^)]*\)/g, '').replace(/—.*/g, '').replace(/[^A-Za-z0-9\s'-]/g, ' ').trim().split(/\s+/).filter((w) => w.length > 1);
  return words.slice(0, 3).join(' ').toUpperCase() || 'WORLD NEWS';
}

export function synthesizeTopicsFromHeadlines(
  headlines: Array<{ title: string; source: string }>,
  batchNonce: number,
  externalUsedArch?: Set<string>,
): TopicOption[] {
  const stamp = Date.now().toString(36);
  const usedArch = externalUsedArch ?? loadUsedArchetypes();
  let available = cryptoShuffle(LIVE_ARCHETYPES.filter((a) => !usedArch.has(a.id)), cryptoRng);
  if (available.length < 8) {
    usedArch.clear();
    available = cryptoShuffle(LIVE_ARCHETYPES, cryptoRng);
  }

  const picked = available.slice(0, Math.min(8, headlines.length));
  for (const a of picked) usedArch.add(a.id);
  if (!externalUsedArch) saveUsedArchetypes(usedArch);

  return picked.map((arch, idx) => {
    const h = headlines[idx];
    const subj = cleanSubject(h.title);
    const synth = synthesizeTrendCard(subj, batchNonce + idx);
    return {
      ...synth,
      id: `live_${stamp}_${arch.id}_${idx}`,
      title: arch.makeTitle(subj),
      angle: arch.angle,
      brand: h.source,
      trendHook: `Live: ${h.source}`,
      pitch: arch.makePitch(subj, h.title),
    };
  });
}
