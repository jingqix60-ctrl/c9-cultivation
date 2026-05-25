const PROFILE_PREFIX = 'c9_profile_';

export interface StoredProgress {
  done: number[];
  retry: number[];
  currentTask: number;
  completed: boolean;
}

function key(profileId: string, chapterId: number): string {
  return `${PROFILE_PREFIX}${profileId}_chapter_${chapterId}`;
}

export function loadProgress(profileId: string, chapterId: number): StoredProgress {
  try {
    const raw = localStorage.getItem(key(profileId, chapterId));
    if (!raw) return { done: [], retry: [], currentTask: 0, completed: false };
    const parsed = JSON.parse(raw);
    return {
      done: parsed.done ?? [],
      retry: parsed.retry ?? [],
      currentTask: parsed.currentTask ?? 0,
      completed: parsed.completed ?? false,
    };
  } catch {
    return { done: [], retry: [], currentTask: 0, completed: false };
  }
}

export function saveProgress(profileId: string, chapterId: number, progress: StoredProgress): void {
  try {
    localStorage.setItem(key(profileId, chapterId), JSON.stringify(progress));
  } catch { /* ignore */ }
}

// ── Profile management ──

export interface Profile {
  id: string;
  name: string;
  createdAt: string;
}

export function getProfiles(): Profile[] {
  try {
    const raw = localStorage.getItem('c9_profiles');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveProfiles(profiles: Profile[]): void {
  localStorage.setItem('c9_profiles', JSON.stringify(profiles));
}

export function getActiveProfileId(): string {
  return localStorage.getItem('c9_active_profile') || '';
}

export function setActiveProfileId(id: string): void {
  localStorage.setItem('c9_active_profile', id);
}

export function createProfile(name: string): Profile {
  const profiles = getProfiles();
  const p: Profile = { id: Date.now().toString(36), name, createdAt: new Date().toISOString().slice(0, 10) };
  profiles.push(p);
  saveProfiles(profiles);
  setActiveProfileId(p.id);
  return p;
}

export function deleteProfile(id: string): void {
  let profiles = getProfiles();
  profiles = profiles.filter(p => p.id !== id);
  saveProfiles(profiles);
  // Clear all chapter data for this profile
  const keys = Object.keys(localStorage).filter(k => k.startsWith(`${PROFILE_PREFIX}${id}_`));
  keys.forEach(k => localStorage.removeItem(k));
  if (getActiveProfileId() === id) {
    setActiveProfileId(profiles.length > 0 ? profiles[0].id : '');
  }
}

export function renameProfile(id: string, name: string): void {
  const profiles = getProfiles().map(p => p.id === id ? { ...p, name } : p);
  saveProfiles(profiles);
}

export function ensureProfile(): Profile {
  const profiles = getProfiles();
  if (profiles.length > 0) {
    const active = getActiveProfileId();
    const found = profiles.find(p => p.id === active);
    if (found) return found;
    setActiveProfileId(profiles[0].id);
    return profiles[0];
  }
  return createProfile('本地学习者');
}

export function exportProfile(id: string): string {
  const data: Record<string, unknown> = {};
  const keys = Object.keys(localStorage).filter(k => k.startsWith(`${PROFILE_PREFIX}${id}_`) || k === 'c9_imported_chapters');
  keys.forEach(k => { data[k] = JSON.parse(localStorage.getItem(k) || 'null'); });
  return JSON.stringify(data, null, 2);
}

export function importProfile(id: string, json: string): void {
  const data = JSON.parse(json);
  for (const [k, v] of Object.entries(data)) {
    if (k.startsWith(`${PROFILE_PREFIX}`) || k === 'c9_imported_chapters') {
      localStorage.setItem(k, JSON.stringify(v));
    }
  }
  setActiveProfileId(id);
}

// ── Chapter-level export/import ──

export interface ExportedProgress {
  version: number;
  exportedAt: string;
  profile: { id: string; name: string; createdAt: string };
  chapters: Record<string, {
    chapterId: number;
    chapterTitle: string;
    done: number[];
    retry: number[];
    currentTask: number;
    completed: boolean;
    masteryPct: number;
  }>;
}

export function exportAllProgress(): ExportedProgress {
  const profile = ensureProfile();
  const chapters: ExportedProgress['chapters'] = {};
  const keys = Object.keys(localStorage).filter(k => k.startsWith(`${PROFILE_PREFIX}${profile.id}_`));
  for (const k of keys) {
    const chapterId = parseInt(k.split('_').pop() || '0');
    const progress = loadProgress(profile.id, chapterId);
    chapters[String(chapterId)] = {
      chapterId,
      chapterTitle: '',
      done: progress.done,
      retry: progress.retry,
      currentTask: progress.currentTask,
      completed: progress.completed,
      masteryPct: 0,
    };
  }
  return { version: 1, exportedAt: new Date().toISOString(), profile, chapters };
}

export function validateImportData(data: unknown): data is ExportedProgress {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  return typeof d.version === 'number'
    && typeof d.exportedAt === 'string'
    && d.profile != null && typeof (d.profile as Record<string,unknown>).id === 'string'
    && d.chapters != null && typeof d.chapters === 'object';
}

export function importAllProgress(data: ExportedProgress, targetProfileId: string): void {
  for (const [, ch] of Object.entries(data.chapters)) {
    saveProgress(targetProfileId, ch.chapterId, {
      done: ch.done, retry: ch.retry, currentTask: ch.currentTask, completed: ch.completed,
    });
  }
  setActiveProfileId(targetProfileId);
}
