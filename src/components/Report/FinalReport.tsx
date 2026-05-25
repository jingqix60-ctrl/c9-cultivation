import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '../../store/useProgressStore';

export default function FinalReport() {
  const navigate = useNavigate();
  const stats = useProgressStore(s => s.stats);
  const done = useProgressStore(s => s.done);
  const retry = useProgressStore(s => s.retry);
  const tasks = useProgressStore(s => s.tasks);
  const chapterId = useProgressStore(s => s.chapterId);
  const chapterTitle = useProgressStore(s => s.chapterTitle);
  const resetChapter = useProgressStore(s => s.resetChapter);
  const base = `/chapter/${chapterId}`;

  const allSkills = useMemo(() => {
    const skillSet = new Set<string>();
    tasks.forEach(t => t.skillTags.forEach(s => skillSet.add(s)));
    return Array.from(skillSet).map(sk => ({
      name: sk,
      covered: tasks.filter(t => t.skillTags.includes(sk)).every(t => done.includes(t.id)),
    }));
  }, [tasks, done]);

  const completed = done.length >= tasks.length && retry.length === 0;

  if (!completed) {
    return (
      <div className="anim-in" style={{ textAlign: 'center', padding: 48 }}>
        <p style={{ color: 'var(--text2)', fontSize: 13 }}>
          还有任务未完成或心魔未清除。
        </p>
        <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={() => navigate(`${base}/task`)}>
          继续修炼
        </button>
      </div>
    );
  }

  return (
    <div className="report anim-in">
      <div className="report-icon">👑</div>
      <h2>第{chapterId}讲 · {chapterTitle} · 圆满通关</h2>
      <p style={{ color: 'var(--text2)', fontSize: 12, maxWidth: 400, margin: '8px auto 0', lineHeight: 1.7 }}>
        已完成张宇30讲第{chapterId}讲主线，并吸收经典教辅中与本讲相关的核心技巧。
      </p>

      {/* ── Stat grid ── */}
      <div className="report-grid">
        <div className="report-item">
          <strong>总掌握度</strong>
          <span style={{ color: 'var(--green)', fontSize: 20, fontWeight: 700 }}>{stats.mastery}%</span>
        </div>
        <div className="report-item">
          <strong>张宇主线</strong>
          <span style={{ color: 'var(--accent)', fontSize: 20, fontWeight: 700 }}>{stats.zhangyu}%</span>
        </div>
        <div className="report-item">
          <strong>辅助技巧</strong>
          <span style={{ color: 'var(--purple)', fontSize: 20, fontWeight: 700 }}>{stats.skills}%</span>
        </div>
        <div className="report-item">
          <strong>C9战力</strong>
          <span style={{ color: 'var(--gold)', fontSize: 20, fontWeight: 700 }}>{stats.c9}</span>
        </div>
        <div className="report-item">
          <strong>方法选择</strong>
          <span style={{ fontSize: 15, color: 'var(--accent)' }}>{stats.method}%</span>
        </div>
        <div className="report-item">
          <strong>几何建模</strong>
          <span style={{ fontSize: 15, color: 'var(--purple)' }}>{stats.geometry}%</span>
        </div>
        <div className="report-item">
          <strong>计算稳定</strong>
          <span style={{ fontSize: 15, color: 'var(--green)' }}>{stats.calc}%</span>
        </div>
        <div className="report-item" style={{ borderColor: 'rgba(251,191,36,0.3)' }}>
          <strong>最终境界</strong>
          <span style={{ color: 'var(--gold)', fontSize: 15, fontWeight: 700 }}>
            {stats.realm?.name ?? 'C9候选人'}
          </span>
        </div>
      </div>

      {/* ── Skills ── */}
      <div style={{ textAlign: 'left', marginTop: 14, fontSize: 11 }}>
        <strong style={{ color: 'var(--text2)' }}>已征服技能</strong>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
          {allSkills.filter(s => s.covered).map(s => (
            <span key={s.name} className="tag tag-green">✓ {s.name}</span>
          ))}
        </div>
      </div>

      {/* ── Next ── */}
      <p style={{ marginTop: 18, color: 'var(--accent)', fontSize: 12 }}>
        下一秘境：第{chapterId + 1}讲
      </p>

      {/* ── Actions ── */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 14, flexWrap: 'wrap' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/')}>🏠 返回首页</button>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(base)}>📊 仪表盘</button>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(`${base}/map`)}>🗺️ 章节地图</button>
        <button className="btn btn-danger btn-sm" onClick={() => {
          if (confirm('确定要重置本章所有进度吗？此操作不可撤销。')) { resetChapter(); navigate(base); }
        }}>🔄 重置进度</button>
      </div>
    </div>
  );
}
