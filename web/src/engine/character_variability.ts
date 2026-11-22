import { classifySituation } from './taxonomy';
import type { GeneratedPrompts, SituationCategory, TopicOption } from '../types';

export interface CharacterArchetype {
  role: string;
  gender: string;
  profession: string;
  wardrobe: string;
  everydayProp: string;
}

const CAST_BY_SITUATION: Record<SituationCategory, readonly [CharacterArchetype, CharacterArchetype][]> = {
  tech: [
    [
      { role: 'Lead', gender: 'young woman', profession: 'software debugger', wardrobe: 'oversized olive hoodie, round glasses, hair in a messy clip', everydayProp: 'tangled wired earphones & dented steel tiffin box' },
      { role: 'NPC', gender: 'middle-aged man', profession: 'mobile repair technician', wardrobe: 'checkered half-sleeve shirt, jeweler loupe on forehead', everydayProp: 'mini screwdriver set & cracked screen protector' },
    ],
    [
      { role: 'Lead', gender: 'young man', profession: 'night-shift delivery rider', wardrobe: 'neon rain poncho, open-face helmet, canvas sneakers', everydayProp: 'thermal backpack & rubber-band bundle of ₹10 notes' },
      { role: 'NPC', gender: 'elderly woman', profession: 'apartment watchwoman', wardrobe: 'printed cotton saree, wool shawl, thick spectacles', everydayProp: 'brass padlock ring & steel torchlight' },
    ],
  ],
  coastal: [
    [
      { role: 'Lead', gender: 'woman', profession: 'traffic constable', wardrobe: 'crisp khaki uniform, reflective vest, aviators', everydayProp: 'silver whistle & yellow challan clipboard' },
      { role: 'NPC', gender: 'older man', profession: 'roadside coconut seller', wardrobe: 'cotton vest, checkered lungi, sweat towel on shoulder', everydayProp: 'curved machete & blue plastic water crate' },
    ],
    [
      { role: 'Lead', gender: 'young woman', profession: 'solo scooter commuter', wardrobe: 'floral dupatta scarf, backpack, pastel helmet', everydayProp: 'half-folded umbrella & laminated toll receipt' },
      { role: 'NPC', gender: 'middle-aged woman', profession: 'ferry ticket clerk', wardrobe: 'handloom kurta, silver bangles, reading glasses on chain', everydayProp: 'ink stamp pad & torn paper ticket roll' },
    ],
  ],
  ego: [
    [
      { role: 'Lead', gender: 'middle-aged woman', profession: 'strict bank cashier', wardrobe: 'starched mustard cotton saree, neat bun, sharp stare', everydayProp: 'wooden rubber stamp & dusty desk calculator' },
      { role: 'NPC', gender: 'young man', profession: 'flashy wedding DJ', wardrobe: 'sequined bomber jacket, tinted shades, gold chain', everydayProp: 'coiled aux cable & chipped cutting-chai glass' },
    ],
    [
      { role: 'Lead', gender: 'elderly woman', profession: 'veteran boutique tailor', wardrobe: 'teal salwar kameez, measuring tape draped around neck', everydayProp: 'heavy brass scissors & chalk marking wheel' },
      { role: 'NPC', gender: 'older man', profession: 'apartment society treasurer', wardrobe: 'tucked safari shirt, leather belt, wristwatch', everydayProp: 'thick spiral ledger & ballpoint pen on string' },
    ],
  ],
  lab: [
    [
      { role: 'Lead', gender: 'young woman', profession: 'quantum chemist', wardrobe: 'oversized white lab coat over jeans, safety goggles pushed up', everydayProp: 'borosilicate coffee mug & bubbling flask' },
      { role: 'NPC', gender: 'older woman', profession: 'night-shift pharmacist', wardrobe: 'apron over cotton kurta, spectacles', everydayProp: 'blister-pack tray & squeaky plastic stool' },
    ],
    [
      { role: 'Lead', gender: 'non-binary', profession: 'robotics tinkerer', wardrobe: 'utility vest with pockets, rolled sleeves, wrist multimeter', everydayProp: 'soldering iron & plastic lunchbox of resistors' },
      { role: 'NPC', gender: 'elderly man', profession: 'retired physics professor', wardrobe: 'faded tweed jacket, woolen scarf, wire-rim glasses', everydayProp: 'wooden slide rule & brass pocket bell' },
    ],
  ],
  childhood: [
    [
      { role: 'Lead', gender: 'middle-aged woman', profession: 'stern math teacher', wardrobe: 'crisp border saree, chalk-dusted fingers, glasses', everydayProp: 'wooden ruler & dusty blackboard duster' },
      { role: 'NPC', gender: 'young man', profession: 'school bus conductor', wardrobe: 'faded blue uniform shirt, leather ticket satchel', everydayProp: 'metal whistle & rolled attendance sheet' },
    ],
    [
      { role: 'Lead', gender: 'young girl', profession: 'hyper-competitive class topper', wardrobe: 'neat school uniform, double braids, oversized backpack', everydayProp: 'geometry compass box & color-coded timetable' },
      { role: 'NPC', gender: 'older woman', profession: 'stationery shopkeeper', wardrobe: 'floral cotton kurti, bindi, coin apron', everydayProp: 'stapler gun & jar of loose erasers' },
    ],
  ],
  global: [
    [
      { role: 'Lead', gender: 'woman', profession: 'diplomatic translator', wardrobe: 'tailored navy blazer, single earpiece, poised posture', everydayProp: 'spiral shorthand pad & stainless-steel thermos' },
      { role: 'NPC', gender: 'middle-aged man', profession: 'airport customs inspector', wardrobe: 'crisp white uniform shirt, shoulder stripes', everydayProp: 'handheld metal wand & green chalk stick' },
    ],
    [
      { role: 'Lead', gender: 'man', profession: 'live newsroom field reporter', wardrobe: 'rumpled blazer over t-shirt, press lanyard', everydayProp: 'foam-topped handheld mic & tangled power bank' },
      { role: 'NPC', gender: 'woman', profession: 'street flower vendor', wardrobe: 'bright marigold-colored saree, woven basket', everydayProp: 'marigold garland & brass weighing scale' },
    ],
  ],
};

