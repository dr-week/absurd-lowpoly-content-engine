export type VoteValue = 'up' | 'down';
export type TargetKind = 'topic' | 'storyboard' | 'video';
export type ActiveTab = 'studio' | 'saved' | 'analytics' | 'logs';
export type SavedFilter = 'all' | 'pending' | 'done';
export type OutcomeTag = 'flop' | 'good' | 'viral';
export type HookCategory = 'iconic' | 'build' | 'origin' | 'science' | 'tutorial' | 'news';
export type SituationCategory = 'global' | 'coastal' | 'tech' | 'ego' | 'lab' | 'childhood';
export type ThemeName = 'studio' | 'noir';
export type VisualStyle =
  | 'ps1-1998'
  | 'gta6-vice'
  | 'hybrid-1998-gta6'
  | 'cctv-dashcam'
  | 'claymation-stopmo'
  | 'retro-80s-concept'
  | 'isometric-diorama'
  | 'vhs-found-footage'
  | 'noir-monochrome'
  | 'lugan-3d-skit'
  | 'stylized-2d-anime'
  | 'mixed-2d-realworld'
  | 'mixed-2d-3d-collage'
  | 'paper-cutout-stopmo'
  | 'concept-art-gouache'
  | 'ink-wash-blueprint';
export type SourceMode = 'live-free' | 'standalone' | 'gemini' | 'groq' | 'openrouter' | 'backend';

export interface SavedItem {
  topic: ScoredTopic;
  savedAt: string;
  generated: boolean;
  generatedAt?: string;
  outcome?: OutcomeTag;
}

export interface BrandSignal {
  brand: string;
  spendHeat: number;
  hook: string;
  agencyStyle: string;
}

export interface StoryboardFrameData {
  frame: number;
  position: 'Top Left' | 'Top Center' | 'Top Right' | 'Bottom Left' | 'Bottom Center' | 'Bottom Right';
  framing: string;
  action: string;
  caption: string;
}

export type SpeakerRole = 'protagonist' | 'npc1' | 'npc2' | 'entity' | 'narrator';

export interface DialogueTurn {
  speaker: string;
  role: SpeakerRole;
  voice: string;
  delivery: string;
  hindi: string;
}

export interface VideoShotData {
  shot: number;
  visual: string;
  sfx: string;
  hindi: string;
  turns?: DialogueTurn[];
}

export interface TopicOption {
  id: string;
  title: string;
  angle: string;
  brand: string;
  trendHook: string;
  pitch: string;
  visualStyle?: VisualStyle;
  frames?: StoryboardFrameData[];
  shots?: VideoShotData[];
}

export interface ScoredTopic extends TopicOption {
  viralScore: number;
  brandHeat: number;
  hookCategory: HookCategory;
  situationCategory: SituationCategory;
  visualStyle: VisualStyle;
}

export interface GeneratedPrompts {
  topicId: string;
  topicTitle: string;
  angle: string;
  brand: string;
  storyboardPrompt: string;
  videoPrompt: string;
  generatedAt: string;
}

export interface RatingLogEntry {
  id: string;
  timestamp: string;
  kind: TargetKind;
  targetId: string;
  title: string;
  angle: string;
  brand: string;
  viralScore: number;
  vote: VoteValue;
  contentSnapshot?: string;
}

export interface EngineConfig {
  theme: ThemeName;
  sourceMode: SourceMode;
  apiKey: string;
  model: string;
  backendUrl: string;
  batchSize: number;
}

export interface AngleStat {
  angle: string;
  up: number;
  down: number;
  rate: number;
}

export interface TasteAnalytics {
  totalVotes: number;
  upVotes: number;
  downVotes: number;
  approvalRate: number;
  byKind: Record<TargetKind, { up: number; down: number }>;
  byAngle: AngleStat[];
}
