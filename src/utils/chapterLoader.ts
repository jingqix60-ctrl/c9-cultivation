import type { ChapterData } from '../data/types';
import { chapter10Data } from '../data/math/zhangyu30/chapter10';
import { loadChapterData } from '../data/math/zhangyu30';

export function getChapterData(chapterId: number): ChapterData | null {
  // Built-in chapters
  if (chapterId === 10) return chapter10Data;

  // Imported chapters from localStorage
  const raw = loadChapterData(chapterId);
  if (raw) return raw as ChapterData;

  return null;
}
