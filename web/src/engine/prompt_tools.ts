import type { GeneratedPrompts, SavedItem, VisualStyle } from '../types';
import { CINEMATOGRAPHY_RIGS } from './randomizer';
import { getVisualStyleMeta } from './visual_styles';

const CAMERA_LINE_RE = /Camera & Lighting:[^.]+\./;
const STYLE_LINE_RE = /(Apply one unified style[^:]*:\s*)([^.]+\.)/;

export function switchPromptVisualStyle(prompts: GeneratedPrompts, style: VisualStyle): GeneratedPrompts {
  const meta = getVisualStyleMeta(style);
  return {
    ...prompts,
    storyboardPrompt: prompts.storyboardPrompt.replace(STYLE_LINE_RE, `$1${meta.sbDesc}`),
    videoPrompt: prompts.videoPrompt.replace(STYLE_LINE_RE, `$1${meta.vidDesc}`),
  };
}

/** Cycles the global 1998 camera & lighting rig in both Storyboard and Video prompts in 1 click. */
export function rerollCameraRig(
  prompts: GeneratedPrompts,
  nextIndex: number,
): { prompts: GeneratedPrompts; rigLabel: string; rigIndex: number } {
  const idx = ((nextIndex % CINEMATOGRAPHY_RIGS.length) + CINEMATOGRAPHY_RIGS.length) % CINEMATOGRAPHY_RIGS.length;
  const rig = CINEMATOGRAPHY_RIGS[idx];
  const replaceRig = (text: string): string =>
    CAMERA_LINE_RE.test(text) ? text.replace(CAMERA_LINE_RE, rig.directive) : text;

  return {
    rigIndex: idx,
    rigLabel: rig.label,
    prompts: {
      ...prompts,
      storyboardPrompt: replaceRig(prompts.storyboardPrompt),
      videoPrompt: replaceRig(prompts.videoPrompt),
    },
  };
}

const ALT_PUNCHLINES: readonly { style: string; hindi: string }[] = [
  { style: 'Deadpan Invoice', hindi: 'बोले, जीएसटी और टिप अलग लगेगा।' },
  { style: 'Status Drop', hindi: 'कमेटी अगली मीटिंग अगले साल रखेगी।' },
  { style: 'Minimalist Callback', hindi: 'दिक्कत सिस्टम नहीं, दस का नोट था।' },
  { style: 'Tech Excuse', hindi: 'बोले, अगला अपडेट सब ठीक कर देगा।' },
];

/** Swaps the final Shot 6 Hindi punchline with a crisp comedy-crafted alternate ending in 1 click. */
export function cycleAlternatePunchline(
  prompts: GeneratedPrompts,
  step: number,
): { prompts: GeneratedPrompts; style: string } {
  const pick = ALT_PUNCHLINES[Math.abs(step) % ALT_PUNCHLINES.length];
  const updatedVideo = prompts.videoPrompt.replace(
    /(Shot (?:5|6|4):[\s\S]*?(?:Hindi Dialogue|Speaker \[[^\]]+\]):\s*")([^"]*)(")(?![\s\S]*Shot \d+:)/,
    `$1${pick.hindi}$3`,
  );
  return { style: pick.style, prompts: { ...prompts, videoPrompt: updatedVideo } };
}

/** Downloads all Saved topics (with Pending/Done status) as a clean Markdown production sheet. */
export function exportSavedMarkdown(saved: SavedItem[]): void {
  const stamp = new Date().toISOString().slice(0, 10);
  const lines = [
    `# Absurd Low-Poly Studio — Saved Production Sheet (${stamp})`,
    '',
    ...saved.map(
      (item, i) =>
        `${i + 1}. **[${item.generated ? 'DONE' : 'PENDING'}] ${item.topic.title}** (${item.topic.brand})\n   - ${item.topic.pitch}`,
    ),
    '',
  ];
  const url = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/markdown' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `absurd-saved-${stamp}.md`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
