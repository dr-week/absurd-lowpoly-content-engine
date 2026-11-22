import type { TopicOption } from '../types';
import { sanitizeTopic } from '../engine/alias_sanitizer';
import { ANTICIPATION_STORIES } from './stories_anticipation';
import { CRAFT_STORIES_A } from './stories_craft_a';
import { CRAFT_STORIES_B } from './stories_craft_b';
import { CRAFT_STORIES_C } from './stories_craft_c';
import { DEBATE_STORIES } from './stories_debates';
import { GTA_STORIES } from './stories_gta';
import { ICONIC_STORIES_B } from './stories_iconic_b';
import { INDIA_MEME_STORIES } from './stories_india_memes';
import { LUGAN_STORIES_B } from './stories_lugan_b';
import { LUGAN_STORIES_C } from './stories_lugan_c';
import { LUGAN_STORIES_D } from './stories_lugan_d';
import { LUGAN_STYLE_STORIES } from './stories_lugan_style';
import { MEME_STORIES } from './stories_meme';
import { MEME_STORIES_B } from './stories_meme_b';
import { NEWS_STORIES } from './stories_news';
import { ORIGIN_STORIES } from './stories_origin';
import { OVERENGINEER_STORIES } from './stories_overengineer';
import { SCIENCE_STORIES } from './stories_science';
import { SLICE_OF_LIFE_STORIES } from './stories_slice_of_life';
import { SPIRAL_STORIES } from './stories_spiral';
import { SUBVERSION_STORIES_A } from './stories_subversion_a';
import { SUBVERSION_STORIES_B } from './stories_subversion_b';
import { SUSPENSE_STORIES } from './stories_suspense';
import { SWAG_CHALLENGE_STORIES } from './stories_swag_challenge';
import { THEATER_STORIES_A } from './stories_theater_a';
import { THEATER_STORIES_B } from './stories_theater_b';
import { TUTORIAL_STORIES } from './stories_tutorial';

export const ALL_BESPOKE_STORIES: readonly TopicOption[] = [
  ...LUGAN_STYLE_STORIES,
  ...LUGAN_STORIES_B,
  ...LUGAN_STORIES_C,
  ...LUGAN_STORIES_D,
  ...THEATER_STORIES_A,
  ...THEATER_STORIES_B,
  ...OVERENGINEER_STORIES,
  ...ORIGIN_STORIES,
  ...NEWS_STORIES,
  ...TUTORIAL_STORIES,
  ...SPIRAL_STORIES,
  ...SCIENCE_STORIES,
  ...CRAFT_STORIES_A,
  ...CRAFT_STORIES_B,
  ...CRAFT_STORIES_C,
  ...MEME_STORIES,
  ...MEME_STORIES_B,
  ...ICONIC_STORIES_B,
  ...GTA_STORIES,
  ...SUSPENSE_STORIES,
  ...DEBATE_STORIES,
  ...INDIA_MEME_STORIES,
  ...SLICE_OF_LIFE_STORIES,
  ...SWAG_CHALLENGE_STORIES,
  ...SUBVERSION_STORIES_A,
  ...SUBVERSION_STORIES_B,
  ...ANTICIPATION_STORIES,
].map(sanitizeTopic);
