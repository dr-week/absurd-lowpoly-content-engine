import type { HookCategory, ScoredTopic, StoryboardFrameData, TopicOption, VideoShotData } from '../types';
import { sanitizeCopyrightNames } from './alias_sanitizer';
import { classifyHook, classifySituation } from './taxonomy';
import { assignDiverseVisualStyles } from './visual_styles';

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
  const mode = topic.title.length % 3;

  if (mode === 1) {
    return {
      frames: [
        { frame: 1, position: 'Top Left', framing: 'Wide cold-open shot', action: `${lead} walks in with full high-status swagger: ${idea}.`, caption: 'Full attitude mein entry!' },
        { frame: 2, position: 'Top Center', framing: 'Counter two-shot', action: `A completely unbothered counterpart barely glances up while ${lead} demands VIP treatment.`, caption: 'Saamne wala bilkul chill tha.' },
        { frame: 3, position: 'Top Right', framing: 'Action escalation shot', action: `${lead} dramatically doubles down, pulling out a shiny badge and pointing at the clock.`, caption: 'VIP card nikaal diya!' },
        { frame: 4, position: 'Bottom Left', framing: 'Silent reveal shot', action: `The counterpart calmly points to a tiny handwritten rule taped right beside ${lead}’s nose.`, caption: 'Chhota board dikhaya.' },
        { frame: 5, position: 'Bottom Center', framing: 'Tight reaction close-up', action: `${lead}’s confident smile freezes mid-frame as everyone behind them stares silently.`, caption: 'Hawa nikal gayi.' },
        { frame: 6, position: 'Bottom Right', framing: 'Deadpan final shot', action: `${lead} quietly pays double and backs out with zero eye contact.`, caption: 'Chupchaap double de diya.' },
      ],
      shots: [
        { shot: 1, visual: `Cold-open wide shot of ${lead} strutting in: ${idea}.`, sfx: 'Confident shoe stomp', hindi: 'आज काम तुरंत होना चाहिए!' },
        { shot: 2, visual: `Deadpan counterpart barely looks up as ${lead} waves a shiny VIP pass.`, sfx: 'Flat counter tap', hindi: 'नियम सबके लिए बराबर है।' },
        { shot: 3, visual: `Counterpart silently points to a tiny taped sign reading "DOUBLE CHARGE FOR ATTITUDE".`, sfx: 'Crisp paper tap', hindi: 'बोर्ड देखो।' },
        { shot: 4, visual: `Tight close-up of ${lead} blinking slowly in stunned silence as the queue watches.`, sfx: 'Awkward dry room hum', hindi: 'सन्नाटा।' },
        { shot: 5, visual: `${lead} quietly slides double cash across the counter and walks backward out the door.`, sfx: 'Cash slap, instant hard cut to black', hindi: 'माफ़ करना भाई, खुला रखो।' },
      ],
    };
  }

  return {
    frames: [
      { frame: 1, position: 'Top Left', framing: 'Flat wide establishing shot', action: `${lead} faces an absurd moment mid-action: ${idea}.`, caption: `${lead} ne naya plan shuru kiya.` },
      { frame: 2, position: 'Top Center', framing: 'Close-up escalation', action: `Instead of the ₹10 obvious fix, ${lead} deploys an absurdly over-engineered contraption.`, caption: 'Simple chhoda, mega plan banaya.' },
      { frame: 3, position: 'Top Right', framing: 'Peak chaos shot', action: `Sparks fly and nearby objects float sideways the instant ${lead} flips the switch.`, caption: 'Switch dabate hi chaos!' },
      { frame: 4, position: 'Bottom Left', framing: 'Silent reveal shot', action: `Smoke clears—the original tiny problem sits completely untouched in the center.`, caption: 'Asli dikkat wahin thi.' },
      { frame: 5, position: 'Bottom Center', framing: 'Bystander beat', action: `A sleepy bystander solves the whole thing in one effortless casual tap.`, caption: 'Ek tap mein solve hua.' },
      { frame: 6, position: 'Bottom Right', framing: 'Deadpan lens close-up', action: `${lead} nods proudly anyway and hands over a ₹500 bill.`, caption: 'Maine pehle dheela kiya tha.' },
    ],
    shots: [
      { shot: 1, visual: `Static cold-open shot introducing ${lead}: ${idea}.`, sfx: 'Quiet ambient room hum', hindi: 'आज यह मामला खत्म होगा!' },
      { shot: 2, visual: `Hard cut to ${lead} flipping a glowing switch on an absurdly huge contraption.`, sfx: 'Turbine hum and retro chime', hindi: 'सीधा मेगा प्लान चालू किया।' },
      { shot: 3, visual: 'Smoke blasts across the room while the original tiny problem stays completely untouched.', sfx: 'Poof and dry squeak', hindi: 'कुछ नहीं बदला।' },
      { shot: 4, visual: 'A sleepy bystander walks past and fixes it effortlessly with one casual finger tap.', sfx: 'Single crisp click', hindi: 'हो गया।' },
      { shot: 5, visual: `Deadpan close-up of ${lead} nodding proudly with zero shame.`, sfx: 'Cricket chirp, instant hard cut to black', hindi: 'मैंने पहले ढीला किया था।' },
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

  const styled = assignDiverseVisualStyles([base])[0];
  return {
    ...styled,
    brandHeat: 94,
    viralScore: 95,
    hookCategory: hookChoice !== 'all' ? hookChoice : classifyHook(base),
    situationCategory: classifySituation(base),
  };
}
