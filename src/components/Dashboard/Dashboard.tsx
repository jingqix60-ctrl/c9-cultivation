import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '../../store/useProgressStore';
import { chapter10Meta } from '../../data/chapter10';

export default function Dashboard() {
  const navigate = useNavigate();
  const stats = useProgressStore(s => s.stats);
  const tasks = useProgressStore(s => s.tasks);
  const currentTask = useProgressStore(s => s.currentTask);
  const completed = useProgressStore(s => s.completed);

  if (!stats.realm) return null;

  const currentTaskData = tasks[currentTask];

  if (completed) {
    return (
      <div className="anim-in">
        <div className="dash-cta" style={{ borderColor: 'var(--gold)' }}>
          <div className="cta-text">
            <div className="cta-title" style={{ color: 'var(--gold)' }}>👑 第10讲已圆满通关！</div>
            <div className="cta-sub">所有任务已完成，心魔已清空。</div>
          </div>
          <button className="btn btn-gold" onClick={() => navigate('/report')}>
            查看战报
          </button>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'var(--green)' }}>{stats.mastery}%</div>
            <div className="stat-label">📊 本讲掌握度</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'var(--gold)' }}>{stats.c9}</div>
            <div className="stat-label">⚡ C9战力指数</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'var(--green)' }}>0</div>
            <div className="stat-label">🔄 待重做心魔</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="anim-in">
      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--accent)' }}>{stats.mastery}%</div>
          <div className="stat-label">📊 本讲掌握度</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--green)' }}>{stats.zhangyu}%</div>
          <div className="stat-label">📘 张宇主线</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--purple)' }}>{stats.skills}%</div>
          <div className="stat-label">🎯 辅助技巧</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--gold)' }}>{stats.c9}</div>
          <div className="stat-label">⚡ C9战力指数</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: stats.retryCount > 0 ? 'var(--red)' : 'var(--green)' }}>
            {stats.retryCount}
          </div>
          <div className="stat-label">🔄 待重做心魔</div>
        </div>
      </div>

      {/* Skill bars */}
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

      {/* CTA - Current task */}
      <div className="dash-cta">
        <div className="cta-text">
          <div className="cta-title">
            {currentTaskData ? `当前修炼 · #${currentTask + 1} ${currentTaskData.title}` : '开始修炼'}
          </div>
          <div className="cta-sub">
            {currentTaskData
              ? `${chapter10Meta.totalTasks - stats.doneCount} 题待攻克 · ${stats.retryCount} 心魔待清`
              : `共 ${chapter10Meta.totalTasks} 道修炼任务`}
          </div>
        </div>
        <button className="btn btn-accent" onClick={() => navigate('/task')}>
          {stats.doneCount === 0 ? '开始修炼 ⚔️' : '继续修炼 ⚔️'}
        </button>
      </div>

      {/* Quick links */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/map')}>
          🗺️ 章节地图
        </button>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/knowledge')}>
          📋 知识矩阵
        </button>
        {stats.retryCount > 0 && (
          <button className="btn btn-red btn-sm" onClick={() => navigate('/review')}>
            📖 心魔本 ({stats.retryCount})
          </button>
        )}
      </div>
    </div>
  );
}
