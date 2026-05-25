import { useNavigate } from 'react-router-dom';

export default function MathHome() {
  const navigate = useNavigate();

  return (
    <div className="anim-in">
      <h3 style={{ color: 'var(--purple)', marginBottom: 12, fontSize: 14 }}>
        📐 高等数学
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button
          className="stage-node"
          onClick={() => navigate('/math/zhangyu30')}
          style={{ borderColor: 'var(--accent)' }}
        >
          <div className="stage-icon" style={{ background: 'rgba(56,189,248,0.12)' }}>📘</div>
          <div className="stage-body">
            <div className="st-name">张宇30讲</div>
            <div className="st-meta">已录入 1 讲 · 第10讲：旋转体体积</div>
          </div>
          <span style={{ color: 'var(--accent)' }}>→</span>
        </button>

        <button className="stage-node" style={{ opacity: 0.35, cursor: 'not-allowed' }} disabled>
          <div className="stage-icon">📙</div>
          <div className="stage-body">
            <div className="st-name">武忠祥辅导讲义</div>
            <div className="st-meta">敬请期待</div>
          </div>
        </button>

        <button className="stage-node" style={{ opacity: 0.35, cursor: 'not-allowed' }} disabled>
          <div className="stage-icon">📗</div>
          <div className="stage-body">
            <div className="st-name">李永乐复习全书</div>
            <div className="st-meta">敬请期待</div>
          </div>
        </button>
      </div>

      <div style={{ marginTop: 12 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/')}>
          ← 返回首页
        </button>
      </div>
    </div>
  );
}
