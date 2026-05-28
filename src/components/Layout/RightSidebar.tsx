import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProgressStore } from '../../store/useProgressStore';
import ImportModal from '../Common/ImportModal';

// ── 共享档案进度一览 ──
import { getProfiles, getSharedProfiles, generateShareCode, importShareCode, removeSharedProfile, getActiveProfileProgress, type SharedProfileEntry, loadProgress } from '../../utils/storage';
import { getAllChapters } from '../../data/math/zhangyu30';

const CHAPTER_LIST = getAllChapters().filter(c => c.status === 'available' || c.status === 'not_imported');

function getChapterName(cid: number): string {
  const ch = CHAPTER_LIST.find(c => c.chapterId === cid);
  return ch ? `第${ch.chapterNumber}讲 ${ch.chapterTitle}` : `第${cid}讲`;
}

/** 获取本地档案各章节进度 */
function getLocalProfileChapters(profileId: string): { chapterId: number; name: string; done: number; total: number; pct: number }[] {
  const result: { chapterId: number; name: string; done: number; total: number; pct: number }[] = [];
  // 扫描所有可能的章节
  const seen = new Set<number>();
  const keys = Object.keys(localStorage).filter(k => k.startsWith(`c9_profile_${profileId}_chapter_`));
  for (const k of keys) {
    const cid = parseInt(k.split('_').pop() || '0');
    if (seen.has(cid)) continue;
    seen.add(cid);
    const progress = loadProgress(profileId, cid);
    if (!progress || (progress.done.length === 0 && progress.retry.length === 0)) continue;
    // 从章节数据获取总数
    const chInfo = CHAPTER_LIST.find(c => c.chapterId === cid);
    const total = chInfo?.taskCount || progress.done.length + progress.retry.length;
    const done = progress.done.length;
    result.push({
      chapterId: cid,
      name: chInfo ? `第${chInfo.chapterNumber}讲` : `第${cid}讲`,
      done,
      total: Math.max(total, done),
      pct: total > 0 ? Math.round((done / total) * 100) : 0,
    });
  }
  // 也检查共享章节存档中未在本地扫描到的
  return result.sort((a, b) => a.chapterId - b.chapterId);
}

