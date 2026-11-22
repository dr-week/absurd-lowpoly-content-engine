import type { EngineConfig, GeneratedPrompts, StoryboardFrameData, TopicOption, VideoShotData, VisualStyle } from '../types';
import { detectCharacterLock, sanitizeCopyrightNames } from './alias_sanitizer';
import { generateFreeLiveScriptSpec } from './free_ai';
import { generateLiveScriptSpec } from './live_ai';
import { pickCinematographyRig } from './randomizer';

export const VISUAL_STYLE_OPTIONS: readonly { id: VisualStyle; label: string }[] = [
  { id: 'ps1-1998', label: '1998 PS1 Low-Poly' },
  { id: 'gta6-vice', label: 'GTA 6 Vice Engine' },
  { id: 'hybrid-1998-gta6', label: 'PS1 × GTA 6 Hybrid' },
];

const STYLE_SB_DESC: Record<VisualStyle, string> = {
  'ps1-1998':
    'raw 1998 PlayStation 1 (PS1) / Nintendo 64 (N64) ultra low-poly 3D game screenshots—angular faceted polygons, blurry pixelated bitmap textures, stiff awkward poses, crude Gouraud shading, jagged aliased edges, and muddy retro colors.',
  'gta6-vice':
    'authentic GTA 6 / GTA 5 open-world gameplay screenshots—classic over-the-shoulder third-person follow camera, circular GPS radar minimap in the bottom-left corner with pink mission waypoint, flashing wanted-level stars in the top-right corner, weapon/cash HUD counter, sun-drenched Vice-City tropical neon reflections on wet asphalt, and chaotic Ragdoll physics.',
  'hybrid-1998-gta6':
    '1998 PlayStation 1 (PS1) ultra low-poly 3D blocky characters inside an authentic GTA 6 / GTA 5 open-world gameplay HUD—chunky faceted PS1 polygon characters with circular GPS radar minimap in the bottom-left corner, flashing wanted-level stars in the top-right corner, third-person follow camera, and glossy wet-asphalt Vice-City neon reflections.',
};

const STYLE_VID_DESC: Record<VisualStyle, string> = {
  'ps1-1998':
    'raw 1998 PlayStation 1 (PS1) / Nintendo 64 (N64) ultra low-poly 3D game graphics—angular faceted polygons, blurry pixelated bitmap textures, stiff robotic animations with jerky low-FPS movement, crude Gouraud shading, jagged aliased edges, and muddy retro colors.',
  'gta6-vice':
    'authentic GTA 6 / GTA 5 open-world gameplay capture—classic third-person follow & drive camera, circular GPS radar minimap in the bottom-left corner, flashing wanted-level stars in the top-right corner, yellow mission objective text at the bottom, chaotic open-world NPC ragdoll physics, and glossy neon wet-asphalt reflections.',
  'hybrid-1998-gta6':
    '1998 PlayStation 1 (PS1) ultra low-poly 3D blocky characters inside an authentic GTA 6 / GTA 5 open-world gameplay engine—stiff faceted 1998 PS1 polygon characters moving through glossy neon Vice-City streets with the GTA circular GPS minimap in the bottom-left, flashing wanted stars in the top-right, and third-person getaway camera tracking.',
};

const STORYBOARD_HEADER = (title: string, rigDirective: string, charLock: string, style: VisualStyle): string =>
  `6-frame storyboard in a 3x2 grid on a plain dark background. Apply one unified style to ALL panels: ${STYLE_SB_DESC[style]} ${rigDirective}${charLock ? ` ${charLock}` : ''} Strictly NO 2D cartoon art, NO comic ink outlines, NO cel-shading. Place a short bold retro pixel-font Hinglish caption under each panel. Title at top: "${title}".`;

// Strictly NO time, NO duration, NO video size / aspect ratio mentions!
const VIDEO_HEADER = (rigDirective: string, charLock: string, style: VisualStyle): string =>
  `Absurdist comedy video. Apply one unified style throughout: ${STYLE_VID_DESC[style]} ${rigDirective}${charLock ? ` ${charLock}` : ''} Strictly NO 2D cartoon art, NO comic ink outlines, NO cel-shading. Audio: deadpan, serious Indian male narrator speaking ultra-short Hindi lines matched tightly to each shot, paired with punchy game SFX and sharp hard cuts.`;

