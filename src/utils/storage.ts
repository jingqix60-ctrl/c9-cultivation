const STORAGE_PREFIX = 'c9_chapter_';

export interface StoredProgress {
  done: number[];
  retry: number[];
  currentTask: number;
  completed: boolean;
}

export function loadProgress(chapterId: number): StoredProgress {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + chapterId);
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

export function saveProgress(chapterId: number, progress: StoredProgress): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + chapterId, JSON.stringify(progress));
  } catch {
    // Storage full or unavailable — silently fail
  }
}

export function clearProgress(chapterId: number): void {
  try {
    localStorage.removeItem(STORAGE_PREFIX + chapterId);
  } catch {
    // ignore
  }
}
