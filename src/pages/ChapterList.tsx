import { useNavigate } from 'react-router-dom';
import { getAllChapters } from '../data/math/zhangyu30';

export default function ChapterList() {
  const navigate = useNavigate();
  const chapters = getAllChapters();

  return (
    <div className="anim-in">
      <h3 style={{ color: 'var(--purple)', marginBottom: 8, fontSize: 14 }}>
        📘 张宇30讲 · 章节目录
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
        {chapters.map(ch => {
          const available = ch.status === 'available';
          return (
            <button
              key={ch.chapterId}
              className={`stage-node ${available ? '' : 'locked'}`}
              onClick={() => available ? navigate(`/chapter/${ch.chapterId}`) : undefined}
              disabled={!available}
              style={available ? {} : {}}
            >
              <div className={`stage-icon ${available ? 'done' : ''}`}>
                {available ? '📖' : '🔒'}
              </div>
              <div className="stage-body">
                <div className="st-name">
                  第{ch.chapterNumber}讲：{ch.chapterTitle}
                </div>
                <div className="st-meta">
                  {available
                    ? `${ch.taskCount} 题 · ${ch.description}`
                    : '未录入'}
                </div>
              </div>
              <span style={{ color: 'var(--text2)', fontSize: 11 }}>
                {available ? '可进入 →' : '—'}
              </span>
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/math')}>
          ← 返回
        </button>
        <button className="btn btn-accent btn-sm" onClick={() => navigate('/import')}>
          📥 导入新章节
        </button>
      </div>
    </div>
  );
}
