export type VoteValue = 'up' | 'down';
export type TargetKind = 'topic' | 'storyboard' | 'video';
export type ActiveTab = 'studio' | 'analytics' | 'logs';
export type ThemeName = 'studio' | 'noir';
export type SourceMode = 'standalone' | 'gemini' | 'groq' | 'openrouter' | 'backend';

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

export interface VideoShotData {
  shot: number;
  visual: string;
  sfx: string;
  hindi: string;
}

export interface TopicOption {
  id: string;
  title: string;
  angle: string;
  brand: string;
  trendHook: string;
  pitch: string;
  frames?: StoryboardFrameData[];
  shots?: VideoShotData[];
}

export interface ScoredTopic extends TopicOption {
  viralScore: number;
  brandHeat: number;
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
