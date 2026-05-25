# 云笺书院风 · 可折叠三栏学习台

**Date:** 2026-05-25
**Status:** Approved
**Design Origin:** Brainstorming session — user selected Option C (symmetrical three-column) with customizations

---

## 1. Problem

The site currently uses a single-column layout with `max-width: 760px` centered. On wide screens (>760px), both sides are empty dead space. The experience feels "a single card floating in the middle."

## 2. Solution: Three-Column Study Desk

Transform the layout into a functional three-column study desk:

- **Left (220px):** "Where am I?" — cultivation path + chapter module navigation
- **Center (720-820px):** "What am I learning?" — main content, reading priority
- **Right (260px):** "What next?" — context-sensitive sidebar (today's notes, question nav, or chapter operations)

**Design style:** Cloud Scroll Academy (云笺书院风) — classical, warm, restrained, bookish. No neon gaming panels.

---

## 3. Layout & Responsive Breakpoints

### Desktop (≥ 1200px)
Full three-column layout:
- Left sidebar: 220px fixed
- Center: 720-820px (flexible, auto-fill)
- Right sidebar: 260px fixed
- Page max-width: 1280-1360px, centered

### Tablet (768px – 1199px)
- Left sidebar: hidden by default, accessible via top button → drawer
- Center: takes primary width
- Right sidebar: moves below content or right-edge drawer
- Task page: question nav accessible via button-triggered drawer

### Mobile (< 768px)
- Single column layout
- Left path → top breadcrumb (`下界筑基 / 高等数学 / 第10讲`)
- Right sidebar → bottom drawer
- Question nav → inside bottom drawer
- Bottom nav bar: fixed, 首页 / 章节地图 / 任务 / 心魔本 / 知识矩阵

### Collapse Behavior
- Both sidebars have visible collapse toggle buttons
- Collapse state persisted in `localStorage`
- When collapsed, center content auto-expands to fill space
- Task page: question nav takes priority over 今日小札 in right sidebar

---

## 4. Left Sidebar: 修炼路径 (Cultivation Path)

### Content (top to bottom)

```
[折叠按钮 ▼]

📖 修炼路径
─────────────────
下界筑基
  └ 高等数学
      └ 张宇30讲
          └ 第10讲：旋转体体积  ← current highlighted

─────────────────
章节模块
  知识地图        0/1
  公式筑基        2/3
  圆盘法/垫片法    3/4
  柱壳法          2/3
  平行截面        1/2
  方法选择        2/3
  ...
  C9拔高          0/1
  隐藏理解        0/1
```

### Module Data Strategy
- **Preferred:** `chapter.modules[]` — manual configuration controlling order, names
- **Task attribution:** `task.moduleId` maps each task to a module
- **Fallback:** if no `modules` config, auto-extract from `task.stageName` (deduplicated, ordered by first appearance)
- **Catch-all:** tasks without matching `moduleId` → "未分类"

### Module Item Display
- Module name + done/total (e.g., `3/4`)
- Small red dot if any retry tasks in module
- Current module highlighted (via 青玉色 `#5E7C76` subtle highlight)
- Click behavior:
  - On task page → jump to first task in that module
  - On knowledge matrix → scroll to matching knowledge cards
  - On chapter map → scroll to matching stage node

### Styling
- Light paper background, subtle border
- Lower visual weight than center content
- 220px wide, collapsible

---

## 5. Right Sidebar: Context-Sensitive

### Mode A: Home / Dashboard → 今日小札 (Today's Notes)

- Today's main quest (chapter + remaining tasks)
- Due retry count
- Recent mastery % + C9 score
- Quick actions: 继续修炼, 进入心魔本, 导出进度, 导入进度

### Mode B: Task Page → 题号导航 (Question Navigator) — **Highest Priority**

- Question number grid (1..N) with color-coded states:
  - Grey: undone, Green: completed, Red: retry, Yellow: unstable, Blue: current
- Filters: 全部 / 未做 / 完成 / 心魔 / 不稳
- Quick jump: first, last, next undone, next retry
- Click number → `navigate(/chapter/:id/task/:taskId)`
- 今日小札 can be collapsed below question nav

### Mode C: Knowledge Matrix → 本章操作 (Chapter Operations)

- 重置本章进度 (with confirmation)
- 仅重置完成状态 (with confirmation)
- 仅清空心魔本 (with confirmation)
- 只看未掌握 (filter toggle)
- 只看有心魔 (filter toggle)
- 返回章节首页

### Mode D: Other Pages → 今日小札精简版

- Condensed version of Mode A, with page-relevant quick actions

---

## 6. Page-Specific Adaptations

| Page | Left | Center | Right |
|------|------|--------|-------|
| Home | Cultivation path | Hero + 3 stage entries + subject entries | 今日小札 (Mode A) |
| Dashboard | Path + module nav | Stats + skill bars + CTA | 今日小札 (Mode A condensed) |
| Task | Path + module nav | Question card (full) | 题号导航 (Mode B) |
| Knowledge Matrix | Path + knowledge point TOC | Knowledge cards grid | 本章操作 (Mode C) |
| Review Queue | Path + module nav | Retry groups | 今日小札 (Mode D) |
| Chapter Map | Path + module nav | Stage nodes | 今日小札 (Mode D) |
| Final Report | Path + module nav | Report stats | 今日小札 (Mode D) |

---

## 7. Data Layer Changes

### `chapter10.ts` additions
```ts
modules: [
  { id: "map", name: "知识地图", order: 0 },
  { id: "formula", name: "公式筑基", order: 1 },
  // ... 12 modules total
]
```
Each task gets `moduleId: "shell"` (or matching id).

### `types.ts` additions
```ts
interface ChapterData {
  // existing...
  modules?: { id: string; name: string; order: number }[];
}

interface Task {
  // existing...
  moduleId?: string;
}
```

### Fallback logic
When `chapter.modules` is undefined → extract unique `stageName` values from all tasks, order by first occurrence.

---

## 8. Export / Import Progress

### Export
- Serialize: profileId, profileName, stage/subject/chapter, done[], retry[], currentTask, mistakeTypes per task, mastery %, review plan, export timestamp, data version
- Generate JSON → `Blob` → `URL.createObjectURL` → browser download
- Filename: `c9-progress-{profileName}-{YYYYMMDD}.json`
- Does NOT include question content, answers, or explanations (those come from built-in data)

### Import
- `<input type="file" accept=".json">` reads file
- Validate JSON structure (required fields check)
- Invalid → toast error, no crash
- Valid → modal: "覆盖当前学习者" / "新建学习者并导入" / "取消"
- New learner → `ensureProfile()` with new id, write imported data

---

## 9. Visual Style: 云笺书院风

### Color Palette (unchanged from current)
| Role | Value | Usage |
|------|-------|-------|
| Page background | `#F7F1E6` | Rice paper |
| Cards/surfaces | `#FFFDF7` | Warm paper |
| Body text | `#2F2A24` | Ink |
| Primary accent | `#8B5E34` | Tea brown |
| Complete/success | `#4F7D5A` | Bamboo green |
| Retry/error | `#B85C5C` | Soft vermilion |
| Emphasis | `#B68A35` | Pale gold |
| Module highlight | `#5E7C76` | Celadon jade |

### Subtle Decorations (3-6% opacity only)
- Rice paper fiber texture on `body` background (CSS gradient, 3-4% opacity)
- Faint grid lines in code/formula areas (4% opacity)
- Sidebar separators: 1px `var(--border)`, or subtle `inset box-shadow`

### Forbidden
- No cloud/mountain/bamboo illustrations
- No neon blue/purple, fluorescent colors
- No complex animations
- No heavy borders or gaming-panel shadows
- No decorative filler text or quotes

### Visual Hierarchy
- Center content: strongest visual weight
- Sidebars: lighter background, smaller text (12-13px), muted colors
- Current/active items: subtle celadon or tea-brown highlight
- Sidebar backgrounds: slightly lighter than center (`#FCFAF5` or `--bg`)

---

## 10. Hard Constraints

1. **Do NOT delete** any questions, answers, explanations, sources, or knowledge point tags from chapter 10
2. Task page right sidebar MUST have functional question number navigation with click-to-jump
3. Home page MUST show three stage entries: 下界筑基, 灵域试炼, 天庭问道
4. Left sidebar = cultivation path + module nav ONLY, no extra complexity
5. Right sidebar content varies by page (Mode A/B/C/D)
6. Reset functionality: full reset, reset-done-only, reset-retry-only, all with confirmation
7. Export/import must be real features, not placeholder buttons
8. Mobile: single column + bottom drawer, no forced three-column
9. UI stays 云笺书院风
10. Same URL, same gh-pages deployment
