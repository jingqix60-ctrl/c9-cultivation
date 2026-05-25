# 张宇30讲第10讲 · 旋转体体积 · C9修仙系统

基于张宇30讲第10讲「旋转体体积」的交互式学习系统，融合武忠祥、李永乐、李正元辅助教辅的核心技巧。

## 快速开始

```bash
npm install
npm run dev        # 开发模式 → http://localhost:5173
npm run build      # 生产构建 → dist/
```

## 部署

```bash
npm run build
npx gh-pages -d dist
```

当前部署地址：https://jingqix60-ctrl.github.io/c9-cultivation/

## 新增章节

1. 在 `src/data/` 下新建 `chapter11.ts`，导出 `chapter11Meta` 和 `chapter11Tasks`
2. 在 `App.tsx` 中 `init()` 调用切换章节 ID 和数据源

页面组件和数据完全分离，无需修改任何 UI 代码。

## 项目结构

```
src/
  data/            数据层 — 章节题目、类型定义（与 UI 无关）
  store/           状态层 — Zustand store，进度持久化到 localStorage
  utils/           工具层 — storage 读写、进度计算、KaTeX 渲染
  components/      视图层
    Layout/        布局壳 — Header、BottomNav、AppShell
    Dashboard/     首页仪表盘
    ChapterMap/    章节修炼地图
    Task/          任务页 — 题目卡、提示/答案面板、奖励通知
    Review/        心魔本 — 错题回顾，按错因分类
    Knowledge/     知识矩阵 — 知识点覆盖度
    Report/        最终战报 — 圆满通关报告
  styles/          主题 CSS（深色修仙风格）
```

## 技术栈

Vite + React 18 + TypeScript + Zustand + KaTeX + React Router (HashRouter)

## 进度保存

所有进度通过 localStorage 保存在浏览器本地，刷新不丢失。
