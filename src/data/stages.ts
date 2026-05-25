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
  chapters: number;
  locked: boolean;
}

export const STAGES: StageInfo[] = [
  { id: 'foundation', name: '下界筑基', desc: '基础阶段：打牢概念、公式、基本题型和核心方法。逐讲精练，不留死角。', icon: '📘' },
  { id: 'training', name: '灵域试炼', desc: '强化阶段：训练综合题、技巧融合、复杂建模。打通跨章节知识连接。', icon: '⚔️' },
  { id: 'summit', name: '天庭问道', desc: '冲刺阶段：真题压缩、错题清算、限时模拟。剑指C9，渡劫飞升。', icon: '👑' },
];

export const SUBJECTS: SubjectInfo[] = [
  { id: 'math', name: '高等数学', stageId: 'foundation', icon: '📐', chapters: 1, locked: false },
  { id: 'linear', name: '线性代数', stageId: 'foundation', icon: '📊', chapters: 0, locked: true },
  { id: 'prob', name: '概率统计', stageId: 'foundation', icon: '🎲', chapters: 0, locked: true },
];
