import type { GeneratedPrompts, VideoShotData } from '../types';

type CastSlot = { speaker: string; voice: string; delivery: string };

export interface VoiceEnsemble {
  id: string;
  label: string;
  audioHeader: string;
  castByShot: readonly [CastSlot, CastSlot, CastSlot, CastSlot, CastSlot];
}

export const VOICE_ENSEMBLES: readonly VoiceEnsemble[] = [
  {
    id: 'narrator-hero-duo', label: 'Narrator V.O. + Character Duo',
    audioHeader: 'Audio: crisp studio-clean Hindi voiceover and character lip-sync—strictly ONLY the exact scripted Speaker lines below are voiced, NO improvised background chatter, NO unnamed bystanders speaking, NO reading stage directions aloud.',
    castByShot: [
      { speaker: 'NARRATOR (V.O.)', voice: 'deep dry deadpan Indian male studio baritone, warm unhurried cadence', delivery: 'off-screen voiceover, crisp studio mic' },
      { speaker: 'PROTAGONIST', voice: 'expressive mid-register conversational Indian voice, earnest tone', delivery: 'on-screen lip-sync, natural pacing' },
      { speaker: 'NARRATOR (V.O.)', voice: 'deep dry deadpan Indian male studio baritone, warm unhurried cadence', delivery: 'off-screen voiceover' },
      { speaker: 'PROTAGONIST', voice: 'expressive mid-register conversational Indian voice, tense tone', delivery: 'on-screen lip-sync' },
      { speaker: 'NARRATOR (V.O.)', voice: 'deep dry deadpan Indian male studio baritone, surgical dry delivery', delivery: 'off-screen voiceover, instant cut to black' },
    ],
  },
  {
    id: 'status-duel', label: 'Status Duel (Hero vs Deadpan Counterpart)',
    audioHeader: 'Audio: clean two-voice contrast—confident character voice vs flat deadpan counterpart, crisp lip-sync, strictly ONLY the exact scripted Speaker lines below are voiced, NO background chatter or improvised NPC lines.',
    castByShot: [
      { speaker: 'PROTAGONIST', voice: 'booming overconfident mid-high male voice, crisp diction', delivery: 'on-screen lip-sync, chin raised' },
      { speaker: 'COUNTERPART', voice: 'flat unbothered low monotone voice, slow calm drawl', delivery: 'on-screen lip-sync, deadpan gaze' },
      { speaker: 'PROTAGONIST', voice: 'strained defensive mid-high voice', delivery: 'on-screen lip-sync' },
      { speaker: 'COUNTERPART', voice: 'calm polite low monotone', delivery: 'on-screen lip-sync' },
      { speaker: 'COUNTERPART', voice: 'surgical deadpan low monotone, dry mic-drop', delivery: 'on-screen lip-sync, holding eye contact' },
    ],
  },
  {
    id: 'doc-vo-contrast', label: 'Documentary V.O. vs Live Character',
    audioHeader: 'Audio: grave wildlife-documentary off-screen Hindi narrator contrasting one crisp live on-screen character voice—strictly ONLY the exact scripted Speaker lines below, zero unscripted crowd speech.',
    castByShot: [
      { speaker: 'NARRATOR (V.O.)', voice: 'grave wildlife-documentary baritone, slow solemn tone', delivery: 'off-screen voiceover' },
      { speaker: 'PROTAGONIST', voice: 'urgent crisp conversational live voice, slightly breathless', delivery: 'on-screen lip-sync' },
      { speaker: 'NARRATOR (V.O.)', voice: 'solemn anthropological baritone', delivery: 'off-screen voiceover' },
      { speaker: 'PROTAGONIST', voice: 'panicked hushed live voice', delivery: 'on-screen lip-sync' },
      { speaker: 'NARRATOR (V.O.)', voice: 'ice-cold deadpan documentary baritone', delivery: 'off-screen voiceover, instant cut to black' },
    ],
  },
  {
    id: 'deadpan-solo', label: 'Single Deadpan Narrator (Pure V.O.)',
    audioHeader: 'Audio: single clean studio-recorded deadpan Indian male narrator (V.O.) speaking ultra-short Hindi lines—all on-screen characters remain strictly silent with zero lip-sync or background chatter.',
    castByShot: [
      { speaker: 'NARRATOR (V.O.)', voice: 'calm dry deadpan Indian male narrator, unhurried baritone', delivery: 'off-screen voiceover' },
      { speaker: 'NARRATOR (V.O.)', voice: 'calm dry deadpan Indian male narrator, slight amused pause', delivery: 'off-screen voiceover' },
      { speaker: 'NARRATOR (V.O.)', voice: 'calm dry deadpan Indian male narrator', delivery: 'off-screen voiceover' },
      { speaker: 'NARRATOR (V.O.)', voice: 'calm dry deadpan Indian male narrator', delivery: 'off-screen voiceover' },
      { speaker: 'NARRATOR (V.O.)', voice: 'calm dry deadpan Indian male narrator, flat final verdict', delivery: 'off-screen voiceover, instant cut to black' },
    ],
  },
  {
    id: 'noir-whisper', label: 'Noir Hushed Confrontation',
    audioHeader: 'Audio: moody hushed noir voices—low gravelly whispers and crisp pauses, strictly ONLY the exact scripted Speaker lines below, zero off-script chatter or background voices.',
    castByShot: [
      { speaker: 'NARRATOR (V.O.)', voice: 'smoky low gravelly noir baritone, slow measured pace', delivery: 'off-screen voiceover' },
      { speaker: 'PROTAGONIST', voice: 'tense clipped low whisper, crisp consonants', delivery: 'on-screen lip-sync, shadowed profile' },
      { speaker: 'COUNTERPART', voice: 'icy calm flat voice', delivery: 'on-screen lip-sync' },
      { speaker: 'PROTAGONIST', voice: 'cracking hushed voice', delivery: 'on-screen lip-sync' },
      { speaker: 'COUNTERPART', voice: 'dry sarcastic flat sign-off, unhurried pace', delivery: 'on-screen lip-sync, walking away' },
    ],
  },
];

