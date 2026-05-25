import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '../../store/useProgressStore';

interface Props { base: string; }

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

  const jumpTo = (id: number) => { navigate(`${base}/task/${id}`); setOpen(false); };

  const overlay = open && createPortal(
    <>
      <div
        onClick={() => setOpen(false)}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.15)', zIndex: 9999 }}
      />
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 260, zIndex: 10000,
        background: '#FFFDF7', borderLeft: '1px solid rgba(94,77,56,0.14)',
        boxShadow: '-2px 0 16px rgba(0,0,0,0.08)',
        overflowY: 'auto', padding: 18, fontFamily: 'system-ui, sans-serif',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontWeight: 700, fontSize: 14 }}>题号导航</span>
          <button onClick={() => setOpen(false)}
            style={{ background: 'none', border: 'none', fontSize: 16, cursor: 'pointer', color: '#7A6F63' }}>✕</button>
        </div>
        {/* Filter */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 10, flexWrap: 'wrap' }}>
          {(['all', 'undone', 'done', 'retry'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{
                padding: '3px 10px', borderRadius: 14, border: '1px solid',
                borderColor: filter === f ? '#8B5E34' : 'rgba(94,77,56,0.14)',
                background: filter === f ? 'rgba(139,94,52,0.1)' : 'transparent',
                color: filter === f ? '#8B5E34' : '#7A6F63',
                fontSize: 11, cursor: 'pointer', fontWeight: filter === f ? 600 : 400,
              }}>
              {{ all: '全部', undone: '未做', done: '完成', retry: '心魔' }[f]}
            </button>
          ))}
        </div>
        {/* Quick jump */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 10, flexWrap: 'wrap' }}>
          <button onClick={() => jumpTo(0)}
            style={{ padding: '3px 8px', fontSize: 10, border: '1px solid rgba(94,77,56,0.14)', borderRadius: 6, background: '#fff', cursor: 'pointer' }}>⏮ 第一题</button>
          <button onClick={() => jumpTo(tasks.length - 1)}
            style={{ padding: '3px 8px', fontSize: 10, border: '1px solid rgba(94,77,56,0.14)', borderRadius: 6, background: '#fff', cursor: 'pointer' }}>⏭ 最后一题</button>
          {nextUndone && (
            <button onClick={() => jumpTo(nextUndone.id)}
              style={{ padding: '3px 8px', fontSize: 10, border: '1px solid rgba(139,94,52,0.3)', borderRadius: 6, background: '#fff', cursor: 'pointer', color: '#8B5E34' }}>▶ 下一未做</button>
          )}
          {nextRetry && (
            <button onClick={() => jumpTo(nextRetry.id)}
              style={{ padding: '3px 8px', fontSize: 10, border: '1px solid rgba(184,92,92,0.3)', borderRadius: 6, background: '#fff', cursor: 'pointer', color: '#B85C5C' }}>🔄 下一心魔</button>
          )}
        </div>
        {/* Number grid */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {filtered.map(t => {
            const isDone = done.includes(t.id);
            const isRetry = retry.includes(t.id);
            const isCurrent = t.id === currentTask;
            let bg = '#F5EFE3', color = '#A09480', border = '1px solid rgba(94,77,56,0.1)';
            if (isCurrent) { bg = 'rgba(139,94,52,0.12)'; color = '#8B5E34'; border = '1px solid #8B5E34'; }
            else if (isRetry) { bg = 'rgba(184,92,92,0.1)'; color = '#B85C5C'; border = '1px solid #B85C5C'; }
            else if (isDone) { bg = 'rgba(79,125,90,0.1)'; color = '#4F7D5A'; border = '1px solid #4F7D5A'; }
            return (
              <button key={t.id} onClick={() => jumpTo(t.id)}
                title={`#${t.id + 1}: ${t.title}`}
                style={{
                  width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: 6, fontWeight: isCurrent ? 700 : 500, fontSize: 13,
                  cursor: 'pointer', background: bg, color, border,
                }}>
                {t.id + 1}
              </button>
            );
          })}
        </div>
      </div>
    </>,
    document.body
  );

  return (
    <>
      {/* Toggle button — always visible */}
      <button
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed', right: 12, bottom: 110, zIndex: 9998,
          padding: '8px 14px', borderRadius: 20,
          background: '#FFFDF7', border: '1.5px solid #8B5E34',
          color: '#8B5E34', fontSize: 12, fontWeight: 600,
          cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
        ☰ 题号
      </button>
      {overlay}
    </>
  );
}
