import { DIRECTORS_STACKS } from '../data/creative_matrix';
import { ALL_BESPOKE_STORIES } from '../data/stories_registry';
import { ACCENT_PROFILES } from './accent_engine';
import { VOICE_ENSEMBLES } from './dialogue_theater';
import { LUGAN_CONTRAST_BLUEPRINTS } from './lugan_formats';
import { MARKETING_GIMMICKS } from './marketing_gimmicks';
import { VISUAL_STYLE_OPTIONS } from './visual_styles';

export type KnowledgeKind = 'book' | 'story' | 'gimmick' | 'style' | 'voice' | 'stack';

export interface KnowledgeRecord {
  id: string;
  kind: KnowledgeKind;
  title: string;
  domain: string;
  summary: string;
  tags: readonly string[];
  payload: Record<string, unknown>;
}

export const MASTER_BOOK_DICTIONARY: readonly Omit<KnowledgeRecord, 'payload'>[] = [
  { id: 'book_hook_point', kind: 'book', title: 'Hook Point (Brendan Kane)', domain: 'marketing', summary: 'Win the 3-second attention war with an immediate pattern-interrupt hook.', tags: ['hook', 'viral', '3-second', 'marketing'] },
  { id: 'book_contagious', kind: 'book', title: 'Contagious (Jonah Berger)', domain: 'marketing', summary: 'STEPPS framework: Social Currency, Triggers, High-Arousal Emotion, Public visibility, Practical value, Stories.', tags: ['stepps', 'sharing', 'viral', 'marketing'] },
  { id: 'book_storybrand', kind: 'book', title: 'Building a StoryBrand (Donald Miller)', domain: 'marketing', summary: 'Frame the customer as Hero with a clear problem, your product as Guide, and vivid stakes.', tags: ['brand', 'hero', 'product', 'marketing'] },
  { id: 'book_breakthrough', kind: 'book', title: 'Breakthrough Advertising (Eugene Schwartz)', domain: 'marketing', summary: 'Match copy to the 5 Stages of Market Awareness and amplify existing mass desire.', tags: ['copywriting', 'desire', 'awareness', 'marketing'] },
  { id: 'book_influence', kind: 'book', title: 'Influence (Robert Cialdini)', domain: 'marketing', summary: 'Social Proof, Scarcity, Authority, Reciprocity, Liking, and Commitment drive instant action.', tags: ['psychology', 'scarcity', 'proof', 'marketing'] },
  { id: 'book_purple_cow', kind: 'book', title: 'Purple Cow (Seth Godin)', domain: 'marketing', summary: 'Build something so remarkable and absurdly different that ignoring it is impossible.', tags: ['remarkable', 'differentiation', 'viral', 'marketing'] },
  { id: 'book_made_to_stick', kind: 'book', title: 'Made to Stick (Chip & Dan Heath)', domain: 'marketing', summary: 'SUCCESs: Simple, Unexpected, Concrete, Credible, Emotional Stories that open curiosity gaps.', tags: ['curiosity', 'unexpected', 'concrete', 'retention'] },
  { id: 'book_science_sharing', kind: 'book', title: 'Viral Marketing: The Science of Sharing (Karen Nelson-Field)', domain: 'marketing', summary: 'High-arousal emotions (hilarity, shock, awe) outperform low-arousal emotions for sharing.', tags: ['emotion', 'arousal', 'shares', 'marketing'] },
  { id: 'book_story_mckee', kind: 'book', title: 'Story (Robert McKee)', domain: 'story', summary: 'Every beat must turn the Value Charge from positive to negative via Expectation vs Reality.', tags: ['beats', 'arc', 'twist', 'story'] },
  { id: 'book_dialogue_mckee', kind: 'book', title: 'Dialogue (Robert McKee)', domain: 'theater', summary: 'Ban on-the-nose exposition; every spoken line is a verbal tactic driven by hidden subtext.', tags: ['dialogue', 'subtext', 'action', 'theater'] },
  { id: 'book_impro', kind: 'book', title: 'Impro (Keith Johnstone)', domain: 'theater', summary: 'Status Transactions: comedy explodes when fixed social rank collides with a status seesaw.', tags: ['status', 'improv', 'npc', 'theater'] },
  { id: 'book_save_the_cat', kind: 'book', title: 'Save the Cat! (Blake Snyder)', domain: 'story', summary: 'Open mid-conflict with instant irony and a crisp beat reversal.', tags: ['beats', 'irony', 'hook', 'story'] },
  { id: 'book_anatomy_story', kind: 'book', title: 'The Anatomy of Story (John Truby)', domain: 'story', summary: 'Organic 7-step spine: Weakness/Need, Desire, Opponent, Plan, Battle, Self-Revelation.', tags: ['opponent', 'desire', 'plan', 'story'] },
  { id: 'book_storyworthy', kind: 'book', title: 'Storyworthy (Matthew Dicks)', domain: 'story', summary: 'Anchor every story on a 5-second moment of realization and contrast the beginning vs end.', tags: ['contrast', 'moment', 'twist', 'story'] },
  { id: 'book_comic_toolbox', kind: 'book', title: 'The Comic Toolbox (John Vorhaus)', domain: 'comedy', summary: 'Comic Opposites & Comedy of Pain: pair dead-serious status with a microscopic petty problem.', tags: ['comedy', 'opposites', 'deadpan', 'status'] },
  { id: 'book_blink_eye', kind: 'book', title: 'In the Blink of an Eye (Walter Murch)', domain: 'film', summary: 'Rule of Six: cut on the exact emotional reaction beat (51% emotion priority).', tags: ['editing', 'cuts', 'pacing', 'film'] },
];

