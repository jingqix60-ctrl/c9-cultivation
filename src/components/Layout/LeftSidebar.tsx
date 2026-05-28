import { useNavigate, useLocation } from 'react-router-dom';
import { useProgressStore } from '../../store/useProgressStore';
import type { ChapterModule } from '../../data/types';

const STAGE_MAP: Record<string, string> = { foundation: '下界筑基', spirit: '灵域试炼', heaven: '天庭问道' };
const SUBJECT_MAP: Record<string, string> = { math: '高等数学', linear: '线性代数', probability: '概率论与数理统计' };

interface PathSegment {
  label: string;
  to: string;
  isLast: boolean;
}

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
  const currentStageId = useProgressStore(s => s.currentStageId);
  const currentSubjectId = useProgressStore(s => s.currentSubjectId);
  const inChapter = location.pathname.includes('/chapter/') && chapterTitle;

  // Derive modules
  const modules = chapterModules.length > 0
    ? chapterModules
    : deriveModulesFromTasks(tasks);

  // Module stats
  const moduleStats = new Map<string, { total: number; done: number; retry: number }>();
  for (const m of modules) {
    moduleStats.set(m.id, { total: 0, done: 0, retry: 0 });
  }
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
    navigate(`/chapter/${chapterId}/task/${first.id}`);
  };

  // ── Build path segments from context ──
  const p = location.pathname;
  const isHome = p === '/' || p === '';
  const isChapterPage = inChapter;

  // 判断当前页面类型（从 URL 判断精简版）
  const isStagePage = currentStageId !== '' && currentSubjectId === '' && !isChapterPage;
  const isSubjectPage = currentStageId !== '' && currentSubjectId !== '' && !isChapterPage;

  // 构建路径段
  const pathSegments: PathSegment[] = [];

  // 首页（始终显示）
  pathSegments.push({ label: '首页', to: '/', isLast: isHome });

  // 阶段
  if (currentStageId) {
    const label = STAGE_MAP[currentStageId] || currentStageId;
    pathSegments.push({ label, to: `/stage/${currentStageId}`, isLast: isStagePage });
  }

  // 学科
  if (currentSubjectId) {
    const label = SUBJECT_MAP[currentSubjectId] || currentSubjectId;
    pathSegments.push({ label, to: `/stage/${currentStageId}/subject/${currentSubjectId}`, isLast: isSubjectPage });
  }

  // 章节
  if (isChapterPage) {
    pathSegments.push({
      label: `第${chapterId}讲：${chapterTitle}`,
      to: `/chapter/${chapterId}/task`,
      isLast: true,
    });
  }

  return (
    <div className="sidebar-left">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontWeight: 600, fontSize: 11, color: 'var(--accent)', fontFamily: 'var(--font-title)', letterSpacing: '0.04em' }}>
          📖 修炼路径
        </span>
        {onCollapse && (
          <button className="sidebar-toggle-btn" onClick={onCollapse} title="折叠左侧栏">◀</button>
        )}
      </div>

      {/* 路径导航（可点击） */}
      <div style={{ marginBottom: 14 }}>
        {pathSegments.map((seg, i) => (
          <div key={i} style={{
            padding: '3px 0', fontSize: 11, lineHeight: 1.6,
            color: seg.isLast ? 'var(--accent)' : 'var(--text2)',
            fontWeight: seg.isLast ? 600 : 400,
            cursor: 'pointer',
            transition: 'color 0.12s',
          }}
            onClick={() => navigate(seg.to)}
            onMouseEnter={e => { if (!seg.isLast) e.currentTarget.style.color = 'var(--accent)'; }}
            onMouseLeave={e => { if (!seg.isLast) e.currentTarget.style.color = 'var(--text2)'; }}>
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

      {/* 能力面板（做题时显示） */}
      {inChapter && tasks.length > 0 && (() => {
        const kpMap = new Map<string, { total: number; done: number; hasRetry: boolean }>();
        tasks.forEach(t => {
          for (const kp of t.knowledgePoints) {
            if (!kpMap.has(kp)) kpMap.set(kp, { total: 0, done: 0, hasRetry: false });
            const entry = kpMap.get(kp)!;
            entry.total++;
            if (done.includes(t.id)) entry.done++;
            if (retry.includes(t.id)) entry.hasRetry = true;
          }
        });
        const items = Array.from(kpMap.entries())
          .map(([name, v]) => ({ name, ...v, pct: Math.round((v.done / Math.max(1, v.total)) * 100) }))
          .sort((a, b) => a.pct - b.pct || b.total - a.total);

        if (items.length === 0) return null;

        return (
          <div style={{ marginTop: 10, borderTop: '1px solid var(--border)', paddingTop: 8 }}>
            <div style={{ fontWeight: 600, fontSize: 10, color: 'var(--purple)', marginBottom: 6, fontFamily: 'var(--font-title)' }}>
              📋 能力面板
            </div>
            {items.map(item => (
              <div key={item.name} style={{ marginBottom: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, marginBottom: 2 }}>
                  <span style={{ color: 'var(--text2)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.name}{item.hasRetry && <span style={{ color: 'var(--red)', marginLeft: 2 }}>🔄</span>}
                  </span>
                  <span style={{ color: 'var(--text3)', flexShrink: 0, marginLeft: 4 }}>
                    {item.done}/{item.total}
                  </span>
                </div>
                <div className="progress-bar" style={{ height: 3 }}>
                  <div className="progress-fill" style={{
                    width: item.pct + '%',
                    background: item.pct >= 100 ? 'var(--green)' : item.pct >= 50 ? 'var(--amber)' : 'var(--text3)',
                  }} />
                </div>
              </div>
            ))}
          </div>
        );
      })()}
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
