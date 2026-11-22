import type { DialogueTurn, GeneratedPrompts, VideoShotData } from '../types';

export interface VoiceEnsemble {
  id: string;
  label: string;
  audioHeader: string;
  castByShot: readonly [
    { speaker: string; voice: string; delivery: string },
    { speaker: string; voice: string; delivery: string },
    { speaker: string; voice: string; delivery: string },
    { speaker: string; voice: string; delivery: string },
    { speaker: string; voice: string; delivery: string },
    { speaker: string; voice: string; delivery: string },
  ];
}

export const VOICE_ENSEMBLES: readonly VoiceEnsemble[] = [
  {
    id: 'street-ensemble',
    label: 'Street Ensemble (Hero + 2 NPCs + Entity)',
    audioHeader:
      'Audio: multi-voice spoken Hindi dialogue with distinct character voices, crisp on-screen lip-sync matching each speaker eyeline, reactive NPC-to-NPC street cross-talk, punchy SFX, and sharp hard cuts.',
    castByShot: [
      { speaker: 'PROTAGONIST', voice: 'overconfident urgent tone', delivery: 'on-screen lip-sync, frame-left, looking right' },
      { speaker: 'NPC-1: SHOPKEEPER', voice: 'bored raspy drawl', delivery: 'on-screen lip-sync, frame-right, looking left' },
      { speaker: 'NPC-2: BYSTANDER', voice: 'nosy excited chatter', delivery: 'on-screen lip-sync, mid-frame, turning to NPC-1' },
      { speaker: 'ENTITY: PA / MACHINE', voice: 'tinny robotic speaker chime', delivery: 'diegetic loudspeaker audio, no lip-sync' },
      { speaker: 'PROTAGONIST', voice: 'panicked hushed whisper', delivery: 'on-screen lip-sync, close-up, eyes wide' },
      { speaker: 'NPC-1: SHOPKEEPER', voice: 'ice-cold deadpan sigh', delivery: 'on-screen lip-sync, deadpan straight-face' },
    ],
  },
  {
    id: 'status-duel',
    label: 'Status Duel (VIP vs Deadpan NPC)',
    audioHeader:
      'Audio: Keith-Johnstone status-duel Hindi dialogue—booming high-status hero voice clashing against an unbothered low-key NPC drawl, crisp lip-sync, tight eyelines, and sharp hard cuts.',
    castByShot: [
      { speaker: 'PROTAGONIST', voice: 'booming arrogant command', delivery: 'on-screen lip-sync, chin raised, frame-left' },
      { speaker: 'NPC-1: GUARD', voice: 'flat unbothered monotone', delivery: 'on-screen lip-sync, chewing gum, frame-right' },
      { speaker: 'PROTAGONIST', voice: 'tight strained bluff', delivery: 'on-screen lip-sync, leaning forward' },
      { speaker: 'NPC-1: GUARD', voice: 'calm polite dismissal', delivery: 'on-screen lip-sync, barely glancing up' },
      { speaker: 'NPC-2: CROWD CHORUS', voice: 'hushed gasps and murmurs', delivery: 'background on-screen reactions' },
      { speaker: 'NPC-1: GUARD', voice: 'surgical deadpan mic-drop', delivery: 'on-screen lip-sync, holding eye contact' },
    ],
  },
  {
    id: 'npc-gossip-chorus',
    label: 'Nukkad Natak NPC-to-NPC Chorus',
    audioHeader:
      'Audio: Indian street-theater Nukkad Natak ensemble—two lively NPCs arguing and betting with each other on-screen while the protagonist scrambles, crisp lip-sync, lively street SFX, and sharp hard cuts.',
    castByShot: [
      { speaker: 'NPC-1: TEA SELLER', voice: 'amused streetwise rasp', delivery: 'on-screen lip-sync, nudging NPC-2, frame-left' },
      { speaker: 'NPC-2: AUTO DRIVER', voice: 'skeptical loud scoff', delivery: 'on-screen lip-sync, pointing uphill, frame-right' },
      { speaker: 'PROTAGONIST', voice: 'breathless defensive shout', delivery: 'on-screen lip-sync, mid-action' },
      { speaker: 'NPC-1: TEA SELLER', voice: 'fast side-bet whisper', delivery: 'on-screen lip-sync, leaning to NPC-2' },
      { speaker: 'NPC-2: AUTO DRIVER', voice: 'triumphant cackle', delivery: 'on-screen lip-sync, slapping knee' },
      { speaker: 'NPC-1: TEA SELLER', voice: 'casual deadpan verdict', delivery: 'on-screen lip-sync, turning back to tea' },
    ],
  },
  {
    id: 'entity-interrupt',
    label: 'Entity / Machine Hijack',
    audioHeader:
      'Audio: human panic colliding with cheerful robotic machine/intercom announcements—crisp on-screen lip-sync for human characters, filtered electronic speaker voice for entities, and sharp hard cuts.',
    castByShot: [
      { speaker: 'PROTAGONIST', voice: 'confident casual mutter', delivery: 'on-screen lip-sync, tapping device' },
      { speaker: 'ENTITY: SMART SPEAKER', voice: 'overly cheerful synthetic chime', delivery: 'diegetic speaker box, echoing' },
      { speaker: 'NPC-1: BYSTANDER', voice: 'confused squinting question', delivery: 'on-screen lip-sync, leaning in' },
      { speaker: 'ENTITY: PA ANNOUNCER', voice: 'echoing station megaphone', delivery: 'overhead public loudspeaker' },
      { speaker: 'PROTAGONIST', voice: 'frantic pleading whisper', delivery: 'on-screen lip-sync, sweating' },
      { speaker: 'ENTITY: PAYMENT BOX', voice: 'bright robotic confirmation', delivery: 'loudspeaker ding, instant cut to black' },
    ],
  },
  {
    id: 'doc-vo-contrast',
    label: 'Documentary V.O. vs Live Lip-Sync',
    audioHeader:
      'Audio: grave wildlife-documentary off-screen Hindi narrator contrasting frantic live on-screen lip-sync shouts from characters and NPCs, punchy SFX, and sharp hard cuts.',
    castByShot: [
      { speaker: 'NARRATOR (V.O.)', voice: 'grave wildlife-documentary baritone', delivery: 'off-screen voiceover' },
      { speaker: 'PROTAGONIST', voice: 'panicked live shout', delivery: 'on-screen lip-sync, frame-left' },
      { speaker: 'NPC-1: WITNESS', voice: 'blunt irritated retort', delivery: 'on-screen lip-sync, frame-right' },
      { speaker: 'NARRATOR (V.O.)', voice: 'solemn anthropological whisper', delivery: 'off-screen voiceover' },
      { speaker: 'NPC-2: BYSTANDER', voice: 'deadpan dry comment', delivery: 'on-screen lip-sync, shaking head' },
      { speaker: 'NARRATOR (V.O.)', voice: 'deadpan final verdict', delivery: 'off-screen voiceover, instant cut to black' },
    ],
  },
  {
    id: 'noir-whisper',
    label: 'Noir Hushed Confrontation',
    audioHeader:
      'Audio: tense hushed noir dialogue—low gravelly whispers, heavy pauses, sharp NPC interruptions, crisp on-screen lip-sync, moody foley SFX, and hard cuts.',
    castByShot: [
      { speaker: 'PROTAGONIST', voice: 'low gravelly whisper', delivery: 'on-screen lip-sync, shadowed profile' },
      { speaker: 'NPC-1: INFORMANT', voice: 'nervous clipped mutter', delivery: 'on-screen lip-sync, glancing sideways' },
      { speaker: 'PROTAGONIST', voice: 'icy slow ultimatum', delivery: 'on-screen lip-sync, tight close-up' },
      { speaker: 'NPC-2: WAITRESS', voice: 'cheerful oblivious interruption', delivery: 'on-screen lip-sync, holding bill' },
      { speaker: 'PROTAGONIST', voice: 'cracking composure', delivery: 'on-screen lip-sync, blinking fast' },
      { speaker: 'NPC-1: INFORMANT', voice: 'dry sarcastic sign-off', delivery: 'on-screen lip-sync, walking away' },
    ],
  },
];

