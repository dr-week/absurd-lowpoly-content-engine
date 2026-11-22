import type { EngineConfig, GeneratedPrompts, StoryboardFrameData, TopicOption, VideoShotData } from '../types';
import { detectCharacterLock, sanitizeCopyrightNames } from './alias_sanitizer';
import { generateFreeLiveScriptSpec } from './free_ai';
import { generateLiveScriptSpec } from './live_ai';
import { pickCinematographyRig } from './randomizer';

const STORYBOARD_HEADER = (title: string, rigDirective: string, charLock: string): string =>
  `6-frame storyboard in a 3x2 grid on a plain dark background. Apply one unified style to ALL panels: raw 1998 PlayStation 1 (PS1) / Nintendo 64 (N64) ultra low-poly 3D game screenshots—angular faceted polygons, blurry pixelated bitmap textures, stiff awkward poses, crude Gouraud shading, jagged aliased edges, and muddy retro colors. ${rigDirective}${charLock ? ` ${charLock}` : ''} Strictly NO 2D cartoon art, NO comic ink outlines, NO cel-shading, NO smooth modern CGI. Place a short bold retro pixel-font Hinglish caption under each panel. Title at top: "${title}".`;

// Strictly NO time, NO duration, NO video size / aspect ratio mentions!
const VIDEO_HEADER = (rigDirective: string, charLock: string): string =>
  `Absurdist comedy video. Apply one unified style throughout: raw 1998 PlayStation 1 (PS1) / Nintendo 64 (N64) ultra low-poly 3D game graphics—angular faceted polygons, blurry pixelated bitmap textures, stiff robotic animations with jerky low-FPS movement, crude Gouraud shading, jagged aliased edges, and muddy retro colors. ${rigDirective}${charLock ? ` ${charLock}` : ''} Strictly NO 2D cartoon art, NO comic ink outlines, NO cel-shading, NO smooth modern CGI. Audio: deadpan, serious Indian male narrator with slightly compressed lo-fi 1998 PS1-era voice fidelity speaking ultra-short Hindi lines matched tightly to each shot, paired with retro PS1 SFX and sharp hard cuts.`;

export function renderStoryboardText(title: string, frames: StoryboardFrameData[], rigDirective?: string): string {
  const safeTitle = sanitizeCopyrightNames(title);
  const rig = rigDirective ?? pickCinematographyRig().directive;
  const lock = detectCharacterLock(`${safeTitle} ${frames.map((f) => f.action).join(' ')}`);
  const lines: string[] = [STORYBOARD_HEADER(safeTitle, rig, lock), ''];
  for (const frame of frames) {
    lines.push(`Frame ${frame.frame} (${frame.position}): ${frame.framing}. ${sanitizeCopyrightNames(frame.action)}`);
    lines.push(`Caption: "${sanitizeCopyrightNames(frame.caption)}"`);
    lines.push('');
  }
  return lines.join('\n').trim();
}

export function renderVideoText(shots: VideoShotData[], rigDirective?: string): string {
  const rig = rigDirective ?? pickCinematographyRig().directive;
  const lock = detectCharacterLock(shots.map((s) => s.visual).join(' '));
  const lines: string[] = [VIDEO_HEADER(rig, lock), ''];
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
): Promise<GeneratedPrompts> {
  const rig = pickCinematographyRig().directive;

  if (config.sourceMode === 'gemini' || config.sourceMode === 'groq' || config.sourceMode === 'openrouter') {
    const spec = await generateLiveScriptSpec(config, topic);
    return {
      topicId: topic.id,
      topicTitle: topic.title,
      angle: topic.angle,
      brand: topic.brand,
      storyboardPrompt: renderStoryboardText(topic.title, spec.frames, rig),
      videoPrompt: renderVideoText(spec.shots, rig),
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
    storyboardPrompt: renderStoryboardText(topic.title, spec.frames, rig),
    videoPrompt: renderVideoText(spec.shots, rig),
    generatedAt: new Date().toISOString(),
  };
}
