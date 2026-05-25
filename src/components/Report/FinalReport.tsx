import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '../../store/useProgressStore';

export default function FinalReport() {
  const navigate = useNavigate();
  const stats = useProgressStore(s => s.stats);
  const done = useProgressStore(s => s.done);
  const retry = useProgressStore(s => s.retry);
  const tasks = useProgressStore(s => s.tasks);
  const resetChapter = useProgressStore(s => s.resetChapter);

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
      <div className="anim-in" style={{ textAlign: 'center', padding: 40 }}>
        <p style={{ color: 'var(--text2)' }}>
          还有任务未完成或心魔未清除。请先完成所有修炼。
        </p>
        <button className="btn btn-accent btn-sm" style={{ marginTop: 12 }} onClick={() => navigate('/task')}>
          继续修炼
        </button>
      </div>
    );
  }

  return (
    <div className="report anim-in">
      <div className="report-icon">👑</div>
      <h2>第10讲 · 旋转体体积 · 圆满通关</h2>
      <p style={{ color: 'var(--text2)', fontSize: 12 }}>
        宿主已完成张宇30讲第10讲主线，并吸收武忠祥方法选择、李永乐综合建模、李正元压轴拔高之精华。
      </p>

      <div className="report-grid">
        <div className="report-item">
          <strong>📊 总掌握度</strong>
          <span style={{ color: 'var(--green)', fontSize: 18, fontWeight: 700 }}>{stats.mastery}%</span>
        </div>
        <div className="report-item">
          <strong>📘 张宇主线</strong>
          <span style={{ color: 'var(--accent)', fontSize: 18, fontWeight: 700 }}>{stats.zhangyu}%</span>
        </div>
        <div className="report-item">
          <strong>🎯 辅助技巧</strong>
          <span style={{ color: 'var(--purple)', fontSize: 18, fontWeight: 700 }}>{stats.skills}%</span>
        </div>
        <div className="report-item">
          <strong>⚡ C9战力</strong>
          <span style={{ color: 'var(--gold)', fontSize: 18, fontWeight: 700 }}>{stats.c9}</span>
        </div>
        <div className="report-item">
          <strong>🔄 方法选择</strong>
          <span style={{ fontSize: 14 }}>{stats.method}%</span>
        </div>
        <div className="report-item">
          <strong>📐 几何建模</strong>
          <span style={{ fontSize: 14 }}>{stats.geometry}%</span>
        </div>
        <div className="report-item">
          <strong>🧮 计算稳定</strong>
          <span style={{ fontSize: 14 }}>{stats.calc}%</span>
        </div>
        <div className="report-item">
          <strong>🏆 最终境界</strong>
          <span style={{ color: 'var(--gold)', fontSize: 14, fontWeight: 700 }}>
            {stats.realm?.name ?? 'C9候选人'}
          </span>
        </div>
      </div>

      {/* Skills */}
      <div style={{ textAlign: 'left', marginTop: 12, fontSize: 12 }}>
        <strong style={{ color: 'var(--purple)' }}>已征服技能：</strong>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
          {allSkills.filter(s => s.covered).map(s => (
            <span key={s.name} className="tag tag-green">✓ {s.name}</span>
          ))}
        </div>
      </div>

      <p style={{ marginTop: 16, color: 'var(--accent)', fontSize: 13 }}>
        📂 下一秘境：第11讲 · 常微分方程
      </p>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/')}>
          📊 仪表盘
        </button>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/map')}>
          🗺️ 章节地图
        </button>
        <button className="btn btn-red btn-sm" onClick={() => {
          if (confirm('确定要重置第10讲所有进度吗？此操作不可撤销。')) {
            resetChapter();
            navigate('/');
          }
        }}>
          🔄 重置进度
        </button>
      </div>
    </div>
  );
}