export function pickVoiceEnsemble(seed = 0): VoiceEnsemble {
  return VOICE_ENSEMBLES[Math.abs(seed) % VOICE_ENSEMBLES.length];
}

const cleanHindi = (s: string): string => s.replace(/[\u{1F300}-\u{1FAFF}\u2600-\u27BF]/gu, '').trim();

export function formatShotDialogue(shot: VideoShotData, ensembleSeed = 0): string[] {
  if (shot.turns && shot.turns.length > 0) {
    return shot.turns.map((turn: DialogueTurn, idx: number) => {
      const prefix = idx === 0 ? 'Speaker' : 'Immediately';
      return `${prefix} [${turn.speaker} — ${turn.voice}, ${turn.delivery}]: "${cleanHindi(turn.hindi)}"`;
    });
  }
  const ensemble = pickVoiceEnsemble(ensembleSeed);
  const slot = ensemble.castByShot[Math.max(0, Math.min(5, shot.shot - 1))];
  return [`Speaker [${slot.speaker} — ${slot.voice}, ${slot.delivery}]: "${cleanHindi(shot.hindi)}"`];
}

const AUDIO_HEADER_RE = /Audio:[^.]+\./;
const SPEAKER_LINE_RE = /^Speaker \[[^\]]+\]: "([^"]*)"$/gm;

export function cycleVoiceEnsemble(
  prompts: GeneratedPrompts,
  step: number,
): { prompts: GeneratedPrompts; label: string } {
  const ens = pickVoiceEnsemble(step);
  let idx = 0;
  let nextVid = AUDIO_HEADER_RE.test(prompts.videoPrompt)
    ? prompts.videoPrompt.replace(AUDIO_HEADER_RE, ens.audioHeader)
    : prompts.videoPrompt;

  nextVid = nextVid.replace(SPEAKER_LINE_RE, (_m, line: string) => {
    const slot = ens.castByShot[Math.min(5, idx)];
    idx += 1;
    return `Speaker [${slot.speaker} — ${slot.voice}, ${slot.delivery}]: "${line}"`;
  });

  return { label: ens.label, prompts: { ...prompts, videoPrompt: nextVid } };
}
