export type BeatRole = 'hook' | 'setup' | 'escalation' | 'twist' | 'payoff';

export interface BlueprintBeat {
  role: BeatRole;
  label: string;
  targetSec: number;
  promptHint: string;
  template: string;
}

export interface ScriptBlueprint {
  id: string;
  name: string;
  style: string;
  beats: [
    BlueprintBeat,
    BlueprintBeat,
    BlueprintBeat,
    BlueprintBeat,
    BlueprintBeat
  ];
}
