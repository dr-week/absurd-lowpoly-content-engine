import { getBlueprintById } from './blueprints_comedy.ts';
import type { BeatRole } from './blueprints_types.ts';
import {
  extractDeliveryCues,
  formatRehearsalLine,
  stripDeliveryCues,
  type ParsedCue,
} from './delivery_cues.ts';
import {
  calculatePacingSummary,
  countSpokenWords,
  estimateBeatDurationSec,
} from './pacing_calc.ts';
import { sanitizeAudioFirst } from './visual_gate.ts';

export interface CompiledBeat {
  role: BeatRole;
  label: string;
  targetSec: number;
  estimatedSec: number;
  wordCount: number;
  text: string;
  cleanText: string;
  cues: ParsedCue[];
}

export interface CompiledScript {
  id: string;
  title: string;
  topic: string;
  language: string;
  blueprintId: string;
  totalDurationSec: number;
  totalPauseSec: number;
  wordCount: number;
  effectiveWpm: number;
  beats: CompiledBeat[];
  cleanText: string;
  rehearsalText: string;
}

export interface CompileScriptInput {
  topic: string;
  language?: string;
  blueprintId?: string;
  customLines?: Partial<Record<BeatRole, string>>;
}

export function compileScript(input: CompileScriptInput): CompiledScript {
  const topic = input.topic.trim() || 'auto-rickshaw Wi-Fi';
  const language = input.language ?? 'Hinglish';
  const blueprint = getBlueprintById(input.blueprintId);

  const beats: CompiledBeat[] = blueprint.beats.map((bpBeat) => {
    const rawLine =
      input.customLines?.[bpBeat.role] ??
      bpBeat.template.replaceAll('{topic}', topic);
    const { cleanAudio } = sanitizeAudioFirst(rawLine);
    const rehearsal = formatRehearsalLine(cleanAudio);
    return {
      role: bpBeat.role,
      label: bpBeat.label,
      targetSec: bpBeat.targetSec,
      estimatedSec: estimateBeatDurationSec(rehearsal),
      wordCount: countSpokenWords(rehearsal),
      text: rehearsal,
      cleanText: stripDeliveryCues(rehearsal),
      cues: extractDeliveryCues(rehearsal),
    };
  });

  const pacing = calculatePacingSummary(beats);
  const cleanText = beats.map((b) => b.cleanText).join('\n\n');
  const rehearsalText = beats
    .map((b) => `[${b.label}] ${b.text}`)
    .join('\n\n');

  return {
    id: `scr_${Date.now().toString(36)}`,
    title: `${topic} (${blueprint.name})`,
    topic,
    language,
    blueprintId: blueprint.id,
    totalDurationSec: pacing.totalDurationSec,
    totalPauseSec: pacing.totalPauseSec,
    wordCount: pacing.totalWords,
    effectiveWpm: pacing.effectiveWpm,
    beats,
    cleanText,
    rehearsalText,
  };
}
