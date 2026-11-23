import type { GeneratedPrompts, ScoredTopic } from '../types';

export interface ReelOverlayPreset {
  id: string;
  label: string;
  topText: string;
  editorNote: string;
  promptDirective: string;
}

const VIEWER_HANDLES = ['@rohan_watches', '@chai_critic99', '@late_night_scroll', '@desireel_fan', '@midnight_viewer'] as const;

export function buildReelOverlays(topic: ScoredTopic): readonly ReelOverlayPreset[] {
  const hero = topic.brand || 'this guy';
  const cleanTitle = topic.title.replace(/^(?:PART\s*\d+|CROSSOVER):\s*/i, '').trim();
  const shortTopic = cleanTitle.length > 44 ? `${cleanTitle.slice(0, 41).trim()}...` : cleanTitle;
  const handle = VIEWER_HANDLES[topic.title.length % VIEWER_HANDLES.length];

  return [
    {
      id: 'reply-comment',
      label: 'Reply-to-Comment Bubble',
      topText: `Reply to ${handle}'s comment: "Show what happens when ${hero} tries this in real life"`,
      editorNote: 'Place white rounded comment-reply sticker in top-center safe zone for the first 3 seconds, then pop it off.',
      promptDirective: `Native Social Overlay: crisp rounded white "Reply to ${handle}" comment bubble pinned cleanly in the upper-center safe zone for Shot 1 only, never blocking faces.`,
    },
    {
      id: 'ig-hook-pill',
      label: 'Native Story Hook Pill',
      topText: `Wait till the last 2 seconds: ${shortTopic.toLowerCase()}`,
      editorNote: 'Use native Reels Classic/Modern font inside a clean white rounded pill at upper-center (above character head).',
      promptDirective: `Native Social Overlay: clean white rounded text pill in bold modern sans-serif at the top-center safe zone reading "WAIT FOR THE END", authentic mobile-editor look.`,
    },
    {
      id: 'pinned-comment-card',
      label: 'Floating Comment Pop-In',
      topText: `${handle} · 2m: "Bro really thought that plan would work"`,
      editorNote: 'Pop a translucent dark-glass comment card in the upper-left during Shot 3 silent reaction beat.',
      promptDirective: `Native Social Overlay: subtle translucent dark-glass viewer comment card popping briefly in the upper-left corner during Shot 3 reaction, crisp readable sans-serif text.`,
    },
    {
      id: 'poll-sticker',
      label: '2-Option Debate Poll Sticker',
      topText: `Would you stay calm like ${hero}?  [ YES ]  |  [ NO WAY ]`,
      editorNote: 'Add native 2-option Poll sticker in the lower-middle safe zone (above caption area) to boost comments & votes.',
      promptDirective: `Native Social Overlay: clean white 2-option social poll sticker box in the lower-left safe zone ("STAY CALM?" — YES / NO WAY) styled like a genuine mobile story edit.`,
    },
    {
      id: 'pov-caption-bar',
      label: 'Classic POV Text Strip',
      topText: `POV: ${shortTopic.toLowerCase()}`,
      editorNote: 'Center bold white text with thin dark drop-shadow in the upper third; stays on screen for the first 2 shots.',
      promptDirective: `Native Social Overlay: crisp centered white bold sans-serif "POV:" text with soft dark drop-shadow in the upper third safe zone, authentic creator reel edit style.`,
    },
    {
      id: 'karaoke-captions',
      label: 'Bold 2-Word Pop Subtitles',
      topText: 'Synced 2–3 word bold centered subtitles on Shots 1, 2 & 5',
      editorNote: 'Turn on Auto-Captions (bold white + yellow active word highlight) in lower-center safe zone—zero text during silent Shots 3–4.',
      promptDirective: `Native Social Overlay: punchy 2-word bold white centered subtitles with subtle black outline synced tightly to the 3 spoken shots only, zero text on silent Shots 3–4.`,
    },
    {
      id: 'location-timestamp',
      label: 'Story Location + Time Tag',
      topText: `LOCAL STREET · 9:03 AM · PART 1`,
      editorNote: 'Drop a frosted-glass translucent location/time sticker in top-left corner for raw candid reel authenticity.',
      promptDirective: `Native Social Overlay: small frosted-glass translucent location-and-time pill sticker ("9:03 AM · LIVE") tucked neatly in the top-left corner for candid reel realism.`,
    },
  ];
}

const OVERLAY_LINE_RE = /Native Social Overlay:[^.]+\./;

export function cycleReelOverlay(
  prompts: GeneratedPrompts,
  topic: ScoredTopic | undefined,
  step: number,
): { prompts: GeneratedPrompts; label: string } {
  const fallbackTopic = topic ?? ({
    id: prompts.topicId, title: prompts.topicTitle, angle: prompts.angle, brand: prompts.brand,
    trendHook: '', pitch: '', viralScore: 90, brandHeat: 90, hookCategory: 'iconic', situationCategory: 'ego', visualStyle: 'ps1-1998',
  } as ScoredTopic);
  const presets = buildReelOverlays(fallbackTopic);
  const pick = presets[Math.abs(step) % presets.length];
  const nextVid = OVERLAY_LINE_RE.test(prompts.videoPrompt)
    ? prompts.videoPrompt.replace(OVERLAY_LINE_RE, pick.promptDirective)
    : prompts.videoPrompt.replace(/\n\n/, ` ${pick.promptDirective}\n\n`);
  return { label: pick.label, prompts: { ...prompts, videoPrompt: nextVid } };
}
