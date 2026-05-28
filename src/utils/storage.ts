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
  if (typeof d.version !== 'number') return false;
  if (typeof d.exportedAt !== 'string') return false;
  if (!d.profile || typeof (d.profile as Record<string,unknown>).id !== 'string') return false;
  if (!d.chapters || typeof d.chapters !== 'object') return false;
  // Validate at least one chapter has required fields
  const chapters = d.chapters as Record<string, Record<string, unknown>>;
  const entries = Object.values(chapters);
  if (entries.length > 0) {
    const first = entries[0];
    if (typeof first.chapterId !== 'number' || !Array.isArray(first.done) || !Array.isArray(first.retry)) return false;
  }
  return true;
}

export function importAllProgress(data: ExportedProgress, targetProfileId: string): void {
  for (const [, ch] of Object.entries(data.chapters)) {
    saveProgress(targetProfileId, ch.chapterId, {
      done: ch.done, retry: ch.retry, currentTask: ch.currentTask, completed: ch.completed,
    });
  }
  setActiveProfileId(targetProfileId);
}

// ═══════════ 共享档案 ═══════════

export interface SharedProfileEntry {
  id: string;
  name: string;
  updatedAt: string;
  chapters: Record<number, { mastery: number; doneCount: number; totalCount: number }>;
}

/** 将当前活跃档案的进度压缩为分享码 */
/** 获取当前活跃档案的完整进度（含所有章节） */
export function getActiveProfileProgress(): SharedProfileEntry {
  const profile = ensureProfile();
  const chapters: SharedProfileEntry['chapters'] = {};
  const keys = Object.keys(localStorage).filter(k => k.startsWith(`${PROFILE_PREFIX}${profile.id}_chapter_`));
  for (const k of keys) {
    const chapterId = parseInt(k.split('_').pop() || '0');
    const progress = loadProgress(profile.id, chapterId);
    let totalCount = 0;
    try {
      const chaptersRaw = localStorage.getItem('c9_imported_chapters');
      if (chaptersRaw) {
        const chs = JSON.parse(chaptersRaw);
        const chInfo = chs.find((c: Record<string, unknown>) => c.chapterId === chapterId);
        if (chInfo) totalCount = (chInfo as Record<string, number>).taskCount || 0;
      }
    } catch { /* ignore */ }
    const doneCount = progress.done.length;
    const mastery = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
    chapters[chapterId] = { mastery, doneCount, totalCount: Math.max(totalCount, doneCount) };
  }
  return { id: profile.id, name: profile.name, updatedAt: new Date().toISOString(), chapters };
}

export function generateShareCode(): string {
  const entry = getActiveProfileProgress();
  try {
    return btoa(JSON.stringify(entry));
  } catch {
    return JSON.stringify(entry);
  }
}

/** 解析分享码 */
export function parseShareCode(code: string): SharedProfileEntry | null {
  try {
    let json: string;
    try { json = atob(code); } catch { json = code; }
    const data = JSON.parse(json);
    if (data && typeof data.id === 'string' && typeof data.name === 'string' && data.chapters) {
      return data as SharedProfileEntry;
    }
    return null;
  } catch { return null; }
}

const SHARED_PROFILES_KEY = 'c9_shared_profiles';

/** 获取已导入的共享档案列表 */
export function getSharedProfiles(): SharedProfileEntry[] {
  try {
    const raw = localStorage.getItem(SHARED_PROFILES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveSharedProfiles(profiles: SharedProfileEntry[]): void {
  localStorage.setItem(SHARED_PROFILES_KEY, JSON.stringify(profiles));
}

/** 导入一个分享码，添加到共享档案列表 */
export function importShareCode(code: string): { success: boolean; error?: string; entry?: SharedProfileEntry } {
  const entry = parseShareCode(code);
  if (!entry) return { success: false, error: '分享码格式不正确' };
  if (!entry.name.trim()) return { success: false, error: '档案名称无效' };
  const profiles = getSharedProfiles().filter(p => p.id !== entry.id);
  profiles.push(entry);
  saveSharedProfiles(profiles);
  return { success: true, entry };
}

/** 删除共享档案 */
export function removeSharedProfile(id: string): void {
  saveSharedProfiles(getSharedProfiles().filter(p => p.id !== id));
}
