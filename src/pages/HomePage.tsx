import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '../store/useProgressStore';
import { getAllChapters } from '../data/math/zhangyu30';

export default function HomePage() {
  const navigate = useNavigate();
  const storeChapterId = useProgressStore(s => s.chapterId);
  const storeTitle = useProgressStore(s => s.chapterTitle);
  const stats = useProgressStore(s => s.stats);

  const allChapters = getAllChapters();
  const availableChapters = allChapters.filter(c => c.status === 'available');
  const totalTasks = availableChapters.reduce((s, c) => s + c.taskCount, 0);

  return (
    <div className="anim-in">
      {/* ── Hero ── */}
      <div className="hero">
        <div className="hero-icon">🗡️</div>
        <div className="hero-title">C9 考研数学修炼系统</div>
        <div className="hero-sub">张宇30讲为主线 · 经典教辅为辅助 · 逐讲打穿</div>
      </div>

      {/* ── Stats ── */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--accent)' }}>{availableChapters.length}</div>
          <div className="stat-label">已录入章节</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--green)' }}>{totalTasks}</div>
          <div className="stat-label">总任务数</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--purple)' }}>
            {stats.mastery || 0}%
          </div>
          <div className="stat-label">最近掌握度</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: stats.retryCount > 0 ? 'var(--red)' : 'var(--green)' }}>
            {stats.retryCount ?? 0}
          </div>
          <div className="stat-label">待清心魔</div>
        </div>
      </div>

      {/* ── 继续学习 CTA ── */}
      {storeTitle && (
        <div className="dash-cta">
          <div className="cta-text">
            <div className="cta-title">📖 最近：第{storeChapterId}讲 · {storeTitle}</div>
            <div className="cta-sub">掌握度 {stats.mastery || 0}% · {stats.doneCount || 0}/{stats.totalCount || 0} 题</div>
          </div>
          <button className="btn btn-primary" onClick={() => navigate(`/chapter/${storeChapterId}`)}>
            继续修炼 →
          </button>
        </div>
      )}

      {/* ── 科目入口 ── */}
      <div style={{ marginBottom: 8 }}>
        <div className="task-section-label" style={{ marginBottom: 8 }}>科目入口</div>
        <button className="stage-node" onClick={() => navigate('/math')}
          style={{ borderColor: 'rgba(96,165,250,0.25)' }}>
          <div className="stage-icon" style={{ background: 'rgba(96,165,250,0.1)' }}>📐</div>
          <div className="stage-body">
            <div className="st-name">高等数学</div>
            <div className="st-meta">张宇30讲 · {availableChapters.length} 讲已录入 · {totalTasks} 题</div>
          </div>
          <span style={{ color: 'var(--accent)', fontSize: 13 }}>→</span>
        </button>
        <button className="stage-node locked" disabled>
          <div className="stage-icon">📊</div>
          <div className="stage-body">
            <div className="st-name">线性代数</div>
            <div className="st-meta">敬请期待</div>
          </div>
        </button>
        <button className="stage-node locked" disabled>
          <div className="stage-icon">🎲</div>
          <div className="stage-body">
            <div className="st-name">概率统计</div>
            <div className="st-meta">敬请期待</div>
          </div>
        </button>
      </div>

      {/* ── 快捷操作 ── */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/math/zhangyu30')}>
          📘 全部章节
        </button>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/import')}>
          📥 导入章节
        </button>
      </div>
    </div>
  );
}