const tokenize = (text: string): string[] =>
  text.toLowerCase().replace(/[^a-z0-9\u0900-\u097f]+/g, ' ').split(/\s+/).filter((t) => t.length >= 2);

export class StructuredKnowledgeDB {
  private readonly dict = new Map<string, KnowledgeRecord>();
  private readonly index = new Map<string, Map<string, number>>();
  private readonly byKind = new Map<KnowledgeKind, KnowledgeRecord[]>();

  insert(rec: KnowledgeRecord): void {
    this.dict.set(rec.id, rec);
    const list = this.byKind.get(rec.kind) ?? [];
    list.push(rec);
    this.byKind.set(rec.kind, list);

    const tokens = tokenize(`${rec.title} ${rec.domain} ${rec.summary} ${rec.tags.join(' ')}`);
    for (const tok of tokens) {
      let postings = this.index.get(tok);
      if (!postings) { postings = new Map(); this.index.set(tok, postings); }
      postings.set(rec.id, (postings.get(rec.id) ?? 0) + 1);
    }
  }

  get(id: string): KnowledgeRecord | undefined { return this.dict.get(id); }
  listByKind(kind: KnowledgeKind): readonly KnowledgeRecord[] { return this.byKind.get(kind) ?? []; }
  get size(): number { return this.dict.size; }

  search(query: string, kind?: KnowledgeKind, limit = 10): KnowledgeRecord[] {
    const terms = tokenize(query);
    if (!terms.length) return (kind ? this.listByKind(kind) : Array.from(this.dict.values())).slice(0, limit);
    const scores = new Map<string, number>();
    const totalDocs = Math.max(1, this.dict.size);

    for (const term of terms) {
      for (const [tok, postings] of this.index) {
        if (!tok.startsWith(term)) continue;
        const idf = Math.log(1 + totalDocs / (1 + postings.size));
        const exactBoost = tok === term ? 1.5 : 1.0;
        for (const [docId, tf] of postings) {
          const doc = this.dict.get(docId);
          if (!doc || (kind && doc.kind !== kind)) continue;
          scores.set(docId, (scores.get(docId) ?? 0) + tf * idf * exactBoost);
        }
      }
    }
    return Array.from(scores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id]) => this.dict.get(id)!)
      .filter(Boolean);
  }
}

let cachedDb: StructuredKnowledgeDB | null = null;

export function getKnowledgeDB(): StructuredKnowledgeDB {
  if (cachedDb) return cachedDb;
  const db = new StructuredKnowledgeDB();
  for (const b of MASTER_BOOK_DICTIONARY) db.insert({ ...b, payload: b });
  for (const g of MARKETING_GIMMICKS) db.insert({ id: `gimmick_${g.id}`, kind: 'gimmick', title: g.label, domain: 'marketing', summary: g.mechanism, tags: ['promo', 'product', g.id], payload: { ...g } });
  for (const s of VISUAL_STYLE_OPTIONS) db.insert({ id: `style_${s.id}`, kind: 'style', title: s.label, domain: 'visual', summary: s.sbDesc, tags: ['style', s.badge, s.id], payload: { ...s } });
  for (const v of VOICE_ENSEMBLES) db.insert({ id: `voice_${v.id}`, kind: 'voice', title: v.label, domain: 'theater', summary: v.audioHeader, tags: ['voice', 'npc', v.id], payload: { ...v } });
  for (const d of DIRECTORS_STACKS) db.insert({ id: `stack_${d.label}`, kind: 'stack', title: d.label, domain: 'film', summary: `${d.book} | ${d.lens} | ${d.editMethod}`, tags: ['film', 'camera', d.book], payload: { ...d } });
  for (const a of ACCENT_PROFILES) db.insert({ id: `accent_${a.id}`, kind: 'voice', title: a.label, domain: 'accent', summary: `${a.languageFlavor} — ${a.trendingWords.join(', ')}`, tags: ['accent', 'slang', ...a.trendingWords], payload: { ...a } });
  for (const l of LUGAN_CONTRAST_BLUEPRINTS) db.insert({ id: `lugan_${l.id}`, kind: 'stack', title: l.label, domain: 'contrast', summary: `${l.splitCards} — ${l.recurringCast}`, tags: ['lugan3d', 'contrast', 'vs', l.id], payload: { ...l } });
  for (const st of ALL_BESPOKE_STORIES) db.insert({ id: `story_${st.id}`, kind: 'story', title: st.title, domain: st.angle, summary: st.pitch, tags: [st.brand, st.angle, st.trendHook], payload: { ...st } });
  cachedDb = db;
  return db;
}
