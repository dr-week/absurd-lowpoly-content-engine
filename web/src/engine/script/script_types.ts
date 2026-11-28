import type { ScriptNiche } from '../storage/storage_types';

export type BeatId = 'hook' | 'setup' | 'escalation' | 'climax' | 'loop';

export interface BlueprintBeat {
  id: BeatId;
  label: string;
  transition: string;
  targetSec: number;
  template: string;
  visualCue: string;
}

export interface NicheBlueprint {
  niche: ScriptNiche;
  titlePrefix: string;
  beats: BlueprintBeat[];
}

export interface CompiledBeat {
  id: BeatId;
  label: string;
  transition: string;
  spokenText: string;
  visualCue: string;
  targetSec: number;
  actualSec: number;
  wordCount: number;
}

export interface CompiledScript {
  id: string;
  niche: ScriptNiche;
  topic: string;
  title: string;
  beats: CompiledBeat[];
  totalWords: number;
  totalSec: number;
  targetDurationSec: number;
  wordBudget: number;
}
