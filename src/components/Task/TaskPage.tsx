import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProgressStore } from '../../store/useProgressStore';
import HintPanel from './HintPanel';
import AnswerPanel from './AnswerPanel';
import LatexContent from './LatexContent';

export default function TaskPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const tasks = useProgressStore(s => s.tasks);
  const chapterId = useProgressStore(s => s.chapterId);
  const currentTask = useProgressStore(s => s.currentTask);
  const done = useProgressStore(s => s.done);
  const retry = useProgressStore(s => s.retry);
  const markDone = useProgressStore(s => s.markDone);
  const markRetry = useProgressStore(s => s.markRetry);
  const goToTask = useProgressStore(s => s.goToTask);
  const nextTask = useProgressStore(s => s.nextTask);

  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  // Resolve task ID: URL param > store currentTask
  const taskId = id !== undefined ? parseInt(id) : currentTask;
  const task = tasks[taskId];

  // Sync store when URL changes
  useEffect(() => {
    if (id !== undefined) {
      const tid = parseInt(id);
      if (!isNaN(tid) && tid !== currentTask) {
        goToTask(tid);
      }
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Redirect /task (no id) to /task/{currentTask}
  useEffect(() => {
    if (id === undefined && currentTask >= 0 && currentTask < tasks.length) {
      navigate(`/chapter/${chapterId}/task/${currentTask}`, { replace: true });
    }
  }, [id, currentTask, tasks.length, navigate]);

  // Reset UI state when task changes
  useEffect(() => {
    setShowHint(false);
    setShowAnswer(false);
  }, [taskId]);

  // All complete
  if (!task && done.length >= tasks.length && retry.length === 0) {
    return (
      <div className="anim-in" style={{ textAlign: 'center', padding: 40 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>👑</div>
        <p style={{ color: 'var(--text2)' }}>所有任务已完成，心魔已清空。</p>
        <button className="btn btn-accent" style={{ marginTop: 12 }} onClick={() => navigate(`/chapter/${chapterId}/report`)}>
          查看战报
        </button>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="anim-in" style={{ textAlign: 'center', padding: 40 }}>
        <p style={{ color: 'var(--text2)' }}>任务不存在。</p>
        <button className="btn btn-accent btn-sm" style={{ marginTop: 12 }} onClick={() => navigate(`/chapter/${chapterId}`)}>
          返回仪表盘
        </button>
      </div>
    );
  }

  const isDone = done.includes(task.id);
  const isRetry = retry.includes(task.id);
  const total = tasks.length;

  const advanceAndNavigate = () => {
    nextTask();
    // Read the updated currentTask after nextTask() settled
    const { currentTask: newCur, done: nd, retry: nr } = useProgressStore.getState();
    if (nd.length >= tasks.length && nr.length === 0) {
      navigate(`/chapter/${chapterId}/report`);
    } else {
      navigate(`/chapter/${chapterId}/task/${newCur}`);
    }
  };

  const handleMarkDone = () => {
    markDone();
    advanceAndNavigate();
  };

  const handleMarkRetry = () => {
    markRetry();
    advanceAndNavigate();
  };

  return (
    <div className="anim-in">
      <div className="task-card">
        {/* ── Row 0: Header tags ── */}
        <div className="task-header">
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
            <span className="tag tag-purple">{task.stageName}</span>
            <span className={`diff diff-${task.difficulty}`}>
              {'★'.repeat(task.difficulty)}
            </span>
            <span className="tag tag-blue">{task.source}</span>
          </div>
          <span style={{ fontSize: 11, color: 'var(--text2)' }}>
            #{task.id + 1}/{total}
          </span>
        </div>

        {/* ── Row 1: Title ── */}
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>
          {task.title}
        </div>

        {/* ── Row 2: Knowledge points ── */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: 'var(--text2)', marginBottom: 4 }}>核心考点</div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
            gap: 4,
          }}>
            {task.knowledgePoints.map(kp => (
              <span key={kp} className="tag tag-purple" style={{ textAlign: 'center' }}>{kp}</span>
            ))}
          </div>
        </div>

        {/* ── Row 3: Question body ── */}
        <div className="task-body" style={{ marginBottom: 8 }}>
          <LatexContent html={task.question} />
        </div>

        {/* ── Row 4: Meta ── */}
        <div className="task-meta" style={{ marginBottom: 6 }}>
          ⏱ {task.time} &nbsp;|&nbsp; 🎁 掌握度 +{task.reward.mastery}%
        </div>

        {/* Status badges */}
        {isDone && (
          <div style={{ fontSize: 11, color: 'var(--green)', marginBottom: 6 }}>✅ 已完成</div>
        )}
        {isRetry && (
          <div style={{ fontSize: 11, color: 'var(--red)', marginBottom: 6 }}>
            🔄 此任务在心魔队列中，完成后方可计入掌握度。
          </div>
        )}

        {/* ── Row 5: Hint & Answer buttons ── */}
        <div className="task-buttons" style={{ borderTop: '1px solid var(--border)', paddingTop: 10 }}>
          <HintPanel hint={task.hint} visible={showHint} onToggle={() => setShowHint(!showHint)} />
          <AnswerPanel
            answer={task.answer}
            method={task.method}
            trap={task.trap}
            afterMastery={task.afterMastery}
            visible={showAnswer}
            onToggle={() => setShowAnswer(!showAnswer)}
          />
        </div>

        {/* ── Row 6: Action buttons ── */}
        <div className="task-buttons" style={{ marginTop: 10 }}>
          <button className="btn btn-green" onClick={handleMarkDone}>
            ✅ 我做对了
          </button>
          <button className="btn btn-red" onClick={handleMarkRetry}>
            🔄 需要重做
          </button>
        </div>

        {/* ── Row 7: Prev/Next ── */}
        <div className="task-buttons" style={{ marginTop: 6 }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => {
              const allVisited = [...done, ...retry].filter(i => i < task.id);
              const prev = allVisited.length > 0 ? Math.max(...allVisited) : Math.max(0, task.id - 1);
              goToTask(prev);
              navigate(`/chapter/${chapterId}/task/${prev}`);
            }}
          >
            ← 上一题
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => {
              const remaining = tasks.filter((_, i) => !done.includes(i) && !retry.includes(i) && i > task.id);
              const allRetry = retry.filter(i => i > task.id);
              const next = remaining.length > 0
                ? remaining[0].id
                : allRetry.length > 0
                  ? Math.min(...allRetry)
                  : task.id;
              goToTask(next);
              navigate(`/chapter/${chapterId}/task/${next}`);
            }}
          >
            下一题 →
          </button>
        </div>

        {/* ── Row 8: Source footer ── */}
        <div style={{
          marginTop: 10,
          paddingTop: 8,
          borderTop: '1px solid var(--border)',
          fontSize: 10,
          color: 'var(--text2)',
        }}>
          题源：{task.source}
          {task.skillTags.length > 0 && ` · 考点：${task.skillTags.join('、')}`}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 4 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/chapter/${chapterId}/map`)}>
          🗺️ 章节地图
        </button>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/chapter/${chapterId}`)}>
          📊 仪表盘
        </button>
      </div>
    </div>
  );
}
