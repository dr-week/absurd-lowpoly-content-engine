import type { VisualStyle } from '../types';

export interface VisualStyleMeta {
  id: VisualStyle;
  label: string;
  badge: string;
  negRule: string;
  sbDesc: string;
  vidDesc: string;
}

const NO_2D = 'Strictly NO 2D cartoon art, NO comic ink outlines, NO cel-shading.';
const MIXED_CLEAN = 'Keep mixed-media textures razor-sharp with cohesive lighting and zero generic blurry CGI.';

export const VISUAL_STYLE_OPTIONS: readonly VisualStyleMeta[] = [
  {
    id: 'ps1-1998', label: '1998 Retro Low-Poly', badge: '98 Low-Poly', negRule: NO_2D,
    sbDesc: 'raw late-1990s 32-bit retro console ultra low-poly 3D game screenshots—angular faceted polygons, blurry pixelated bitmap textures, stiff awkward poses, crude Gouraud shading, jagged aliased edges, and muddy retro colors.',
    vidDesc: 'raw late-1990s 32-bit retro console ultra low-poly 3D game graphics—angular faceted polygons, blurry pixelated bitmap textures, stiff robotic animations with jerky low-FPS movement, crude Gouraud shading, jagged aliased edges, and muddy retro colors.',
  },
  {
    id: 'gta6-vice', label: 'Open-World Sandbox HUD', badge: 'Sandbox HUD', negRule: NO_2D,
    sbDesc: 'authentic modern coastal open-world sandbox action-game screenshots—classic over-the-shoulder third-person follow camera, circular GPS radar minimap in the bottom-left corner with pink mission waypoint, flashing wanted-level stars in the top-right corner, sun-drenched tropical neon reflections on wet asphalt, and chaotic Ragdoll physics.',
    vidDesc: 'authentic modern coastal open-world sandbox action-game capture—classic third-person follow & drive camera, circular GPS radar minimap in the bottom-left corner, flashing wanted-level stars in the top-right corner, chaotic open-world NPC ragdoll physics, and glossy neon wet-asphalt reflections.',
  },
  {
    id: 'hybrid-1998-gta6', label: '98 Low-Poly × Sandbox HUD', badge: '98 × Sandbox', negRule: NO_2D,
    sbDesc: 'late-1990s 32-bit ultra low-poly 3D blocky characters inside an open-world coastal sandbox action-game HUD—chunky faceted retro polygon characters with circular GPS radar minimap in the bottom-left corner, flashing wanted-level stars in the top-right corner, and glossy wet-asphalt tropical neon reflections.',
    vidDesc: 'late-1990s 32-bit ultra low-poly 3D blocky characters inside an open-world coastal sandbox action-game engine—stiff faceted retro polygon characters moving through glossy neon coastal streets with a circular GPS minimap in the bottom-left and flashing wanted stars in the top-right.',
  },
  {
    id: 'cctv-dashcam', label: '240p CCTV & Dashcam', badge: '240p CCTV', negRule: NO_2D,
    sbDesc: 'ultra low-quality 240p overhead Indian shop CCTV & traffic dashcam security footage screenshots—wide-angle fisheye lens distortion, green-tinted night-vision or blown-out fluorescent glare, gritty JPEG compression macroblocks, REC blinking red dot in the corner, and raw unscripted surveillance realism.',
    vidDesc: 'ultra low-quality 240p overhead Indian shop CCTV & traffic dashcam surveillance footage—fixed high-angle wide fisheye security lens, choppy 12-FPS surveillance frame drops, heavy compression artifacts, REC indicator in top corner, and deadpan candid street chaos.',
  },
  {
    id: 'claymation-stopmo', label: 'Handcrafted Claymation', badge: 'Claymation', negRule: NO_2D,
    sbDesc: 'tactile handcrafted British-style stop-motion plasticine claymation miniature photography—visible thumbprints and sculpt marks on colorful clay characters, miniature physical cardboard-and-wood street sets, soft macro tilt-shift depth of field, and warm practical studio lighting.',
    vidDesc: 'tactile handcrafted stop-motion plasticine claymation animation—visible thumbprint textures shifting slightly frame-by-frame on clay characters, jerky 12-FPS physical stop-motion movement, miniature tabletop street props, and shallow macro depth of field.',
  },
  {
    id: 'retro-80s-concept', label: '1980s Retro Concept Art', badge: '80s Concept Art', negRule: MIXED_CLEAN,
    sbDesc: '1980s vintage hand-painted sci-fi & pulp textbook airbrush concept art illustration—rich gouache and airbrush textures, dramatic retro-futuristic lighting, weathered paper grain, bold pulp-poster composition, and deadpan retro-industrial machines.',
    vidDesc: 'living 1980s vintage hand-painted sci-fi & pulp airbrush concept art in motion—textured gouache brushwork, dramatic retro-futuristic rim lighting, subtle vintage film grain, and deadpan retro-industrial contraptions.',
  },
  {
    id: 'isometric-diorama', label: 'Isometric Miniature Diorama', badge: 'Isometric Toy', negRule: NO_2D,
    sbDesc: 'tilt-shift isometric miniature architectural diorama photography—overhead 45-degree toy-scale street block, crisp tabletop studio lighting, tiny detailed plastic miniature figures and vehicles, and shallow macro depth of field.',
    vidDesc: 'living tilt-shift isometric miniature diorama in motion—overhead 45-degree toy-scale neighborhood, crisp tabletop studio lighting, tiny miniature vehicles and characters moving with hyper-real stop-motion precision.',
  },
  {
    id: 'vhs-found-footage', label: '1990s VHS Found Footage', badge: '90s VHS', negRule: NO_2D,
    sbDesc: 'raw 1990s home-video VHS camcorder found footage screenshots—analog magnetic tape tracking lines, washed-out chromatic aberration, harsh direct on-camera flash glare, handheld off-center framing, and candid unscripted street chaos.',
    vidDesc: 'raw 1990s home-video VHS camcorder found footage capture—shaky handheld zoom-ins, analog tape hiss and tracking flicker, harsh direct flash lighting, and authentic unscripted street comedy.',
  },
  {
    id: 'noir-monochrome', label: 'Noir Monochrome + Neon', badge: 'Noir Neon', negRule: MIXED_CLEAN,
    sbDesc: 'high-contrast neo-noir monochrome cinema screenshots—deep Venetian-blind black shadows, wet rain-slicked street reflections, sharp chiaroscuro rim lighting, and one single vivid neon-amber accent color popping against stark black-and-white.',
    vidDesc: 'high-contrast neo-noir monochrome cinema capture—dramatic chiaroscuro shadows, pouring rain on wet asphalt, slow moody tracking shots, and one vivid neon-amber accent color contrasting deadpan street comedy.',
  },
  {
    id: 'lugan-3d-skit', label: 'Stylized 3D Viral Skit', badge: '3D Viral Skit', negRule: NO_2D,
    sbDesc: 'clean stylized indie 3D character animation screenshots—smooth simplified matte-shaded 3D figures with big expressive reaction faces, glossy stylized cars and garage props, crisp bright daylight lighting, and exaggerated slapstick vehicle physics.',
    vidDesc: 'clean stylized indie 3D character animation capture—expressive simplified 3D comedy rigs with snappy squash-and-stretch timing, glossy stylized vehicles and street props, crisp daylight lighting, whip-pan reaction cuts, and chaotic slapstick physics.',
  },
  {
    id: 'stylized-2d-anime', label: 'Stylized 2D Graphic Animation', badge: 'Stylized 2D', negRule: MIXED_CLEAN,
    sbDesc: 'bold stylized 2D hand-inked animation screenshots—thick expressive brush ink outlines, vibrant flat cel-shading, dynamic speedlines, exaggerated comedic facial smears, and richly painted watercolor street backgrounds.',
    vidDesc: 'bold stylized 2D hand-inked frame-by-frame animation—snappy 12-FPS smear frames, thick graphic ink outlines, crisp cel-shading, dramatic comedic reaction freeze-frames, and vibrant painted street backdrops.',
  },
  {
    id: 'mixed-2d-realworld', label: '2D Character × Real World', badge: '2D × Real World', negRule: MIXED_CLEAN,
    sbDesc: 'mixed-media hybrid combining flat hand-drawn 2D inked characters composited directly into gritty real-world 4K handheld street photography—realistic contact shadows on wet asphalt and real-world live-action pedestrians reacting deadpan to the 2D character.',
    vidDesc: 'mixed-media live-action hybrid: snappy hand-drawn 2D animated character moving and interacting physically inside real-world 4K handheld street footage with realistic ground shadows, lens shake, and deadpan live-action bystanders.',
  },
  {
    id: 'mixed-2d-3d-collage', label: '2D × 3D Mixed-Media Hybrid', badge: '2D × 3D Hybrid', negRule: MIXED_CLEAN,
    sbDesc: 'kinetic 2D-over-3D mixed-media graphic screenshots—chunky 3D street environments and glossy vehicles colliding with hand-drawn 2D comic impact bursts, halftone dots, sketchy chalk motion trails, and bold 2D reaction overlays.',
    vidDesc: 'kinetic 2D-over-3D mixed-media animation—snappy 3D characters and vehicles animated on twos colliding with hand-drawn 2D smear lines, halftone impact flashes, sketchy chalk overlays, and crisp whip-pan cuts.',
  },
  {
    id: 'paper-cutout-stopmo', label: 'Paper Cutout Collage Stop-Mo', badge: 'Paper Cutout', negRule: MIXED_CLEAN,
    sbDesc: 'tactile torn-paper cutout and magazine-collage stop-motion photography—hand-scissored characters and photographic props pinned onto layered cardboard street stages with visible paper fibers, scotch-tape edges, and warm tabletop studio shadows.',
    vidDesc: 'tactile torn-paper cutout stop-motion animation—hand-scissored collage characters and real-photo props sliding jerkily at 12-FPS across layered cardboard stages with paper-rustle foley and crisp drop shadows.',
  },
  {
    id: 'concept-art-gouache', label: 'Painterly Concept Art Gouache', badge: 'Concept Gouache', negRule: MIXED_CLEAN,
    sbDesc: 'museum-grade painterly film concept art screenshots—rich impasto gouache brushstrokes, dramatic volumetric light shafts, cinematic color-key atmosphere, sculpted environmental silhouettes, and expressive hand-painted textures.',
    vidDesc: 'living painterly film concept art in motion—visible impasto gouache brushwork shifting subtly frame-by-frame, volumetric atmospheric light shafts, cinematic matte-painted street depth, and deadpan comedic staging.',
  },
  {
    id: 'ink-wash-blueprint', label: 'Ink-Wash & Sketchbook Concept', badge: 'Ink Sketchbook', negRule: MIXED_CLEAN,
    sbDesc: 'fine-art architectural sketchbook & ink-wash concept illustrations—expressive sumi-e ink strokes, loose graphite construction lines, warm amber watercolor washes on heavy cotton paper, and dramatic silhouette contrast.',
    vidDesc: 'living architectural sketchbook & ink-wash concept animation—fluid sumi-e brush lines, subtle graphite construction marks animating on twos, warm amber ink washes bleeding softly on textured paper, and crisp comedic pauses.',
  },
];
