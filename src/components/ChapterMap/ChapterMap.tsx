import { useNavigate } from 'react-router-dom';
import { STAGE_NAMES } from '../../data/types';
import { useProgressStore } from '../../store/useProgressStore';

const STAGE_ICONS: Record<number, string> = {
  0: '🗺️', 1: '📘', 2: '🎯', 3: '🏗️', 4: '🔥', 5: '👑',
};

export default function ChapterMap() {
  const navigate = useNavigate();
  const tasks = useProgressStore(s => s.tasks);
  const done = useProgressStore(s => s.done);
  const retry = useProgressStore(s => s.retry);
  const chapterId = useProgressStore(s => s.chapterId);
  const base = `/chapter/${chapterId}`;

  const stages = new Map<number, { stage: number; name: string; tasks: typeof tasks }>();
  tasks.forEach(t => {
    if (!stages.has(t.stage)) {
      stages.set(t.stage, { stage: t.stage, name: STAGE_NAMES[t.stage] ?? `阶段${t.stage}`, tasks: [] });
    }
    stages.get(t.stage)!.tasks.push(t);
  });

  const stageList = Array.from(stages.values());

  return (
    <div className="anim-in">
      <h3 style={{ color: 'var(--purple)', marginBottom: 10, fontSize: 14, letterSpacing: '0.01em' }}>
        🗺️ 第{chapterId}讲 · 修炼地图
      </h3>

      <div style={{ position: 'relative', paddingLeft: 0 }}>
        {stageList.map((st, idx) => {
          const stageTasks = st.tasks;
          const stageDone = stageTasks.filter(t => done.includes(t.id)).length;
          const stageRetry = stageTasks.filter(t => retry.includes(t.id)).length;
          const stageTotal = stageTasks.length;
          const allDone = stageDone === stageTotal && stageRetry === 0;
          const hasRetry = stageRetry > 0;
          const inProgress = stageDone > 0 && !allDone;
          const isLast = idx === stageList.length - 1;

          let borderColor = 'var(--border)';
          let iconBg = 'var(--surface3)';
          let connectorColor = 'var(--border)';
          if (hasRetry) { borderColor = 'rgba(239,68,68,0.35)'; iconBg = 'var(--red-soft)'; connectorColor = 'rgba(239,68,68,0.2)'; }
          else if (allDone) { borderColor = 'rgba(34,197,94,0.3)'; iconBg = 'var(--green-soft)'; connectorColor = 'rgba(34,197,94,0.2)'; }
          else if (inProgress) { borderColor = 'rgba(96,165,250,0.25)'; iconBg = 'var(--accent-soft)'; connectorColor = 'rgba(96,165,250,0.15)'; }

          return (
            <div key={st.stage} style={{ display: 'flex', gap: 0 }}>
              {/* Connector column */}
              <div style={{
                width: 20, display: 'flex', flexDirection: 'column', alignItems: 'center',
                flexShrink: 0, paddingTop: 2,
              }}>
                {/* Top half connector from previous node */}
                {idx > 0 && (
                  <div style={{ width: 2, height: 12, background: connectorColor, borderRadius: 1 }} />
                )}
                {/* Node dot */}
                <div style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: allDone ? 'var(--green)' : hasRetry ? 'var(--red)' : inProgress ? 'var(--accent)' : 'var(--text3)',
                  flexShrink: 0,
                  border: `2px solid ${allDone ? 'var(--green)' : hasRetry ? 'var(--red)' : inProgress ? 'var(--accent)' : 'var(--border-strong)'}`,
                }} />
                {/* Bottom half connector to next node */}
                {!isLast && (
                  <div style={{ width: 2, flex: 1, background: connectorColor, borderRadius: 1, minHeight: 12 }} />
                )}
              </div>

              {/* Stage card */}
              <button
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', gap: 12,
                  padding: '14px 16px', marginBottom: isLast ? 0 : 6,
                  background: 'var(--surface)', border: `1px solid ${borderColor}`,
                  borderRadius: 'var(--radius)', cursor: 'pointer',
                  transition: 'all 0.15s', textAlign: 'left' as const,
                  fontFamily: 'inherit', color: 'var(--text)', width: '100%',
                }}
                onClick={() => {
                  const firstTask = stageTasks[0];
                  if (firstTask) navigate(`${base}/task/${firstTask.id}`);
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = borderColor; e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, flexShrink: 0, background: iconBg,
                  border: `1px solid ${borderColor}`,
                }}>
                  {STAGE_ICONS[st.stage] ?? '📌'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="st-name">{st.name}</div>
                  <div className="st-meta">
                    {stageTotal} 题 · 完成 {stageDone}
                    {hasRetry ? ` · 心魔 ${stageRetry}` : ''}
                    {inProgress && !hasRetry ? ` · 进行中` : ''}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <span style={{ fontSize: 10, color: 'var(--text2)' }}>
                    {stageDone}/{stageTotal}
                  </span>
                  <span style={{ fontSize: 12 }}>
                    {allDone ? '✅' : hasRetry ? '🔄' : inProgress ? '▶️' : '○'}
                  </span>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <button className="btn btn-primary btn-sm" onClick={() => navigate(`${base}/task`)}>
          进入当前任务
        </button>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(base)}>
          ← 仪表盘
        </button>
      </div>
    </div>
  );
}
