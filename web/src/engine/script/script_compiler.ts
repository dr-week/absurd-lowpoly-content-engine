import type { ScriptNiche } from '../storage/storage_types';
import { TECH_BLUEPRINT } from './blueprints_tech';
import { HISTORY_BLUEPRINT } from './blueprints_history';
import { GROWTH_BLUEPRINT } from './blueprints_growth';
import { SCIENCE_BLUEPRINT } from './blueprints_science';
import {
  computeWordBudget,
  countSpokenWords,
  estimateSpokenSeconds,
} from './pacing_calc';
import { sanitizeAudioFirst } from './visual_gate';
import type { CompiledBeat, CompiledScript, NicheBlueprint } from './script_types';

const BLUEPRINTS: Record<ScriptNiche, NicheBlueprint> = {
  tech: TECH_BLUEPRINT,
  history: HISTORY_BLUEPRINT,
  growth: GROWTH_BLUEPRINT,
  science: SCIENCE_BLUEPRINT,
};

export interface CompileOptions {
  niche: ScriptNiche;
  topic: string;
  targetDurationSec?: number;
  includeVisuals?: boolean;
}

export function compileScript(opts: CompileOptions): CompiledScript {
  const bp = BLUEPRINTS[opts.niche];
  const cleanTopic = opts.topic.trim() || 'local-first software';
  const targetDurationSec = Math.max(15, Math.min(90, opts.targetDurationSec ?? 20));
  const includeVisuals = opts.includeVisuals ?? false;
  const scale = targetDurationSec / 20;

  const beats: CompiledBeat[] = bp.beats.map((b) => {
    const raw = b.template.replace(/\{topic\}/g, cleanTopic);
    const withVisual = includeVisuals ? `${raw} ${b.visualCue}` : raw;
    const spokenText = sanitizeAudioFirst(withVisual, includeVisuals);
    const targetSec = Math.max(2, Math.round(b.targetSec * scale));
    return {
      id: b.id,
      label: b.label,
      transition: b.transition,
      spokenText,
      visualCue: b.visualCue,
      targetSec,
      actualSec: estimateSpokenSeconds(spokenText),
      wordCount: countSpokenWords(spokenText),
    };
  });

  const combinedText = beats.map((b) => b.spokenText).join(' ');
  const totalWords = beats.reduce((acc, b) => acc + b.wordCount, 0);
  const totalSec = Number(beats.reduce((acc, b) => acc + b.actualSec, 0).toFixed(1));

  return {
    id: `scr_${Date.now().toString(36)}`,
    niche: opts.niche,
    topic: cleanTopic,
    title: `${bp.titlePrefix}: ${cleanTopic}`,
    beats,
    totalWords,
    totalSec,
    targetDurationSec,
    wordBudget: computeWordBudget(targetDurationSec, combinedText),
  };
}
