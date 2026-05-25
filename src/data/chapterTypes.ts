// ═══════════ 统一类型定义 ═══════════

export type SourceType = 'main' | 'skill' | 'boss' | 'hidden';

export type MistakeType =
  | 'formula'
  | 'region'
  | 'method_selection'
  | 'calculation'
  | 'radius'
  | 'parametric_dx'
  | 'non_coordinate_translation'
  | 'integral'
  | 'geometry';

export const MistakeTypeLabels: Record<MistakeType, string> = {
  formula: '公式不熟',
  region: '区域判断错误',
  method_selection: '方法选择错误',
  calculation: '计算错误',
  radius: '绕轴半径判断错误',
  parametric_dx: '参数方程漏 dx',
  non_coordinate_translation: '非坐标轴平移错误',
  integral: '积分计算错误',
  geometry: '几何建模错误',
};

export interface Reward {
  mastery: number;
  method: number;
  calc: number;
  geometry: number;
  c9: number;
}

export interface Task {
  id: number;
  stage: number;
  stageName: string;
  title: string;
  source: string;
  sourceType: SourceType;
  time: string;
  difficulty: number;
  skillTags: string[];
  reward: Reward;
  question: string;
  hint: string;
  answer: string;
  method: string;
  trap: string;
  afterMastery: string;
  knowledgePoints: string[];
  mistakeTypes: MistakeType[];
}

export interface ChapterMeta {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  mainBook: string;
  supportBooks: string[];
  totalTasks: number;
}

export interface Realm {
  name: string;
  minMastery: number;
  className: string;
}

export const REALMS: Realm[] = [
  { name: '炼气入门', minMastery: 0, className: 'realm-r0' },
  { name: '公式筑基', minMastery: 20, className: 'realm-r1' },
  { name: '方法小成', minMastery: 40, className: 'realm-r2' },
  { name: '技巧大成', minMastery: 60, className: 'realm-r3' },
  { name: '压轴预备', minMastery: 80, className: 'realm-r4' },
  { name: 'C9候选人', minMastery: 95, className: 'realm-r5' },
];

export const STAGE_NAMES: Record<number, string> = {
  0: '系统载入',
  1: '张宇主线·基础功法',
  2: '武忠祥技能包·方法选择',
  3: '李永乐技能包·综合建模',
  4: '李正元技能包·拔高压轴',
  5: 'C9终极试炼',
};
