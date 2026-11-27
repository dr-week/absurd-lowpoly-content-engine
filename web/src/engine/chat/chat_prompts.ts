import type { ScoredTopic } from '../../types.ts';
import { compileScript } from '../script/script_compiler.ts';

export const CHAT_STARTERS = [
  { title: '5-Beat Hinglish Reel', sub: 'Deadpan society lift audit script', prompt: 'Write a 5-beat Hinglish comedy script about a mandatory Aadhaar scan inside the society lift.' },
  { title: 'Parody World News', sub: 'Elone Maask vs Bengaluru traffic', prompt: 'Pitch 3 absurd breaking-news premises where Elone Maask tries solving Bengaluru traffic.' },
  { title: 'Punch Up My Premise', sub: 'Sharper escalation & deadpan button', prompt: 'Punch up a comedy bit about parents treating an air fryer like nuclear machinery.' },
  { title: '3 Viral Cold-Open Hooks', sub: 'High-retention first 3 seconds', prompt: 'Give me 3 viral hook variants about corporate 9 AM standup meetings.' },
];

export const CHAT_SLASH_CHIPS = [
  { label: '5-Beat Script', prefix: 'Write a 20s 5-Beat script on: ' },
  { label: 'Hinglish Pass', prefix: 'Convert into deadpan Hinglish with cues: ' },
  { label: 'Punch Up Twist', prefix: 'Heighten the escalation and twist for: ' },
  { label: '3 Hooks', prefix: 'Give me 3 cold-open hooks for: ' },
];

export function buildChatSystemPrompt(activeTopic?: ScoredTopic): string {
  const ctx = activeTopic
    ? `Active Studio Topic: "${activeTopic.title}" — ${activeTopic.pitch} (Angle: ${activeTopic.angle}).`
    : 'No active studio topic selected yet.';
  return [
    'You are the Head Comedy Writer inside Absurd Studio (1998 PS1 low-poly deadpan Indian & global parody shorts).',
    'Write sharp, deadpan, visual-first comedy pitches, 20-second 5-Beat Reels scripts ([DEADPAN], [PAUSE:0.6s], [WHISPER], [CAMERA:zoom-in], [BEAT]), Hinglish dialogue passes, and A/B viral hooks.',
    'Use phonetic parody names when referencing figures (Elone Maask, Doland Trumpe, Moodi-G, Zuckerburge, Ambaani, Giga-Chaad, Salmaan Bhoi, Koohli).',
    'STRICT RULES: Zero emojis. Keep responses concise and structured with clean numbered beats.',
    ctx,
  ].join(' ');
}

export function buildOfflineCowriterReply(prompt: string, activeTopic?: ScoredTopic): string {
  const lower = prompt.toLowerCase();
  const subject =
    prompt
      .replace(/^(write|make|give me|create|punch up|convert|rewrite|pitch)\s+/i, '')
      .replace(/5-beat\s*(script|reel)?\s*(on|for|about)?/i, '')
      .trim() ||
    activeTopic?.title ||
    'Society lift maintenance audit';

  if (lower.includes('hook')) {
    return [
      `3 Deadpan Hook Variants — ${subject}`,
      `1. [DEADPAN] Nobody reads the notice board until "${subject}" becomes a felony. [PAUSE:0.5s]`,
      `2. [CAMERA:tight] At 6:42 AM, Uncleji declared martial law over ${subject}.`,
      `3. [WHISPER] Three engineers tried fixing ${subject}—two are now selling laminated forms.`,
    ].join('\n\n');
  }

  if (lower.includes('hinglish')) {
    return [
      `Hinglish Deadpan Pass — ${subject}`,
      `[01 Hook] [DEADPAN] Bhai sahab, ${subject} ka matter ab seedha Supreme Society Committee mein gaya hai. [PAUSE:0.6s]`,
      `[02 Setup] Subah 7 baje guard ne register khola aur mera naam red pen se underline kar diya.`,
      `[03 Escalation] [CAMERA:zoom-in] Secretary uncle ne laminated chart nikala [PAUSE:0.5s] aur bola posture ka GST alag lagega.`,
      `[04 Twist] [WHISPER] Pata chala yeh rule pichhle Tuesday se mere hi Wi-Fi router pe chal raha tha. [BEAT]`,
      `[05 Payoff] [DEADPAN] Filhaal maine fine elaichi mein bhar diya hai. [PAUSE:0.8s]`,
    ].join('\n\n');
  }

  const compiled = compileScript({
    topic: subject.slice(0, 80),
    blueprintId: lower.includes('chaos') || lower.includes('roast') ? 'household-chaos' : 'absurd-deadpan',
  });
  return `${compiled.title} (${compiled.totalDurationSec}s · ${compiled.wordCount}w)\n\n${compiled.rehearsalText}`;
}
