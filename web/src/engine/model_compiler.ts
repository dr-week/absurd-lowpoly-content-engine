import type { GeneratedPrompts, ScoredTopic, TargetVideoModel } from '../types';
import { detectCharacterLock } from './alias_sanitizer';
import { getVisualStyleMeta } from './visual_styles';

export const TARGET_MODEL_OPTIONS: readonly { id: TargetVideoModel; label: string; hint: string }[] = [
  { id: 'veo-3-flow', label: 'Veo 3.1 / Flow (Native Audio)', hint: '5-shot native audio + lip-sync + Voice Cast Bible' },
  { id: 'nano-banana', label: 'Nano Banana (Character Sheet)', hint: '1:1 forensic character consistency anchor sheet' },
  { id: 'sora-2', label: 'Sora 2 (Cinematic Physics)', hint: 'Visual-first physical lighting & camera choreography' },
  { id: 'kling-2', label: 'Kling 2.0 (Kinetic Motion)', hint: 'High-energy facial acting & whip-pan motion' },
];

const AUDIO_STRIP_RE = /(?:Pacing:[^\n]+\n?|Voice Cast \(strictly ONLY[^\n]*(?:\n- [^\n]+)+|Speaker \[[^\]]+\]: "[^"]*"|Spoken Audio:[^\n]+)/g;

function buildNanoBananaCharacterSheet(topic: ScoredTopic | undefined, prompts: GeneratedPrompts): string {
  const style = topic ? getVisualStyleMeta(topic.visualStyle) : getVisualStyleMeta('ps1-1998');
  const charLock = detectCharacterLock(`${prompts.topicTitle} ${prompts.storyboardPrompt}`) ||
    `Original comedic protagonist for "${prompts.topicTitle}" with bold recognizable silhouette and high-contrast everyday wardrobe.`;
  return [
    `CHARACTER CONSISTENCY ANCHOR SHEET (Nano Banana / Gemini Flash Image).`,
    `Unified Visual Engine: ${style.sbDesc} ${style.negRule}`,
    `Subject Identity Lock: ${charLock}`,
    ``,
    `Layout: 4-panel studio turnaround reference sheet on a clean neutral grey backdrop:`,
    `- Top Left (Front Neutral): Full-body front-facing standing pose showing exact proportions, face geometry, footwear, and colors.`,
    `- Top Right (3/4 Action Profile): Three-quarter angle mid-gesture holding the signature comedy prop from "${prompts.topicTitle}".`,
    `- Bottom Left (Deadpan Expression Close-Up): Tight portrait locking eyes, brow, hair silhouette, and flat comedic expression.`,
    `- Bottom Right (Key Prop & Wardrobe Detail): Isolated close-up of the main comedy prop and costume texture for zero identity drift across multi-part video scenes.`,
  ].join('\n');
}

/**
 * Compiles canonical Studio prompts for frontier 2026 video/image models
 * (Veo 3.1 / Flow, Nano Banana Character Sheet, Sora 2, Kling 2.0).
 */
export function compileForTargetModel(
  prompts: GeneratedPrompts,
  target: TargetVideoModel,
  topic?: ScoredTopic,
): { videoOutput: string; label: string; meta: string } {
  if (target === 'veo-3-flow') {
    return { videoOutput: prompts.videoPrompt, label: 'Video Prompt (Veo 3.1)', meta: '5 Shots · 3 Dialogues · Native Audio' };
  }

  if (target === 'nano-banana') {
    return {
      videoOutput: buildNanoBananaCharacterSheet(topic, prompts),
      label: 'Character Sheet (Nano Banana)',
      meta: '4-Panel Identity Anchor · Zero Drift',
    };
  }

  const visualOnly = prompts.videoPrompt
    .replace(AUDIO_STRIP_RE, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  if (target === 'sora-2') {
    return {
      videoOutput: `SORA 2 VISUAL-FIRST DIRECTIVE: Prioritize realistic physical momentum, micro-lighting bounce, continuous spatial geometry, and crisp lens breathing across hard cuts.\n\n${visualOnly}`,
      label: 'Video Prompt (Sora 2)',
      meta: 'Visual-First · Cinematic Physics',
    };
  }

  return {
    videoOutput: `KLING 2.0 KINETIC MOTION DIRECTIVE: Maximize expressive facial micro-acting, snappy squash-and-stretch body language, fast whip-pan transitions, and tactile prop physics.\n\n${visualOnly}`,
    label: 'Video Prompt (Kling 2.0)',
    meta: 'Kinetic Motion · Expressive Acting',
  };
}
