# 云笺书院风 · 可折叠三栏学习台 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the single-column 760px layout into a functional three-column study desk with cultivation path navigation (left), main content (center), and context-sensitive sidebar (right), across desktop/tablet/mobile.

**Architecture:** AppShell becomes a three-column CSS Grid shell. LeftSidebar/RightSidebar are new components reading from Zustand store and React Router location. Existing page components are adapted to work inside the center column. Mobile gets a single-column fallback with breadcrumb + bottom drawer.

**Tech Stack:** React 19, React Router 7 (HashRouter), Zustand 5, TypeScript 6, Vite 8, CSS (no framework)

---

### Task 0: Git Worktree & Branch Setup

**Files:**
- Create: git worktree on branch `feat/three-column-study-desk`

- [ ] **Step 1: Create worktree**

```bash
cd "C:/Users/狗琦/Desktop/c9-cultivation" && git checkout -b feat/three-column-study-desk
```

---

### Task 1: Data Layer — Types & Chapter Modules

**Files:**
- Modify: `src/data/types.ts:59-69`
- Modify: `src/data/math/zhangyu30/chapter10.ts:1-6` (add modules + moduleId on every task)

- [ ] **Step 1: Add module types to types.ts**

In `src/data/types.ts`, add to `ChapterData` interface and `Task` interface:

```ts
// Add to ChapterData interface (after knowledgePoints line 68):
export interface ChapterData {
  // ... existing fields unchanged ...
  modules?: ChapterModule[];  // ADD THIS LINE
}

// Add NEW interface after ChapterData:
export interface ChapterModule {
  id: string;
  name: string;
  order: number;
}

// Add to Task interface (after mistakeTypes line 56):
export interface Task {
  // ... existing fields unchanged ...
  moduleId?: string;  // ADD THIS LINE
}
```

- [ ] **Step 2: Add modules array to chapter10.ts**

In `src/data/math/zhangyu30/chapter10.ts`, after the `knowledgePoints` array (before `tasks:`), add:

```ts
modules: [
  { id: 'map',           name: '知识地图',       order: 0 },
  { id: 'formula',       name: '公式筑基',       order: 1 },
  { id: 'washer',        name: '圆盘法/垫片法',   order: 2 },
  { id: 'shell',         name: '柱壳法',         order: 3 },
  { id: 'section',       name: '平行截面',       order: 4 },
  { id: 'choice',        name: '方法选择',       order: 5 },
  { id: 'region',        name: '两曲线区域',     order: 6 },
  { id: 'axis',          name: '非坐标轴旋转',   order: 7 },
  { id: 'parametric',    name: '参数方程',       order: 8 },
  { id: 'improper',      name: '反常积分',       order: 9 },
  { id: 'comprehensive', name: '综合应用',       order: 10 },
  { id: 'c9',            name: 'C9拔高',        order: 11 },
  { id: 'hidden',        name: '隐藏理解',       order: 12 },
],
```

- [ ] **Step 3: Add moduleId to every task in chapter10.ts**

Add `moduleId` field to each task object. Mapping based on `stageName` + `knowledgePoints`:

| task id | moduleId | task id | moduleId | task id | moduleId |
|---------|----------|---------|----------|---------|----------|
| 0 | map | 9 | shell | 18 | region |
| 1 | formula | 10 | shell | 19 | section |
| 2 | formula | 11 | section | 20 | comprehensive |
| 3 | washer | 12 | choice | 21 | axis |
| 4 | washer | 13 | choice | 22 | parametric |
| 5 | shell | 14 | region | 23 | improper |
| 6 | shell | 15 | choice | 24 | c9 |
| 7 | washer | 16 | comprehensive | | |
| 8 | washer | 17 | choice | | |

This mapping follows: tasks 0=map, 1-2=formula, 3-4+7-8=washer, 5-6+9-10=shell, 11+19=section, 12-13+15+17=choice, 14+18=region, 21=axis, 22=parametric, 23=improper, 16+20=comprehensive, 24=c9.

Each task line appends: `moduleId: 'washer',` (or matching id) after `mistakeTypes: [...],`.

- [ ] **Step 4: Build check**

```bash
cd "C:/Users/狗琦/Desktop/c9-cultivation" && npx tsc -b --noEmit 2>&1
```

Expected: No TypeScript errors.

- [ ] **Step 5: Commit**

```bash
git add src/data/types.ts src/data/math/zhangyu30/chapter10.ts
git commit -m "feat: add ChapterModule type, modules config, and moduleId to all chapter 10 tasks"
```

---

### Task 2: Progress Store Extensions

**Files:**
- Modify: `src/store/useProgressStore.ts`
- Modify: `src/utils/storage.ts`
- Modify: `src/utils/progress.ts`

- [ ] **Step 1: Add export/import helpers to storage.ts**

In `src/utils/storage.ts`, add after existing `exportProfile`/`importProfile`:

```ts
// ── Chapter-level export/import ──

export interface ExportedProgress {
  version: number;
  exportedAt: string;
  profile: { id: string; name: string; createdAt: string };
  chapters: Record<string, {
    chapterId: number;
    chapterTitle: string;
    done: number[];
    retry: number[];
    currentTask: number;
    completed: boolean;
    masteryPct: number;
  }>;
}

export function exportAllProgress(): ExportedProgress {
  const profile = ensureProfile();
  const chapters: ExportedProgress['chapters'] = {};
  const keys = Object.keys(localStorage).filter(k => k.startsWith(`${PROFILE_PREFIX}${profile.id}_`));
  for (const k of keys) {
    const chapterId = parseInt(k.split('_').pop() || '0');
    const progress = loadProgress(profile.id, chapterId);
    chapters[String(chapterId)] = {
      chapterId,
      chapterTitle: '', // filled by caller
      done: progress.done,
      retry: progress.retry,
      currentTask: progress.currentTask,
      completed: progress.completed,
      masteryPct: 0, // filled by caller
    };
  }
  return { version: 1, exportedAt: new Date().toISOString(), profile, chapters };
}

export function validateImportData(data: unknown): data is ExportedProgress {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  return typeof d.version === 'number'
    && typeof d.exportedAt === 'string'
    && d.profile && typeof (d.profile as Record<string,unknown>).id === 'string'
    && d.chapters && typeof d.chapters === 'object';
}

export function importAllProgress(data: ExportedProgress, targetProfileId: string): void {
  for (const [, ch] of Object.entries(data.chapters)) {
    saveProgress(targetProfileId, ch.chapterId, {
      done: ch.done, retry: ch.retry, currentTask: ch.currentTask, completed: ch.completed,
    });
  }
  setActiveProfileId(targetProfileId);
}
```

- [ ] **Step 2: Add review schedule to progress.ts**

In `src/utils/progress.ts`, add at end:

```ts
export interface ReviewSchedule {
  nextReviewDate: string;
  intervalDays: number;
  reviewCount: number;
}

export function calcReviewSchedule(tasks: Task[], done: number[], retry: number[]): ReviewSchedule {
  const hasPending = retry.length > 0;
  const doneCount = done.length;
  const totalCount = tasks.length;
  let intervalDays: number;
  if (doneCount === 0) intervalDays = 0;
  else if (hasPending) intervalDays = 1;
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
```

