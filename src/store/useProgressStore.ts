import { create } from 'zustand';
import type { Task, ChapterData } from '../data/types';
import { loadProgress, saveProgress, ensureProfile, exportAllProgress, validateImportData, type StoredProgress } from '../utils/storage';
import { calcStats, getNextTask, calcReviewSchedule, type ChapterStats } from '../utils/progress';

interface ProgressState {
  chapterId: number;
  profileId: string;
  tasks: Task[];
  done: number[];
  retry: number[];
  currentTask: number;
  completed: boolean;
  stats: ChapterStats;
  toastMessage: string | null;
  toastType: 'gr' | 'ac' | 'go' | 'rd';

  // Data
  chapterTitle: string;

  // Actions
  init: (chapterId: number, data: ChapterData) => void;
  markDone: () => void;
  markRetry: () => void;
  goToTask: (taskId: number) => void;
  nextTask: () => void;
  prevTask: () => void;
  clearToast: () => void;
  resetChapter: () => void;
  removeRetry: (taskId: number) => void;
  resetOptions: (opts: { done?: boolean; retry?: boolean }) => void;
  exportAllData: () => { json: string; filename: string };
  importAllData: (json: string) => { success: boolean; error?: string };
  getReviewSchedule: () => { nextReviewDate: string; intervalDays: number; reviewCount: number };
  chapterModules: import('../data/types').ChapterModule[];
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  chapterId: 10,
  tasks: [],
  done: [],
  retry: [],
  currentTask: 0,
  completed: false,
  stats: {} as ChapterStats,
  toastMessage: null,
  toastType: 'gr' as const,
  chapterTitle: '',
  profileId: '',
  chapterModules: [],

  init: (chapterId, data) => {
    const profile = ensureProfile();
    const tasks = data.tasks;
    const saved = loadProgress(profile.id, chapterId);
    const state = get();
    if (state.chapterId === chapterId && state.tasks.length === tasks.length && state.profileId === profile.id) return;

    const current = saved.done.length >= tasks.length && saved.retry.length === 0
      ? -1
      : saved.currentTask < tasks.length
        ? saved.currentTask
        : getNextTask(tasks, saved.done, saved.retry, -1);

    const stats = calcStats(tasks, saved.done, saved.retry);

    set({
      chapterId,
      profileId: profile.id,
      chapterTitle: data.chapterTitle,
      tasks,
      done: saved.done,
      retry: saved.retry,
      currentTask: current >= 0 ? current : 0,
      completed: saved.completed || (saved.done.length >= tasks.length && saved.retry.length === 0),
      stats,
      chapterModules: (data as any).modules || [],
    });
  },

  markDone: () => {
    const { chapterId, profileId, tasks, done, retry, currentTask } = get();
    if (currentTask < 0 || currentTask >= tasks.length) return;

    const newDone = [...done, currentTask];
    const newRetry = retry.filter(id => id !== currentTask);
    const task = tasks[currentTask];

    const progress: StoredProgress = {
      done: newDone,
      retry: newRetry,
      currentTask,
      completed: newDone.length >= tasks.length && newRetry.length === 0,
    };
    saveProgress(profileId, chapterId, progress);

    const stats = calcStats(tasks, newDone, newRetry);

    set({
      done: newDone,
      retry: newRetry,
      stats,
      completed: progress.completed,
      toastMessage: `叮！任务完成 · 掌握度 +${task.reward.mastery}% → ${stats.mastery}%`,
      toastType: 'gr',
    });
  },

  markRetry: () => {
    const { chapterId, profileId, tasks, done, retry, currentTask } = get();
    if (currentTask < 0 || currentTask >= tasks.length) return;

    const newRetry = retry.includes(currentTask) ? retry : [...retry, currentTask];
    const newDone = done.filter(id => id !== currentTask);

    const progress: StoredProgress = {
      done: newDone,
      retry: newRetry,
      currentTask,
      completed: false,
    };
    saveProgress(profileId, chapterId, progress);

    const stats = calcStats(tasks, newDone, newRetry);

    set({
      done: newDone,
      retry: newRetry,
      stats,
      completed: false,
      toastMessage: '心魔入列 · 已加入待重做队列',
      toastType: 'rd',
    });
  },

