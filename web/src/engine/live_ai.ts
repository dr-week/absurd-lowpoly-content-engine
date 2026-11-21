import type { EngineConfig, RatingLogEntry, ScoredTopic, StoryboardFrameData, TopicOption, VideoShotData } from '../types';

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
): Promise<ScoredTopic[]> {
  const liked = logs.filter((l) => l.vote === 'up').slice(0, 6).map((l) => l.title);
  const disliked = logs.filter((l) => l.vote === 'down').slice(0, 6).map((l) => l.title);

  const system =
    'You invent 8 wildly creative, completely UNRELATED absurdist comedy topics for 1998 PS1/N64 low-poly 3D videos with a deadpan Hindi narrator. ' +
    'Mix across ALL of these categories (1 per category): World News, Political Satire, Weird Scientific Research/Studies, Space/Tech/AI, Goa/Coastal Life, Economy/Startups, Viral Internet Culture, and Universal Everyday Life. ' +
    'DO NOT make topics specific to Delhi or Mumbai. Keep every topic distinct and unpredictable. ' +
    'Return ONLY JSON: {"topics":[{"title":"UPPERCASE PUNCHY TITLE","angle":"short-tag","brand":"Topic/World Tag","pitch":"1-sentence hook + surreal twist + deadpan payoff","viralScore":88}]}';

  const user = [
    `Generate 8 completely fresh, unrelated Indian absurd comedy topics. Seed nonce: ${Date.now()}-${Math.random().toString(36).slice(2, 7)}.`,
    query.trim() ? `Include at least 1 topic related to: ${query.trim()} (keep the other 7 completely unrelated!).` : '',
    liked.length ? `User previously LIKED these vibes: ${liked.join('; ')}` : '',
    disliked.length ? `User previously DISLIKED these vibes (avoid similar): ${disliked.join('; ')}` : '',
    avoidTitles.length ? `NEVER repeat any of these past titles: ${avoidTitles.slice(0, 24).join('; ')}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const raw = await callBrowserLLM(config, system, user);
  const parsed = JSON.parse(extractJson(raw)) as { topics: Array<{ title: string; angle: string; brand: string; pitch: string; viralScore?: number }> };
  const stamp = Date.now().toString(36);
  return parsed.topics.slice(0, 8).map((t, idx) => ({
    id: `ai_${stamp}_${idx}`,
    title: t.title,
    angle: t.angle || 'surreal',
    brand: t.brand || 'India',
    trendHook: 'Live AI',
    pitch: t.pitch,
    brandHeat: t.viralScore ?? 85,
    viralScore: Math.max(40, Math.min(99, Math.round(t.viralScore ?? 85))),
  }));
}

export async function generateLiveScriptSpec(
  config: EngineConfig,
  topic: TopicOption,
): Promise<{ frames: StoryboardFrameData[]; shots: VideoShotData[] }> {
  const system =
    'Expand this Indian absurdist comedy topic into a 6-frame 3x2 storyboard and a 6-shot video script. ' +
    'DO NOT repeat global PS1/low-poly style words inside individual frames/shots. ' +
    'NEVER mention video duration, time, timestamps, or aspect ratio (no 9:16, no 20s). Keep Hindi lines <= 7 words. ' +
    'Return ONLY JSON: {"frames":[{"frame":1,"position":"Top Left","framing":"...","action":"...","caption":"short Hinglish"}],"shots":[{"shot":1,"visual":"...","sfx":"...","hindi":"short Devanagari Hindi"}]}';

  const user = `Title: ${topic.title}\nSetting/Brand: ${topic.brand}\nPremise: ${topic.pitch}\nUse exact positions: Top Left, Top Center, Top Right, Bottom Left, Bottom Center, Bottom Right.`;
  const raw = await callBrowserLLM(config, system, user);
  return JSON.parse(extractJson(raw)) as { frames: StoryboardFrameData[]; shots: VideoShotData[] };
}
