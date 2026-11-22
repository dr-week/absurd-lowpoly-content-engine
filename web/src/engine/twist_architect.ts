import type { GeneratedPrompts, TopicOption } from '../types';

export interface TwistBlueprint {
  id: string;
  label: string;
  assumedTrack: string;
  subversionSnap: string;
  directive: string;
}

export const TWIST_BLUEPRINTS: readonly TwistBlueprint[] = [
  {
    id: 'zoom-out-flip',
    label: 'Zoom-Out Context Flip',
    assumedTrack: 'Life-or-death crisis in tight close-ups',
    subversionSnap: 'Shot 5 zooms wide to reveal a tiny mundane Indian task',
    directive: 'Expectation Subversion: Keep Shots 1-4 in tense tight close-ups hiding full context, then snap wide in Shot 5 to reveal the hilariously tiny real situation.',
  },
  {
    id: 'false-genre-hijack',
    label: 'False-Genre Hijack',
    assumedTrack: 'Serious horror / thriller / emotional drama',
    subversionSnap: 'Shot 4 shatters the serious genre into deadpan street comedy',
    directive: 'Expectation Subversion: Play Shots 1-3 100% straight like a serious movie trailer, then shatter the genre in Shot 4 with deadpan everyday comedy.',
  },
  {
    id: 'double-twist',
    label: 'Double-Twist (False Ending)',
    assumedTrack: 'Viewer predicts the obvious joke in Shot 4',
    subversionSnap: 'Shot 6 pulls the rug out a second time for instant rewatch',
    directive: 'Expectation Subversion: Deliver the expected joke in Shot 4 so the audience relaxes, then hit a sharper second reversal in Shot 6.',
  },
  {
    id: 'audio-visual-clash',
    label: 'Audio-Visual Contradiction',
    assumedTrack: 'Epic Hollywood spy/military voiceover',
    subversionSnap: 'Visuals calmly expose a petty midnight household operation',
    directive: 'Expectation Subversion: Pair dramatic tactical voiceover with deadpan ordinary household visuals so the contrast drives every beat.',
  },
  {
    id: 'intimidation-switch',
    label: 'Intimidation Bait-and-Switch',
    assumedTrack: 'Slow-mo street fight / tense confrontation',
    subversionSnap: 'Resolves into ultra-polite mundane exchange',
    directive: 'Expectation Subversion: Build maximum intimidating slow-mo tension in Shots 1-3, then snap into ultra-polite everyday behavior in Shots 4-6.',
  },
  {
    id: 'brick-joke-loop',
    label: 'Shot 1 -> Shot 6 Callback Loop',
    assumedTrack: 'Background prop in Shot 1 looks harmless',
    subversionSnap: 'That exact Shot 1 prop becomes the Shot 6 punchline',
    directive: 'Expectation Subversion: Plant one casual detail in Shot 1 that looks like background clutter and pay it off as the final Shot 6 twist.',
  },
  {
    id: 'anticipation-hook',
    label: '0.5s Physical Anticipation Hook',
    assumedTrack: 'Object/vehicle is 1 millimeter from disaster or falling',
    subversionSnap: 'Holds breath for 4 shots then resolves with an impossible deadpan catch',
    directive: 'Expectation Subversion: Open Frame 1 on an unmistakable physical disaster about to happen (tilting tower, 1mm reverse, falling object) so viewers cannot scroll until resolution.',
  },
  {
    id: 'trojan-chaos-reveal',
    label: 'Trojan-Horse Chaos Reveal',
    assumedTrack: 'Pure unscripted crash / prank / stunt with zero ad radar',
    subversionSnap: 'Impact beat match-cuts straight into an unexpected deadpan swag/product flex',
    directive: 'Expectation Subversion: Earn 100% attention with raw stunt/crash chaos in Shots 1-3, then match-cut at peak impact into an unexpected deadpan product or swag reveal.',
  },
];

export const TWIST_ARCHITECT_GUIDE =
  'EXPECTATION-SUBVERSION BLUEPRINTS (pick 1 per story): ' +
  '1) Zoom-Out Context Flip; 2) False-Genre Hijack; 3) Double-Twist False Ending; ' +
  '4) Audio-Visual Contradiction; 5) Intimidation Bait-and-Switch; ' +
  '6) 0.5s Physical Anticipation Hook (about-to-crash/drop tension); ' +
  '7) Trojan-Horse Chaos Reveal (earn attention with stunt/crash -> unexpected deadpan flex at end).';

const TWIST_LINE_RE = /Expectation Subversion:[^.]+\./;

export function detectTwistBlueprint(topic: TopicOption): TwistBlueprint {
  const txt = `${topic.title} ${topic.pitch} ${topic.trendHook}`.toLowerCase();
  if (/trojan|hoodie|mattress|demo|flex/.test(txt)) return TWIST_BLUEPRINTS[7];
  if (/tilting|millimeter|1mm|40 chai|falling|anticipation/.test(txt)) return TWIST_BLUEPRINTS[6];
  if (/zoom|close-up|maggi|noodle|tweezer|macro/.test(txt)) return TWIST_BLUEPRINTS[0];
  if (/horror|rain|violin|romantic|ghost|trailer/.test(txt)) return TWIST_BLUEPRINTS[1];
  if (/double|second|bill|robber|biscuit|clove|laung/.test(txt)) return TWIST_BLUEPRINTS[2];
  if (/midnight|fridge|spy|stealth|gulab|mission/.test(txt)) return TWIST_BLUEPRINTS[3];
  if (/alley|standoff|fight|stare|tiffin|swap/.test(txt)) return TWIST_BLUEPRINTS[4];
  return TWIST_BLUEPRINTS[5];
}

export function cycleTwistBlueprint(
  prompts: GeneratedPrompts,
  step: number,
): { prompts: GeneratedPrompts; label: string } {
  const bp = TWIST_BLUEPRINTS[Math.abs(step) % TWIST_BLUEPRINTS.length];
  const inject = (text: string): string => {
    if (TWIST_LINE_RE.test(text)) return text.replace(TWIST_LINE_RE, bp.directive);
    return text.replace(/(Strictly NO 2D cartoon art)/, `${bp.directive} $1`);
  };
  return {
    label: bp.label,
    prompts: {
      ...prompts,
      storyboardPrompt: inject(prompts.storyboardPrompt),
      videoPrompt: inject(prompts.videoPrompt),
    },
  };
}
