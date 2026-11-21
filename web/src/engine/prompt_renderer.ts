import type { EngineConfig, GeneratedPrompts, StoryboardFrameData, TopicOption, VideoShotData } from '../types';
import { generateLiveScriptSpec } from './live_ai';

const STORYBOARD_HEADER = (title: string): string =>
  `6-frame storyboard in a 3x2 grid on a plain dark background. Apply one unified style to ALL panels: raw 1998 PlayStation 1 (PS1) / Nintendo 64 (N64) ultra low-poly 3D game screenshots—angular faceted polygons, blurry pixelated bitmap textures, stiff awkward poses, crude Gouraud shading, jagged aliased edges, and muddy retro colors. Strictly NO 2D cartoon art, NO comic ink outlines, NO cel-shading, NO smooth modern CGI. Place a short bold retro pixel-font Hinglish caption under each panel. Title at top: "${title}".`;

// Strictly NO time, NO duration, NO video size / aspect ratio mentions!
const VIDEO_HEADER =
  'Absurdist comedy video. Apply one unified style throughout: raw 1998 PlayStation 1 (PS1) / Nintendo 64 (N64) ultra low-poly 3D game graphics—angular faceted polygons, blurry pixelated bitmap textures, stiff robotic animations with jerky low-FPS movement, crude Gouraud shading, jagged aliased edges, and muddy retro colors. Strictly NO 2D cartoon art, NO comic ink outlines, NO cel-shading, NO smooth modern CGI. Audio: deadpan, serious Indian male narrator speaking ultra-short Hindi lines matched tightly to each shot, paired with retro PS1 SFX and sharp hard cuts.';

export function renderStoryboardText(title: string, frames: StoryboardFrameData[]): string {
  const lines: string[] = [STORYBOARD_HEADER(title), ''];
  for (const frame of frames) {
    lines.push(`Frame ${frame.frame} (${frame.position}): ${frame.framing}. ${frame.action}`);
    lines.push(`Caption: "${frame.caption}"`);
    lines.push('');
  }
  return lines.join('\n').trim();
}

export function renderVideoText(shots: VideoShotData[]): string {
  const lines: string[] = [VIDEO_HEADER, ''];
  for (const shot of shots) {
    lines.push(`Shot ${shot.shot}: ${shot.visual} SFX: ${shot.sfx}.`);
    lines.push(`Hindi Dialogue: "${shot.hindi}"`);
    lines.push('');
  }
  return lines.join('\n').trim();
}

export async function generatePromptsForTopic(
  topic: TopicOption,
  config: EngineConfig,
): Promise<GeneratedPrompts> {
  if (config.sourceMode === 'gemini' || config.sourceMode === 'groq' || config.sourceMode === 'openrouter') {
    const spec = await generateLiveScriptSpec(config, topic);
    return {
      topicId: topic.id,
      topicTitle: topic.title,
      angle: topic.angle,
      brand: topic.brand,
      storyboardPrompt: renderStoryboardText(topic.title, spec.frames),
      videoPrompt: renderVideoText(spec.shots),
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

  return {
    topicId: topic.id,
    topicTitle: topic.title,
    angle: topic.angle,
    brand: topic.brand,
    storyboardPrompt: renderStoryboardText(topic.title, topic.frames ?? []),
    videoPrompt: renderVideoText(topic.shots ?? []),
    generatedAt: new Date().toISOString(),
  };
}
