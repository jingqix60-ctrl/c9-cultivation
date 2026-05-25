import { useNavigate, useLocation } from 'react-router-dom';
import { useProgressStore } from '../../store/useProgressStore';
import type { ChapterModule } from '../../data/types';

export default function LeftSidebar({ onCollapse }: { onCollapse?: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const chapterId = useProgressStore(s => s.chapterId);
  const chapterTitle = useProgressStore(s => s.chapterTitle);
  const tasks = useProgressStore(s => s.tasks);
  const done = useProgressStore(s => s.done);
  const retry = useProgressStore(s => s.retry);
  const chapterModules = useProgressStore(s => s.chapterModules);
  const currentTask = useProgressStore(s => s.currentTask);
  const inChapter = location.pathname.includes('/chapter/') && chapterTitle;

  // Derive modules: prefer chapterModules from store, else auto-extract from stageName
  const modules = chapterModules.length > 0
    ? chapterModules
    : deriveModulesFromTasks(tasks);

  // Compute stats per module
  const moduleStats = new Map<string, { total: number; done: number; retry: number }>();
  for (const m of modules) {
    moduleStats.set(m.id, { total: 0, done: 0, retry: 0 });
  }
  // Also add a catch-all for unmatched
  moduleStats.set('__unmatched', { total: 0, done: 0, retry: 0 });

  for (const t of tasks) {
    const mid = (t as any).moduleId || t.stageName || '__unmatched';
    let key = modules.find(m => m.id === mid)?.id;
    if (!key) key = '__unmatched';
    if (!moduleStats.has(key)) {
      moduleStats.set(key, { total: 0, done: 0, retry: 0 });
    }
    const entry = moduleStats.get(key)!;
    entry.total++;
    if (done.includes(t.id)) entry.done++;
    if (retry.includes(t.id)) entry.retry++;
  }

  const handleModuleClick = (moduleId: string) => {
    const allTasks = useProgressStore.getState().tasks;
    const first = allTasks.find(t => ((t as any).moduleId || t.stageName) === moduleId);
    if (!first) return;
    if (location.pathname.includes('/task')) {
      navigate(`/chapter/${chapterId}/task/${first.id}`);
    } else {
      navigate(`/chapter/${chapterId}/task/${first.id}`);
    }
  };

  // Cultivation path segments
  const pathSegments = [
    { label: '下界筑基', active: true },
    { label: '高等数学', active: true },
    { label: '张宇30讲', active: true },
  ];
  if (inChapter) {
    pathSegments.push({ label: `第${chapterId}讲：${chapterTitle}`, active: true });
  }

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
            color: seg.active ? 'var(--accent)' : 'var(--text3)',
            fontWeight: seg.active ? 600 : 400,
          }}>
            {i > 0 && <span style={{ marginRight: 4, color: 'var(--text3)', fontSize: 9 }}>└</span>}
            {seg.label}
          </div>
        ))}
      </div>

      {/* Module Navigation (only in chapter context) */}
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
          {modules.filter(m => m.id !== '__unmatched').map(m => {
            const s = moduleStats.get(m.id);
            const total = s?.total || 0;
            const doneCount = s?.done || 0;
            const hasRetry = (s?.retry || 0) > 0;
            const currentModuleId = (tasks[currentTask] as any)?.moduleId;
            const isCurrentModule = currentModuleId === m.id;

            if (total === 0) return null;

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

// Fallback: derive modules from task stageName (deduplicated, ordered by first appearance)
function deriveModulesFromTasks(tasks: { stageName: string }[]): ChapterModule[] {
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
