import type { TopicOption, VisualStyle } from '../types';
import { cryptoRng, cryptoShuffle } from './randomizer';

export interface VisualStyleMeta {
  id: VisualStyle;
  label: string;
  badge: string;
  sbDesc: string;
  vidDesc: string;
}

export const VISUAL_STYLE_OPTIONS: readonly VisualStyleMeta[] = [
  {
    id: 'ps1-1998',
    label: '1998 PS1 Low-Poly',
    badge: 'PS1 Low-Poly',
    sbDesc:
      'raw 1998 PlayStation 1 (PS1) / Nintendo 64 (N64) ultra low-poly 3D game screenshots—angular faceted polygons, blurry pixelated bitmap textures, stiff awkward poses, crude Gouraud shading, jagged aliased edges, and muddy retro colors.',
    vidDesc:
      'raw 1998 PlayStation 1 (PS1) / Nintendo 64 (N64) ultra low-poly 3D game graphics—angular faceted polygons, blurry pixelated bitmap textures, stiff robotic animations with jerky low-FPS movement, crude Gouraud shading, jagged aliased edges, and muddy retro colors.',
  },
  {
    id: 'gta6-vice',
    label: 'GTA 6 Vice Gameplay',
    badge: 'GTA 6 HUD',
    sbDesc:
      'authentic GTA 6 / GTA 5 open-world gameplay screenshots—classic over-the-shoulder third-person follow camera, circular GPS radar minimap in the bottom-left corner with pink mission waypoint, flashing wanted-level stars in the top-right corner, weapon/cash HUD counter, sun-drenched Vice-City tropical neon reflections on wet asphalt, and chaotic Ragdoll physics.',
    vidDesc:
      'authentic GTA 6 / GTA 5 open-world gameplay capture—classic third-person follow & drive camera, circular GPS radar minimap in the bottom-left corner, flashing wanted-level stars in the top-right corner, yellow mission objective text at the bottom, chaotic open-world NPC ragdoll physics, and glossy neon wet-asphalt reflections.',
  },
  {
    id: 'hybrid-1998-gta6',
    label: 'PS1 × GTA 6 Hybrid',
    badge: 'PS1 × GTA 6',
    sbDesc:
      '1998 PlayStation 1 (PS1) ultra low-poly 3D blocky characters inside an authentic GTA 6 / GTA 5 open-world gameplay HUD—chunky faceted PS1 polygon characters with circular GPS radar minimap in the bottom-left corner, flashing wanted-level stars in the top-right corner, third-person follow camera, and glossy wet-asphalt Vice-City neon reflections.',
    vidDesc:
      '1998 PlayStation 1 (PS1) ultra low-poly 3D blocky characters inside an authentic GTA 6 / GTA 5 open-world gameplay engine—stiff faceted 1998 PS1 polygon characters moving through glossy neon Vice-City streets with the GTA circular GPS minimap in the bottom-left, flashing wanted stars in the top-right, and third-person getaway camera tracking.',
  },
  {
    id: 'cctv-dashcam',
    label: '240p CCTV & Dashcam',
    badge: '240p CCTV',
    sbDesc:
      'ultra low-quality 240p overhead Indian shop CCTV & traffic dashcam security footage screenshots—wide-angle fisheye lens distortion, green-tinted night-vision or blown-out fluorescent glare, gritty JPEG compression macroblocks, REC blinking red dot in the corner, and raw unscripted surveillance realism.',
    vidDesc:
      'ultra low-quality 240p overhead Indian shop CCTV & traffic dashcam surveillance footage—fixed high-angle wide fisheye security lens, choppy 12-FPS surveillance frame drops, heavy compression artifacts, REC indicator in top corner, and deadpan candid street chaos.',
  },
  {
    id: 'claymation-stopmo',
    label: 'Handcrafted Claymation',
    badge: 'Claymation',
    sbDesc:
      'tactile handcrafted Aardman-style stop-motion plasticine claymation miniature photography—visible thumbprints and sculpt marks on colorful clay characters, miniature physical cardboard-and-wood Indian street sets, soft macro tilt-shift depth of field, and warm practical studio lighting.',
    vidDesc:
      'tactile handcrafted stop-motion plasticine claymation animation—visible thumbprint textures shifting slightly frame-by-frame on clay characters, jerky 12-FPS physical stop-motion movement, miniature tabletop Indian street props, and shallow macro depth of field.',
  },
  {
    id: 'retro-80s-concept',
    label: '1980s Retro Concept Art',
    badge: '80s Concept Art',
    sbDesc:
      '1980s vintage hand-painted Indian sci-fi & pulp textbook airbrush concept art illustration—rich gouache and airbrush textures, dramatic retro-futuristic lighting, weathered paper grain, bold pulp-poster composition, and deadpan retro-industrial machines colliding with everyday Indian street life.',
    vidDesc:
      'living 1980s vintage hand-painted Indian sci-fi & pulp airbrush concept art in motion—textured gouache brushwork, dramatic retro-futuristic rim lighting, subtle vintage film grain, and deadpan retro-industrial contraptions operating in an Indian neighborhood.',
  },
];

export function getVisualStyleMeta(style: VisualStyle): VisualStyleMeta {
  return VISUAL_STYLE_OPTIONS.find((s) => s.id === style) ?? VISUAL_STYLE_OPTIONS[0];
}

/**
 * Assigns a diverse randomized VisualStyle across a batch of topics so every card in the grid
 * pairs its story with a distinct visual aesthetic (1998 PS1, GTA 6 HUD, PS1×GTA6, 240p CCTV, Claymation, 80s Concept Art),
 * while respecting natural story affinities (e.g. GTA-VI Bhai -> GTA 6 / Hybrid).
 */
export function assignDiverseVisualStyles<T extends TopicOption>(
  topics: T[],
  rng: () => number = cryptoRng,
): (T & { visualStyle: VisualStyle })[] {
  const allIds = VISUAL_STYLE_OPTIONS.map((s) => s.id);
  const used = new Set<VisualStyle>();
  for (const t of topics) {
    if (t.visualStyle) used.add(t.visualStyle);
  }
  const unseen = cryptoShuffle(allIds.filter((id) => !used.has(id)), rng);
  const deck = [...unseen, ...cryptoShuffle(allIds, rng), ...cryptoShuffle(allIds, rng)];
  let cursor = 0;

  return topics.map((t) => {
    if (t.visualStyle) return { ...t, visualStyle: t.visualStyle };
    const text = `${t.brand} ${t.title}`.toLowerCase();
    if (/gta/.test(text)) {
      return { ...t, visualStyle: rng() > 0.4 ? 'gta6-vice' : 'hybrid-1998-gta6' };
    }
    const picked = deck[cursor % deck.length];
    cursor += 1;
    return { ...t, visualStyle: picked };
  });
}
