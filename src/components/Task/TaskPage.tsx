import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useProgressStore } from '../../store/useProgressStore';
import HintPanel from './HintPanel';
import AnswerPanel from './AnswerPanel';
import LatexContent from './LatexContent';
function splitSubQuestions(text: string): string[] {
  const lines = text.split('\n');
  const parts: string[] = [];
  let current: string[] = [];

  for (const line of lines) {
    const isMarker = /^\s*(?:\(\d+\)|\(\w\)|\d+[\.\)]|[①②③④⑤⑥⑦⑧⑨⑩]|\*\*题\s*\d+\*\*)/.test(line);
    if (isMarker && current.length > 0) {
      parts.push(current.join('\n').trim());
      current = [];
    }
    current.push(line);
  }
  if (current.length > 0) {
    parts.push(current.join('\n').trim());
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

  // 检测当前 URL 格式（新路由含 stage/subject，旧路由直接 /chapter）
  const p = location.pathname;
  const isNewRoute = p.includes('/stage/') && p.includes('/subject/');
  const stageMatch = p.match(/\/stage\/([^/]+)/);
  const subjectMatch = p.match(/\/subject\/([^/]+)/);
  const stageId = stageMatch?.[1] || '';
  const subjectId = subjectMatch?.[1] || '';

  // base 根据路由格式动态生成
  const base = isNewRoute
    ? `/stage/${stageId}/subject/${subjectId}/chapter/${chapterId}`
    : `/chapter/${chapterId}`;

  useEffect(() => {
    if (tid !== undefined) { const n = parseInt(tid); if (!isNaN(n) && n !== currentTask) goToTask(n); }
  }, [tid]);
  useEffect(() => {
    if (tid === undefined && currentTask >= 0 && currentTask < tasks.length)
      navigate(`${base}/task/${currentTask}`, { replace: true });
  }, [tid, currentTask, tasks.length, base, navigate]);
  useEffect(() => { setShowHint(false); setShowAnswer(false); }, [taskId]);

  if (!task && done.length >= tasks.length && retry.length === 0) {
    return (
      <div className="anim-in" style={{ textAlign: 'center', padding: 48 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>👑</div>
        <p style={{ color: 'var(--text2)' }}>所有任务已完成，心魔已清空。</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12 }}>
          <button className="btn btn-primary" onClick={() => navigate(`${base}/report`)}>查看战报</button>
          <button className="btn btn-ghost" onClick={() => navigate('/')}>🏠 返回首页</button>
        </div>
      </div>
    );
  }
  if (!task) {
    return (
      <div className="anim-in" style={{ textAlign: 'center', padding: 48 }}>
        <p style={{ color: 'var(--text2)' }}>任务不存在。</p>
        <button className="btn btn-ghost btn-sm" style={{ marginTop: 12 }} onClick={() => navigate('/')}>返回首页</button>
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
    navigate(s.done.length >= tasks.length && s.retry.length === 0 ? `${base}/report` : `${base}/task/${s.currentTask}`);
  };

  const stats = useProgressStore(s => s.stats);
  const chapterTitle = useProgressStore(s => s.chapterTitle);

  return (
    <div className="anim-in">
      {/* ── 本讲进度条 ── */}
      <div className="stats-grid" style={{ marginBottom: 12 }}>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--accent)' }}>{stats.mastery || 0}%</div>
          <div className="stat-label">本讲掌握度</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--green)' }}>{stats.doneCount || 0}/{stats.totalCount || 0}</div>
          <div className="stat-label">已完成任务</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: (stats.retryCount || 0) > 0 ? 'var(--red)' : 'var(--green)' }}>
            {stats.retryCount || 0}
          </div>
          <div className="stat-label">待重做心魔</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--gold)' }}>{stats.c9 || 0}</div>
          <div className="stat-label">C9战力指数</div>
        </div>
      </div>

      {/* ── 技能条 ── */}
      <div className="skill-bars" style={{ marginBottom: 12 }}>
        <div className="skill-row">
          <span className="skill-name">方法选择</span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: (stats.method || 0) + '%', background: 'var(--accent)' }} />
          </div>
          <span className="skill-pct">{stats.method || 0}%</span>
        </div>
        <div className="skill-row">
          <span className="skill-name">计算稳定</span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: (stats.calc || 0) + '%', background: 'var(--green)' }} />
          </div>
          <span className="skill-pct">{stats.calc || 0}%</span>
        </div>
        <div className="skill-row">
          <span className="skill-name">几何建模</span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: (stats.geometry || 0) + '%', background: 'var(--purple)' }} />
          </div>
          <span className="skill-pct">{stats.geometry || 0}%</span>
        </div>
      </div>

      {/* ── Main Column ── */}
      <div style={{ flex: 1, minWidth: 0 }}>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600 }}>#{task.id + 1}/{total}</span>
            </div>
          </div>

          <h2 style={{ fontSize: 16, fontWeight: 600, fontFamily: 'var(--font-title)', marginBottom: 14, lineHeight: 1.5, letterSpacing: '0.03em' }}>
            {task.title}
          </h2>

          <div className="task-section">
            <div className="task-section-label">核心考点</div>
            <div className="kp-grid">
              {task.knowledgePoints.map(kp => <div key={kp} className="kp-tag">{kp}</div>)}
            </div>
          </div>

          <div className="task-section">
            <div className="task-section-label">题目</div>
            <div className="task-body md-content">
              {subQuestions.length > 1 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {subQuestions.map((sq, i) => (
                    <div key={i} style={{
                      padding: i > 0 ? '14px 0 0' : 0,
                      borderTop: i > 0 ? '1px solid var(--border)' : 'none'
                    }}>
                      <LatexContent html={sq} />
                    </div>
                  ))}
                </div>
              ) : (
                <LatexContent html={task.question} />
              )}
            </div>
          </div>

          <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span>📖</span>
            <span>{task.source}</span>
          </div>

          <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 6, display: 'flex', gap: 10 }}>
            <span>🎁 掌握度 +{task.reward.mastery}%</span>
            {task.reward.c9 > 0 && <span>⚡ C9 +{task.reward.c9}</span>}
          </div>

          {isRetry && (
            <div style={{ fontSize: 11, color: 'var(--red)', marginBottom: 8 }}>
              此任务在心魔队列中。
              <button className="btn btn-ghost btn-sm" style={{ marginLeft: 8, fontSize: 10, padding: '2px 8px' }}
                onClick={() => { removeRetry(task.id); navigate(`${base}/task/${task.id}`); }}>移出心魔本</button>
            </div>
          )}

          <HintPanel hint={task.hint} visible={showHint} onToggle={() => setShowHint(!showHint)} />
          <AnswerPanel answer={task.answer} method={task.method} trap={task.trap}
            afterMastery={task.afterMastery} visible={showAnswer} onToggle={() => setShowAnswer(!showAnswer)} />

          <div style={{ marginTop: 10, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn btn-success" onClick={() => { markDone(); advanceAndNavigate(); }}>✅ 我做对了</button>
            <button className="btn btn-danger" onClick={() => { markRetry(); advanceAndNavigate(); }}>🔄 需要重做</button>
          </div>

          <div style={{ marginTop: 10, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn btn-ghost btn-sm" onClick={() => {
              const vs = [...done, ...retryList].filter(i => i < task.id);
              const p = vs.length > 0 ? Math.max(...vs) : Math.max(0, task.id - 1);
              goToTask(p); navigate(`${base}/task/${p}`);
            }}>← 上一题</button>
            <button className="btn btn-ghost btn-sm" onClick={() => {
              const rm = tasks.filter((_, i) => !done.includes(i) && !retryList.includes(i) && i > task.id);
              const ar = retryList.filter(i => i > task.id);
              const n = rm.length > 0 ? rm[0].id : ar.length > 0 ? Math.min(...ar) : task.id;
              goToTask(n); navigate(`${base}/task/${n}`);
            }}>下一题 →</button>
          </div>

          <hr className="task-divider" />
          <div style={{ fontSize: 10, color: 'var(--text3)' }}>
            题源：{task.source}{task.skillTags.length > 0 && ` · ${task.skillTags.join('、')}`}
          </div>
        </div>

      </div>

    </div>
  );
}
