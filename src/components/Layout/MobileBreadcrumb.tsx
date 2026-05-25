import { useLocation } from 'react-router-dom';
import { useProgressStore } from '../../store/useProgressStore';

export default function MobileBreadcrumb() {
  const chapterId = useProgressStore(s => s.chapterId);
  const chapterTitle = useProgressStore(s => s.chapterTitle);
  const location = useLocation();
  const inChapter = location.pathname.includes('/chapter/') && chapterTitle;
  if (!inChapter) return null;
  return (
    <div className="mobile-breadcrumb">
      <span>下界筑基</span><span style={{ margin: '0 4px', color: 'var(--text3)' }}>/</span>
      <span>高等数学</span><span style={{ margin: '0 4px', color: 'var(--text3)' }}>/</span>
      <span className="current">第{chapterId}讲</span>
    </div>
  );
}