export function pickVoiceEnsemble(seed = 0): VoiceEnsemble {
  return VOICE_ENSEMBLES[Math.abs(seed) % VOICE_ENSEMBLES.length];
}

const STAGE_LEAK_RE = /\[[^\]]*\]|\([^)]*\)|\b(?:SFX|Shot\s*\d+|Dialogue|Camera|Cut to):[^।.!?]*/gi;
const DANGLING_END_RE = /\s+(?:और|लेकिन|कि|पर|को|के|का|की|में|से|भी|तो|ही|ने)$/u;

/** Optimizes spoken Hindi to <= 6 grammatically complete words with zero leaked stage directions. */
export function optimizeMicroDialogue(line: string, maxWords = 6): string {
  const cleaned = line
    .replace(/[\u{1F300}-\u{1FAFF}\u2600-\u27BF]/gu, '')
    .replace(STAGE_LEAK_RE, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return cleaned;

  const clauses = cleaned.split(/[,—;]/).map((c) => c.trim()).filter(Boolean);
  const punchClause = [...clauses].reverse().find((c) => {
    const n = c.split(/\s+/).length;
    return n >= 2 && n <= maxWords;
  });
  const base = punchClause ?? words.slice(0, maxWords).join(' ').replace(DANGLING_END_RE, '').trim();
  return /[।?!]$/.test(base) ? base : `${base}।`;
}

function resolveShotSlot(shot: VideoShotData, ensembleSeed: number): CastSlot {
  if (shot.turns && shot.turns.length > 0) {
    const t = shot.turns[0];
    return { speaker: t.speaker, voice: t.voice, delivery: t.delivery };
  }
  const ensemble = pickVoiceEnsemble(ensembleSeed);
  const idx = shot.shot >= 5 ? 4 : Math.max(0, Math.min(3, shot.shot - 1));
  return ensemble.castByShot[idx];
}

/** Builds an explicit Voice Cast directory describing EVERY speaking voice before Shot 1. */
export function buildVoiceCastBible(shots: VideoShotData[], ensembleSeed = 0): string {
  const seen = new Map<string, CastSlot>();
  for (let i = 0; i < shots.length; i += 1) {
    const shot = shots[i];
    if (shot.shot !== 1 && shot.shot !== 2 && i !== shots.length - 1) continue;
    const slot = resolveShotSlot(shot, ensembleSeed);
    if (!seen.has(slot.speaker)) seen.set(slot.speaker, slot);
  }
  const rows = Array.from(seen.values()).map((s) => `- ${s.speaker}: ${s.voice} (${s.delivery}).`);
  return `Voice Cast (strictly ONLY these voices speak; zero extra speakers):\n${rows.join('\n')}`;
}

export function formatShotDialogue(shot: VideoShotData, ensembleSeed = 0): string[] {
  const slot = resolveShotSlot(shot, ensembleSeed);
  const raw = shot.turns?.[0]?.hindi ?? shot.hindi;
  return [`Speaker [${slot.speaker} — ${slot.voice}, unhurried pace, ${slot.delivery}]: "${optimizeMicroDialogue(raw)}"`];
}

const VOICE_CAST_RE = /Voice Cast \(strictly ONLY these voices speak; zero extra speakers\):(?:\n- [^\n]+)+/;
const AUDIO_HEADER_RE = /Audio:[^.]+\./;
const SPEAKER_LINE_RE = /^Speaker \[[^\]]+\]: "([^"]*)"$/gm;

export function cycleVoiceEnsemble(prompts: GeneratedPrompts, step: number): { prompts: GeneratedPrompts; label: string } {
  const ens = pickVoiceEnsemble(step);
  const slotOrder = [0, 1, 4];
  const castRows = Array.from(new Map(slotOrder.map((i) => [ens.castByShot[i].speaker, ens.castByShot[i]])).values())
    .map((s) => `- ${s.speaker}: ${s.voice} (${s.delivery}).`);
  let idx = 0;
  let nextVid = AUDIO_HEADER_RE.test(prompts.videoPrompt) ? prompts.videoPrompt.replace(AUDIO_HEADER_RE, ens.audioHeader) : prompts.videoPrompt;
  nextVid = nextVid.replace(VOICE_CAST_RE, `Voice Cast (strictly ONLY these voices speak; zero extra speakers):\n${castRows.join('\n')}`);
  nextVid = nextVid.replace(SPEAKER_LINE_RE, (_m, line: string) => {
    const slot = ens.castByShot[slotOrder[Math.min(2, idx)]];
    idx += 1;
    return `Speaker [${slot.speaker} — ${slot.voice}, unhurried pace, ${slot.delivery}]: "${line}"`;
  });
  return { label: ens.label, prompts: { ...prompts, videoPrompt: nextVid } };
}
