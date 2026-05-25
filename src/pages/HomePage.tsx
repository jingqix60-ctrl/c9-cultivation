import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '../store/useProgressStore';

export default function HomePage() {
  const navigate = useNavigate();
  const storeChapterId = useProgressStore(s => s.chapterId);
  const storeTitle = useProgressStore(s => s.chapterTitle);
  const stats = useProgressStore(s => s.stats);

  return (
    <div className="anim-in">
      <div style={{ textAlign: 'center', padding: '20px 0 12px' }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>🗡️</div>
        <h2 style={{ fontSize: 18, color: 'var(--accent)' }}>C9 考研数学修炼系统</h2>
        <p style={{ color: 'var(--text2)', fontSize: 12, marginTop: 4 }}>
          张宇30讲为主线 · 经典教辅为辅助
        </p>
      </div>

      {/* Quick stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--accent)' }}>1</div>
          <div className="stat-label">📘 已录入章节</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: stats.mastery ? 'var(--green)' : 'var(--text2)' }}>
            {stats.mastery || 0}%
          </div>
          <div className="stat-label">📊 最近章节掌握度</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: stats.retryCount > 0 ? 'var(--red)' : 'var(--green)' }}>
            {stats.retryCount ?? 0}
          </div>
          <div className="stat-label">🔄 总心魔题数</div>
        </div>
      </div>

      {/* Recent chapter */}
      {storeTitle && (
        <div className="dash-cta">
          <div className="cta-text">
            <div className="cta-title">📖 最近学习：{storeTitle}</div>
            <div className="cta-sub">
              掌握度 {stats.mastery || 0}% · {stats.doneCount || 0}/{stats.totalCount || 0} 题完成
            </div>
          </div>
          <button className="btn btn-accent" onClick={() => navigate(`/chapter/${storeChapterId}`)}>
            继续修炼 ⚔️
          </button>
        </div>
      )}

      {/* Entry points */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
        <button
          className="stage-node"
          onClick={() => navigate('/math')}
          style={{ borderColor: 'var(--accent)' }}
        >
          <div className="stage-icon" style={{ background: 'rgba(56,189,248,0.12)' }}>📐</div>
          <div className="stage-body">
            <div className="st-name">高等数学</div>
            <div className="st-meta">张宇30讲 · 已录入 1 讲</div>
          </div>
          <span style={{ color: 'var(--accent)' }}>→</span>
        </button>

        <button
          className="stage-node"
          style={{ opacity: 0.4, cursor: 'not-allowed' }}
          disabled
        >
          <div className="stage-icon">📊</div>
          <div className="stage-body">
            <div className="st-name">线性代数</div>
            <div className="st-meta">敬请期待</div>
          </div>
        </button>

        <button
          className="stage-node"
          style={{ opacity: 0.4, cursor: 'not-allowed' }}
          disabled
        >
          <div className="stage-icon">🎲</div>
          <div className="stage-body">
            <div className="st-name">概率统计</div>
            <div className="st-meta">敬请期待</div>
          </div>
        </button>
      </div>

      {/* Import link */}
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/import')}>
          📥 导入章节 JSON
        </button>
      </div>
    </div>
  );
}
