import { useParams, useNavigate } from 'react-router-dom';
import { SUBJECTS } from '../data/stages';
import { getAllChapters } from '../data/math/zhangyu30';

export default function SubjectPage() {
  const { stageId, subjectId } = useParams<{ stageId: string; subjectId: string }>();
  const navigate = useNavigate();
  const subject = SUBJECTS.find(s => s.stageId === stageId && s.id === subjectId);
  const chapters = getAllChapters();

  if (!subject) {
    return (
      <div className="anim-in" style={{ textAlign: 'center', padding: 48 }}>
        <p style={{ color: 'var(--text2)' }}>学科不存在。</p>
        <button className="btn btn-ghost btn-sm" style={{ marginTop: 12 }} onClick={() => navigate('/')}>
          返回首页
        </button>
      </div>
    );
  }

  if (subject.locked) {
    return (
      <div className="anim-in" style={{ textAlign: 'center', padding: 48 }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
        <h3 style={{ fontFamily: 'var(--font-title)', color: 'var(--text2)' }}>{subject.name} · 即将开启</h3>
        <p style={{ color: 'var(--text3)', fontSize: 13, marginTop: 4 }}>敬请期待</p>
        <button className="btn btn-ghost btn-sm" style={{ marginTop: 14 }} onClick={() => navigate(`/stage/${stageId}`)}>
          ← 返回
        </button>
      </div>
    );
  }

  return (
    <div className="anim-in">
      <div className="hero">
        <div className="hero-icon">{subject.icon}</div>
        <div className="hero-title">{subject.name}</div>
        <div className="hero-sub">张宇30讲 · {chapters.filter(c => c.status === 'available').length} 讲已录入</div>
      </div>

      <div className="task-section-label" style={{ marginBottom: 8 }}>章节目录</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {chapters.map(ch => (
          <button
            key={ch.chapterId}
            className={`stage-node-btn ${ch.status !== 'available' ? 'locked' : ''}`}
            disabled={ch.status !== 'available'}
            onClick={() => navigate(`/chapter/${ch.chapterId}`)}
          >
            <div className="stage-icon" style={{
              background: ch.status === 'available' ? 'var(--accent-soft)' : 'var(--surface3)',
            }}>
              {ch.status === 'available' ? '📖' : '🔒'}
            </div>
            <div className="stage-body">
              <div className="st-name">第{ch.chapterNumber}讲：{ch.chapterTitle}</div>
              <div className="st-meta">
                {ch.status === 'available'
                  ? `${ch.taskCount} 题 · ${ch.description || ''}`
                  : '未录入'}
              </div>
            </div>
            <span style={{ color: 'var(--text3)', fontSize: 11 }}>
              {ch.status === 'available' ? '→' : '—'}
            </span>
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/stage/${stageId}`)}>← 返回</button>
        <button className="btn btn-primary btn-sm" onClick={() => navigate('/import')}>📥 导入新章节</button>
      </div>
    </div>
  );
}
