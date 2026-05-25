import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '../../store/useProgressStore';

interface Props {
  base: string;
}

export default function QuestionNav({ base }: Props) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'undone' | 'done' | 'retry'>('all');
  const navigate = useNavigate();
  const tasks = useProgressStore(s => s.tasks);
  const done = useProgressStore(s => s.done);
  const retry = useProgressStore(s => s.retry);
  const currentTask = useProgressStore(s => s.currentTask);

  const filtered = tasks.filter(t => {
    switch (filter) {
      case 'undone': return !done.includes(t.id) && !retry.includes(t.id);
      case 'done': return done.includes(t.id);
      case 'retry': return retry.includes(t.id);
      default: return true;
    }
  });

  const nextUndone = tasks.find(t => !done.includes(t.id) && !retry.includes(t.id) && t.id > currentTask);
  const nextRetry = tasks.find(t => retry.includes(t.id) && t.id !== currentTask);

  return (
    <>
      {/* Toggle button */}
      <button className="qnav-toggle" onClick={() => setOpen(!open)}
        title="题号导航">
        ☰
      </button>

      {/* Mobile overlay */}
      <div className={`qnav-overlay ${open ? 'open' : ''}`} onClick={() => setOpen(false)} />

      {/* Panel */}
      <div className={`qnav-panel ${open ? 'open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontWeight: 700, fontSize: 13, fontFamily: 'var(--font-title)' }}>题号导航</span>
          <button className="btn btn-ghost btn-sm" onClick={() => setOpen(false)}>✕</button>
        </div>

        {/* Filter */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 10, flexWrap: 'wrap' }}>
          {(['all', 'undone', 'done', 'retry'] as const).map(f => (
            <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
              style={{ padding: '2px 8px', fontSize: 10 }}
              onClick={() => setFilter(f)}>
              {{ all: '全部', undone: '未做', done: '已完成', retry: '心魔' }[f]}
            </button>
          ))}
        </div>

        {/* Quick jump */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 10, flexWrap: 'wrap' }}>
          <button className="btn btn-ghost btn-sm" style={{ fontSize: 10, padding: '2px 6px' }}
            onClick={() => { navigate(`${base}/task/0`); setOpen(false); }}>⏮ 第一题</button>
          <button className="btn btn-ghost btn-sm" style={{ fontSize: 10, padding: '2px 6px' }}
            onClick={() => { navigate(`${base}/task/${tasks.length - 1}`); setOpen(false); }}>⏭ 最后一题</button>
          {nextUndone && (
            <button className="btn btn-ghost btn-sm" style={{ fontSize: 10, padding: '2px 6px' }}
              onClick={() => { navigate(`${base}/task/${nextUndone.id}`); setOpen(false); }}>
              ▶ 下一未做
            </button>
          )}
          {nextRetry && (
            <button className="btn btn-danger btn-sm" style={{ fontSize: 10, padding: '2px 6px' }}
              onClick={() => { navigate(`${base}/task/${nextRetry.id}`); setOpen(false); }}>
              🔄 下一心魔
            </button>
          )}
        </div>

        {/* Number grid */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {filtered.map(t => {
            const isDone = done.includes(t.id);
            const isRetry = retry.includes(t.id);
            const isCurrent = t.id === currentTask;
            let cls = 'pending';
            if (isCurrent) cls = 'current';
            else if (isRetry) cls = 'retry';
            else if (isDone) cls = 'done';
            return (
              <button
                key={t.id}
                className={`qnav-num ${cls}`}
                onClick={() => { navigate(`${base}/task/${t.id}`); setOpen(false); }}
                title={`#${t.id + 1}: ${t.title}`}
              >
                {t.id + 1}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
