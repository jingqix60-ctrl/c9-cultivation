import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '../../store/useProgressStore';
import { STAGE_NAMES } from '../../data/chapterTypes';

const STAGE_ICONS: Record<number, string> = {
  0: '📖', 1: '📘', 2: '🎯', 3: '🏗️', 4: '🔥', 5: '👑',
};

export default function ChapterMap() {
  const navigate = useNavigate();
  const tasks = useProgressStore(s => s.tasks);
  const done = useProgressStore(s => s.done);
  const retry = useProgressStore(s => s.retry);

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
      <h3 style={{ color: 'var(--purple)', marginBottom: 8, fontSize: 13 }}>
        🗺️ 第10讲 · 旋转体体积 · 修炼地图
      </h3>
      <div className="map-container">
        {stageList.map(st => {
          const stageTasks = st.tasks;
          const stageDone = stageTasks.filter(t => done.includes(t.id)).length;
          const stageRetry = stageTasks.filter(t => retry.includes(t.id)).length;
          const stageTotal = stageTasks.length;
          const allDone = stageDone === stageTotal && stageRetry === 0;
          const hasRetry = stageRetry > 0;

          let statusClass = '';
          let iconClass = '';
          if (hasRetry) { statusClass = 'retry'; iconClass = 'retry'; }
          else if (allDone) { statusClass = 'completed'; iconClass = 'done'; }

          return (
            <button
              key={st.stage}
              className={`stage-node ${statusClass}`}
              onClick={() => {
                const firstTask = stageTasks[0];
                if (firstTask) navigate(`/task/${firstTask.id}`);
              }}
            >
              <div className={`stage-icon ${iconClass}`}>
                {STAGE_ICONS[st.stage] ?? '📌'}
              </div>
              <div className="stage-body">
                <div className="st-name">{st.name}</div>
                <div className="st-meta">
                  {stageTotal} 题 · 完成 {stageDone}{stageRetry > 0 ? ` · 心魔 ${stageRetry}` : ''}
                </div>
              </div>
              <span style={{ color: 'var(--text2)', fontSize: 11 }}>
                {allDone ? '✅' : hasRetry ? '🔄' : `${stageDone}/${stageTotal}`}
              </span>
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        <button className="btn btn-accent btn-sm" onClick={() => navigate('/task')}>
          进入当前任务
        </button>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/')}>
          ← 返回仪表盘
        </button>
      </div>
    </div>
  );
}