- [ ] **Step 3: Add store actions for export/import**

In `src/store/useProgressStore.ts`, add to `ProgressState` interface:

```ts
// In ProgressState interface add:
exportAllData: () => { json: string; filename: string };
importAllData: (json: string) => { success: boolean; error?: string };
getReviewSchedule: () => { nextReviewDate: string; intervalDays: number; reviewCount: number };
```

Add implementations in the `create` callback:

```ts
exportAllData: () => {
  const { chapterId, chapterTitle, done, retry, currentTask, stats } = get();
  const data = exportAllProgress();
  // Enrich with chapter info from current state
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
```

Add imports at top of `useProgressStore.ts`:
```ts
import { exportAllProgress, validateImportData, importAllProgress, type ExportedProgress } from '../utils/storage';
import { calcReviewSchedule } from '../utils/progress';
```

- [ ] **Step 4: Build check**

```bash
cd "C:/Users/狗琦/Desktop/c9-cultivation" && npx tsc -b --noEmit 2>&1
```

Expected: No TypeScript errors.

- [ ] **Step 5: Commit**

```bash
git add src/store/useProgressStore.ts src/utils/storage.ts src/utils/progress.ts
git commit -m "feat: add export/import progress, review schedule to store and utils"
```

---

### Task 3: CSS Foundation — Three-Column Layout

**Files:**
- Modify: `src/styles/theme.css`

- [ ] **Step 1: Replace layout section in theme.css**

Replace the existing `.app-shell` block and add all three-column styles. In `src/styles/theme.css`:

Replace lines 55-60:
```css
/* ═══════════ LAYOUT ═══════════ */
.app-shell {
  max-width: var(--max-w);
  margin: 0 auto;
  padding: 16px 16px 90px;
}
```

With:
```css
/* ═══════════ LAYOUT ═══════════ */
:root {
  --left-w: 220px;
  --right-w: 260px;
  --center-min: 720px;
  --center-max: 820px;
  --shell-max: 1360px;
  --bp-desktop: 1200px;
  --bp-tablet: 768px;
}

/* Body background with subtle rice-paper texture */
body {
  background-color: var(--bg);
  background-image:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(139, 94, 52, 0.015) 2px,
      rgba(139, 94, 52, 0.015) 4px
    );
}

/* Three-column shell (desktop ≥ 1200px) */
.app-shell {
  display: grid;
  grid-template-columns: var(--left-w) 1fr var(--right-w);
  grid-template-rows: auto 1fr;
  grid-template-areas:
    "left header right"
    "left main   right";
  max-width: var(--shell-max);
  margin: 0 auto;
  min-height: 100vh;
  padding: 16px 0 90px;
  gap: 0;
}

.app-shell.collapsed-left {
  grid-template-columns: 0 1fr var(--right-w);
}
.app-shell.collapsed-right {
  grid-template-columns: var(--left-w) 1fr 0;
}
.app-shell.collapsed-both {
  grid-template-columns: 0 1fr 0;
}

/* Grid area assignments */
.shell-header  { grid-area: header; padding: 0 16px; }
.shell-left    { grid-area: left; }
.shell-main    { grid-area: main; padding: 0 16px; max-width: var(--center-max); margin: 0 auto; width: 100%; }
.shell-right   { grid-area: right; }

/* When both sidebars collapsed, center gets wider */
.app-shell.collapsed-both .shell-main {
  max-width: 960px;
}

/* Left sidebar */
.sidebar-left {
  position: sticky; top: 16px;
  max-height: calc(100vh - 32px);
  overflow-y: auto;
  padding: 10px 10px 10px 16px;
  font-size: 12px;
  color: var(--text2);
  border-right: 1px solid var(--border);
}

/* Right sidebar */
.sidebar-right {
  position: sticky; top: 16px;
  max-height: calc(100vh - 32px);
  overflow-y: auto;
  padding: 10px 16px 10px 10px;
  font-size: 12px;
  color: var(--text2);
  border-left: 1px solid var(--border);
}

/* Collapse toggle buttons */
.sidebar-toggle-btn {
  display: inline-flex; align-items: center; justify-content: center;
  width: 24px; height: 24px; border: 1px solid var(--border);
  border-radius: 4px; background: var(--surface); cursor: pointer;
  font-size: 11px; color: var(--text2); transition: all 0.15s;
  font-family: var(--font-body); line-height: 1;
}
.sidebar-toggle-btn:hover { border-color: var(--accent); color: var(--accent); }
```

- [ ] **Step 2: Add responsive breakpoints**

Append to the mobile section (after existing `@media (max-width: 600px)` block, line 370-385):

```css
/* ═══════════ TABLET (768-1199px) ═══════════ */
@media (max-width: 1199px) {
  .app-shell {
    grid-template-columns: 0 1fr 0;
    grid-template-areas:
      "left header right"
      "left main   right";
    max-width: 100%;
  }
  .shell-left {
    position: fixed; left: 0; top: 0; bottom: 0; z-index: 250;
    width: 260px; transform: translateX(-100%);
    transition: transform 0.25s ease;
    background: var(--surface); box-shadow: 2px 0 12px rgba(0,0,0,0.1);
    padding: 16px;
  }
  .shell-left.open { transform: translateX(0); }
  .shell-right {
    position: fixed; right: 0; top: 0; bottom: 0; z-index: 250;
    width: 280px; transform: translateX(100%);
    transition: transform 0.25s ease;
    background: var(--surface); box-shadow: -2px 0 12px rgba(0,0,0,0.1);
    padding: 16px;
  }
  .shell-right.open { transform: translateX(0); }
  .shell-main { max-width: 100% !important; padding: 0 12px; }
  .sidebar-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.2); z-index: 249; }
}

/* ═══════════ MOBILE (< 768px) ═══════════ */
@media (max-width: 767px) {
  .app-shell {
    display: block;
    padding: 8px 8px 88px;
  }
  .shell-header { padding: 0 4px; margin-bottom: 8px; }
  .shell-main { padding: 0 4px; }
  .shell-left, .shell-right { display: none; }
  .mobile-breadcrumb {
    display: flex; align-items: center; gap: 4px; flex-wrap: wrap;
    font-size: 10px; color: var(--text2); padding: 4px 8px;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius-sm);
  }
  .mobile-breadcrumb span { color: var(--text3); }
  .mobile-breadcrumb .current { color: var(--accent); font-weight: 600; }
  .bottom-drawer {
    position: fixed; bottom: 0; left: 0; right: 0; z-index: 280;
    background: var(--surface); border-top: 1px solid var(--border);
    border-radius: 12px 12px 0 0; padding: 16px; max-height: 60vh;
    overflow-y: auto; transform: translateY(100%);
    transition: transform 0.25s ease; box-shadow: 0 -2px 12px rgba(0,0,0,0.08);
  }
  .bottom-drawer.open { transform: translateY(0); }
}
```

- [ ] **Step 3: Add subtle decorations**

Add after the `body` background-image block (inside the `body` rule already in the file):

