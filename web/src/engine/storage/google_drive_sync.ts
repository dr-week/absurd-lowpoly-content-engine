const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.appdata';
const BACKUP_FILE_NAME = 'absurd_studio_backup.json';

let accessToken: string | null = null;

interface GoogleOAuth2 {
  initTokenClient(cfg: {
    client_id: string;
    scope: string;
    callback: (resp: { access_token?: string; error?: string }) => void;
  }): { requestAccessToken(opts?: { prompt?: string }): void };
  revoke(token: string, done?: () => void): void;
}

declare global {
  interface Window {
    google?: { accounts?: { oauth2?: GoogleOAuth2 } };
  }
}

export function isGoogleSignedIn(): boolean {
  return Boolean(accessToken);
}

export async function loadGisScript(): Promise<void> {
  if (typeof document === 'undefined') return;
  if (window.google?.accounts?.oauth2) return;
  await new Promise<void>((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load Google Identity Services'));
    document.head.appendChild(s);
  });
}

export async function signInWithGoogle(clientId: string): Promise<string> {
  await loadGisScript();
  const oauth2 = window.google?.accounts?.oauth2;
  if (!oauth2) throw new Error('Google OAuth2 client unavailable');
  return new Promise<string>((resolve, reject) => {
    const client = oauth2.initTokenClient({
      client_id: clientId.trim(),
      scope: DRIVE_SCOPE,
      callback: (resp) => {
        if (resp.error || !resp.access_token) {
          reject(new Error(resp.error ?? 'Google sign-in cancelled'));
          return;
        }
        accessToken = resp.access_token;
        resolve(accessToken);
      },
    });
    client.requestAccessToken({ prompt: 'consent' });
  });
}

export function signOutGoogle(): void {
  const token = accessToken;
  accessToken = null;
  if (token && window.google?.accounts?.oauth2) {
    window.google.accounts.oauth2.revoke(token);
  }
}

async function findBackupFileId(token: string): Promise<string | null> {
  const q = encodeURIComponent(`name='${BACKUP_FILE_NAME}' and trashed=false`);
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=${q}&fields=files(id,name)`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (!res.ok) throw new Error(`Drive list failed (${res.status})`);
  const data = (await res.json()) as { files?: Array<{ id: string }> };
  return data.files?.[0]?.id ?? null;
}

export async function backupToDriveAppData(payload: unknown): Promise<void> {
  if (!accessToken) throw new Error('Sign in with Google first');
  const existingId = await findBackupFileId(accessToken);
  const boundary = 'absurd_studio_boundary';
  const meta = existingId
    ? { name: BACKUP_FILE_NAME }
    : { name: BACKUP_FILE_NAME, parents: ['appDataFolder'] };
  const body =
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(meta)}\r\n` +
    `--${boundary}\r\nContent-Type: application/json\r\n\r\n${JSON.stringify(payload)}\r\n--${boundary}--`;
  const url = existingId
    ? `https://www.googleapis.com/upload/drive/v3/files/${existingId}?uploadType=multipart`
    : 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
  const res = await fetch(url, {
    method: existingId ? 'PATCH' : 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body,
  });
  if (!res.ok) throw new Error(`Drive backup failed (${res.status})`);
}

export async function restoreFromDriveAppData<T>(): Promise<T | null> {
  if (!accessToken) throw new Error('Sign in with Google first');
  const fileId = await findBackupFileId(accessToken);
  if (!fileId) return null;
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`Drive restore failed (${res.status})`);
  return (await res.json()) as T;
}
