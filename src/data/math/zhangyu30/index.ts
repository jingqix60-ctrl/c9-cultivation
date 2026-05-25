import type { ChapterEntry } from '../../types';

const ZHANGYU30_CHAPTERS: ChapterEntry[] = [
  { chapterId: 1,  chapterNumber: 1,  chapterTitle: '函数极限与连续',     book: '张宇30讲', description: '', taskCount: 0, difficulty: 2, status: 'not_imported' },
  { chapterId: 2,  chapterNumber: 2,  chapterTitle: '导数与微分',         book: '张宇30讲', description: '', taskCount: 0, difficulty: 2, status: 'not_imported' },
  { chapterId: 3,  chapterNumber: 3,  chapterTitle: '中值定理与导数应用',  book: '张宇30讲', description: '', taskCount: 0, difficulty: 3, status: 'not_imported' },
  { chapterId: 4,  chapterNumber: 4,  chapterTitle: '不定积分',           book: '张宇30讲', description: '', taskCount: 0, difficulty: 2, status: 'not_imported' },
  { chapterId: 5,  chapterNumber: 5,  chapterTitle: '定积分',             book: '张宇30讲', description: '', taskCount: 0, difficulty: 2, status: 'not_imported' },
  { chapterId: 6,  chapterNumber: 6,  chapterTitle: '定积分应用',          book: '张宇30讲', description: '', taskCount: 0, difficulty: 3, status: 'not_imported' },
  { chapterId: 7,  chapterNumber: 7,  chapterTitle: '微分方程',           book: '张宇30讲', description: '', taskCount: 0, difficulty: 3, status: 'not_imported' },
  { chapterId: 8,  chapterNumber: 8,  chapterTitle: '多元函数微分学',      book: '张宇30讲', description: '', taskCount: 0, difficulty: 3, status: 'not_imported' },
  { chapterId: 9,  chapterNumber: 9,  chapterTitle: '二重积分',           book: '张宇30讲', description: '', taskCount: 0, difficulty: 3, status: 'not_imported' },
  { chapterId: 10, chapterNumber: 10, chapterTitle: '旋转体体积',          book: '张宇30讲', description: '垫片法、柱壳法、非坐标轴旋转、平行截面、反常积分型体积', taskCount: 28, difficulty: 3, status: 'available' },
  { chapterId: 11, chapterNumber: 11, chapterTitle: '常微分方程',          book: '张宇30讲', description: '', taskCount: 0, difficulty: 3, status: 'not_imported' },
  { chapterId: 12, chapterNumber: 12, chapterTitle: '无穷级数',           book: '张宇30讲', description: '', taskCount: 0, difficulty: 4, status: 'not_imported' },
  { chapterId: 13, chapterNumber: 13, chapterTitle: '向量代数与空间解析几何', book: '张宇30讲', description: '', taskCount: 0, difficulty: 2, status: 'not_imported' },
  { chapterId: 14, chapterNumber: 14, chapterTitle: '多元函数微分学应用',   book: '张宇30讲', description: '', taskCount: 0, difficulty: 3, status: 'not_imported' },
  { chapterId: 15, chapterNumber: 15, chapterTitle: '三重积分',           book: '张宇30讲', description: '', taskCount: 0, difficulty: 4, status: 'not_imported' },
  { chapterId: 16, chapterNumber: 16, chapterTitle: '曲线积分与曲面积分',   book: '张宇30讲', description: '', taskCount: 0, difficulty: 4, status: 'not_imported' },
  { chapterId: 17, chapterNumber: 17, chapterTitle: '行列式',             book: '张宇30讲', description: '', taskCount: 0, difficulty: 2, status: 'not_imported' },
  { chapterId: 18, chapterNumber: 18, chapterTitle: '矩阵',              book: '张宇30讲', description: '', taskCount: 0, difficulty: 2, status: 'not_imported' },
  { chapterId: 19, chapterNumber: 19, chapterTitle: '向量组与线性方程组',   book: '张宇30讲', description: '', taskCount: 0, difficulty: 3, status: 'not_imported' },
  { chapterId: 20, chapterNumber: 20, chapterTitle: '特征值与二次型',      book: '张宇30讲', description: '', taskCount: 0, difficulty: 3, status: 'not_imported' },
  { chapterId: 21, chapterNumber: 21, chapterTitle: '随机事件与概率',      book: '张宇30讲', description: '', taskCount: 0, difficulty: 2, status: 'not_imported' },
  { chapterId: 22, chapterNumber: 22, chapterTitle: '随机变量与分布',      book: '张宇30讲', description: '', taskCount: 0, difficulty: 2, status: 'not_imported' },
  { chapterId: 23, chapterNumber: 23, chapterTitle: '多维随机变量',       book: '张宇30讲', description: '', taskCount: 0, difficulty: 3, status: 'not_imported' },
  { chapterId: 24, chapterNumber: 24, chapterTitle: '数字特征',           book: '张宇30讲', description: '', taskCount: 0, difficulty: 2, status: 'not_imported' },
  { chapterId: 25, chapterNumber: 25, chapterTitle: '大数定律与中心极限定理', book: '张宇30讲', description: '', taskCount: 0, difficulty: 2, status: 'not_imported' },
  { chapterId: 26, chapterNumber: 26, chapterTitle: '数理统计',           book: '张宇30讲', description: '', taskCount: 0, difficulty: 2, status: 'not_imported' },
  { chapterId: 27, chapterNumber: 27, chapterTitle: '参数估计',           book: '张宇30讲', description: '', taskCount: 0, difficulty: 3, status: 'not_imported' },
  { chapterId: 28, chapterNumber: 28, chapterTitle: '假设检验',           book: '张宇30讲', description: '', taskCount: 0, difficulty: 2, status: 'not_imported' },
  { chapterId: 29, chapterNumber: 29, chapterTitle: '综合复习（一）',      book: '张宇30讲', description: '', taskCount: 0, difficulty: 4, status: 'not_imported' },
  { chapterId: 30, chapterNumber: 30, chapterTitle: '综合复习（二）',      book: '张宇30讲', description: '', taskCount: 0, difficulty: 5, status: 'not_imported' },
];

