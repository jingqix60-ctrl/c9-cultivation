import type { BookInfo } from './types';

export interface StageInfo {
  id: string;
  name: string;
  desc: string;
  icon: string;
}

export interface SubjectInfo {
  id: string;
  name: string;
  stageId: string;
  icon: string;
  locked: boolean;
}

export const STAGES: StageInfo[] = [
  { id: 'foundation', name: '下界筑基', desc: '基础阶段 · 打牢概念、公式、基本题型和核心方法', icon: '📘' },
  { id: 'spirit', name: '灵域试炼', desc: '强化阶段 · 综合题、技巧融合、跨章节知识连接', icon: '⚔️' },
  { id: 'heaven', name: '天庭问道', desc: '冲刺阶段 · 真题压缩、错题清算、限时模拟', icon: '👑' },
];

/** 每个阶段三个学科 */
export const SUBJECTS: SubjectInfo[] = [
  // 下界筑基
  { id: 'math', name: '高等数学', stageId: 'foundation', icon: '📐', locked: false },
  { id: 'linear', name: '线性代数', stageId: 'foundation', icon: '📊', locked: false },
  { id: 'probability', name: '概率论与数理统计', stageId: 'foundation', icon: '🎲', locked: false },
  // 灵域试炼
  { id: 'math', name: '高等数学', stageId: 'spirit', icon: '📐', locked: false },
  { id: 'linear', name: '线性代数', stageId: 'spirit', icon: '📊', locked: false },
  { id: 'probability', name: '概率论与数理统计', stageId: 'spirit', icon: '🎲', locked: false },
  // 天庭问道
  { id: 'math', name: '高等数学', stageId: 'heaven', icon: '📐', locked: false },
  { id: 'linear', name: '线性代数', stageId: 'heaven', icon: '📊', locked: false },
  { id: 'probability', name: '概率论与数理统计', stageId: 'heaven', icon: '🎲', locked: false },
];

/** 书册元数据 — 定义每个阶段·学科下有哪些书 */
export const BOOKS: BookInfo[] = [
  // ── 下界筑基 · 高等数学 ──
  {
    id: 'zhangyu30', name: '张宇30讲', author: '张宇',
    stageId: 'foundation', subjectId: 'math',
    chapters: 30, description: '基础概念、公式、基本题型',
    icon: '📖', priority: 1,
  },
  {
    id: 'wuzhongxiang-fudao', name: '武忠祥辅导讲义', author: '武忠祥',
    stageId: 'foundation', subjectId: 'math',
    chapters: 12, description: '基础巩固 · 经典例题',
    icon: '📖', priority: 2,
  },
  {
    id: 'wuzhongxiang-jichu', name: '武忠祥基础篇', author: '武忠祥',
    stageId: 'foundation', subjectId: 'math',
    chapters: 8, description: '基础过关 · 入门训练',
    icon: '📖', priority: 3,
  },
  {
    id: 'liyongle', name: '李永乐复习全书', author: '李永乐',
    stageId: 'foundation', subjectId: 'math',
    chapters: 15, description: '系统复习 · 全面覆盖',
    icon: '📖', priority: 4,
  },
  {
    id: 'lizhengyuan', name: '李正元复习全书', author: '李正元',
    stageId: 'foundation', subjectId: 'math',
    chapters: 14, description: '提高进阶 · 方法总结',
    icon: '📖', priority: 5,
  },
  // ── 灵域试炼 · 高等数学 ──
  {
    id: 'zhangyu30-strong', name: '张宇30讲（强化）', author: '张宇',
    stageId: 'spirit', subjectId: 'math',
    chapters: 30, description: '综合题 · 多方法对比 · 易错题',
    icon: '⚔️', priority: 1,
  },
  // ── 天庭问道 · 高等数学 ──
  {
    id: 'zhen-ti', name: '历年真题', author: '教育部',
    stageId: 'heaven', subjectId: 'math',
    chapters: 10, description: '真题精练 · 压轴题 · 计时训练',
    icon: '👑', priority: 1,
  },
];
