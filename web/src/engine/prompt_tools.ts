import type { GeneratedPrompts, SavedItem, VisualStyle } from '../types';
import { CINEMATOGRAPHY_RIGS } from './randomizer';

const CAMERA_LINE_RE = /Camera & Lighting:[^.]+\./;
const STYLE_LINE_RE = /(Apply one unified style[^:]*:\s*)([^.]+\.)/;

const STYLE_SB_MAP: Record<VisualStyle, string> = {
  'ps1-1998':
    'raw 1998 PlayStation 1 (PS1) / Nintendo 64 (N64) ultra low-poly 3D game screenshots—angular faceted polygons, blurry pixelated bitmap textures, stiff awkward poses, crude Gouraud shading, jagged aliased edges, and muddy retro colors.',
  'gta6-vice':
    'authentic GTA 6 / GTA 5 open-world gameplay screenshots—classic over-the-shoulder third-person follow camera, circular GPS radar minimap in the bottom-left corner with pink mission waypoint, flashing wanted-level stars in the top-right corner, weapon/cash HUD counter, sun-drenched Vice-City tropical neon reflections on wet asphalt, and chaotic Ragdoll physics.',
  'hybrid-1998-gta6':
    '1998 PlayStation 1 (PS1) ultra low-poly 3D blocky characters inside an authentic GTA 6 / GTA 5 open-world gameplay HUD—chunky faceted PS1 polygon characters with circular GPS radar minimap in the bottom-left corner, flashing wanted-level stars in the top-right corner, third-person follow camera, and glossy wet-asphalt Vice-City neon reflections.',
};

const STYLE_VID_MAP: Record<VisualStyle, string> = {
  'ps1-1998':
    'raw 1998 PlayStation 1 (PS1) / Nintendo 64 (N64) ultra low-poly 3D game graphics—angular faceted polygons, blurry pixelated bitmap textures, stiff robotic animations with jerky low-FPS movement, crude Gouraud shading, jagged aliased edges, and muddy retro colors.',
  'gta6-vice':
    'authentic GTA 6 / GTA 5 open-world gameplay capture—classic third-person follow & drive camera, circular GPS radar minimap in the bottom-left corner, flashing wanted-level stars in the top-right corner, yellow mission objective text at the bottom, chaotic open-world NPC ragdoll physics, and glossy neon wet-asphalt reflections.',
  'hybrid-1998-gta6':
    '1998 PlayStation 1 (PS1) ultra low-poly 3D blocky characters inside an authentic GTA 6 / GTA 5 open-world gameplay engine—stiff faceted 1998 PS1 polygon characters moving through glossy neon Vice-City streets with the GTA circular GPS minimap in the bottom-left, flashing wanted stars in the top-right, and third-person getaway camera tracking.',
};

export function switchPromptVisualStyle(prompts: GeneratedPrompts, style: VisualStyle): GeneratedPrompts {
  return {
    ...prompts,
    storyboardPrompt: prompts.storyboardPrompt.replace(STYLE_LINE_RE, `$1${STYLE_SB_MAP[style]}`),
    videoPrompt: prompts.videoPrompt.replace(STYLE_LINE_RE, `$1${STYLE_VID_MAP[style]}`),
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
    /(Shot 6:[\s\S]*?Hindi Dialogue:\s*")([^"]*)(")/,
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