```css
/* Code/formula faint grid */
.katex-display, pre, code {
  background-image:
    linear-gradient(rgba(94,77,56,0.03) 1px, transparent 1px);
  background-size: 100% 24px;
}
```

- [ ] **Step 4: Verify CSS parses**

```bash
cd "C:/Users/狗琦/Desktop/c9-cultivation" && npx vite build 2>&1
```

Expected: Build succeeds, CSS is included.

- [ ] **Step 5: Commit**

```bash
git add src/styles/theme.css
git commit -m "feat: add three-column CSS grid layout, responsive breakpoints, and subtle decorations"
```

---

### Task 4: useWindowWidth Hook

**Files:**
- Create: `src/utils/useWindowWidth.ts`

- [ ] **Step 1: Create the hook**

```ts
import { useState, useEffect } from 'react';

export function useWindowWidth(): number {
  const [width, setWidth] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1200));

  useEffect(() => {
    let raf: number;
    const handleResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setWidth(window.innerWidth));
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return width;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/utils/useWindowWidth.ts
git commit -m "feat: add useWindowWidth hook with RAF debounce"
```

---

### Task 5: LeftSidebar Component

**Files:**
- Create: `src/components/Layout/LeftSidebar.tsx`

- [ ] **Step 1: Write LeftSidebar**

```tsx
import { useNavigate, useLocation } from 'react-router-dom';
import { useProgressStore } from '../../store/useProgressStore';
import type { ChapterModule } from '../../data/types';
import { STAGES, SUBJECTS } from '../../data/stages';

interface ModuleStat {
  module: ChapterModule;
  total: number;
  done: number;
  retry: number;
}

function useModuleStats(): { modules: ChapterModule[]; stats: Map<string, ModuleStat> } {
  const tasks = useProgressStore(s => s.tasks);
  const done = useProgressStore(s => s.done);
  const retry = useProgressStore(s => s.retry);

  // Try to get modules from chapter data or derive from tasks
  const modules = (tasks[0] as any)?.moduleId !== undefined
    ? (window as any).__chapterModules as ChapterModule[] || []
    : deriveModulesFromTasks(tasks);

  const stats = new Map<string, ModuleStat>();
  for (const m of modules) {
    stats.set(m.id, { module: m, total: 0, done: 0, retry: 0 });
  }
  for (const t of tasks) {
    const mid = (t as any).moduleId || t.stageName;
    const key = modules.find(m => m.id === mid)?.id || mid;
    if (!stats.has(key)) {
      stats.set(key, {
        module: { id: key, name: String(mid), order: 99 },
        total: 0, done: 0, retry: 0,
      });
    }
    const entry = stats.get(key)!;
    entry.total++;
    if (done.includes(t.id)) entry.done++;
    if (retry.includes(t.id)) entry.retry++;
  }

  const sorted = Array.from(stats.entries())
    .sort((a, b) => a[1].module.order - b[1].module.order);
  return { modules: sorted.map(([k, v]) => v.module), stats: new Map(sorted) };
}

// Fallback: derive from stageName
function deriveModulesFromTasks(tasks: { stageName: string }[], _done?: number[], _retry?: number[]): ChapterModule[] {
  const seen = new Set<string>();
  const result: ChapterModule[] = [];
  for (const t of tasks) {
    if (!seen.has(t.stageName)) {
      seen.add(t.stageName);
      result.push({ id: t.stageName, name: t.stageName, order: result.length });
    }
  }
  return result;
}

export default function LeftSidebar({ onCollapse }: { onCollapse?: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const chapterId = useProgressStore(s => s.chapterId);
  const chapterTitle = useProgressStore(s => s.chapterTitle);
  const inChapter = location.pathname.includes('/chapter/') && chapterTitle;

  const { modules, stats } = useModuleStats();

  const handleModuleClick = (moduleId: string) => {
    const tasks = useProgressStore.getState().tasks;
    const first = tasks.find(t => ((t as any).moduleId || t.stageName) === moduleId);
    if (first) {
      if (location.pathname.includes('/task')) {
        navigate(`/chapter/${chapterId}/task/${first.id}`);
      } else if (location.pathname.includes('/knowledge')) {
        navigate(`/chapter/${chapterId}/knowledge`);
        // Scroll will be handled by knowledge page via hash or state
      } else if (location.pathname.includes('/map')) {
        navigate(`/chapter/${chapterId}/map`);
      } else {
        navigate(`/chapter/${chapterId}/task/${first.id}`);
      }
    }
  };

  const pathSegments = [
    { label: '下界筑基', path: '/stage/foundation' },
    { label: '高等数学', path: '/stage/foundation/math' },
    { label: '张宇30讲', path: '/stage/foundation/math' },
    { label: `第${chapterId}讲：${chapterTitle || '...'}`, path: `/chapter/${chapterId}`, current: true },
  ];

  return (
    <div className="sidebar-left">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontWeight: 700, fontSize: 11, color: 'var(--accent)', fontFamily: 'var(--font-title)' }}>
          📖 修炼路径
        </span>
        {onCollapse && (
          <button className="sidebar-toggle-btn" onClick={onCollapse} title="折叠左侧栏">◀</button>
        )}
      </div>

      {/* Cultivation Path */}
      <div style={{ marginBottom: 14 }}>
        {pathSegments.map((seg, i) => (
          <div key={i} style={{
            padding: '3px 0', fontSize: 11, lineHeight: 1.6,
            color: seg.current ? 'var(--accent)' : 'var(--text3)',
            fontWeight: seg.current ? 600 : 400,
            cursor: seg.current ? 'default' : 'pointer',
            borderLeft: seg.current ? '2px solid var(--accent)' : 'none',
            paddingLeft: seg.current ? 8 : 0,
          }}
          onClick={() => !seg.current && seg.path && navigate(seg.path)}>
            {i > 0 && <span style={{ marginRight: 4, color: 'var(--text3)', fontSize: 9 }}>{'└'}</span>}
            {seg.label}
          </div>
        ))}
      </div>

      {/* Module Nav (only in chapter context) */}
      {inChapter && modules.length > 0 && (
        <div>
          <div style={{
            fontWeight: 600, fontSize: 10, color: 'var(--purple)',
            marginBottom: 6, paddingTop: 8,
            borderTop: '1px solid var(--border)',
            fontFamily: 'var(--font-title)',
          }}>
            章节模块
          </div>
          {modules.map(m => {
            const s = stats.get(m.id);
            const total = s?.total || 0;
            const doneCount = s?.done || 0;
            const hasRetry = (s?.retry || 0) > 0;
            const isCurrentModule = location.pathname.includes('/task/') &&
              useProgressStore.getState().tasks[useProgressStore.getState().currentTask] &&
              (((useProgressStore.getState().tasks[useProgressStore.getState().currentTask] as any).moduleId || '') === m.id);

            return (
              <button
                key={m.id}
                onClick={() => handleModuleClick(m.id)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', padding: '5px 8px', marginBottom: 2,
                  border: 'none', borderRadius: 4,
                  background: isCurrentModule ? 'var(--accent-soft)' : 'transparent',
                  color: isCurrentModule ? 'var(--accent)' : 'var(--text2)',
                  fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
                  textAlign: 'left' as const, transition: 'all 0.12s',
                  fontWeight: isCurrentModule ? 600 : 400,
                }}
                onMouseEnter={e => { if (!isCurrentModule) e.currentTarget.style.color = 'var(--accent)'; }}
                onMouseLeave={e => { if (!isCurrentModule) e.currentTarget.style.color = 'var(--text2)'; }}
              >
                <span style={{ flex: 1 }}>{m.name}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, color: 'var(--text3)' }}>
                  {doneCount}/{total}
                  {hasRetry && <span style={{ color: 'var(--red)', fontSize: 9 }}>●</span>}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Store modules in a way LeftSidebar can access**

Modify `src/store/useProgressStore.ts` — in the `init` function, after `set(...)`, also expose modules:

Actually, simpler: pass modules via the store. Add to `ProgressState`:

```ts
chapterModules: ChapterModule[];
```

And in `init`, after the `set(...)`:
```ts
chapterModules: (data as any).modules || [],
```

- [ ] **Step 3: Build check**

```bash
cd "C:/Users/狗琦/Desktop/c9-cultivation" && npx tsc -b --noEmit 2>&1
```

- [ ] **Step 4: Commit**

```bash
git add src/components/Layout/LeftSidebar.tsx src/store/useProgressStore.ts
git commit -m "feat: add LeftSidebar with cultivation path and chapter module navigation"
```

---

### Task 6: RightSidebar Component

**Files:**
- Create: `src/components/Layout/RightSidebar.tsx`

- [ ] **Step 1: Write RightSidebar with three modes**

```tsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProgressStore } from '../../store/useProgressStore';
import ResetModal from '../Common/ResetModal';