// Load imported chapters from localStorage
function loadImportedChapters(): ChapterEntry[] {
  try {
    const raw = localStorage.getItem('c9_imported_chapters');
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// Get all chapters (built-in + imported)
export function getAllChapters(): ChapterEntry[] {
  const imported = loadImportedChapters();
  const merged = ZHANGYU30_CHAPTERS.map(c => {
    const imp = imported.find(i => i.chapterId === c.chapterId);
    return imp && imp.status === 'available' ? { ...c, ...imp, status: 'available' as const } : c;
  });
  // Add imported chapters that aren't in the built-in list
  for (const imp of imported) {
    if (!merged.find(c => c.chapterId === imp.chapterId)) {
      merged.push(imp);
    }
  }
  return merged;
}

// Save imported chapter entry
export function registerImportedChapter(entry: ChapterEntry): void {
  const imported = loadImportedChapters();
  const idx = imported.findIndex(c => c.chapterId === entry.chapterId);
  if (idx >= 0) {
    imported[idx] = entry;
  } else {
    imported.push(entry);
  }
  localStorage.setItem('c9_imported_chapters', JSON.stringify(imported));
}

// Save full chapter data (tasks)
export function saveChapterData(chapterId: number, data: unknown): void {
  localStorage.setItem(`c9_chapter_data_${chapterId}`, JSON.stringify(data));
}

// Load chapter data
export function loadChapterData(chapterId: number): unknown | null {
  try {
    const raw = localStorage.getItem(`c9_chapter_data_${chapterId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default ZHANGYU30_CHAPTERS;
