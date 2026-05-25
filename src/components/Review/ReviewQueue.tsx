import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '../../store/useProgressStore';
import { MistakeTypeLabels, type MistakeType } from '../../data/types';

export default function ReviewQueue() {
  const navigate = useNavigate();
  const chapterId = useProgressStore(s => s.chapterId);
  const tasks = useProgressStore(s => s.tasks);
  const retry = useProgressStore(s => s.retry);

  if (retry.length === 0) {
    return (
      <div className="anim-in" style={{ textAlign: 'center', padding: 40 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>✨</div>
        <h3 style={{ color: 'var(--green)' }}>心魔已清空！</h3>
        <p style={{ color: 'var(--text2)', fontSize: 12, marginTop: 4 }}>
          所有待重做题目已完成。
        </p>
        <button className="btn btn-accent btn-sm" style={{ marginTop: 12 }} onClick={() => navigate(`/chapter/${chapterId}`)}>
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
        grouped.get(mt)!.push(task);
      }
    }
  }

  return (
    <div className="anim-in">
      <h3 style={{ color: 'var(--red)', marginBottom: 8, fontSize: 13 }}>
        📖 心魔本 · 待重做 {retry.length} 题
      </h3>

      {Array.from(grouped.entries()).map(([type, items]) => (
        <div className="review-group" key={type}>
          <h3>{MistakeTypeLabels[type] ?? type} ({items.length})</h3>
          {items.map(task => (
            <button
              key={task.id}
              className="review-item"
              onClick={() => navigate(`/chapter/${chapterId}/task/${task.id}`)}
            >
              <span>#{task.id + 1} {task.title}</span>
              <span style={{ color: 'var(--text2)', fontSize: 10 }}>{task.source}</span>
            </button>
          ))}
        </div>
      ))}

      {uncategorized.length > 0 && (
        <div className="review-group">
          <h3>其他 ({uncategorized.length})</h3>
          {uncategorized.map(task => (
            <button
              key={task.id}
              className="review-item"
              onClick={() => navigate(`/chapter/${chapterId}/task/${task.id}`)}
            >
              <span>#{task.id + 1} {task.title}</span>
              <span style={{ color: 'var(--text2)', fontSize: 10 }}>{task.source}</span>
            </button>
          ))}
        </div>
      )}

      <div style={{ marginTop: 8 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/chapter/${chapterId}`)}>
          ← 返回仪表盘
        </button>
      </div>
    </div>
  );
}