// ── Mode A: 今日小札 (Home / Dashboard) ──
function TodayNotes() {
  const navigate = useNavigate();
  const stats = useProgressStore(s => s.stats);
  const chapterId = useProgressStore(s => s.chapterId);
  const chapterTitle = useProgressStore(s => s.chapterTitle);
  const retry = useProgressStore(s => s.retry);
  const reviewSchedule = useProgressStore(s => s.getReviewSchedule());
  const exportAllData = useProgressStore(s => s.exportAllData);

  const handleExport = () => {
    const { json, filename } = exportAllData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="sidebar-right" style={{ padding: '10px 16px 10px 10px' }}>
      <div style={{ fontWeight: 700, fontSize: 11, color: 'var(--accent)', fontFamily: 'var(--font-title)', marginBottom: 8 }}>
        📋 今日小札
      </div>

      {chapterTitle && (
        <div style={{ marginBottom: 8, padding: '8px 10px', background: 'var(--accent-soft)', borderRadius: 6, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 9, color: 'var(--text3)' }}>今日主线任务</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)' }}>
            第{chapterId}讲 · {chapterTitle}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text2)', marginTop: 2 }}>
            剩余 {stats.totalCount - stats.doneCount} 题未完成
          </div>
        </div>
      )}

      {retry.length > 0 && (
        <div style={{ marginBottom: 8, padding: '8px 10px', background: 'var(--red-soft)', borderRadius: 6, border: '1px solid rgba(184,92,92,0.15)' }}>
          <div style={{ fontSize: 9, color: 'var(--red)' }}>到期心魔</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--red)' }}>{retry.length} 题待复习</div>
        </div>
      )}

      <div style={{ marginBottom: 8, padding: '8px 10px', background: 'var(--surface)', borderRadius: 6, border: '1px solid var(--border)' }}>
        <div style={{ fontSize: 9, color: 'var(--text3)' }}>最近进度</div>
        <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>
          掌握度 {stats.mastery || 0}% · C9战力 {stats.c9 || 0}
        </div>
        <div style={{ fontSize: 9, color: 'var(--text3)', marginTop: 1 }}>
          下次复习：{reviewSchedule.nextReviewDate}
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 8 }}>
        <div style={{ fontSize: 9, color: 'var(--text3)', marginBottom: 4 }}>快捷操作</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {chapterTitle && (
            <button className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => navigate(`/chapter/${chapterId}/task`)}>继续修炼 →</button>
          )}
          {retry.length > 0 && (
            <button className="btn btn-danger btn-sm" style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => navigate(`/chapter/${chapterId || 10}/review`)}>📖 进入心魔本 ({retry.length})</button>
          )}
          <button className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center' }}
            onClick={handleExport}>📥 导出进度</button>
          <button className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => useProgressStore.getState().clearToast() /* trigger import modal */}>
            📤 导入进度
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Mode B: 题号导航 (Task Page) ──
function QuestionNav() {
  const navigate = useNavigate();
  const chapterId = useProgressStore(s => s.chapterId);
  const tasks = useProgressStore(s => s.tasks);
  const done = useProgressStore(s => s.done);
  const retry = useProgressStore(s => s.retry);
  const currentTask = useProgressStore(s => s.currentTask);
  const [filter, setFilter] = useState<'all' | 'undone' | 'done' | 'retry'>('all');
  const base = `/chapter/${chapterId}`;

  const filtered = tasks.filter(t => {
    switch (filter) {
      case 'undone': return !done.includes(t.id) && !retry.includes(t.id);
      case 'done': return done.includes(t.id);
      case 'retry': return retry.includes(t.id);
      default: return true;
    }
  });

  const jump = (id: number) => navigate(`${base}/task/${id}`);
  const nextUndone = tasks.find(t => !done.includes(t.id) && !retry.includes(t.id) && t.id > currentTask);
  const nextRetry = tasks.find(t => retry.includes(t.id) && t.id !== currentTask);

  return (
    <div className="sidebar-right" style={{ padding: '10px 16px 10px 10px' }}>
      <div style={{ fontWeight: 700, fontSize: 11, color: 'var(--accent)', fontFamily: 'var(--font-title)', marginBottom: 8 }}>
        📝 题号导航
      </div>

      {/* Filter buttons */}
      <div style={{ display: 'flex', gap: 3, marginBottom: 6 }}>
        {(['all', 'undone', 'done', 'retry'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
            style={{ padding: '2px 6px', fontSize: 9 }}>
            {{ all: '全部', undone: '未做', done: '完成', retry: '心魔' }[f]}
          </button>
        ))}
      </div>

      {/* Question number grid */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 8 }}>
        {filtered.map(t => {
          const isD = done.includes(t.id), isR = retry.includes(t.id), isC = t.id === currentTask;
          let bg = 'var(--surface3)'; let color = 'var(--text3)'; let borderColor = 'var(--border)';
          if (isC) { bg = 'var(--accent-soft)'; color = 'var(--accent)'; borderColor = 'var(--accent)'; }
          else if (isR) { bg = 'var(--red-soft)'; color = 'var(--red)'; borderColor = 'var(--red)'; }
          else if (isD) { bg = 'var(--green-soft)'; color = 'var(--green)'; borderColor = 'var(--green)'; }
          return (
            <button key={t.id}
              onClick={() => jump(t.id)}
              style={{
                width: 28, height: 28, borderRadius: 4,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: isC ? 700 : 500,
                cursor: 'pointer', border: `1.5px solid ${borderColor}`,
                background: bg, color, fontFamily: 'var(--font-body)',
                transition: 'all 0.12s',
              }}
              title={`#${t.id + 1} ${t.title}`}>
              {t.id + 1}
            </button>
          );
        })}
      </div>

      {/* Quick jump */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 6 }}>
        <div style={{ fontSize: 9, color: 'var(--text3)', marginBottom: 4 }}>快捷跳转</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <button className="btn btn-ghost btn-sm" style={{ fontSize: 9, padding: '2px 6px' }} onClick={() => jump(0)}>⏮ 第一题</button>
          <button className="btn btn-ghost btn-sm" style={{ fontSize: 9, padding: '2px 6px' }} onClick={() => jump(tasks.length - 1)}>⏭ 最后</button>
          {nextUndone && <button className="btn btn-ghost btn-sm" style={{ fontSize: 9, padding: '2px 6px' }} onClick={() => jump(nextUndone.id)}>▶ 下一未做</button>}
          {nextRetry && <button className="btn btn-danger btn-sm" style={{ fontSize: 9, padding: '2px 6px' }} onClick={() => jump(nextRetry.id)}>🔄 下一心魔</button>}
        </div>
      </div>
    </div>
  );
}

