import { useLocation } from 'react-router-dom';
import { useProgressStore } from '../../store/useProgressStore';

export default function MobileBreadcrumb() {
  const chapterId = useProgressStore(s => s.chapterId);
  const chapterTitle = useProgressStore(s => s.chapterTitle);
  const location = useLocation();
  const inChapter = location.pathname.includes('/chapter/') && chapterTitle;

  const pathMatch = location.pathname.match(/\/stage\/([^/]+)\/subject\/([^/]+)/);
  const stageMap: Record<string, string> = { foundation: '下界筑基', spirit: '灵域试炼', heaven: '天庭问道' };
  const subjectMap: Record<string, string> = { math: '高等数学', linear: '线性代数', probability: '概率论与数理统计' };
  const stageLabel = pathMatch ? (stageMap[pathMatch[1]] || pathMatch[1]) : '下界筑基';
  const subjectLabel = pathMatch ? (subjectMap[pathMatch[2]] || pathMatch[2]) : '高等数学';

  if (!inChapter) return null;
  return (
    <div className="mobile-breadcrumb">
      <span>{stageLabel}</span><span style={{ margin: '0 4px', color: 'var(--text3)' }}>/</span>
      <span>{subjectLabel}</span><span style={{ margin: '0 4px', color: 'var(--text3)' }}>/</span>
      <span className="current">第{chapterId}讲</span>
    </div>
  );
}
