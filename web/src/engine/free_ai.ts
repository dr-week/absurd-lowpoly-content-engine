import type { HookCategory, RatingLogEntry, ScoredTopic, SituationCategory, StoryboardFrameData, TopicOption, VideoShotData } from '../types';
import { sanitizeTopic } from './alias_sanitizer';
import { pickComedyMechanism, WRITERS_ROOM_RULES } from './comedy_craft';
import { expandCustomIdeaLocally } from './custom_builder';
import { DESI_NOMENCLATURE_GUIDE } from './desi_nomenclature';
import { fetchFreshOnlineNews } from './live_news';
import { pickCleanLiveNewsStories } from './news_mapper';
import { cryptoRng, pickCinematographyRig } from './randomizer';
import { classifyHook, classifySituation, getHookLabel, getSituationLabel } from './taxonomy';
import { TWIST_ARCHITECT_GUIDE } from './twist_architect';
import { assignDiverseVisualStyles } from './visual_styles';

const POLLINATIONS_URL = 'https://text.pollinations.ai/openai';
const PLLNS_TS_KEY = 'absurd_studio_pllns_ts';
const PLLNS_COOLDOWN_MS = 46_000;

function canCallPollinations(): boolean {
  if (typeof localStorage === 'undefined') return true;
  const last = Number(localStorage.getItem(PLLNS_TS_KEY) || '0');
  return Date.now() - last >= PLLNS_COOLDOWN_MS;
}

function recordPollinationsCall(): void {
  if (typeof localStorage !== 'undefined') localStorage.setItem(PLLNS_TS_KEY, String(Date.now()));
}

