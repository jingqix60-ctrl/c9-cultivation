import { useNavigate, useLocation } from 'react-router-dom';
import { useProgressStore } from '../../store/useProgressStore';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const stats = useProgressStore(s => s.stats);
  const chapterTitle = useProgressStore(s => s.chapterTitle);
  const chapterId = useProgressStore(s => s.chapterId);
  const realm = stats.realm ?? { name: '炼气入门', className: 'realm-r0' };
  const inChapter = location.pathname.includes('/chapter/') && chapterTitle;

  return (
    <div className="header">
      <div className="header-icon">{inChapter ? '🗡️' : '🏠'}</div>
      <div className="header-info">
        <div className="header-title">
          {inChapter ? `第${chapterId}讲 · ${chapterTitle}` : 'C9 考研数学修炼系统'}
        </div>
        <div className="header-sub">
          {inChapter ? '张宇30讲主线 · 经典教辅融合' : '张宇30讲为主线 · 经典教辅为辅助'}
        </div>
      </div>
      {inChapter && <span className={`realm ${realm.className}`}>{realm.name}</span>}
      {location.pathname !== '/' && (
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>
          ← 返回
        </button>
      )}
    </div>
  );
}