function ProfileProgressPanel() {
  const [tab, setTab] = useState<'local' | 'shared'>('local');
  const [shareCode, setShareCode] = useState('');
  const [showShare, setShowShare] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importInput, setImportInput] = useState('');
  const [importMsg, setImportMsg] = useState('');
  const [expandedProfile, setExpandedProfile] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(0);

  const localProfiles = getProfiles();
  const sharedProfiles = getSharedProfiles();

  const handleShare = () => {
    const code = generateShareCode();
    setShareCode(code);
    setShowShare(true);
    navigator.clipboard?.writeText(code).catch(() => {});
  };

  const handleImport = () => {
    const result = importShareCode(importInput.trim());
    if (result.success) {
      setImportMsg(`✅ 已导入「${result.entry!.name}」`);
      setImportInput('');
      setImporting(false);
      setRefresh(r => r + 1);
    } else {
      setImportMsg(`❌ ${result.error}`);
    }
    setTimeout(() => setImportMsg(''), 3000);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`确定从道友名录中移除「${name}」？`)) {
      removeSharedProfile(id);
      setRefresh(r => r + 1);
    }
  };

  const profiles = tab === 'local' ? localProfiles : sharedProfiles;

  return (
    <div style={{ padding: '10px 16px 10px 10px' }}>
      <div style={{ fontWeight: 600, fontSize: 11, color: 'var(--accent)', fontFamily: 'var(--font-title)', letterSpacing: '0.04em', marginBottom: 6 }}>
        👥 道友进度
      </div>

      {/* 操作栏 */}
      <div style={{ display: 'flex', gap: 3, marginBottom: 8 }}>
        <button onClick={() => setTab('local')}
          className={`btn btn-sm ${tab === 'local' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ padding: '2px 6px', fontSize: 9 }}>本地</button>
        <button onClick={() => setTab('shared')}
          className={`btn btn-sm ${tab === 'shared' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ padding: '2px 6px', fontSize: 9 }}>道友</button>
        <button onClick={handleShare} className="btn btn-ghost btn-sm"
          style={{ padding: '2px 6px', fontSize: 9, marginLeft: 'auto' }}>分享</button>
        {tab === 'shared' && (
          <button onClick={() => { setImporting(true); setImportMsg(''); }} className="btn btn-ghost btn-sm"
            style={{ padding: '2px 6px', fontSize: 9 }}>导入</button>
        )}
      </div>

      {/* 分享码弹窗 */}
      {showShare && (
        <div style={{ marginBottom: 8, padding: 8, background: 'var(--accent-soft)', borderRadius: 6, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 9, color: 'var(--text3)', marginBottom: 4 }}>已复制到剪贴板，分享给道友</div>
          <div style={{ fontSize: 8, wordBreak: 'break-all', color: 'var(--accent)', lineHeight: 1.5, maxHeight: 48, overflow: 'auto' }}>
            {shareCode}
          </div>
          <button className="btn btn-ghost btn-sm" style={{ fontSize: 9, padding: '2px 6px', marginTop: 4 }}
            onClick={() => { setShowShare(false); }}>关闭</button>
        </div>
      )}

      {/* 导入框 */}
      {importing && (
        <div style={{ marginBottom: 8, padding: 8, background: 'var(--surface)', borderRadius: 6, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 9, color: 'var(--text3)', marginBottom: 4 }}>粘贴道友的分享码</div>
          <textarea value={importInput}
            onChange={e => setImportInput(e.target.value)}
            placeholder="粘贴在这里..."
            style={{ width: '100%', fontSize: 9, padding: 6, borderRadius: 4, border: '1px solid var(--border)', resize: 'none', height: 40, background: 'var(--bg)', fontFamily: 'monospace', color: 'var(--text)' }} />
          <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
            <button className="btn btn-primary btn-sm" style={{ fontSize: 9, padding: '2px 8px' }}
              onClick={handleImport}>导入</button>
            <button className="btn btn-ghost btn-sm" style={{ fontSize: 9, padding: '2px 8px' }}
              onClick={() => { setImporting(false); setImportMsg(''); }}>取消</button>
          </div>
          {importMsg && <div style={{ fontSize: 9, marginTop: 4, color: importMsg.startsWith('✅') ? 'var(--green)' : 'var(--red)' }}>{importMsg}</div>}
        </div>
      )}

      {/* 档案列表 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 320, overflowY: 'auto' }}>
        {profiles.length === 0 ? (
          <div style={{ fontSize: 10, color: 'var(--text3)', padding: '12px 0', textAlign: 'center' }}>
            {tab === 'shared' ? '暂无道友，点击 📥 导入' : '暂无本地档案'}
          </div>
        ) : (
          profiles.map(p => {
            const pid = (p as Record<string, unknown>).id as string;
            const pname = (p as Record<string, unknown>).name as string;
            const isExpanded = expandedProfile === pid;

            // 获取该档案的所有章节进度
            let chapters: { chapterId: number; name: string; done: number; total: number; pct: number }[];
            if (tab === 'local') {
              chapters = getLocalProfileChapters(pid);
            } else {
              const shared = p as SharedProfileEntry;
              chapters = Object.entries(shared.chapters || {}).map(([cid, ch]) => ({
                chapterId: parseInt(cid),
                name: getChapterName(parseInt(cid)),
                done: ch.doneCount,
                total: ch.totalCount,
                pct: ch.mastery,
              })).sort((a, b) => a.chapterId - b.chapterId);
            }

            const totalMastery = chapters.length > 0
              ? Math.round(chapters.reduce((s, c) => s + c.pct, 0) / chapters.length)
              : 0;

            return (
              <div key={pid} style={{
                borderRadius: 4,
                border: '1px solid var(--border)',
                overflow: 'hidden',
              }}>
                {/* 档案头 */}
                <div
                  onClick={() => setExpandedProfile(isExpanded ? null : pid)}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '6px 8px', cursor: 'pointer',
                    background: isExpanded ? 'var(--accent-soft)' : 'var(--surface)',
                    fontSize: 10,
                  }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: 10 }}>{pname}</div>
                    {chapters.length > 0 && (
                      <div className="progress-bar" style={{ height: 3, marginTop: 3 }}>
                        <div className="progress-fill" style={{
                          width: totalMastery + '%',
                          background: totalMastery >= 100 ? 'var(--green)' : totalMastery >= 50 ? 'var(--amber)' : 'var(--accent)',
                        }} />
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                    <span style={{ fontSize: 8, color: 'var(--text3)' }}>
                      {chapters.length}讲 · {totalMastery}%
                    </span>
                    {tab === 'shared' && (
                      <button onClick={e => { e.stopPropagation(); handleDelete(pid, pname); }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 10, color: 'var(--text3)', padding: 0 }}>✕</button>
                    )}
                    <span style={{ fontSize: 8, color: 'var(--text3)' }}>{isExpanded ? '▾' : '▸'}</span>
                  </div>
                </div>

                {/* 展开的各讲进度 */}
                {isExpanded && chapters.length > 0 && (
                  <div style={{ padding: '4px 8px 6px', background: 'var(--surface2)', borderTop: '1px solid var(--border)' }}>
                    {chapters.map(ch => (
                      <div key={ch.chapterId} style={{ marginBottom: 4 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 8, marginBottom: 1 }}>
                          <span style={{ color: 'var(--text2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                            {ch.name}
                          </span>
                          <span style={{ color: 'var(--text3)', flexShrink: 0, marginLeft: 4 }}>
                            {ch.done}/{ch.total} · {ch.pct}%
                          </span>
                        </div>
                        <div className="progress-bar" style={{ height: 2 }}>
                          <div className="progress-fill" style={{
                            width: ch.pct + '%',
                            background: ch.pct >= 100 ? 'var(--green)' : ch.pct >= 50 ? 'var(--amber)' : 'var(--accent)',
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ── Mode A: 今日小札 (Home / Dashboard / Other) ──
export function TodayNotes() {
  const navigate = useNavigate();
  const stats = useProgressStore(s => s.stats);
  const chapterId = useProgressStore(s => s.chapterId);
  const chapterTitle = useProgressStore(s => s.chapterTitle);
  const retry = useProgressStore(s => s.retry);
  const exportAllData = useProgressStore(s => s.exportAllData);
  const [showImport, setShowImport] = useState(false);

  const reviewSchedule = useMemo(() => {
    const doneCount = stats.doneCount;
    const totalCount = stats.totalCount;
    let intervalDays: number;
    if (doneCount === 0) intervalDays = 0;
    else if (retry.length > 0) intervalDays = 1;
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
  }, [stats.doneCount, stats.totalCount, retry.length]);

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
        <div style={{ fontWeight: 600, fontSize: 11, color: 'var(--accent)', fontFamily: 'var(--font-title)', letterSpacing: '0.04em', marginBottom: 8 }}>
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
      {showImport && <ImportModal onClose={() => setShowImport(false)} />}
    </>
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
      <div style={{ fontWeight: 600, fontSize: 11, color: 'var(--accent)', fontFamily: 'var(--font-title)', letterSpacing: '0.04em', marginBottom: 8 }}>
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

// ── Mode C: 修炼地图 (Task Page sidebar) ──
import { STAGE_NAMES } from '../../data/types';

const STAGE_ICONS: Record<number, string> = {
  0: '🗺️', 1: '📘', 2: '🎯', 3: '🏗️', 4: '🔥', 5: '👑',
};

export function ChapterMapPanel() {
  const navigate = useNavigate();
  const tasks = useProgressStore(s => s.tasks);
  const done = useProgressStore(s => s.done);
  const retry = useProgressStore(s => s.retry);
  const chapterId = useProgressStore(s => s.chapterId);
  const base = `/chapter/${chapterId}`;

  const stages = new Map<number, { stage: number; name: string; tasks: typeof tasks }>();
  tasks.forEach(t => {
    if (!stages.has(t.stage)) {
      stages.set(t.stage, { stage: t.stage, name: STAGE_NAMES[t.stage] ?? `阶段${t.stage}`, tasks: [] });
    }
    stages.get(t.stage)!.tasks.push(t);
  });

  const stageList = Array.from(stages.values());

  return (
    <div style={{ padding: '10px 16px 10px 10px' }}>
      <div style={{ fontWeight: 600, fontSize: 11, color: 'var(--purple)', fontFamily: 'var(--font-title)', letterSpacing: '0.04em', marginBottom: 8 }}>
        🗺️ 修炼地图
      </div>

      {stageList.map((st) => {
        const stageTasks = st.tasks;
        const stageDone = stageTasks.filter(t => done.includes(t.id)).length;
        const stageRetry = stageTasks.filter(t => retry.includes(t.id)).length;
        const stageTotal = stageTasks.length;
        const allDone = stageDone === stageTotal && stageRetry === 0;
        const hasRetry = stageRetry > 0;
        const inProgress = stageDone > 0 && !allDone;

        let borderColor = 'var(--border)';
        let iconBg = 'var(--surface3)';
        if (hasRetry) { borderColor = 'rgba(239,68,68,0.35)'; iconBg = 'var(--red-soft)'; }
        else if (allDone) { borderColor = 'rgba(34,197,94,0.3)'; iconBg = 'var(--green-soft)'; }
        else if (inProgress) { borderColor = 'rgba(96,165,250,0.25)'; iconBg = 'var(--accent-soft)'; }

        return (
          <button
            key={st.stage}
            onClick={() => {
              const firstTask = stageTasks[0];
              if (firstTask) navigate(`${base}/task/${firstTask.id}`);
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              width: '100%', padding: '7px 10px', marginBottom: 3,
              background: 'var(--surface)', border: `1px solid ${borderColor}`,
              borderRadius: 'var(--radius-sm)', cursor: 'pointer',
              textAlign: 'left' as const, fontFamily: 'inherit', color: 'var(--text)',
              fontSize: 11, transition: 'all 0.12s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = borderColor; }}
          >
            <div style={{
              width: 24, height: 24, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, flexShrink: 0, background: iconBg,
            }}>
              {STAGE_ICONS[st.stage] ?? '📌'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 10, fontWeight: 600 }}>{st.name}</div>
              <div style={{ fontSize: 8, color: 'var(--text3)' }}>
                {stageDone}/{stageTotal}
                {stageRetry > 0 ? ` · 🔄${stageRetry}` : ''}
              </div>
            </div>
            <span style={{ fontSize: 10 }}>
              {allDone ? '✅' : hasRetry ? '🔄' : inProgress ? '▶️' : '○'}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ── Mode D: 本章操作 (Knowledge Matrix) ──
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
        <div style={{ fontWeight: 600, fontSize: 11, color: 'var(--accent)', fontFamily: 'var(--font-title)', letterSpacing: '0.04em', marginBottom: 8 }}>
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
    content = (
      <>
        <ChapterMapPanel />
        <div style={{ borderTop: '1px solid var(--border)', margin: '0 10px' }} />
        <QuestionNav />
      </>
    );
  } else {
    content = (
      <>
        <ProfileProgressPanel />
        <div style={{ borderTop: '1px solid var(--border)', margin: '0 10px' }} />
        <TodayNotes />
      </>
    );
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