export function renderStoryboardText(
  title: string,
  frames: StoryboardFrameData[],
  rigDirective?: string,
  visualStyle: VisualStyle = 'ps1-1998',
): string {
  const safeTitle = sanitizeCopyrightNames(title);
  const rig = rigDirective ?? pickCinematographyRig().directive;
  const lock = detectCharacterLock(`${safeTitle} ${frames.map((f) => f.action).join(' ')}`);
  const lines: string[] = [STORYBOARD_HEADER(safeTitle, rig, lock, visualStyle), ''];
  for (const frame of frames) {
    lines.push(`Frame ${frame.frame} (${frame.position}): ${frame.framing}. ${sanitizeCopyrightNames(frame.action)}`);
    lines.push(`Caption: "${sanitizeCopyrightNames(frame.caption)}"`);
    lines.push('');
  }
  return lines.join('\n').trim();
}

export function renderVideoText(
  shots: VideoShotData[],
  rigDirective?: string,
  visualStyle: VisualStyle = 'ps1-1998',
): string {
  const rig = rigDirective ?? pickCinematographyRig().directive;
  const lock = detectCharacterLock(shots.map((s) => s.visual).join(' '));
  const lines: string[] = [VIDEO_HEADER(rig, lock, visualStyle), ''];
  for (const shot of shots) {
    lines.push(`Shot ${shot.shot}: ${sanitizeCopyrightNames(shot.visual)} SFX: ${shot.sfx}.`);
    lines.push(`Hindi Dialogue: "${shot.hindi}"`);
    lines.push('');
  }
  return lines.join('\n').trim();
}

export async function generatePromptsForTopic(
  topic: TopicOption,
  config: EngineConfig,
  visualStyle: VisualStyle = 'ps1-1998',
): Promise<GeneratedPrompts> {
  const rig = pickCinematographyRig().directive;

  if (config.sourceMode === 'gemini' || config.sourceMode === 'groq' || config.sourceMode === 'openrouter') {
    const spec = await generateLiveScriptSpec(config, topic);
    return {
      topicId: topic.id,
      topicTitle: topic.title,
      angle: topic.angle,
      brand: topic.brand,
      storyboardPrompt: renderStoryboardText(topic.title, spec.frames, rig, visualStyle),
      videoPrompt: renderVideoText(spec.shots, rig, visualStyle),
      generatedAt: new Date().toISOString(),
    };
  }

  if (config.sourceMode === 'backend' && config.backendUrl) {
    try {
      const resp = await fetch(`${config.backendUrl.replace(/\/$/, '')}/episodes/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seed_topic: `${topic.title} — ${topic.pitch}`, mode: 'fused', auto_repair: true, save_to_db: true }),
      });
      if (resp.ok) {
        const data = (await resp.json()) as { episode: { storyboard: { rendered_prompt: string }; video: { rendered_prompt: string } } };
        return {
          topicId: topic.id,
          topicTitle: topic.title,
          angle: topic.angle,
          brand: topic.brand,
          storyboardPrompt: data.episode.storyboard.rendered_prompt,
          videoPrompt: data.episode.video.rendered_prompt,
          generatedAt: new Date().toISOString(),
        };
      }
    } catch {
      // Fall back cleanly
    }
  }

  const hasPrebuilt = (topic.frames?.length ?? 0) === 6 && (topic.shots?.length ?? 0) === 6;
  const spec = hasPrebuilt ? { frames: topic.frames!, shots: topic.shots! } : await generateFreeLiveScriptSpec(topic);
  return {
    topicId: topic.id,
    topicTitle: topic.title,
    angle: topic.angle,
    brand: topic.brand,
    storyboardPrompt: renderStoryboardText(topic.title, spec.frames, rig, visualStyle),
    videoPrompt: renderVideoText(spec.shots, rig, visualStyle),
    generatedAt: new Date().toISOString(),
  };
}
