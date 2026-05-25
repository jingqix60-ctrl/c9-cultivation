import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProgressStore } from '../../store/useProgressStore';
import { importAllProgress, createProfile } from '../../utils/storage';

// ── Mode A: 今日小札 (Home / Dashboard / Other) ──
function TodayNotes() {
  const navigate = useNavigate();
  const stats = useProgressStore(s => s.stats);
  const chapterId = useProgressStore(s => s.chapterId);
  const chapterTitle = useProgressStore(s => s.chapterTitle);
  const retry = useProgressStore(s => s.retry);
  const reviewSchedule = useProgressStore(s => s.getReviewSchedule());
  const exportAllData = useProgressStore(s => s.exportAllData);
  const [showImport, setShowImport] = useState(false);

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
    <>
      <div style={{ padding: '10px 16px 10px 10px' }}>
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
              onClick={() => setShowImport(true)}>📤 导入进度</button>
          </div>
        </div>
      </div>
      {showImport && <ImportModalPlaceholder onClose={() => setShowImport(false)} />}
    </>
  );
}

// Placeholder — will be replaced by real ImportModal in Task 9
function ImportModalPlaceholder({ onClose }: { onClose: () => void }) {
  const importData = useProgressStore(s => s.importAllData);
  const [error, setError] = useState<string | null>(null);
  const [parsed, setParsed] = useState<any>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const res = importData(result);
      if (!res.success) { setError(res.error || '导入失败'); return; }
      setParsed(res.data);
      setError(null);
    };
    reader.readAsText(file);
  };

  const handleImport = (mode: 'overwrite' | 'new') => {
    if (!parsed) return;
    if (mode === 'overwrite') {
      importAllProgress(parsed, useProgressStore.getState().profileId || parsed.profile.id);
    } else {
      const newProfile = createProfile(parsed.profile.name + ' (导入)');
      importAllProgress(parsed, newProfile.id);
    }
    onClose();
    window.location.reload();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 440 }}>
        <h3>📤 导入进度</h3>
        {!parsed ? (
          <>
            <p style={{ fontSize: 12, color: 'var(--text2)' }}>选择之前导出的 JSON 进度文件。</p>
            <input type="file" accept=".json" onChange={handleFile}
              style={{ display: 'block', margin: '12px 0', fontSize: 12 }} />
            {error && (
              <div style={{ padding: '8px 12px', background: 'var(--red-soft)', color: 'var(--red)', borderRadius: 6, fontSize: 11, marginBottom: 8 }}>
                {error}
              </div>
            )}
          </>
        ) : (
          <>
            <p style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 8 }}>已读取进度数据：</p>
            <div style={{ fontSize: 11, color: 'var(--text2)', padding: '8px 12px', background: 'var(--surface2)', borderRadius: 6, marginBottom: 10 }}>
              <div>学习者：{parsed.profile.name}</div>
              <div>导出时间：{parsed.exportedAt.slice(0, 10)}</div>
              <div>包含 {Object.keys(parsed.chapters).length} 个章节</div>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 8 }}>选择导入方式：</p>
            <div className="modal-actions" style={{ flexDirection: 'column', gap: 6 }}>
              <button className="btn btn-primary btn-sm" style={{ width: '100%' }}
                onClick={() => handleImport('overwrite')}>覆盖当前学习者进度</button>
              <button className="btn btn-ghost btn-sm" style={{ width: '100%' }}
                onClick={() => handleImport('new')}>新建学习者并导入</button>
              <button className="btn btn-ghost btn-sm" style={{ width: '100%' }} onClick={onClose}>取消</button>
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

// ── Mode B: 题号导航 (Task Page) ──
export function QuestionNav() {
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
    <div style={{ padding: '10px 16px 10px 10px' }}>
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
export function ChapterOps() {
  const navigate = useNavigate();
  const chapterId = useProgressStore(s => s.chapterId);
  const resetChapter = useProgressStore(s => s.resetChapter);
  const resetOptions = useProgressStore(s => s.resetOptions);
  const [showReset, setShowReset] = useState(false);
  const base = `/chapter/${chapterId}`;

  return (
    <>
      <div style={{ padding: '10px 16px 10px 10px' }}>
        <div style={{ fontWeight: 700, fontSize: 11, color: 'var(--accent)', fontFamily: 'var(--font-title)', marginBottom: 8 }}>
          ⚙️ 本章操作
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <button className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => navigate(base)}>📊 返回章节首页</button>
          <button className="btn btn-danger btn-sm" style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => setShowReset(true)}>🔄 重置本章进度</button>
        </div>
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
    </>
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
