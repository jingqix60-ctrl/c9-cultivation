import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProgressStore } from '../../store/useProgressStore';
import HintPanel from './HintPanel';
import AnswerPanel from './AnswerPanel';
import LatexContent from './LatexContent';
import katex from 'katex';

const FORMULAS = [
  { title: '绕 x 轴（圆盘法）', latex: 'V_x = \\pi\\int_a^b y^2\\,dx' },
  { title: '绕 y 轴（柱壳法）', latex: 'V_y = 2\\pi\\int_a^b x\\cdot y\\,dx' },
  { title: '两曲线绕 x 轴', latex: 'V = \\pi\\int_a^b (y_2^2 - y_1^2)\\,dx' },
  { title: '两曲线绕 y 轴', latex: 'V = 2\\pi\\int_a^b x(y_2 - y_1)\\,dx' },
  { title: '平行截面体积', latex: 'V = \\int_a^b A(x)\\,dx' },
  { title: '参数方程绕 x 轴', latex: 'V = \\pi\\int y^2\\cdot x\'(t)\\,dt' },
  { title: '绕非坐标轴', latex: 'V = 2\\pi\\iint_D r\\,d\\sigma' },
  { title: 'Pappus 定理', latex: 'V = S \\cdot 2\\pi d' },
];

interface SidebarProps { base: string; }

function Sidebar({ base }: SidebarProps) {
  const [filter, setFilter] = useState<'all' | 'undone' | 'done' | 'retry'>('all');
  const [showFormulas, setShowFormulas] = useState(true);
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
  const jump = (id: number) => navigate(`${base}/task/${id}`);

  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: 14, boxShadow: 'var(--shadow)',
      position: 'sticky', top: 80, maxHeight: 'calc(100vh - 100px)', overflowY: 'auto',
    }}>
      <div style={{ fontWeight: 700, fontSize: 12, fontFamily: 'var(--font-title)', marginBottom: 8, color: 'var(--accent)' }}>
        题号导航
      </div>

      {/* Quick jump */}
      <div style={{ display: 'flex', gap: 3, marginBottom: 8, flexWrap: 'wrap' }}>
        <button onClick={() => jump(0)} className="btn btn-ghost btn-sm" style={{ fontSize: 10, padding: '2px 6px' }}>⏮</button>
        {nextUndone && <button onClick={() => jump(nextUndone.id)} className="btn btn-ghost btn-sm" style={{ fontSize: 10, padding: '2px 6px' }}>▶</button>}
        {nextRetry && <button onClick={() => jump(nextRetry.id)} className="btn btn-danger btn-sm" style={{ fontSize: 10, padding: '2px 6px' }}>🔄</button>}
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 3, marginBottom: 8 }}>
        {(['all', 'undone', 'done', 'retry'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
            style={{ padding: '2px 6px', fontSize: 10 }}>
            {{ all: '全', undone: '未', done: '✓', retry: '魔' }[f]}
          </button>
        ))}
      </div>

      {/* Numbers */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 10 }}>
        {filtered.map(t => {
          const isD = done.includes(t.id), isR = retry.includes(t.id), isC = t.id === currentTask;
          let cls = 'pending'; if (isC) cls = 'current'; else if (isR) cls = 'retry'; else if (isD) cls = 'done';
          return <button key={t.id} className={`qnav-num ${cls}`} onClick={() => jump(t.id)} title={`#${t.id + 1}`}>{t.id + 1}</button>;
        })}
      </div>

      {/* Formula toggle */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 8 }}>
        <button className="btn btn-ghost btn-sm" style={{ fontSize: 10, padding: '2px 8px', width: '100%', justifyContent: 'space-between' }}
          onClick={() => setShowFormulas(!showFormulas)}>
          公式速查 {showFormulas ? '▲' : '▼'}
        </button>
        {showFormulas && (
          <div style={{ marginTop: 6 }}>
            {FORMULAS.map((f, i) => (
              <div key={i} style={{
                padding: '5px 8px', marginBottom: 3, borderRadius: 'var(--radius-sm)',
                background: 'var(--accent-soft)',
                fontSize: 11, lineHeight: 1.5,
              }}>
                <div style={{ fontSize: 9, color: 'var(--text3)' }}>{f.title}</div>
                <span dangerouslySetInnerHTML={{
                  __html: katex.renderToString(f.latex, { throwOnError: false, displayMode: false })
                }} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function splitSubQuestions(text: string): string[] {
  const markers = text.match(/(?:^|\n)\s*(?:\(\d+\)|\d+[\.\)]|[①②③④⑤⑥⑦⑧⑨⑩]|\*\*题\s*\d+\*\*)/g);
  if (!markers || markers.length <= 1) return [text];
  const parts: string[] = [];
  let lastIdx = 0;
  for (let i = 0; i < markers.length; i++) {
    const m = markers[i];
    const idx = text.indexOf(m, lastIdx);
    if (idx < 0) continue;
    const nextIdx = i + 1 < markers.length ? text.indexOf(markers[i + 1], idx + m.length) : text.length;
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
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const taskId = tid !== undefined ? parseInt(tid) : currentTask;
  const task = tasks[taskId];

  useEffect(() => {
    if (tid !== undefined) { const n = parseInt(tid); if (!isNaN(n) && n !== currentTask) goToTask(n); }
  }, [tid]);
  useEffect(() => {
    if (tid === undefined && currentTask >= 0 && currentTask < tasks.length)
      navigate(`/chapter/${chapterId}/task/${currentTask}`, { replace: true });
  }, [tid, currentTask, tasks.length, chapterId, navigate]);
  useEffect(() => { setShowHint(false); setShowAnswer(false); }, [taskId]);

  const base = `/chapter/${chapterId}`;

  if (!task && done.length >= tasks.length && retry.length === 0) {
    return (
      <div className="anim-in" style={{ textAlign: 'center', padding: 48 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>👑</div>
        <p style={{ color: 'var(--text2)' }}>所有任务已完成，心魔已清空。</p>
        <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => navigate(`${base}/report`)}>查看战报</button>
      </div>
    );
  }
  if (!task) {
    return (
      <div className="anim-in" style={{ textAlign: 'center', padding: 48 }}>
        <p style={{ color: 'var(--text2)' }}>任务不存在。</p>
        <button className="btn btn-ghost btn-sm" style={{ marginTop: 12 }} onClick={() => navigate(base)}>返回仪表盘</button>
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

  return (
    <div className="anim-in" style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
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
              {/* Mobile sidebar toggle */}
              <button className="btn btn-ghost btn-sm sidebar-toggle" style={{ fontSize: 10, padding: '2px 8px' }}
                onClick={() => setSidebarVisible(!sidebarVisible)}>
                {sidebarVisible ? '隐藏侧栏' : '☰ 题号'}
              </button>
            </div>
          </div>

          <h2 style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-title)', marginBottom: 14, lineHeight: 1.4 }}>
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
            {subQuestions.length > 1 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {subQuestions.map((sq, i) => (
                  <div key={i} style={{ padding: i > 0 ? '12px 0 0' : 0, borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}>
                    <LatexContent html={sq} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="task-body"><LatexContent html={task.question} /></div>
            )}
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

        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 4 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate(`${base}/map`)}>🗺️ 地图</button>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate(base)}>📊 仪表盘</button>
        </div>
      </div>

      {/* ── Sidebar Column (desktop) ── */}
      <div className="task-sidebar-col" style={{
        width: 230, flexShrink: 0, display: sidebarVisible ? 'block' : 'none',
      }}>
        <Sidebar base={base} />
      </div>
    </div>
  );
}
