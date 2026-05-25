import { create } from 'zustand';
import type { Task } from '../data/chapterTypes';
import { loadProgress, saveProgress, type StoredProgress } from '../utils/storage';
import { calcStats, getNextTask, type ChapterStats } from '../utils/progress';

interface ProgressState {
  chapterId: number;
  tasks: Task[];
  done: number[];
  retry: number[];
  currentTask: number;
  completed: boolean;
  stats: ChapterStats;
  toastMessage: string | null;
  toastType: 'gr' | 'ac' | 'go' | 'rd';

  // Actions
  init: (chapterId: number, tasks: Task[]) => void;
  markDone: () => void;
  markRetry: () => void;
  goToTask: (taskId: number) => void;
  nextTask: () => void;
  prevTask: () => void;
  clearToast: () => void;
  resetChapter: () => void;
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
  toastType: 'gr',

  init: (chapterId, tasks) => {
    const saved = loadProgress(chapterId);
    const state = get();
    // Only init if not already or if chapter changed
    if (state.chapterId === chapterId && state.tasks.length > 0) return;

    const current = saved.done.length >= tasks.length && saved.retry.length === 0
      ? -1
      : saved.currentTask < tasks.length
        ? saved.currentTask
        : getNextTask(tasks, saved.done, saved.retry, -1);

    const stats = calcStats(tasks, saved.done, saved.retry);

    set({
      chapterId,
      tasks,
      done: saved.done,
      retry: saved.retry,
      currentTask: current >= 0 ? current : 0,
      completed: saved.completed || (saved.done.length >= tasks.length && saved.retry.length === 0),
      stats,
    });
  },

  markDone: () => {
    const { chapterId, tasks, done, retry, currentTask } = get();
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
    saveProgress(chapterId, progress);

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
    const { chapterId, tasks, done, retry, currentTask } = get();
    if (currentTask < 0 || currentTask >= tasks.length) return;

    const newRetry = retry.includes(currentTask) ? retry : [...retry, currentTask];
    const newDone = done.filter(id => id !== currentTask);

    const progress: StoredProgress = {
      done: newDone,
      retry: newRetry,
      currentTask,
      completed: false,
    };
    saveProgress(chapterId, progress);

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
    const { chapterId, tasks, done, retry } = get();
    const stats = calcStats(tasks, done, retry);
    set({ currentTask: taskId, stats });

    const progress: StoredProgress = { done, retry, currentTask: taskId, completed: get().completed };
    saveProgress(chapterId, progress);
  },

  nextTask: () => {
    const { tasks, done, retry, currentTask, chapterId } = get();
    const nxt = getNextTask(tasks, done, retry, currentTask);
    if (nxt >= 0) {
      const stats = calcStats(tasks, done, retry);
      set({ currentTask: nxt, stats });
      const progress: StoredProgress = { done, retry, currentTask: nxt, completed: false };
      saveProgress(chapterId, progress);
    }
  },

  prevTask: () => {
    const { tasks, done, currentTask, chapterId, retry } = get();
    // Go to previous done task
    const allVisited = [...done, ...retry].filter(id => id < currentTask);
    const prev = allVisited.length > 0 ? Math.max(...allVisited) : 0;
    const stats = calcStats(tasks, done, retry);
    set({ currentTask: prev, stats });
    const progress: StoredProgress = { done, retry, currentTask: prev, completed: get().completed };
    saveProgress(chapterId, progress);
  },

  clearToast: () => set({ toastMessage: null }),

  resetChapter: () => {
    const { chapterId } = get();
    const progress: StoredProgress = { done: [], retry: [], currentTask: 0, completed: false };
    saveProgress(chapterId, progress);
    set({
      done: [],
      retry: [],
      currentTask: 0,
      completed: false,
      stats: calcStats(get().tasks, [], []),
    });
  },
}));