function extractJson(raw: string): string {
  const s = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
  const start = s.search(/[\[{]/);
  if (start === -1) return s;
  const end = s[start] === '{' ? s.lastIndexOf('}') : s.lastIndexOf(']');
  return end > start ? s.slice(start, end + 1) : s;
}

async function callFreeAI(system: string, user: string, timeoutMs = 18000): Promise<string> {
  if (!canCallPollinations()) throw new Error('Cooldown active');
  recordPollinationsCall();
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const resp = await fetch(POLLINATIONS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: ctrl.signal,
      body: JSON.stringify({
        model: 'openai-fast',
        seed: Math.floor(cryptoRng() * 1_000_000_000),
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
      }),
    });
    if (!resp.ok) throw new Error(`Free AI HTTP ${resp.status}`);
    const data = (await resp.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error('Empty Free AI response');
    return content;
  } finally {
    clearTimeout(timer);
  }
}

export async function generateFreshLiveNewsTopics(params: {
  query: string;
  logs: RatingLogEntry[];
  seenTitles: Set<string>;
  batchNonce: number;
  hookFilter: HookCategory | 'all';
  situationFilter: SituationCategory | 'all';
  tasteSummary?: string;
}): Promise<ScoredTopic[]> {
  const { query, logs, seenTitles, hookFilter, situationFilter, tasteSummary = '' } = params;
  const headlines = await fetchFreshOnlineNews(8).catch(() => []);
  const liked = logs.filter((l) => l.vote === 'up').slice(0, 5).map((l) => l.title);
  const avoid = Array.from(seenTitles).slice(-40);

  const system =
    'You are a stand-up & sketch comedy head writer inventing 8 BRAND-NEW, structurally DIFFERENT absurdist comedy topics. ' +
    'ALL titles and pitches MUST be in crisp ENGLISH ONLY. ' +
    'Keep every premise DEAD-SIMPLE, SUSPENSEFUL, SURPRISING, and FUNNY—never write robotic tech jargon or copy raw news article titles. Pair a recognizable high-stakes situation (e.g. 5-star GTA chase, bank heist, bomb squad, auto-meter fight) with a simple everyday Indian twist and our phonetic lookalike parody characters (NEVER use real copyrighted names—always use tweaked spellings and absurd desi costume variations): Elone Maask, Doland Trumpe, Gaandhi-G, Putine, Moodi-G, Zuckerburge, Ambaani, Giga-Chaad, Dogee, Spooder-Maan, Hulke, Baatmaan, Sigmaa, Lorde Puneete, Dolli Chai, Khaali, Salmaan Bhoi, Koohli, GTA-Sixe. ' +
    'NEVER mention "low-poly", "PS1", "3D", "meme", or "viral". NEVER use prefixes like "Fake biopic:" or "Inspired by". STRICT NO-RELIGION RULE: NEVER joke about temples, churches, mosques, gurudwaras, prasad, gods, priests, or religious rituals. ' +
    `${DESI_NOMENCLATURE_GUIDE} ${TWIST_ARCHITECT_GUIDE} ${WRITERS_ROOM_RULES} ` +
    'Return ONLY valid JSON: {"topics":[{"title":"UPPERCASE ENGLISH TITLE","angle":"over-engineer|fake-origin|breaking-news|fake-tutorial|petty-spiral|weird-science","brand":"Parody Character / World","pitch":"Cold-open 1-sentence visual setup + broken-assumption twist + deadpan payoff","viralScore":94}]}';

  const newsBlock = headlines.map((h, i) => `${i + 1}. ${h.title}`).join('\n');
  const user = [
    `Today's trending themes (extract ONLY broad relatable themes, NEVER quote raw headlines):\n${newsBlock}`,
    hookFilter !== 'all' ? `Focus HOOK CATEGORY on: ${getHookLabel(hookFilter)}.` : '',
    situationFilter !== 'all' ? `Focus SITUATION CATEGORY on: ${getSituationLabel(situationFilter)}.` : '',
    tasteSummary ? `USER TASTE DNA: ${tasteSummary}` : '',
    query.trim() ? `At least 2 topics MUST feature: ${query.trim()}.` : '',
    liked.length ? `User liked: ${liked.join('; ')}` : '',
    avoid.length ? `NEVER repeat these past titles:\n${avoid.join(' | ')}` : '',
    `Nonce: ${Date.now()}-${Math.floor(cryptoRng() * 999999)}. Return ONLY JSON.`,
  ]
    .filter(Boolean)
    .join('\n');

  try {
    const raw = await callFreeAI(system, user);
    const parsed = JSON.parse(extractJson(raw)) as { topics?: Array<{ title: string; angle: string; brand: string; pitch: string; viralScore?: number }> };
    const list = (parsed.topics ?? []).filter((t) =>
      t.title && t.pitch && !/inspired by "|after "|reading "|following /i.test(t.pitch) &&
      !/\b(goa|goan|uncle|uncles|delhi|mumbai|temple|mandir|church|mosque|masjid|gurudwara|prasad|pandit|priest|pooja|puja|aarti)\b|[\u{1F300}-\u{1FAFF}\u2600-\u27BF]/iu.test(`${t.title} ${t.pitch}`) &&
      !seenTitles.has(t.title.trim().toLowerCase()),
    );
    if (list.length < 6) throw new Error('Fallback to clean vault');

    const stamp = Date.now().toString(36);
    const bases = assignDiverseVisualStyles(
      list.slice(0, 8).map((t, idx) =>
        sanitizeTopic({ id: `live_${stamp}_${idx}`, title: t.title.trim().toUpperCase(), angle: t.angle || 'over-engineer', brand: t.brand || 'Elon Bhai', trendHook: 'Live AI Comedy', pitch: t.pitch.trim() }),
      ),
    );
    return bases.map((base, idx) => {
      const score = list[idx]?.viralScore ?? 92;
      return {
        ...base, brandHeat: score, viralScore: Math.max(78, Math.min(99, Math.round(score))),
        hookCategory: classifyHook(base), situationCategory: classifySituation(base),
      };
    });
  } catch {
    return pickCleanLiveNewsStories({ seenTitles, hookFilter, situationFilter, count: 8 });
  }
}

export async function generateFreeLiveScriptSpec(topic: TopicOption): Promise<{ frames: StoryboardFrameData[]; shots: VideoShotData[] }> {
  const rig = pickCinematographyRig();
  const mech = pickComedyMechanism(cryptoRng());
  const system =
    'Expand this comedy topic into a 6-frame 3x2 storyboard and a tight 5-shot video script (NEVER 6 shots). ' +
    `PRIMARY MECHANISM (${mech.name}): ${mech.rule} PUNCHLINE RULE: ${mech.punchlineRule} ` +
    `${WRITERS_ROOM_RULES} ${rig.directive} ` +
    'Keep every spoken line ultra-short (<= 6 words) so the whole 5-shot video plays fast and punchy. NEVER mention duration, time, timestamps, or aspect ratio. ' +
    'Return ONLY JSON: {"frames":[{"frame":1,"position":"Top Left","framing":"...","action":"...","caption":"short Hinglish"}],"shots":[{"shot":1,"visual":"...","sfx":"...","hindi":"short Devanagari Hindi"}]}';

  const user = `Title: ${topic.title}\nWorld: ${topic.brand}\nPremise: ${topic.pitch}\nExact 6 storyboard positions: Top Left, Top Center, Top Right, Bottom Left, Bottom Center, Bottom Right. Exactly 5 video shots (1 to 5).`;
  try {
    const raw = await callFreeAI(system, user, 18000);
    const parsed = JSON.parse(extractJson(raw)) as { frames?: StoryboardFrameData[]; shots?: VideoShotData[] };
    if (parsed.frames?.length === 6 && parsed.shots && parsed.shots.length >= 4 && parsed.shots.length <= 5) {
      return { frames: parsed.frames, shots: parsed.shots };
    }
  } catch {
    // Fallback cleanly below
  }
  return expandCustomIdeaLocally(topic);
}
