import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProgressStore } from '../../store/useProgressStore';
import HintPanel from './HintPanel';
import AnswerPanel from './AnswerPanel';
import LatexContent from './LatexContent';
import QuestionNav from './QuestionNav';

/** Split a question string into sub-questions if it contains numbered markers */
function splitSubQuestions(text: string): string[] {
  const markers = text.match(/(?:^|\n)\s*(?:\(\d+\)|\d+[\.\)]|[①②③④⑤⑥⑦⑧⑨⑩]|\*\*题\s*\d+\*\*)/g);
  if (!markers || markers.length <= 1) return [text];
  const parts: string[] = [];
  let lastIdx = 0;
  for (let i = 0; i < markers.length; i++) {
    const m = markers[i];
    const idx = text.indexOf(m, lastIdx);
    if (idx < 0) continue;
    const nextIdx = i + 1 < markers.length
      ? text.indexOf(markers[i + 1], idx + m.length)
      : text.length;
    if (nextIdx < 0) continue;
    parts.push(text.slice(idx, nextIdx).trim());
    lastIdx = nextIdx;
  }
  return parts.length > 1 ? parts : [text];
}

export default function TaskPage() {
  const { taskId: tid } = useParams<{ taskId?: string }>();
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
  const retryList = useProgressStore(s => s.retry);
  const removeRetry = useProgressStore(s => s.removeRetry);

  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const taskId = tid !== undefined ? parseInt(tid) : currentTask;
  const task = tasks[taskId];

  useEffect(() => {
    if (tid !== undefined) {
      const n = parseInt(tid);
      if (!isNaN(n) && n !== currentTask) goToTask(n);
    }
  }, [tid]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (tid === undefined && currentTask >= 0 && currentTask < tasks.length) {
      navigate(`/chapter/${chapterId}/task/${currentTask}`, { replace: true });
    }
  }, [tid, currentTask, tasks.length, chapterId, navigate]);

  useEffect(() => { setShowHint(false); setShowAnswer(false); }, [taskId]);

  const base = `/chapter/${chapterId}`;

  if (!task && done.length >= tasks.length && retry.length === 0) {
    return (
      <div className="anim-in" style={{ textAlign: 'center', padding: 48 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>👑</div>
        <p style={{ color: 'var(--text2)' }}>所有任务已完成，心魔已清空。</p>
        <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => navigate(`${base}/report`)}>
          查看战报
        </button>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="anim-in" style={{ textAlign: 'center', padding: 48 }}>
        <p style={{ color: 'var(--text2)' }}>任务不存在。</p>
        <button className="btn btn-ghost btn-sm" style={{ marginTop: 12 }} onClick={() => navigate(base)}>
          返回仪表盘
        </button>
      </div>
    );
  }

  const isDone = done.includes(task.id);
  const isRetry = retry.includes(task.id);
  const total = tasks.length;

  const subQuestions = splitSubQuestions(task.question);

  const advanceAndNavigate = () => {
    nextTask();
    const s = useProgressStore.getState();
    if (s.done.length >= tasks.length && s.retry.length === 0) {
      navigate(`${base}/report`);
    } else {
      navigate(`${base}/task/${s.currentTask}`);
    }
  };

  return (
    <div className="anim-in">
      {/* QuestionNav sidebar */}
      <QuestionNav base={base} />

      {/* Task Card */}
      <div className="task-card">
        {/* Header */}
        <div className="task-header">
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
            <span className="tag tag-purple">{task.stageName}</span>
            <span className={`diff diff-${task.difficulty}`}>{'★'.repeat(task.difficulty)}</span>
            <span style={{ fontSize: 10, color: 'var(--text2)' }}>⏱ {task.time}</span>
            {isDone && <span className="tag tag-green">✅ 已完成</span>}
            {isRetry && <span className="tag tag-red">🔄 心魔</span>}
          </div>
          <span style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600 }}>
            #{task.id + 1} / {total}
          </span>
        </div>

        {/* Title */}
        <h2 style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-title)', marginBottom: 14, lineHeight: 1.4 }}>
          {task.title}
        </h2>

        {/* Core knowledge points */}
        <div className="task-section">
          <div className="task-section-label">核心考点</div>
          <div className="kp-grid">
            {task.knowledgePoints.map(kp => (
              <div key={kp} className="kp-tag">{kp}</div>
            ))}
          </div>
        </div>

        {/* Question body */}
        <div className="task-section">
          <div className="task-section-label">题目</div>
          {subQuestions.length > 1 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {subQuestions.map((sq, i) => (
                <div key={i} style={{
                  padding: i > 0 ? '12px 0 0' : 0,
                  borderTop: i > 0 ? '1px solid var(--border)' : 'none',
                }}>
                  <LatexContent html={sq} />
                </div>
              ))}
            </div>
          ) : (
            <div className="task-body">
              <LatexContent html={task.question} />
            </div>
          )}
        </div>

        {/* Meta */}
        <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 6, display: 'flex', gap: 10 }}>
          <span>🎁 掌握度 +{task.reward.mastery}%</span>
          {task.reward.c9 > 0 && <span>⚡ C9 +{task.reward.c9}</span>}
        </div>

        {/* Status */}
        {isRetry && (
          <div style={{ fontSize: 11, color: 'var(--red)', marginBottom: 8 }}>
            此任务在心魔队列中，完成后方可计入掌握度。
            {/* Manual remove from retry */}
            <button className="btn btn-ghost btn-sm" style={{ marginLeft: 8, fontSize: 10, padding: '2px 8px' }}
              onClick={() => {
                removeRetry(task.id);
                navigate(`${base}/task/${task.id}`);
              }}>
              移出心魔本
            </button>
          </div>
        )}

        {/* Hint */}
        <HintPanel hint={task.hint} visible={showHint} onToggle={() => setShowHint(!showHint)} />

        {/* Answer */}
        <AnswerPanel
          answer={task.answer} method={task.method} trap={task.trap}
          afterMastery={task.afterMastery}
          visible={showAnswer} onToggle={() => setShowAnswer(!showAnswer)}
        />

        {/* Actions */}
        <div style={{ marginTop: 10, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn btn-success" onClick={() => { markDone(); advanceAndNavigate(); }}>
            ✅ 我做对了
          </button>
          <button className="btn btn-danger" onClick={() => { markRetry(); advanceAndNavigate(); }}>
            🔄 需要重做
          </button>
        </div>

        {/* Nav */}
        <div style={{ marginTop: 10, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => {
            const allVisited = [...done, ...retryList].filter(i => i < task.id);
            const prev = allVisited.length > 0 ? Math.max(...allVisited) : Math.max(0, task.id - 1);
            goToTask(prev);
            navigate(`${base}/task/${prev}`);
          }}>← 上一题</button>
          <button className="btn btn-ghost btn-sm" onClick={() => {
            const remaining = tasks.filter((_, i) => !done.includes(i) && !retryList.includes(i) && i > task.id);
            const allRetry = retryList.filter(i => i > task.id);
            const next = remaining.length > 0 ? remaining[0].id
              : allRetry.length > 0 ? Math.min(...allRetry) : task.id;
            goToTask(next);
            navigate(`${base}/task/${next}`);
          }}>下一题 →</button>
        </div>

        {/* Source footer */}
        <hr className="task-divider" />
        <div style={{ fontSize: 10, color: 'var(--text3)' }}>
          题源：{task.source}
          {task.skillTags.length > 0 && ` · ${task.skillTags.join('、')}`}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(`${base}/map`)}>🗺️ 地图</button>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(base)}>📊 仪表盘</button>
      </div>
    </div>
  );
}
