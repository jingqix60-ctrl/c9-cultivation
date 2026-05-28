import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { STAGES, SUBJECTS } from '../data/stages';
import { useProgressStore } from '../store/useProgressStore';

const BASE = '/c9-cultivation';
const STAGE_IMAGES: Record<string, string> = {
  foundation: `${BASE}/images/xiajie.jpg`,
  spirit: `${BASE}/images/lingyu.jpg`,
  heaven: `${BASE}/images/tiantang-wen.jpg`,
};

export default function StagePage() {
  const { stageId } = useParams<{ stageId: string }>();
  const navigate = useNavigate();
  const setStageContext = useProgressStore(s => s.setStageContext);

  // 设置当前阶段信息供左侧栏使用
  useEffect(() => {
    if (stageId) setStageContext(stageId);
  }, [stageId, setStageContext]);
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

  const subjectIcons: Record<string, string> = {
    math: '📐',
    linear: '📊',
    probability: '🎲',
  };

  const subjectDescs: Record<string, string> = {
    math: '函数极限、导数积分、微分方程、级数…',
    linear: '行列式、矩阵、向量、特征值、二次型…',
    probability: '概率、分布、数字特征、统计推断…',
  };

  return (
    <div className="anim-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 'calc(100vh - 200px)', padding: '20px 0' }}>
      {/* 阶段标题 */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{
          width: 90, height: 90, margin: '0 auto 12px',
          borderRadius: '50%',
          overflow: 'hidden',
          background: '#F7F1E6',
          boxShadow: '0 2px 12px rgba(94,77,56,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <img src={STAGE_IMAGES[stage.id]} alt={stage.name}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <h1 style={{ fontFamily: 'var(--font-title)', fontSize: 24, color: 'var(--accent)', fontWeight: 700 }}>
          {stage.name}
        </h1>
        <p style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4, maxWidth: 300 }}>{stage.desc}</p>
      </div>

      {/* 三个学科按钮 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 400 }}>
        {subjects.map(sub => (
          <button
            key={`${sub.stageId}-${sub.id}`}
            className={`stage-node-btn ${sub.locked ? 'locked' : ''}`}
            disabled={sub.locked}
            onClick={() => navigate(`/stage/${stageId}/subject/${sub.id}`)}
            style={{ padding: '18px 20px' }}
          >
            <div className="stage-icon" style={{
              background: sub.locked ? 'var(--surface3)' : 'var(--accent-soft)',
              width: 44, height: 44, fontSize: 20,
            }}>
              {subjectIcons[sub.id] || '📚'}
            </div>
            <div className="stage-body">
              <div className="st-name" style={{ fontSize: 15 }}>{sub.name}</div>
              <div className="st-meta" style={{ fontSize: 11 }}>
                {sub.locked ? '即将开启' : subjectDescs[sub.id] || ''}
              </div>
            </div>
            <span style={{ color: 'var(--text3)', fontSize: 15 }}>{sub.locked ? '🔒' : '→'}</span>
          </button>
        ))}
      </div>

      {/* 返回首页 */}
      <div style={{ marginTop: 24 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/')}>
          ← 返回首页
        </button>
      </div>
    </div>
  );
}
