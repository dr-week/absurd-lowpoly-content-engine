export interface CinematographyRig {
  id: string;
  label: string;
  directive: string;
}

export const CINEMATOGRAPHY_RIGS: readonly CinematographyRig[] = [
  {
    id: 'cctv',
    label: 'Overhead Security',
    directive: 'Camera & Lighting: high-corner wide security angle with flat fluorescent green-grey tint.',
  },
  {
    id: 'camcorder',
    label: 'Handheld Action',
    directive: 'Camera & Lighting: raw handheld follow-cam angles with harsh daylight exposure.',
  },
  {
    id: 'broadcast',
    label: 'TV Broadcast',
    directive: 'Camera & Lighting: rigid live TV broadcast framing with sterile overhead halogen glare.',
  },
  {
    id: 'overcast',
    label: 'Deadpan Flat',
    directive: 'Camera & Lighting: symmetrical deadpan static tripod framing under flat overcast grey sky.',
  },
  {
    id: 'sodium',
    label: 'Sodium Night',
    directive: 'Camera & Lighting: dramatic low worm-eye angles under dim sodium-yellow streetlamp glow.',
  },
  {
    id: 'doc',
    label: 'Zoom-In Doc',
    directive: 'Camera & Lighting: earnest documentary zoom-ins with muted tungsten indoor tones.',
  },
];

/** Uniform crypto-backed PRNG working in both modern browsers and Node 24. */
export function cryptoRng(): number {
  if (typeof globalThis.crypto !== 'undefined' && typeof globalThis.crypto.getRandomValues === 'function') {
    const buf = new Uint32Array(1);
    globalThis.crypto.getRandomValues(buf);
    return buf[0] / 4294967296;
  }
  return Math.random();
}

export function cryptoShuffle<T>(items: readonly T[], rng: () => number = cryptoRng): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function pickCinematographyRig(rng: () => number = cryptoRng): CinematographyRig {
  const idx = Math.floor(rng() * CINEMATOGRAPHY_RIGS.length) % CINEMATOGRAPHY_RIGS.length;
  return CINEMATOGRAPHY_RIGS[idx];
}
