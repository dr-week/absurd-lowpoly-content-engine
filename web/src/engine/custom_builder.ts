import type { HookCategory, ScoredTopic, StoryboardFrameData, TopicOption, VideoShotData } from '../types';
import { sanitizeCopyrightNames } from './alias_sanitizer';
import { classifyHook, classifySituation } from './taxonomy';

const HOOK_TO_ANGLE: Record<HookCategory, string> = {
  iconic: 'over-engineer',
  build: 'over-engineer',
  origin: 'fake-origin',
  science: 'weird-science',
  tutorial: 'fake-tutorial',
  news: 'breaking-news',
};

export function expandCustomIdeaLocally(topic: TopicOption): { frames: StoryboardFrameData[]; shots: VideoShotData[] } {
  const lead = topic.brand || 'Protagonist';
  const idea = topic.pitch.replace(/\.$/, '');
  return {
    frames: [
      { frame: 1, position: 'Top Left', framing: 'Flat wide establishing shot', action: `${lead} stands stiffly as the premise begins: ${idea}.`, caption: `${lead} ne naya plan shuru kiya.` },
      { frame: 2, position: 'Top Center', framing: 'Desk close-up', action: `Instead of the simple ₹10 fix, ${lead} unrolls a 40-foot blueprint covered in red arrows.`, caption: 'Simple rasta chhoda, mega plan banaya.' },
      { frame: 3, position: 'Top Right', framing: 'Assembly wide shot', action: `Ten boxy assistants bolt glowing gauges, cables, and steel struts around the scene.`, caption: 'Level 999 upgrade lag gaya.' },
      { frame: 4, position: 'Bottom Left', framing: 'Low-angle chaos shot', action: `The moment it powers on, overhead lights flicker and every chair slides sideways calmly.`, caption: 'Switch dabate hi pura room hila.' },
      { frame: 5, position: 'Bottom Center', framing: 'Extreme close-up', action: `Smoke clears; the original tiny problem sits completely untouched in the center.`, caption: 'Asli dikkat abhi bhi wahin thi.' },
      { frame: 6, position: 'Bottom Right', framing: 'Deadpan direct lens shot', action: `${lead} nods with complete pride and hands over a ₹500 invoice anyway.`, caption: 'Agle update mein fix hoga.' },
    ],
    shots: [
      { shot: 1, visual: `Static wide shot introducing ${lead}: ${idea}.`, sfx: 'Quiet ambient room hum', hindi: `${lead} ने नया प्लान शुरू किया।` },
      { shot: 2, visual: `Hard cut to ${lead} snapping open a giant glowing schematic on a steel table.`, sfx: 'Crisp paper snap and retro chime', hindi: 'सीधा चालीस फुट का प्लान खोला।' },
      { shot: 3, visual: 'Fast cut to workers bolting blinking radars and steel pipes at full speed.', sfx: 'Rapid wrench clicks and sparks', hindi: 'लेवल नौ सौ निन्यानवे अपग्रेड हुआ।' },
      { shot: 4, visual: 'Low worm-eye shot as lights dim and the floor tilts sharply sideways.', sfx: 'Deep turbine roar and siren', hindi: 'स्विच दबाते ही पूरा कमरा हिला।' },
      { shot: 5, visual: 'Smash-cut through pixelated smoke showing the original tiny issue untouched.', sfx: 'Awkward dry cricket chirp', hindi: 'असली दिक्कत वहीं की वहीं थी।' },
      { shot: 6, visual: `Deadpan lens close-up of ${lead} nodding proudly with a tiny invoice.`, sfx: 'Bass drop, instant hard cut to black', hindi: 'बोले, अगले अपडेट में फिक्स होगा।' },
    ],
  };
}

/**
 * Turns any user-written 1-line idea into a structured ScoredTopic ready for
 * Live AI or instant 6-frame/6-shot prompt generation + Viral Pack + Part 2 sequels.
 */
export function buildCustomEpisode(rawIdea: string, hookChoice: HookCategory | 'all' = 'all'): ScoredTopic {
  const clean = sanitizeCopyrightNames(rawIdea.trim().replace(/\s+/g, ' '));
  const words = clean.split(' ');
  const title = words.slice(0, 8).join(' ').toUpperCase();
  const brand = words.slice(0, 2).join(' ').replace(/[^A-Za-z0-9\s'-]/g, '') || 'Custom';
  const stamp = Date.now().toString(36).slice(-5);

  const base: TopicOption = {
    id: `custom_${stamp}`,
    title,
    angle: hookChoice !== 'all' ? HOOK_TO_ANGLE[hookChoice] : 'over-engineer',
    brand,
    trendHook: 'Custom Idea',
    pitch: clean,
  };

  return {
    ...base,
    brandHeat: 94,
    viralScore: 95,
    hookCategory: hookChoice !== 'all' ? hookChoice : classifyHook(base),
    situationCategory: classifySituation(base),
  };
}
