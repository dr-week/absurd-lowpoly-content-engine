import type { CompiledScript } from './script/script_types';

export interface YouTubeShortsMetadata {
  title: string;
  tags: [string, string, string];
  description: string;
}

export function buildYouTubeShortsMetadata(script: CompiledScript): YouTubeShortsMetadata {
  const cleanTitle = `${script.title} #Shorts`.slice(0, 100);
  const tags: [string, string, string] = [
    script.niche,
    'shorts',
    script.topic.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 24) || 'storytelling',
  ];
  const body = script.beats.map((b) => `${b.label}: ${b.spokenText}`).join('\n');
  return {
    title: cleanTitle,
    tags,
    description: `${body}\n\n#Shorts #${tags[0]} #${tags[2]}`,
  };
}

export async function exportScriptToGoogleDoc(
  script: CompiledScript,
  accessToken: string,
): Promise<string> {
  const createRes = await fetch('https://docs.googleapis.com/v1/documents', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title: `${script.title} — 5-Beat Rehearsal Sheet` }),
  });
  if (!createRes.ok) throw new Error(`Docs create failed (${createRes.status})`);
  const doc = (await createRes.json()) as { documentId: string };
  const text = script.beats.map((b) => `[${b.label} · ${b.actualSec}s]\n${b.spokenText}\n`).join('\n');
  const updateRes = await fetch(`https://docs.googleapis.com/v1/documents/${doc.documentId}:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requests: [{ insertText: { location: { index: 1 }, text } }],
    }),
  });
  if (!updateRes.ok) throw new Error(`Docs update failed (${updateRes.status})`);
  return `https://docs.google.com/document/d/${doc.documentId}/edit`;
}
