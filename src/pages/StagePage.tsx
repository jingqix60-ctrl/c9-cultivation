import { useParams, useNavigate } from 'react-router-dom';
import { STAGES, SUBJECTS } from '../data/stages';

export default function StagePage() {
  const { stageId } = useParams<{ stageId: string }>();
  const navigate = useNavigate();
  const stage = STAGES.find(s => s.id === stageId);
  const subjects = SUBJECTS.filter(s => s.stageId === stageId);

  if (!stage) {
    return (
      <div className="anim-in" style={{ textAlign: 'center', padding: 48 }}>
        <p style={{ color: 'var(--text2)' }}>阶段不存在。</p>
        <button className="btn btn-ghost btn-sm" style={{ marginTop: 12 }} onClick={() => navigate('/')}>
          返回首页
        </button>
      </div>
    );
  }

  return (
    <div className="anim-in">
      <div className="hero">
        <div className="hero-icon">{stage.icon}</div>
        <div className="hero-title">{stage.name}</div>
        <div className="hero-sub">{stage.desc}</div>
      </div>

      <div className="task-section-label" style={{ marginBottom: 8 }}>学科入口</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {subjects.map(sub => (
          <button
            key={sub.id}
            className={`stage-node-btn ${sub.locked ? 'locked' : ''}`}
            disabled={sub.locked}
            onClick={() => navigate(`/stage/${stageId}/${sub.id}`)}
          >
            <div className="stage-icon" style={{ background: sub.locked ? 'var(--surface3)' : 'var(--accent-soft)' }}>
              {sub.icon}
            </div>
            <div className="stage-body">
              <div className="st-name">{sub.name}</div>
              <div className="st-meta">
                {sub.locked ? '敬请期待' : `张宇30讲 · ${sub.chapters} 讲已录入`}
              </div>
            </div>
            <span style={{ color: 'var(--text3)', fontSize: 13 }}>{sub.locked ? '🔒' : '→'}</span>
          </button>
        ))}
      </div>

      <div style={{ marginTop: 14 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/')}>← 返回首页</button>
      </div>
    </div>
  );
}
