import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '../../store/useProgressStore';

export default function Dashboard() {
  const navigate = useNavigate();
  const stats = useProgressStore(s => s.stats);
  const tasks = useProgressStore(s => s.tasks);
  const currentTask = useProgressStore(s => s.currentTask);
  const completed = useProgressStore(s => s.completed);
  const chapterId = useProgressStore(s => s.chapterId);
  const chapterTitle = useProgressStore(s => s.chapterTitle);

  if (!stats.realm) return null;
  const base = `/chapter/${chapterId}`;
  const currentTaskData = tasks[currentTask];

  if (completed) {
    return (
      <div className="anim-in">
        <div className="hero">
          <div className="hero-icon">👑</div>
          <div className="hero-title">{chapterTitle} · 圆满通关</div>
          <div className="hero-sub">张宇30讲第{chapterId}讲主线 · 心魔已清空</div>
          <span className="realm realm-r5" style={{ marginTop: 8 }}>{stats.realm.name}</span>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'var(--green)' }}>{stats.mastery}%</div>
            <div className="stat-label">本讲掌握度</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'var(--gold)' }}>{stats.c9}</div>
            <div className="stat-label">C9战力指数</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'var(--green)' }}>{stats.doneCount}/{stats.totalCount}</div>
            <div className="stat-label">已完成任务</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'var(--green)' }}>0</div>
            <div className="stat-label">待重做心魔</div>
          </div>
        </div>
        <button className="btn btn-gold" style={{ width: '100%', marginTop: 8 }}
          onClick={() => navigate(`${base}/report`)}>
          查看通关战报
        </button>
      </div>
    );
  }

  return (
    <div className="anim-in">
      {/* ── Hero ── */}
      <div className="hero">
        <div className="hero-icon">🗡️</div>
        <div className="hero-title">第{chapterId}讲 · {chapterTitle}</div>
        <div className="hero-sub">张宇30讲主线 · 定积分应用</div>
        <span className={`realm ${stats.realm.className}`} style={{ marginTop: 8 }}>
          {stats.realm.name}
        </span>
      </div>

      {/* ── Stat cards ── */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--accent)' }}>{stats.mastery}%</div>
          <div className="stat-label">本讲掌握度</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--green)' }}>{stats.doneCount}/{stats.totalCount}</div>
          <div className="stat-label">已完成任务</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: stats.retryCount > 0 ? 'var(--red)' : 'var(--green)' }}>
            {stats.retryCount}
          </div>
          <div className="stat-label">待重做心魔</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--gold)' }}>{stats.c9}</div>
          <div className="stat-label">C9战力指数</div>
        </div>
      </div>

      {/* ── Skill bars ── */}
      <div className="skill-bars">
        <div className="skill-row">
          <span className="skill-name">方法选择</span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: stats.method + '%', background: 'var(--accent)' }} />
          </div>
          <span className="skill-pct">{stats.method}%</span>
        </div>
        <div className="skill-row">
          <span className="skill-name">计算稳定</span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: stats.calc + '%', background: 'var(--green)' }} />
          </div>
          <span className="skill-pct">{stats.calc}%</span>
        </div>
        <div className="skill-row">
          <span className="skill-name">几何建模</span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: stats.geometry + '%', background: 'var(--purple)' }} />
          </div>
          <span className="skill-pct">{stats.geometry}%</span>
        </div>
      </div>

      {/* ── CTA: 继续修炼 ── */}
      <div className="dash-cta">
        <div className="cta-text">
          <div className="cta-title">
            今日建议 · {currentTaskData ? currentTaskData.title : '开始修炼'}
          </div>
          <div className="cta-sub">
            {currentTaskData
              ? `⏱ 预计 ${currentTaskData.time} · ${stats.totalCount - stats.doneCount} 题待攻克`
              : `共 ${stats.totalCount} 题 · 张宇30讲主线`}
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => navigate(`${base}/task`)}>
          {stats.doneCount === 0 ? '开始修炼' : '继续修炼'} →
        </button>
      </div>

      {/* ── Quick nav ── */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(`${base}/map`)}>🗺️ 章节地图</button>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(`${base}/knowledge`)}>📋 知识矩阵</button>
        {stats.retryCount > 0 && (
          <button className="btn btn-danger btn-sm" onClick={() => navigate(`${base}/review`)}>
            📖 心魔本 ({stats.retryCount})
          </button>
        )}
      </div>
    </div>
  );
}
