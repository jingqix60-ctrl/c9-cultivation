import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '../store/useProgressStore';
import { STAGES, SUBJECTS } from '../data/stages';
import { getAllChapters } from '../data/math/zhangyu30';

export default function HomePage() {
  const navigate = useNavigate();
  const storeChapterId = useProgressStore(s => s.chapterId);
  const storeTitle = useProgressStore(s => s.chapterTitle);
  const stats = useProgressStore(s => s.stats);
  const retry = useProgressStore(s => s.retry);

  const chapters = getAllChapters();
  const available = chapters.filter(c => c.status === 'available');
  const totalTasks = available.reduce((s, c) => s + c.taskCount, 0);
  const dueRetryCount = retry.length;

  return (
    <div className="anim-in">
      {/* Hero */}
      <div className="hero">
        <div className="hero-icon">📖</div>
        <div className="hero-title">C9 考研数学修炼系统</div>
        <div className="hero-sub">当前阶段：下界筑基 · 高等数学 · 张宇30讲</div>
      </div>

      {/* Quick stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--accent)' }}>{available.length}</div>
          <div className="stat-label">已录入章节</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--green)' }}>{totalTasks}</div>
          <div className="stat-label">总任务数</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: stats.mastery ? 'var(--accent)' : 'var(--text3)' }}>
            {stats.mastery || 0}%
          </div>
          <div className="stat-label">最近掌握度</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: dueRetryCount > 0 ? 'var(--red)' : 'var(--green)' }}>
            {dueRetryCount}
          </div>
          <div className="stat-label">待清心魔</div>
        </div>
      </div>

      {/* Continue CTA */}
      {storeTitle && (
        <div className="dash-cta">
          <div className="cta-text">
            <div className="cta-title">继续修炼 · 第{storeChapterId}讲 {storeTitle}</div>
            <div className="cta-sub">掌握度 {stats.mastery || 0}% · {stats.doneCount || 0}/{stats.totalCount || 0} 题</div>
          </div>
          <button className="btn btn-primary" onClick={() => navigate(`/chapter/${storeChapterId}`)}>
            继续修炼 →
          </button>
        </div>
      )}

      {/* Three stages */}
      <div className="task-section-label" style={{ marginBottom: 8 }}>修炼阶段</div>
      <div className="stage-grid">
        {STAGES.map(stage => {
          const stageSubjects = SUBJECTS.filter(s => s.stageId === stage.id);
          const stageChapters = stageSubjects.reduce((s, sub) => s + sub.chapters, 0);
          const isActive = stage.id === 'foundation';
          return (
            <div
              key={stage.id}
              className="stage-card"
              style={{ opacity: isActive ? 1 : 0.5, cursor: isActive ? 'pointer' : 'default' }}
              onClick={() => isActive && navigate(`/stage/${stage.id}`)}
            >
              <div className="sc-icon">{stage.icon}</div>
              <div className="sc-name">{stage.name}</div>
              <div className="sc-desc">{stage.desc}</div>
              <div className="sc-meta">
                {stageChapters > 0 ? `${stageChapters} 讲已录入` : '即将开启'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Subject entries under 下界筑基 */}
      <div className="task-section-label" style={{ marginBottom: 8 }}>
        下界筑基 · 学科入口
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
        {SUBJECTS.filter(s => s.stageId === 'foundation').map(sub => (
          <button
            key={sub.id}
            className={`stage-node-btn ${sub.locked ? 'locked' : ''}`}
            disabled={sub.locked}
            onClick={() => navigate(`/stage/foundation/${sub.id}`)}
          >
            <div className="stage-icon" style={{ background: sub.locked ? 'var(--surface3)' : 'var(--accent-soft)' }}>
              {sub.icon}
            </div>
            <div className="stage-body">
              <div className="st-name">{sub.name}</div>
              <div className="st-meta">
                {sub.locked ? '敬请期待' : `张宇30讲 · ${sub.chapters} 讲已录入 · ${totalTasks} 题`}
              </div>
            </div>
            <span style={{ color: 'var(--text3)', fontSize: 13 }}>{sub.locked ? '🔒' : '→'}</span>
          </button>
        ))}
      </div>

      {/* Due retry reminder */}
      {dueRetryCount > 0 && (
        <div className="dash-cta" style={{ borderColor: 'var(--red)' }}>
          <div className="cta-text">
            <div className="cta-title" style={{ color: 'var(--red)' }}>心魔提醒 · {dueRetryCount} 题待复习</div>
            <div className="cta-sub">建议今日完成心魔题复习，巩固薄弱环节。</div>
          </div>
          <button className="btn btn-danger btn-sm" onClick={() => navigate(`/chapter/${storeChapterId || 10}/review`)}>
            进入心魔本 →
          </button>
        </div>
      )}

      {/* Quick links */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/import')}>📥 导入章节</button>
      </div>
    </div>
  );
}
