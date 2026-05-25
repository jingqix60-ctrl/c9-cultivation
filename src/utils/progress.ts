import type { Task, Realm } from '../data/types';
import { REALMS } from '../data/types';

export interface ChapterStats {
  mastery: number;
  zhangyu: number;
  skills: number;
  c9: number;
  method: number;
  calc: number;
  geometry: number;
  retryCount: number;
  doneCount: number;
  totalCount: number;
  realm: Realm;
  completed: boolean;
}

export function calcStats(tasks: Task[], done: number[], retry: number[]): ChapterStats {
  let totalMastery = 0;
  let zhangyuMastery = 0;
  let skillsMastery = 0;
  let c9 = 0;
  let method = 0;
  let calc = 0;
  let geometry = 0;

  for (const i of done) {
    const t = tasks[i];
    if (!t) continue;
    totalMastery += t.reward.mastery;
    if (t.sourceType === 'main') zhangyuMastery += t.reward.mastery;
    if (t.sourceType === 'skill' || t.sourceType === 'boss') skillsMastery += t.reward.mastery;
    c9 += t.reward.c9;
    method += t.reward.method;
    calc += t.reward.calc;
    geometry += t.reward.geometry;
  }

  const maxMastery = tasks.reduce((s, t) => s + t.reward.mastery, 0);
  const maxZhangyu = tasks.filter(t => t.sourceType === 'main').reduce((s, t) => s + t.reward.mastery, 0);
  const maxSkills = tasks.filter(t => t.sourceType === 'skill' || t.sourceType === 'boss').reduce((s, t) => s + t.reward.mastery, 0);
  const maxMethod = tasks.reduce((s, t) => s + t.reward.method, 0);
  const maxCalc = tasks.reduce((s, t) => s + t.reward.calc, 0);
  const maxGeom = tasks.reduce((s, t) => s + t.reward.geometry, 0);

  const masteryPct = Math.round((totalMastery / Math.max(1, maxMastery)) * 100);
  let realm = REALMS[0];
  for (const r of REALMS) {
    if (masteryPct >= r.minMastery) realm = r;
  }
  const completed = done.length >= tasks.length && retry.length === 0;

  return {
    mastery: masteryPct,
    zhangyu: Math.round((zhangyuMastery / Math.max(1, maxZhangyu)) * 100),
    skills: Math.round((skillsMastery / Math.max(1, maxSkills)) * 100),
    c9,
    method: Math.round((method / Math.max(1, maxMethod)) * 100),
    calc: Math.round((calc / Math.max(1, maxCalc)) * 100),
    geometry: Math.round((geometry / Math.max(1, maxGeom)) * 100),
    retryCount: retry.length,
    doneCount: done.length,
    totalCount: tasks.length,
    realm,
    completed,
  };
}

export function getNextTask(tasks: Task[], done: number[], retry: number[], current: number): number {
  // First: next undone non-retry after current
  for (let i = current + 1; i < tasks.length; i++) {
    if (!done.includes(i) && !retry.includes(i)) return i;
  }
  // Second: earliest retry
  if (retry.length > 0) return Math.min(...retry);
  // Third: any remaining undone
  for (let i = 0; i < tasks.length; i++) {
    if (!done.includes(i) && !retry.includes(i)) return i;
  }
  return -1;
}

export interface ReviewSchedule {
  nextReviewDate: string;
  intervalDays: number;
  reviewCount: number;
}

export function calcReviewSchedule(tasks: Task[], done: number[], retry: number[]): ReviewSchedule {
  const doneCount = done.length;
  const totalCount = tasks.length;
  let intervalDays: number;
  if (doneCount === 0) intervalDays = 0;
  else if (retry.length > 0) intervalDays = 1;
  else {
    const pct = doneCount / Math.max(1, totalCount);
    if (pct < 0.3) intervalDays = 1;
    else if (pct < 0.6) intervalDays = 3;
    else if (pct < 0.9) intervalDays = 7;
    else intervalDays = 14;
  }
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + intervalDays);
  return {
    nextReviewDate: nextDate.toISOString().slice(0, 10),
    intervalDays,
    reviewCount: retry.length,
  };
}