const ALL_PAIRS = Object.values(CAST_BY_SITUATION).flat();
const CAST_DIRECTIVE_RE = /Character & Prop Design:[^.]+\./;

export function formatCastPair(pair: readonly [CharacterArchetype, CharacterArchetype]): string {
  const [a, b] = pair;
  return `Character & Prop Design: Lead is a ${a.gender} ${a.profession} (${a.wardrobe}) with ${a.everydayProp}; opposing NPC is a ${b.gender} ${b.profession} (${b.wardrobe}) with ${b.everydayProp}.`;
}

export function pickSituationCastDirective(topic: Pick<TopicOption, 'title' | 'brand' | 'pitch' | 'angle'>, seed = 0): string {
  const sit = classifySituation({ ...topic, id: '', trendHook: '' });
  const pool = CAST_BY_SITUATION[sit] ?? ALL_PAIRS;
  return formatCastPair(pool[Math.abs(seed) % pool.length]);
}

export function cycleSituationCast(
  prompts: GeneratedPrompts,
  step: number,
): { prompts: GeneratedPrompts; label: string } {
  const pair = ALL_PAIRS[Math.abs(step) % ALL_PAIRS.length];
  const directive = formatCastPair(pair);
  const inject = (text: string): string => {
    if (CAST_DIRECTIVE_RE.test(text)) return text.replace(CAST_DIRECTIVE_RE, directive);
    if (/(Strictly NO 2D cartoon art)/.test(text)) return text.replace(/(Strictly NO 2D cartoon art)/, `${directive} $1`);
    const nl = text.indexOf('\n');
    return nl > 0 ? `${text.slice(0, nl)} ${directive}${text.slice(nl)}` : `${text} ${directive}`;
  };
  return {
    label: `${pair[0].profession} + ${pair[1].profession}`,
    prompts: {
      ...prompts,
      storyboardPrompt: inject(prompts.storyboardPrompt),
      videoPrompt: inject(prompts.videoPrompt),
    },
  };
}
