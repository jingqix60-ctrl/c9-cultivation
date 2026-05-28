import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { STAGES, SUBJECTS } from '../data/stages';
import { useProgressStore } from '../store/useProgressStore';
import { getAllChapters } from '../data/math/zhangyu30';

const subjectIcons: Record<string, string> = {
  math: '📐',
  linear: '📊',
  probability: '🎲',
};

export default function SubjectPage() {
  const { stageId, subjectId } = useParams<{ stageId: string; subjectId: string }>();
  const navigate = useNavigate();
  const setStageContext = useProgressStore(s => s.setStageContext);
  const stage = STAGES.find(s => s.id === stageId);
  const subject = SUBJECTS.find(s => s.stageId === stageId && s.id === subjectId);
  const allChapters = getAllChapters();

  // 设置当前阶段+学科信息供左侧栏使用
  useEffect(() => {
    if (stageId) setStageContext(stageId, subjectId);
  }, [stageId, subjectId, setStageContext]);

  if (!subject || !stage) {
    return (
      <div className="anim-in" style={{ textAlign: 'center', padding: 48 }}>
        <p style={{ color: 'var(--text2)' }}>学科不存在。</p>
        <button className="btn btn-ghost btn-sm" style={{ marginTop: 12 }} onClick={() => navigate('/')}>
          返回首页
        </button>
      </div>
    );
  }

  if (subject.locked) {
    return (
      <div className="anim-in" style={{ textAlign: 'center', padding: 48 }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
        <h3 style={{ fontFamily: 'var(--font-title)', color: 'var(--text2)' }}>{subject.name} · 即将开启</h3>
        <p style={{ color: 'var(--text3)', fontSize: 13, marginTop: 4 }}>敬请期待</p>
        <button className="btn btn-ghost btn-sm" style={{ marginTop: 14 }} onClick={() => navigate(`/stage/${stageId}`)}>
          ← 返回
        </button>
      </div>
    );
  }

  // 只显示当前阶段+当前学科下张宇30讲的章节目录
  const zhangyuChapters = allChapters.filter(
    ch => ch.book === '张宇30讲' && ch.subjectId === subjectId && ch.stageId === stageId
  );

  return (
    <div className="anim-in" style={{ padding: '16px 0 8px' }}>
      {/* 面包屑 + 标题 */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 4 }}>
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>首页</span>
          <span style={{ margin: '0 6px' }}>/</span>
          <span style={{ cursor: 'pointer' }} onClick={() => navigate(`/stage/${stageId}`)}>{stage.name}</span>
          <span style={{ margin: '0 6px' }}>/</span>
          <span style={{ color: 'var(--accent)' }}>{subject.name}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 28, lineHeight: 1 }}>{subjectIcons[subject.id] || '📚'}</span>
          <div>
            <h1 style={{ fontFamily: 'var(--font-title)', fontSize: 20, color: 'var(--accent)', fontWeight: 600, margin: 0, letterSpacing: '0.04em' }}>
              {subject.name}{stage && stage.id === 'foundation' ? '筑基' : stage?.id === 'spirit' ? '试炼' : '问道'}篇
            </h1>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>
              共 {zhangyuChapters.length} 讲 · {zhangyuChapters.filter(c => c.status === 'available').length} 讲已录入
            </div>
          </div>
        </div>
      </div>

      {/* 章节目录 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {zhangyuChapters.map(ch => {
          const isAvailable = ch.status === 'available';
          return (
            <button
              key={ch.chapterId}
              className={`stage-node-btn ${!isAvailable ? 'locked' : ''}`}
              disabled={!isAvailable}
              onClick={() => navigate(`/stage/${stageId}/subject/${subjectId}/chapter/${ch.chapterId}/task`)}
              style={{ padding: '14px 16px' }}
            >
              <div className="stage-icon" style={{
                background: isAvailable ? 'var(--accent-soft)' : 'var(--surface3)',
              }}>
                {isAvailable ? '📖' : '🔒'}
              </div>
              <div className="stage-body">
                <div className="st-name" style={{ fontSize: 14 }}>
                  第{ch.chapterNumber}讲：{ch.chapterTitle}
                </div>
                <div className="st-meta" style={{ fontSize: 11, marginTop: 2 }}>
                  {isAvailable
                    ? `${ch.taskCount} 题 · ${ch.description || ''}`
                    : '待录入'}
                </div>
              </div>
              <span style={{ color: 'var(--text3)', fontSize: 13 }}>
                {isAvailable ? '→' : '—'}
              </span>
            </button>
          );
        })}
      </div>

      {/* 底部操作 */}
      <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/stage/${stageId}`)}>
          ← 返回
        </button>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/import')}>
          📥 导入章节
        </button>
      </div>
    </div>
  );
}
