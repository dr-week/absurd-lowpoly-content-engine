// Visual Director & Cinematography Randomizer: prevents identical camera/animation templates across storyboards

export interface CameraProfile {
  name: string;
  lighting: string;
  framings: [string, string, string, string, string, string];
  transitions: [string, string, string, string, string, string];
  ambienceSfx: string;
  pauseSfx: string;
  aftermathSfx: string;
  endSfx: string;
}

export const CAMERA_PROFILES: readonly CameraProfile[] = [
  {
    name: 'cctv-surveillance',
    lighting: 'harsh fluorescent green-grey tint',
    framings: ['High-corner CCTV wide angle', 'Abrupt digital zoom-in', 'Grainy overhead close-up', 'Tilted security-cam wide shot', 'Static ceiling-corner angle', 'Sudden tight face crop'],
    transitions: ['', 'Hard cut to', 'Digital snap-zoom to', 'Hard cut to', 'Cut to static overhead', 'Abrupt zoom onto'],
    ambienceSfx: 'Faint fluorescent ballast hum',
    pauseSfx: 'Dry CCTV tape hiss',
    aftermathSfx: 'Distant ceiling vent rattle',
    endSfx: 'VHS click and bass thump, instant hard cut to black',
  },
  {
    name: 'handheld-camcorder',
    lighting: 'washed-out 1998 camcorder daylight',
    framings: ['Over-the-shoulder handheld shot', 'Jerky side-pan medium shot', 'Tight Dutch-tilt close-up', 'Low-angle shaky wide shot', 'Awkward two-shot from hip level', 'Crash-zoom close-up'],
    transitions: ['', 'Whip-pan to', 'Snap cut to', 'Hard cut to low angle', 'Cut to awkward two-shot', 'Sudden crash-zoom onto'],
    ambienceSfx: 'Muffled camcorder mic wind and room murmur',
    pauseSfx: 'Brief dead-air tape hum',
    aftermathSfx: 'Faint background chatter and floor creak',
    endSfx: 'Abrupt camcorder stop beep, instant hard cut to black',
  },
  {
    name: 'symmetrical-deadpan',
    lighting: 'flat overcast neutral lighting',
    framings: ['Centered symmetrical wide shot', 'Crisp 90-degree profile shot', 'Extreme eye-level close-up', 'Flat-on wide room shot', 'Still deadpan medium two-shot', 'Front-facing tight portrait'],
    transitions: ['', 'Sharp profile cut to', 'Smash-cut to', 'Hard cut to flat wide shot', 'Cut to still two-shot', 'Instant smash-cut to'],
    ambienceSfx: 'Quiet ticking wall clock and ambient hum',
    pauseSfx: 'Uncomfortable two-beat silence',
    aftermathSfx: 'Single distant metallic clink',
    endSfx: 'Heavy low-bit bass drop, instant hard cut to black',
  },
  {
    name: 'low-angle-dramatic',
    lighting: 'moody dim sodium-yellow glow',
    framings: ['Worm-eye establishing shot', 'Fast push-in medium shot', 'Off-center crooked close-up', 'Sweeping wide-angle shot', 'Frozen wide aftermath shot', 'Low-angle upward close-up'],
    transitions: ['', 'Fast cut to', 'Jolt cut to', 'Hard cut to wide angle', 'Cut to frozen wide view', 'Whip-pan upward to'],
    ambienceSfx: 'Low city rumble and dim electrical buzz',
    pauseSfx: 'Hollow room echo',
    aftermathSfx: 'Soft settling debris dust',
    endSfx: 'Punchy retro snare + bass hit, instant hard cut to black',
  },
  {
    name: 'news-broadcast',
    lighting: 'bright sterile studio halogen glare',
    framings: ['Broadcast waist-up framing', 'Sudden zoom onto action', 'Stunned bystander close-up', 'Wide chaotic coverage shot', 'Deadpan shoulder-level shot', 'Direct-to-lens close-up'],
    transitions: ['', 'Live-switch cut to', 'Cut to close-up of', 'Wide-angle switch to', 'Hard cut to', 'Snap-in direct to'],
    ambienceSfx: 'Faint studio air-conditioning hum',
    pauseSfx: 'Open-mic static hiss',
    aftermathSfx: 'Quiet shuffling papers',
    endSfx: 'News sting cutoff + bass hit, instant hard cut to black',
  },
];

export const REACTION_STAGINGS: readonly string[] = [
  'slowly turns their head 90 degrees with zero expression',
  'checks their watch calmly while ignoring the chaos',
  'blinks once in stiff low-FPS motion and adjusts their collar',
  'tilts their head 15 degrees sideways staring straight ahead',
  'takes one tiny step back without changing posture',
  'looks down at the floor then straight back up deadpan',
];

export const PAYOFF_STAGINGS: readonly string[] = [
  'holds up a tiny paper receipt right in front of the lens',
  'turns stiffly toward the camera with hands behind their back',
  'points one rigid finger directly at the protagonist without blinking',
  'steps calmly into frame adjusting their glasses',
  'extends one flat hand expectantly with zero emotion',
  'leans slightly over the counter staring straight into the lens',
];
