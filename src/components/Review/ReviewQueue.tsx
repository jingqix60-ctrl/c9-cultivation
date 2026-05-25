import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '../../store/useProgressStore';
import { MistakeTypeLabels, type MistakeType } from '../../data/types';
import ResetModal from '../Common/ResetModal';

const CATEGORY_ICONS: Record<string, string> = {
  formula: '📝',
  region: '🗺️',
  method_selection: '🔀',
  calculation: '🧮',
  radius: '🎯',
  parametric_dx: '📐',
  non_coordinate_translation: '🔄',
  integral: '∫',
  geometry: '📏',
};

export default function ReviewQueue() {
  const navigate = useNavigate();
  const [showReset, setShowReset] = useState(false);
  const chapterId = useProgressStore(s => s.chapterId);
  const removeRetry = useProgressStore(s => s.removeRetry);
  const tasks = useProgressStore(s => s.tasks);
  const retry = useProgressStore(s => s.retry);
  const base = `/chapter/${chapterId}`;

  if (retry.length === 0) {
    return (
      <div className="anim-in" style={{ textAlign: 'center', padding: 48 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>✨</div>
        <h3 style={{ color: 'var(--green)', fontSize: 15 }}>心魔已清空</h3>
        <p style={{ color: 'var(--text2)', fontSize: 12, marginTop: 4 }}>
          所有待重做题目已完成。
        </p>
        <button className="btn btn-primary btn-sm" style={{ marginTop: 14 }} onClick={() => navigate(base)}>
          ← 返回仪表盘
        </button>
      </div>
    );
  }

  // Group retry tasks by mistake type
  const grouped = new Map<MistakeType, typeof tasks>();
  const uncategorized: typeof tasks = [];

  for (const taskId of retry) {
    const task = tasks[taskId];
    if (!task) continue;
    if (task.mistakeTypes.length === 0) {
      uncategorized.push(task);
    } else {
      for (const mt of task.mistakeTypes) {
        if (!grouped.has(mt)) grouped.set(mt, []);
        if (!grouped.get(mt)!.find(t => t.id === task.id)) {
          grouped.get(mt)!.push(task);
        }
      }
    }
  }

  const sortedGroups = Array.from(grouped.entries())
    .sort((a, b) => b[1].length - a[1].length);

  return (
    <div className="anim-in">
      <h3 style={{ color: 'var(--red)', marginBottom: 10, fontSize: 14, letterSpacing: '0.01em' }}>
        📖 心魔本 · 待重做 {retry.length} 题
      </h3>

      {sortedGroups.map(([type, items]) => (
        <div className="review-group" key={type}>
          <h3>
            <span style={{ marginRight: 6 }}>{CATEGORY_ICONS[type] ?? '📌'}</span>
            {MistakeTypeLabels[type] ?? type}
            <span style={{
              marginLeft: 8, fontSize: 10, fontWeight: 400,
              color: 'var(--text2)', background: 'var(--red-soft)',
              padding: '2px 8px', borderRadius: 10,
            }}>
              {items.length} 题
            </span>
          </h3>
          {items.map(task => (
            <button
              key={task.id}
              className="review-item"
              onClick={() => navigate(`${base}/task/${task.id}`)}
            >
              <span style={{ flex: 1, textAlign: 'left' }}>
                <span style={{ color: 'var(--text3)', marginRight: 6 }}>#{task.id + 1}</span>
                {task.title}
              </span>
              <span style={{ color: 'var(--text3)', fontSize: 10, flexShrink: 0 }}>
                {task.source}
              </span>
              <button className="btn btn-ghost btn-sm" style={{ fontSize: 9, padding: '2px 6px', flexShrink: 0, marginLeft: 4 }}
                onClick={(e) => { e.stopPropagation(); removeRetry(task.id); }}>
                移出
              </button>
            </button>
          ))}
        </div>
      ))}

      {uncategorized.length > 0 && (
        <div className="review-group">
          <h3>📌 其他 ({uncategorized.length})</h3>
          {uncategorized.map(task => (
            <button
              key={task.id}
              className="review-item"
              onClick={() => navigate(`${base}/task/${task.id}`)}
            >
              <span style={{ flex: 1, textAlign: 'left' }}>
                <span style={{ color: 'var(--text3)', marginRight: 6 }}>#{task.id + 1}</span>
                {task.title}
              </span>
              <span style={{ color: 'var(--text3)', fontSize: 10, flexShrink: 0 }}>
                {task.source}
              </span>
              <button className="btn btn-ghost btn-sm" style={{ fontSize: 9, padding: '2px 6px', flexShrink: 0, marginLeft: 4 }}
                onClick={(e) => { e.stopPropagation(); removeRetry(task.id); }}>
                移出
              </button>
            </button>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(base)}>← 返回</button>
        <button className="btn btn-danger btn-sm" onClick={() => setShowReset(true)}>🔄 重置本章</button>
      </div>
      {showReset && <ResetModal onClose={() => setShowReset(false)} />}
    </div>
  );
}
