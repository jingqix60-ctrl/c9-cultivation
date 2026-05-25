import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '../../store/useProgressStore';

interface KPItem {
  name: string;
  total: number;
  done: number;
  pct: number;
  hasRetry: boolean;
}

export default function KnowledgeMatrix() {
  const navigate = useNavigate();
  const chapterId = useProgressStore(s => s.chapterId);
  const tasks = useProgressStore(s => s.tasks);
  const done = useProgressStore(s => s.done);
  const retry = useProgressStore(s => s.retry);
  const base = `/chapter/${chapterId}`;

  const items = useMemo(() => {
    const kpMap = new Map<string, { total: number; done: number; hasRetry: boolean }>();
    tasks.forEach(t => {
      for (const kp of t.knowledgePoints) {
        if (!kpMap.has(kp)) kpMap.set(kp, { total: 0, done: 0, hasRetry: false });
        const entry = kpMap.get(kp)!;
        entry.total++;
        if (done.includes(t.id)) entry.done++;
        if (retry.includes(t.id)) entry.hasRetry = true;
      }
    });
    const result: KPItem[] = [];
    kpMap.forEach((v, name) => {
      result.push({ name, total: v.total, done: v.done,
        pct: Math.round((v.done / Math.max(1, v.total)) * 100), hasRetry: v.hasRetry });
    });
    result.sort((a, b) => a.pct - b.pct || b.total - a.total);
    return result;
  }, [tasks, done, retry]);

  return (
    <div className="anim-in">
      <h3 style={{ color: 'var(--purple)', marginBottom: 10, fontSize: 14 }}>
        📋 第{chapterId}讲 · 能力面板
      </h3>

      <div className="knowledge-grid">
        {items.map(item => (
          <div key={item.name} className="knowledge-card">
            <div className="kp-name" style={{
              color: item.pct >= 100 ? 'var(--green)' : item.pct >= 50 ? 'var(--text)' : 'var(--text2)',
            }}>
              {item.name}
              {item.hasRetry && <span style={{ color: 'var(--red)', fontSize: 9, marginLeft: 4 }}>🔄</span>}
            </div>
            <div className="kp-meta" style={{ marginBottom: 6 }}>
              {item.done}/{item.total} 题完成
            </div>
            <div className="progress-bar" style={{ height: 4 }}>
              <div className="progress-fill" style={{
                width: item.pct + '%',
                background: item.pct >= 100 ? 'var(--green)'
                  : item.pct >= 50 ? 'var(--amber)' : 'var(--text3)',
              }} />
            </div>
            <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 4, textAlign: 'right' }}>
              {item.pct}%
            </div>
          </div>
        ))}
      </div>

      <button className="btn btn-ghost btn-sm" onClick={() => navigate(base)}>
        ← 返回仪表盘
      </button>
    </div>
  );
}