// ── Mode C: 本章操作 (Knowledge Matrix) ──
function ChapterOps() {
  const navigate = useNavigate();
  const chapterId = useProgressStore(s => s.chapterId);
  const resetChapter = useProgressStore(s => s.resetChapter);
  const resetOptions = useProgressStore(s => s.resetOptions);
  const [showReset, setShowReset] = useState(false);
  const base = `/chapter/${chapterId}`;

  return (
    <div className="sidebar-right" style={{ padding: '10px 16px 10px 10px' }}>
      <div style={{ fontWeight: 700, fontSize: 11, color: 'var(--accent)', fontFamily: 'var(--font-title)', marginBottom: 8 }}>
        ⚙️ 本章操作
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <button className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center' }}
          onClick={() => navigate(base)}>📊 返回章节首页</button>
        <button className="btn btn-danger btn-sm" style={{ width: '100%', justifyContent: 'center' }}
          onClick={() => setShowReset(true)}>🔄 重置本章进度</button>
      </div>

      {showReset && (
        <div className="modal-overlay" onClick={() => setShowReset(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3>重置本章进度</h3>
            <p>选择要重置的内容：</p>
            <div className="modal-actions" style={{ flexDirection: 'column', gap: 6 }}>
              <button className="btn btn-danger btn-sm" style={{ width: '100%' }}
                onClick={() => { if (confirm('确定仅重置完成状态？')) { resetOptions({ done: true }); setShowReset(false); } }}>
                仅重置完成状态
              </button>
              <button className="btn btn-danger btn-sm" style={{ width: '100%' }}
                onClick={() => { if (confirm('确定仅清空心魔本？')) { resetOptions({ retry: true }); setShowReset(false); } }}>
                仅清空心魔本
              </button>
              <button className="btn btn-danger" style={{ width: '100%' }}
                onClick={() => { if (confirm('确定重置整个章节？此操作不可撤销！')) { resetChapter(); navigate(base); setShowReset(false); } }}>
                重置整个章节
              </button>
              <button className="btn btn-ghost btn-sm" style={{ width: '100%' }}
                onClick={() => setShowReset(false)}>取消</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main RightSidebar ──
export default function RightSidebar({ onCollapse }: { onCollapse?: () => void }) {
  const location = useLocation();

  let content: React.ReactNode;
  if (location.pathname.includes('/task')) {
    content = <QuestionNav />;
  } else if (location.pathname.includes('/knowledge')) {
    content = <ChapterOps />;
  } else {
    content = <TodayNotes />;
  }

  return (
    <div style={{ position: 'relative' }}>
      {onCollapse && (
        <button className="sidebar-toggle-btn"
          style={{ position: 'absolute', top: 10, right: 6, zIndex: 1 }}
          onClick={onCollapse} title="折叠右侧栏">▶</button>
      )}
      {content}
    </div>
  );
}
```

- [ ] **Step 2: Build check**

```bash
cd "C:/Users/狗琦/Desktop/c9-cultivation" && npx tsc -b --noEmit 2>&1
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Layout/RightSidebar.tsx
git commit -m "feat: add RightSidebar with context-sensitive modes (今日小札/题号导航/本章操作)"
```

---

### Task 7: AppShell Rewrite — Three-Column Shell

**Files:**
- Modify: `src/components/Layout/AppShell.tsx`
- Modify: `src/components/Layout/Header.tsx`

- [ ] **Step 1: Rewrite AppShell for three-column grid**

```tsx
import { useState, useEffect, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import RewardToast from '../Task/RewardToast';
import { useWindowWidth } from '../../utils/useWindowWidth';

const LS_LEFT = 'c9_left_collapsed';
const LS_RIGHT = 'c9_right_collapsed';

export default function AppShell() {
  const width = useWindowWidth();
  const [leftCollapsed, setLeftCollapsed] = useState(() => localStorage.getItem(LS_LEFT) === '1');
  const [rightCollapsed, setRightCollapsed] = useState(() => localStorage.getItem(LS_RIGHT) === '1');
  const [mobileLeftOpen, setMobileLeftOpen] = useState(false);
  const [mobileRightOpen, setMobileRightOpen] = useState(false);

  const isDesktop = width >= 1200;
  const isTablet = width >= 768 && width < 1200;
  const isMobile = width < 768;

  const persist = useCallback((key: string, val: boolean) => {
    localStorage.setItem(key, val ? '1' : '0');
  }, []);

  // Desktop three-column
  if (isDesktop) {
    const cls = [
      'app-shell',
      leftCollapsed && 'collapsed-left',
      rightCollapsed && 'collapsed-right',
    ].filter(Boolean).join(' ');

    return (
      <div className={cls}>
        <div className="shell-header"><Header /></div>
        <div className="shell-left">
          {!leftCollapsed && (
            <LeftSidebar onCollapse={() => { setLeftCollapsed(true); persist(LS_LEFT, true); }} />
          )}
          {leftCollapsed && (
            <button className="sidebar-toggle-btn" style={{ position: 'fixed', left: 8, top: 80, zIndex: 10 }}
              onClick={() => { setLeftCollapsed(false); persist(LS_LEFT, false); }} title="展开左侧栏">▶</button>
          )}
        </div>
        <div className="shell-main"><Outlet /></div>
        <div className="shell-right">
          {!rightCollapsed && (
            <RightSidebar onCollapse={() => { setRightCollapsed(true); persist(LS_RIGHT, true); }} />
          )}
          {rightCollapsed && (
            <button className="sidebar-toggle-btn" style={{ position: 'fixed', right: 8, top: 80, zIndex: 10 }}
              onClick={() => { setRightCollapsed(false); persist(LS_RIGHT, false); }} title="展开右侧栏">◀</button>
          )}
        </div>
        <BottomNav />
        <RewardToast />
      </div>
    );
  }

  // Tablet: sidebars as drawers
  if (isTablet) {
    return (
      <div className="app-shell" style={{ display: 'block', maxWidth: '100%', padding: '12px 12px 88px' }}>
        <Header />
        <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setMobileLeftOpen(true)}>📖 修炼路径</button>
          <button className="btn btn-ghost btn-sm" onClick={() => setMobileRightOpen(true)}>
            {location.pathname.includes('/task') ? '📝 题号' : '📋 小札'}
          </button>
        </div>
        <Outlet />

        {mobileLeftOpen && <div className="sidebar-overlay" onClick={() => setMobileLeftOpen(false)} />}
        <div className={`shell-left ${mobileLeftOpen ? 'open' : ''}`}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
            <button className="sidebar-toggle-btn" onClick={() => setMobileLeftOpen(false)}>✕</button>
          </div>
          <LeftSidebar />
        </div>

        {mobileRightOpen && <div className="sidebar-overlay" onClick={() => setMobileRightOpen(false)} />}
        <div className={`shell-right ${mobileRightOpen ? 'open' : ''}`}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
            <button className="sidebar-toggle-btn" onClick={() => setMobileRightOpen(false)}>✕</button>
          </div>
          <RightSidebar />
        </div>

        <BottomNav />
        <RewardToast />
      </div>
    );
  }

  // Mobile: single column + bottom drawer
  return <MobileLayout />;
}

// ── Mobile Layout ──
function MobileLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'nav' | 'notes'>('nav');

  const openDrawer = (mode: 'nav' | 'notes') => {
    setDrawerMode(mode);
    setDrawerOpen(true);
  };

  return (
    <div className="app-shell" style={{ display: 'block', padding: '8px 8px 88px' }}>
      <Header />
      {/* Mobile breadcrumb */}
      <MobileBreadcrumb />
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => openDrawer('nav')}>📝 题号导航</button>
        <button className="btn btn-ghost btn-sm" onClick={() => openDrawer('notes')}>📋 今日小札</button>
      </div>
      <Outlet />

      {/* Bottom drawer */}
      {drawerOpen && <div className="sidebar-overlay" onClick={() => setDrawerOpen(false)} />}
      <div className={`bottom-drawer ${drawerOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontWeight: 700, fontSize: 12, color: 'var(--accent)' }}>
            {drawerMode === 'nav' ? '📝 题号导航' : '📋 今日小札'}
          </span>
          <button className="sidebar-toggle-btn" onClick={() => setDrawerOpen(false)}>✕</button>
        </div>
        {drawerMode === 'nav' ? <QuestionNavMobile /> : <TodayNotesMobile />}
      </div>

      <BottomNav />
      <RewardToast />
    </div>
  );
}

// Mobile breadcrumb
function MobileBreadcrumb() {
  const chapterId = useProgressStore(s => s.chapterId);
  const chapterTitle = useProgressStore(s => s.chapterTitle);
  const location = useLocation();
  const inChapter = location.pathname.includes('/chapter/') && chapterTitle;

  if (!inChapter) return null;
  return (
    <div className="mobile-breadcrumb">
      <span>下界筑基</span> <span>/</span>
      <span>高等数学</span> <span>/</span>
      <span className="current">第{chapterId}讲</span>
    </div>
  );
}

// Need these imports at top and components for mobile:
import { useNavigate, useLocation } from 'react-router-dom';
import { useProgressStore } from '../../store/useProgressStore';

function QuestionNavMobile() { /* same as QuestionNav but without sidebar wrapper */ }
function TodayNotesMobile() { /* same as TodayNotes but without sidebar wrapper */ }
```

Wait — the mobile sub-components need to duplicate code from RightSidebar. Better approach: extract the mode components from RightSidebar into their own file so they can be reused.

Actually, the cleaner approach is to keep RightSidebar modes as named exports and reuse them in the mobile layout. Let me restructure:

In `RightSidebar.tsx`, export the mode components:
```tsx
export { QuestionNav, TodayNotes, ChapterOps };
```

Then in `AppShell.tsx`, import them for the mobile drawer.

Let me rewrite Step 1 more cleanly.

- [ ] **Step 1 (revised): Rewrite AppShell**

Replace `src/components/Layout/AppShell.tsx`:

```tsx
import { useState, useEffect, useCallback } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';
import LeftSidebar from './LeftSidebar';
import RightSidebar, { QuestionNav, TodayNotes, ChapterOps } from './RightSidebar';
import RewardToast from '../Task/RewardToast';
import { useProgressStore } from '../../store/useProgressStore';
import { useWindowWidth } from '../../utils/useWindowWidth';

const LS_LEFT = 'c9_left_collapsed';
const LS_RIGHT = 'c9_right_collapsed';

export default function AppShell() {
  const width = useWindowWidth();
  const location = useLocation();
  const [leftCollapsed, setLeftCollapsed] = useState(() => localStorage.getItem(LS_LEFT) === '1');
  const [rightCollapsed, setRightCollapsed] = useState(() => localStorage.getItem(LS_RIGHT) === '1');
  const [tabletLeftOpen, setTabletLeftOpen] = useState(false);
  const [tabletRightOpen, setTabletRightOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'nav' | 'notes' | 'ops'>('nav');

  const isDesktop = width >= 1200;
  const isTablet = width >= 768 && width < 1200;

  const persist = useCallback((key: string, val: boolean) => {
    localStorage.setItem(key, val ? '1' : '0');
  }, []);

  // ── Desktop ──
  if (isDesktop) {
    const cls = [
      'app-shell',
      leftCollapsed && 'collapsed-left',
      rightCollapsed && 'collapsed-right',
    ].filter(Boolean).join(' ');

    return (
      <div className={cls}>
        <div className="shell-header"><Header /></div>
        <div className="shell-left">
          {!leftCollapsed && (
            <LeftSidebar onCollapse={() => { setLeftCollapsed(true); persist(LS_LEFT, true); }} />
          )}
          {leftCollapsed && (
            <button className="sidebar-toggle-btn" style={{ position: 'fixed', left: 8, top: 80, zIndex: 10 }}
              onClick={() => { setLeftCollapsed(false); persist(LS_LEFT, false); }}>▶</button>
          )}
        </div>
        <div className="shell-main"><Outlet /></div>
        <div className="shell-right">
          {!rightCollapsed && (
            <RightSidebar onCollapse={() => { setRightCollapsed(true); persist(LS_RIGHT, true); }} />
          )}
          {rightCollapsed && (
            <button className="sidebar-toggle-btn" style={{ position: 'fixed', right: 8, top: 80, zIndex: 10 }}
              onClick={() => { setRightCollapsed(false); persist(LS_RIGHT, false); }}>◀</button>
          )}
        </div>
        <BottomNav />
        <RewardToast />
      </div>
    );
  }

  // ── Tablet ──
  if (isTablet) {
    const taskPage = location.pathname.includes('/task');
    const knowledgePage = location.pathname.includes('/knowledge');
    const rightLabel = taskPage ? '📝 题号' : knowledgePage ? '⚙️ 操作' : '📋 小札';

    return (
      <div className="app-shell" style={{ display: 'block', maxWidth: '100%', padding: '12px 12px 88px' }}>
        <Header />
        <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setTabletLeftOpen(true)}>📖 路径</button>
          <button className="btn btn-ghost btn-sm" onClick={() => setTabletRightOpen(true)}>{rightLabel}</button>
        </div>
        <Outlet />

        {tabletLeftOpen && <div className="sidebar-overlay" onClick={() => setTabletLeftOpen(false)} />}
        <div className={`shell-left ${tabletLeftOpen ? 'open' : ''}`}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
            <button className="sidebar-toggle-btn" onClick={() => setTabletLeftOpen(false)}>✕</button>
          </div>
          <LeftSidebar />
        </div>

        {tabletRightOpen && <div className="sidebar-overlay" onClick={() => setTabletRightOpen(false)} />}
        <div className={`shell-right ${tabletRightOpen ? 'open' : ''}`}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
            <button className="sidebar-toggle-btn" onClick={() => setTabletRightOpen(false)}>✕</button>
          </div>
          {taskPage ? <QuestionNav /> : knowledgePage ? <ChapterOps /> : <TodayNotes />}
        </div>

        <BottomNav />
        <RewardToast />
      </div>
    );
  }

  // ── Mobile ──
  const taskPage = location.pathname.includes('/task');
  const knowledgePage = location.pathname.includes('/knowledge');

  return (
    <div className="app-shell" style={{ display: 'block', padding: '8px 8px 88px' }}>
      <Header />
      <MobileBreadcrumb />
      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
        {taskPage && <button className="btn btn-ghost btn-sm" onClick={() => { setDrawerMode('nav'); setDrawerOpen(true); }}>📝 题号</button>}
        {knowledgePage && <button className="btn btn-ghost btn-sm" onClick={() => { setDrawerMode('ops'); setDrawerOpen(true); }}>⚙️ 操作</button>}
        <button className="btn btn-ghost btn-sm" onClick={() => { setDrawerMode('notes'); setDrawerOpen(true); }}>📋 小札</button>
      </div>
      <Outlet />

      {drawerOpen && <div className="sidebar-overlay" onClick={() => setDrawerOpen(false)} />}
      <div className={`bottom-drawer ${drawerOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontWeight: 700, fontSize: 12, color: 'var(--accent)' }}>
            {drawerMode === 'nav' ? '📝 题号导航' : drawerMode === 'ops' ? '⚙️ 本章操作' : '📋 今日小札'}
          </span>
          <button className="sidebar-toggle-btn" onClick={() => setDrawerOpen(false)}>✕</button>
        </div>
        {drawerMode === 'nav' ? <QuestionNav /> : drawerMode === 'ops' ? <ChapterOps /> : <TodayNotes />}
      </div>

      <BottomNav />
      <RewardToast />
    </div>
  );
}

function MobileBreadcrumb() {
  const chapterId = useProgressStore(s => s.chapterId);
  const chapterTitle = useProgressStore(s => s.chapterTitle);
  const location = useLocation();
  const inChapter = location.pathname.includes('/chapter/') && chapterTitle;
  if (!inChapter) return null;
  return (
    <div className="mobile-breadcrumb">
      <span>下界筑基</span><span>/</span>
      <span>高等数学</span><span>/</span>
      <span className="current">第{chapterId}讲</span>
    </div>
  );
}
```

- [ ] **Step 2: Build check & fix import issues**

```bash
cd "C:/Users/狗琦/Desktop/c9-cultivation" && npx tsc -b --noEmit 2>&1
```

Fix any TypeScript errors (expected: need to export mode components from RightSidebar).

- [ ] **Step 3: Commit**

```bash
git add src/components/Layout/AppShell.tsx src/components/Layout/Header.tsx
git commit -m "feat: rewrite AppShell as three-column grid with desktop/tablet/mobile layouts"
```

---

### Task 8: Page Adaptations

**Files:**
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/components/Task/TaskPage.tsx`
- Modify: `src/components/Knowledge/KnowledgeMatrix.tsx`
- Modify: `src/components/Dashboard/Dashboard.tsx`
- Modify: `src/components/ChapterMap/ChapterMap.tsx`
- Modify: `src/components/Review/ReviewQueue.tsx`
- Modify: `src/components/Report/FinalReport.tsx`

- [ ] **Step 1: Adapt TaskPage — remove inline sidebar, use RightSidebar instead**

In `src/components/Task/TaskPage.tsx`:

Remove the inline sidebar (`Sidebar` component + `sidebarVisible` state + `task-sidebar-col` div). The right sidebar now handles question navigation via `QuestionNav` in `RightSidebar.tsx`.

Key changes:
1. Remove the `Sidebar` function component (lines 22-105) — keep the formula data if needed, but remove sidebar rendering
2. Remove `const [sidebarVisible, setSidebarVisible] = useState(true);` (line 141)
3. Remove the sidebar column div (lines 285-289):
```tsx
<div className="task-sidebar-col" style={{ width: 230, flexShrink: 0, display: sidebarVisible ? 'block' : 'none' }}>
  <Sidebar base={base} />
</div>
```
4. Remove the `sidebar-toggle` button from the header (lines 203-206):
```tsx
<button className="btn btn-ghost btn-sm sidebar-toggle" ...>...</button>
```
5. Change the main layout from `display: flex` to single column:
```tsx
// Change line 187 from:
<div className="anim-in" style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
// To:
<div className="anim-in">
```
6. Remove unused `Sidebar`-related code and `FORMULAS` constant (move formulas to RightSidebar if needed, or keep them in TaskPage but just don't render sidebar)

- [ ] **Step 2: Adapt HomePage — works in center column**

HomePage already has the three stage entries (下界筑基, 灵域试炼, 天庭问道) in `STAGES`. No structural changes needed — it just renders in the center column. The right sidebar will show 今日小札.

- [ ] **Step 3: Adapt KnowledgeMatrix — add reset buttons, remove from internal to use RightSidebar ChapterOps**

In `src/components/Knowledge/KnowledgeMatrix.tsx`:
- Remove the reset modal integration (lines 16, 76-78) since ChapterOps in RightSidebar handles it
- Keep the component focused on knowledge card display

```tsx
// Remove: import ResetModal, useState for showReset, reset modal JSX
// Keep: knowledge grid rendering
// At the bottom, replace reset buttons with just:
<div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
  <button className="btn btn-ghost btn-sm" onClick={() => navigate(base)}>← 返回</button>
</div>
```

- [ ] **Step 4: Adapt Dashboard, ChapterMap, ReviewQueue, FinalReport**

These pages work in the center column as-is. Minor adjustments:
- Remove any wide padding that was designed for full-width single-column
- Keep existing content and navigation

No code changes needed for these — they already render within the `<Outlet />`.

- [ ] **Step 5: Build check**

```bash
cd "C:/Users/狗琦/Desktop/c9-cultivation" && npx tsc -b --noEmit 2>&1
```

- [ ] **Step 6: Commit**

```bash
git add src/components/Task/TaskPage.tsx src/components/Knowledge/KnowledgeMatrix.tsx
git commit -m "feat: adapt TaskPage and KnowledgeMatrix for three-column layout"
```

---

### Task 9: Import Modal UI

**Files:**
- Create: `src/components/Common/ImportModal.tsx`

- [ ] **Step 1: Write ImportModal**

```tsx
import { useState, useRef } from 'react';
import { useProgressStore } from '../../store/useProgressStore';
import { importAllProgress, createProfile, type ExportedProgress } from '../../utils/storage';

interface Props { onClose: () => void; }

export default function ImportModal({ onClose }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ExportedProgress | null>(null);
  const [choice, setChoice] = useState<'overwrite' | 'new' | null>(null);
  const importAllData = useProgressStore(s => s.importAllData);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = reader.result as string;
        const result = importAllData(json);
        if (!result.success) {
          setError(result.error || '导入失败');
          return;
        }
        setParsedData(JSON.parse(json));
        setError(null);
      } catch (err) {
        setError(`文件解析失败：${(err as Error).message}`);
      }
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (!parsedData || !choice) return;
    if (choice === 'overwrite') {
      const profile = useProgressStore.getState().profileId;
      importAllProgress(parsedData, profile || parsedData.profile.id);
      useProgressStore.getState().init(useProgressStore.getState().chapterId,
        { chapterId: useProgressStore.getState().chapterId, chapterTitle: '', book: '', mainSource: '', description: '', stages: [], tasks: useProgressStore.getState().tasks, knowledgePoints: [] });
    } else if (choice === 'new') {
      const newProfile = createProfile(parsedData.profile.name + ' (导入)');
      importAllProgress(parsedData, newProfile.id);
    }
    onClose();
    window.location.reload();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 440 }}>
        <h3>📤 导入进度</h3>
        {!parsedData ? (
          <>
            <p style={{ fontSize: 12, color: 'var(--text2)' }}>
              选择之前导出的 JSON 进度文件。导入不会覆盖题库内容，只恢复学习进度。
            </p>
            <input ref={fileRef} type="file" accept=".json"
              onChange={handleFile}
              style={{ display: 'block', margin: '12px 0', fontSize: 12 }} />
            {error && (
              <div style={{ padding: '8px 12px', background: 'var(--red-soft)', color: 'var(--red)', borderRadius: 6, fontSize: 11, marginBottom: 8 }}>
                {error}
              </div>
            )}
          </>
        ) : (
          <>
            <p style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 8 }}>
              已读取进度数据：
            </p>
            <div style={{ fontSize: 11, color: 'var(--text2)', padding: '8px 12px', background: 'var(--surface2)', borderRadius: 6, marginBottom: 10 }}>
              <div>学习者：{parsedData.profile.name}</div>
              <div>导出时间：{parsedData.exportedAt.slice(0, 10)}</div>
              <div>包含 {Object.keys(parsedData.chapters).length} 个章节的进度</div>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 8 }}>选择导入方式：</p>
            <div className="modal-actions" style={{ flexDirection: 'column', gap: 6 }}>
              <button className={`btn btn-sm ${choice === 'overwrite' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ width: '100%' }}
                onClick={() => setChoice('overwrite')}>
                覆盖当前学习者进度
              </button>
              <button className={`btn btn-sm ${choice === 'new' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ width: '100%' }}
                onClick={() => setChoice('new')}>
                新建学习者并导入
              </button>
              {choice && (
                <button className="btn btn-primary btn-sm" style={{ width: '100%' }}
                  onClick={handleImport}>确认导入</button>
              )}
              <button className="btn btn-ghost btn-sm" style={{ width: '100%' }}
                onClick={onClose}>取消</button>
            </div>
          </>
        )}
        <div className="modal-actions" style={{ marginTop: 12 }}>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>关闭</button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Wire import modal trigger in RightSidebar**

In `RightSidebar.tsx`, in the `TodayNotes` component, add import state:

```tsx
import ImportModal from '../Common/ImportModal';

// Inside TodayNotes, add:
const [showImport, setShowImport] = useState(false);
// ... in JSX:
{showImport && <ImportModal onClose={() => setShowImport(false)} />}
// Change the import button:
<button className="btn btn-ghost btn-sm" ... onClick={() => setShowImport(true)}>📤 导入进度</button>
```

- [ ] **Step 3: Build check & commit**

```bash
cd "C:/Users/狗琦/Desktop/c9-cultivation" && npx tsc -b --noEmit 2>&1
```

```bash
git add src/components/Common/ImportModal.tsx src/components/Layout/RightSidebar.tsx
git commit -m "feat: add ImportModal for importing progress JSON with overwrite/new profile options"
```

---

### Task 10: Build, Fix & Verify

**Files:**
- All modified files

- [ ] **Step 1: Full build**

```bash
cd "C:/Users/狗琦/Desktop/c9-cultivation" && npm run build 2>&1
```

Fix any TypeScript or build errors. Common issues to watch for:
- Unused imports in TaskPage (Sidebar, FORMULAS, useState for sidebar)
- Missing exports from RightSidebar (QuestionNav, TodayNotes, ChapterOps)
- Import paths in AppShell for new components
- Missing `useProgressStore` imports in AppShell

- [ ] **Step 2: Verify the build output**

```bash
ls "C:/Users/狗琦/Desktop/c9-cultivation/dist/assets/index-*.js"
```

Expected: One JS bundle file exists.

- [ ] **Step 3: Commit final fixes**

```bash
git add -A
git commit -m "fix: resolve build errors from three-column migration"
```

---

### Task 11: Deploy to GitHub Pages

- [ ] **Step 1: Deploy**

```bash
cd "C:/Users/狗琦/Desktop/c9-cultivation" && npx gh-pages -d dist 2>&1
```

- [ ] **Step 2: Verify URL**

Confirm the site loads correctly at `https://jingqix60-ctrl.github.io/c9-cultivation/`

---

## Final Checklist (from spec)

- [ ] Wide screen shows three functional columns (not empty space)
- [ ] Left sidebar shows cultivation path + chapter modules
- [ ] Center content is comfortable to read (720-820px)
- [ ] Right sidebar shows 今日小札 on home, 题号导航 on task, 本章操作 on knowledge
- [ ] Task page right sidebar: clickable question numbers that jump to task
- [ ] Question numbers show correct colors (grey=undone, green=done, red=retry, blue=current)
- [ ] Home page shows three stage entries (下界筑基, 灵域试炼, 天庭问道)
- [ ] Export progress produces valid JSON file
- [ ] Import progress validates JSON and offers overwrite/new/cancel
- [ ] Chapter reset (full/done-only/retry-only) works with confirmation
- [ ] Desktop (≥1200px): three columns with collapse toggles
- [ ] Tablet (768-1199px): sidebars as slide-out drawers
- [ ] Mobile (<768px): single column + bottom drawer + breadcrumb
- [ ] 云笺书院风 visual style maintained (no neon, no heavy decorations)
- [ ] Subtle paper texture on background (3-4% opacity)
- [ ] No chapter 10 questions, answers, or explanations deleted
- [ ] Same URL, deployed to gh-pages