  goToTask: (taskId) => {
    const { chapterId, profileId, tasks, done, retry } = get();
    const stats = calcStats(tasks, done, retry);
    set({ currentTask: taskId, stats });

    const progress: StoredProgress = { done, retry, currentTask: taskId, completed: get().completed };
    saveProgress(profileId, chapterId, progress);
  },

  nextTask: () => {
    const { tasks, done, retry, currentTask, chapterId, profileId } = get();
    const nxt = getNextTask(tasks, done, retry, currentTask);
    if (nxt >= 0) {
      const stats = calcStats(tasks, done, retry);
      set({ currentTask: nxt, stats });
      const progress: StoredProgress = { done, retry, currentTask: nxt, completed: false };
      saveProgress(profileId, chapterId, progress);
    }
  },

  prevTask: () => {
    const { tasks, done, currentTask, chapterId, profileId, retry } = get();
    // Go to previous done task
    const allVisited = [...done, ...retry].filter(id => id < currentTask);
    const prev = allVisited.length > 0 ? Math.max(...allVisited) : 0;
    const stats = calcStats(tasks, done, retry);
    set({ currentTask: prev, stats });
    const progress: StoredProgress = { done, retry, currentTask: prev, completed: get().completed };
    saveProgress(profileId, chapterId, progress);
  },

  clearToast: () => set({ toastMessage: null }),

  resetChapter: () => {
    const { chapterId, profileId } = get();
    const progress: StoredProgress = { done: [], retry: [], currentTask: 0, completed: false };
    saveProgress(profileId, chapterId, progress);
    set({
      done: [],
      retry: [],
      currentTask: 0,
      completed: false,
      stats: calcStats(get().tasks, [], []),
    });
  },

  removeRetry: (taskId) => {
    const { chapterId, profileId, tasks, done, retry } = get();
    const newRetry = retry.filter(id => id !== taskId);
    const progress: StoredProgress = { done, retry: newRetry, currentTask: taskId, completed: false };
    saveProgress(profileId, chapterId, progress);
    set({ retry: newRetry, stats: calcStats(tasks, done, newRetry) });
  },

  resetOptions: (opts) => {
    const { chapterId, profileId, tasks, done, retry } = get();
    const newDone = opts.done ? [] : done;
    const newRetry = opts.retry ? [] : retry;
    const progress: StoredProgress = { done: newDone, retry: newRetry, currentTask: 0, completed: false };
    saveProgress(profileId, chapterId, progress);
    set({ done: newDone, retry: newRetry, currentTask: 0, completed: false, stats: calcStats(tasks, newDone, newRetry) });
  },

  exportAllData: () => {
    const { chapterId, chapterTitle, done, retry, currentTask, stats } = get();
    const data = exportAllProgress();
    if (data.chapters[String(chapterId)]) {
      data.chapters[String(chapterId)].chapterTitle = chapterTitle;
      data.chapters[String(chapterId)].masteryPct = stats.mastery;
    } else {
      data.chapters[String(chapterId)] = {
        chapterId, chapterTitle, done: [...done], retry: [...retry],
        currentTask, completed: get().completed, masteryPct: stats.mastery,
      };
    }
    const filename = `c9-progress-${data.profile.name}-${new Date().toISOString().slice(0,10)}.json`;
    return { json: JSON.stringify(data, null, 2), filename };
  },

  importAllData: (json: string) => {
    try {
      const data = JSON.parse(json);
      if (!validateImportData(data)) {
        return { success: false, error: 'JSON 格式不正确：缺少必要字段 (version, profile, chapters)' };
      }
      return { success: true };
    } catch (e) {
      return { success: false, error: `JSON 解析失败：${(e as Error).message}` };
    }
  },

  getReviewSchedule: () => {
    const { tasks, done, retry } = get();
    return calcReviewSchedule(tasks, done, retry);
  },
}));
