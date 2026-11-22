import type { EngineConfig, GeneratedPrompts, StoryboardFrameData, TopicOption, VideoShotData, VisualStyle } from '../types';
import { detectCharacterLock, sanitizeCopyrightNames } from './alias_sanitizer';
import { pickSituationCastDirective } from './character_variability';
import { formatShotDialogue, pickVoiceEnsemble } from './dialogue_theater';
import { generateFreeLiveScriptSpec } from './free_ai';
import { generateLiveScriptSpec } from './live_ai';
import { pickCinematographyRig } from './randomizer';
import { getVisualStyleMeta, VISUAL_STYLE_OPTIONS } from './visual_styles';

export { VISUAL_STYLE_OPTIONS };

const STORYBOARD_HEADER = (title: string, rigDirective: string, charLock: string, style: VisualStyle): string =>
  `6-frame storyboard in a 3x2 grid on a plain dark background. Apply one unified style to ALL panels: ${getVisualStyleMeta(style).sbDesc} ${rigDirective}${charLock ? ` ${charLock}` : ''} Strictly NO 2D cartoon art, NO comic ink outlines, NO cel-shading. Place a short bold retro pixel-font Hinglish caption under each panel. Title at top: "${title}".`;

// Strictly NO time, NO duration, NO video size / aspect ratio mentions!
const VIDEO_HEADER = (rigDirective: string, charLock: string, style: VisualStyle, ensembleSeed = 0): string =>
  `Absurdist comedy video. Apply one unified style throughout: ${getVisualStyleMeta(style).vidDesc} ${rigDirective}${charLock ? ` ${charLock}` : ''} Strictly NO 2D cartoon art, NO comic ink outlines, NO cel-shading. ${pickVoiceEnsemble(ensembleSeed).audioHeader}`;

export function renderStoryboardText(
  title: string,
  frames: StoryboardFrameData[],
  rigDirective?: string,
  visualStyle: VisualStyle = 'ps1-1998',
  castDirective?: string,
): string {
  const safeTitle = sanitizeCopyrightNames(title);
  const rig = rigDirective ?? pickCinematographyRig().directive;
  const lock = detectCharacterLock(`${safeTitle} ${frames.map((f) => f.action).join(' ')}`) || castDirective || '';
  const lines: string[] = [STORYBOARD_HEADER(safeTitle, rig, lock, visualStyle), ''];
  for (const frame of frames) {
    lines.push(`Frame ${frame.frame} (${frame.position}): ${frame.framing}. ${sanitizeCopyrightNames(frame.action)}`);
    lines.push(`Caption: "${sanitizeCopyrightNames(frame.caption)}"`);
    lines.push('');
  }
  return lines.join('\n').trim();
}

const FORBIDDEN_VID_RE = /\b(9:16|16:9|20-second|20 seconds?)\b|\[\d:\d{2}[^\]]*\]|[\u{1F300}-\u{1FAFF}\u2600-\u27BF]/giu;
const cleanVideoLine = (s: string): string => sanitizeCopyrightNames(s).replace(FORBIDDEN_VID_RE, '').replace(/\s{2,}/g, ' ').trim();

function condenseToFiveShots(shots: VideoShotData[]): VideoShotData[] {
  if (shots.length <= 5) return shots.map((s, idx) => ({ ...s, shot: idx + 1 }));
  // Keep Hook (1), Escalation (2), Shift (3), Build-up (5), and Payoff (6) as Shots 1-5
  const picked = [shots[0], shots[1], shots[2], shots[shots.length - 2], shots[shots.length - 1]];
  return picked.map((s, idx) => ({ ...s, shot: idx + 1 }));
}

export function renderVideoText(
  shots: VideoShotData[],
  rigDirective?: string,
  visualStyle: VisualStyle = 'ps1-1998',
  ensembleSeed = 0,
  castDirective?: string,
): string {
  const tightShots = condenseToFiveShots(shots);
  const rig = rigDirective ?? pickCinematographyRig().directive;
  const lock = detectCharacterLock(tightShots.map((s) => s.visual).join(' ')) || castDirective || '';
  const lines: string[] = [VIDEO_HEADER(rig, lock, visualStyle, ensembleSeed), ''];
  let spokenCount = 0;

  for (let i = 0; i < tightShots.length; i += 1) {
    const shot = tightShots[i];
    const isLast = i === tightShots.length - 1;
    lines.push(`Shot ${shot.shot}: ${cleanVideoLine(shot.visual)} SFX: ${cleanVideoLine(shot.sfx)}.`);

    // Keep total video dialogues strictly to 3-4 lines for crisp <15s pacing:
    // Shot 3 is a pure visual/SFX action beat; Shot 4 stays silent if budget already hit 3.
    const shouldSpeak = isLast || (shot.shot !== 3 && (shot.shot !== 4 || spokenCount < 3));
    if (shouldSpeak) {
      const budgetLeft = isLast ? 1 : Math.max(1, 3 - spokenCount);
      const turns = formatShotDialogue(shot, ensembleSeed).slice(0, budgetLeft);
      for (const turnLine of turns) lines.push(turnLine);
      spokenCount += turns.length;
    } else {
      lines.push('Dialogue: [None — pure visual action & SFX beat]');
    }
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
  const castDir = pickSituationCastDirective(topic, topic.title.length);

  if (config.sourceMode === 'gemini' || config.sourceMode === 'groq' || config.sourceMode === 'openrouter') {
    const spec = await generateLiveScriptSpec(config, topic);
    return {
      topicId: topic.id,
      topicTitle: topic.title,
      angle: topic.angle,
      brand: topic.brand,
      storyboardPrompt: renderStoryboardText(topic.title, spec.frames, rig, visualStyle, castDir),
      videoPrompt: renderVideoText(spec.shots, rig, visualStyle, topic.title.length, castDir),
      generatedAt: new Date().toISOString(),
    };
  }

  if (config.sourceMode === 'backend' && config.backendUrl) {
    try {
      const resp = await fetch(`${config.backendUrl.replace(/\/$/, '')}/episodes/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seed_topic: `${topic.title} — ${topic.pitch}`, mode: 'fused', visual_style: visualStyle, auto_repair: true, save_to_db: true }),
      });
      if (resp.ok) {
        const data = (await resp.json()) as { episode: { storyboard: { rendered_prompt: string }; video: { rendered_prompt: string } } };
        return {
          topicId: topic.id,
          topicTitle: sanitizeCopyrightNames(topic.title),
          angle: topic.angle,
          brand: topic.brand,
          storyboardPrompt: sanitizeCopyrightNames(data.episode.storyboard.rendered_prompt),
          videoPrompt: cleanVideoLine(data.episode.video.rendered_prompt),
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
    storyboardPrompt: renderStoryboardText(topic.title, spec.frames, rig, visualStyle, castDir),
    videoPrompt: renderVideoText(spec.shots, rig, visualStyle, topic.title.length, castDir),
    generatedAt: new Date().toISOString(),
  };
}
