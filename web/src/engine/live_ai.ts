import type { EngineConfig, HookCategory, RatingLogEntry, ScoredTopic, SituationCategory, StoryboardFrameData, TopicOption, VideoShotData } from '../types';
import { sanitizeTopic } from './alias_sanitizer';
import { pickComedyMechanism, WRITERS_ROOM_RULES } from './comedy_craft';
import { pickCinematographyRig } from './randomizer';
import { classifyHook, classifySituation, getHookLabel, getSituationLabel } from './taxonomy';
import { assignDiverseVisualStyles } from './visual_styles';

function extractJson(raw: string): string {
  const s = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
  const start = s.search(/[\[{]/);
  if (start === -1) return s;
  const end = s[start] === '{' ? s.lastIndexOf('}') : s.lastIndexOf(']');
  return end > start ? s.slice(start, end + 1) : s;
}

async function callBrowserLLM(config: EngineConfig, system: string, user: string): Promise<string> {
  if (!config.apiKey.trim()) throw new Error('API key required in Settings');

  if (config.sourceMode === 'gemini') {
    const model = config.model.trim() || 'gemini-2.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(config.apiKey.trim())}`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system }] },
        contents: [{ role: 'user', parts: [{ text: user }] }],
        generationConfig: { temperature: 1.0, responseMimeType: 'application/json' },
      }),
    });
    if (!resp.ok) throw new Error(`Gemini HTTP ${resp.status}`);
    const data = (await resp.json()) as { candidates: { content: { parts: { text: string }[] } }[] };
    return data.candidates[0].content.parts[0].text;
  }

  const base = config.sourceMode === 'groq' ? 'https://api.groq.com/openai/v1' : 'https://openrouter.ai/api/v1';
  const defaultModel = config.sourceMode === 'groq' ? 'llama-3.3-70b-versatile' : 'google/gemini-2.5-flash';
  const resp = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey.trim()}`,
    },
    body: JSON.stringify({
      model: config.model.trim() || defaultModel,
      temperature: 1.0,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  });
  if (!resp.ok) throw new Error(`${config.sourceMode} HTTP ${resp.status}`);
  const data = (await resp.json()) as { choices: { message: { content: string } }[] };
  return data.choices[0].message.content;
}

export async function generateLiveTopics(
  config: EngineConfig,
  query: string,
  logs: RatingLogEntry[],
  avoidTitles: string[],
  liveTrends: string[] = [],
  hookFilter: HookCategory | 'all' = 'all',
  situationFilter: SituationCategory | 'all' = 'all',
): Promise<ScoredTopic[]> {
  const liked = logs.filter((l) => l.vote === 'up').slice(0, 6).map((l) => l.title);
  const disliked = logs.filter((l) => l.vote === 'down').slice(0, 6).map((l) => l.title);

  const system =
    'You are a top stand-up & sketch comedy head writer inventing 8 structurally DIFFERENT absurdist comedy premises for 1998 PS1/N64 low-poly 3D videos with a deadpan Hindi narrator. ' +
    'Cover ALL 6 distinct story formats: over-engineer (Level 1 -> Level 999 build), fake-origin (fake celebrity childhood story), breaking-news (serious TV broadcast), fake-tutorial (3-step Rule-of-Three guide), petty-spiral (UCB heightening escalation), weird-science (absurd lab study). ' +
    'Use phonetic parody meme names (Elone Maask, Doland Trumpe, Gaandhi-G, Putine, Moodi-G, Zuckerburge, Giga-Chaad, Dogee, Spooder-Maan, Hulke, Baatmaan, GTA-Sixe), World News, and Science. NEVER lock topics to Delhi, Mumbai, Goa, or generic uncles. ' +
    `${WRITERS_ROOM_RULES} ` +
    'Return ONLY JSON: {"topics":[{"title":"UPPERCASE PUNCHY TITLE","angle":"over-engineer|fake-origin|breaking-news|fake-tutorial|petty-spiral|weird-science","brand":"Figure/World Tag","pitch":"Cold-open 1-sentence Setup -> False Assumption -> Shatter payoff (NO genre-label prefix)","viralScore":92}]}';

  const user = [
    `Generate 8 completely fresh, structurally distinct comedy topics. Seed nonce: ${Date.now()}-${Math.random().toString(36).slice(2, 7)}.`,
    hookFilter !== 'all' ? `Focus HOOK CATEGORY on: ${getHookLabel(hookFilter)}.` : '',
    situationFilter !== 'all' ? `Focus SITUATION CATEGORY on: ${getSituationLabel(situationFilter)}.` : '',
    query.trim() ? `Include at least 1 topic about: ${query.trim()} (keep the other 7 completely unrelated!).` : '',
    liveTrends.length ? `Today's live trending hooks you may riff on for 1-2 topics: ${liveTrends.slice(0, 6).join(', ')}` : '',
    liked.length ? `User previously LIKED: ${liked.join('; ')}` : '',
    disliked.length ? `User previously DISLIKED (avoid): ${disliked.join('; ')}` : '',
    avoidTitles.length ? `NEVER repeat these past titles: ${avoidTitles.slice(0, 24).join('; ')}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const raw = await callBrowserLLM(config, system, user);
  const parsed = JSON.parse(extractJson(raw)) as { topics: Array<{ title: string; angle: string; brand: string; pitch: string; viralScore?: number }> };
  const stamp = Date.now().toString(36);
  const bases = assignDiverseVisualStyles(
    parsed.topics.slice(0, 8).map((t, idx) =>
      sanitizeTopic({ id: `ai_${stamp}_${idx}`, title: t.title, angle: t.angle || 'over-engineer', brand: t.brand || 'Global', trendHook: 'Live AI Craft', pitch: t.pitch }),
    ),
  );
  return bases.map((base, idx) => {
    const score = parsed.topics[idx]?.viralScore ?? 88;
    return {
      ...base,
      brandHeat: score,
      viralScore: Math.max(40, Math.min(99, Math.round(score))),
      hookCategory: classifyHook(base),
      situationCategory: classifySituation(base),
    };
  });
}

export async function generateLiveScriptSpec(
  config: EngineConfig,
  topic: TopicOption,
): Promise<{ frames: StoryboardFrameData[]; shots: VideoShotData[] }> {
  const rig = pickCinematographyRig();
  const mech = pickComedyMechanism();
  const system =
    'You are a master comedy scriptwriter expanding this premise into a 6-frame 3x2 storyboard and a 6-shot video script. ' +
    `PRIMARY COMEDY MECHANISM (${mech.name}): ${mech.rule} PUNCHLINE RULE: ${mech.punchlineRule} ` +
    `${WRITERS_ROOM_RULES} ${rig.directive} ` +
    'DO NOT repeat global PS1/low-poly style words inside individual frames/shots. ' +
    'NEVER mention video duration, time, timestamps, or aspect ratio (no 9:16, no 20s). Keep Shot 6 Hindi <= 7 words with reveal word LAST. ' +
    'Return ONLY JSON: {"frames":[{"frame":1,"position":"Top Left","framing":"...","action":"...","caption":"short Hinglish"}],"shots":[{"shot":1,"visual":"...","sfx":"...","hindi":"short Devanagari Hindi"}]}';

  const user = `Title: ${topic.title}\nWorld: ${topic.brand}\nPremise: ${topic.pitch}\nUse exact positions: Top Left, Top Center, Top Right, Bottom Left, Bottom Center, Bottom Right.`;
  const raw = await callBrowserLLM(config, system, user);
  return JSON.parse(extractJson(raw)) as { frames: StoryboardFrameData[]; shots: VideoShotData[] };
}
