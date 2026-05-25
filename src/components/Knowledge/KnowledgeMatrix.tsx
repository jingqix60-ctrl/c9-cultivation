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
  const tasks = useProgressStore(s => s.tasks);
  const done = useProgressStore(s => s.done);
  const retry = useProgressStore(s => s.retry);

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
      result.push({
        name,
        total: v.total,
        done: v.done,
        pct: Math.round((v.done / Math.max(1, v.total)) * 100),
        hasRetry: v.hasRetry,
      });
    });
    result.sort((a, b) => a.pct - b.pct || b.total - a.total);
    return result;
  }, [tasks, done, retry]);

  return (
    <div className="anim-in">
      <h3 style={{ color: 'var(--purple)', marginBottom: 8, fontSize: 13 }}>
        📋 第10讲 · 知识覆盖矩阵
      </h3>

      <div className="panel" style={{ maxHeight: 'none' }}>
        <table className="knowledge-table">
          <thead>
            <tr>
              <th>知识点</th>
              <th>题数</th>
              <th>完成</th>
              <th>掌握</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.name}>
                <td>
                  {item.name}
                  {item.hasRetry && (
                    <span style={{
                      color: 'var(--red)',
                      fontSize: 9,
                      marginLeft: 4,
                    }}>
                      🔄
                    </span>
                  )}
                </td>
                <td>{item.total}</td>
                <td className={item.pct >= 100 ? 'kw-ok' : item.pct >= 50 ? 'kw-mid' : 'kw-low'}>
                  {item.done}/{item.total}
                </td>
                <td>
                  <div className="progress-bar" style={{ width: 80, display: 'inline-flex', verticalAlign: 'middle' }}>
                    <div
                      className="progress-fill"
                      style={{
                        width: item.pct + '%',
                        background: item.pct >= 100 ? 'var(--green)' : item.pct >= 50 ? 'var(--amber)' : 'var(--text2)',
                      }}
                    />
                  </div>
                  <span style={{ fontSize: 10, color: 'var(--text2)', marginLeft: 6 }}>{item.pct}%</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 8 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/')}>
          ← 返回仪表盘
        </button>
      </div>
    </div>
  );
}
