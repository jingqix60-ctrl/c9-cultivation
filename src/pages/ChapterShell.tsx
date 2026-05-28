import { useEffect } from 'react';
import { useParams, Outlet, useNavigate } from 'react-router-dom';
import { useProgressStore } from '../store/useProgressStore';
import { getChapterData } from '../utils/chapterLoader';

export default function ChapterShell() {
  const { chapterId: chapterIdParam, stageId, subjectId } = useParams<{
    chapterId: string;
    stageId?: string;
    subjectId?: string;
  }>();
  const navigate = useNavigate();
  const init = useProgressStore(s => s.init);
  const storeChapterId = useProgressStore(s => s.chapterId);

  const cid = parseInt(chapterIdParam ?? '10');

  useEffect(() => {
    if (isNaN(cid)) {
      navigate('/', { replace: true });
      return;
    }
    const data = getChapterData(cid);
    if (!data) {
      // 旧路由 fallback
      if (stageId && subjectId) {
        navigate(`/stage/${stageId}/subject/${subjectId}`, { replace: true });
      } else {
        navigate('/', { replace: true });
      }
      return;
    }
    init(cid, data);
  }, [cid]); // eslint-disable-line react-hooks/exhaustive-deps

  if (storeChapterId !== cid) {
    return (
      <div style={{ textAlign: 'center', padding: 40, color: 'var(--text2)' }}>
        加载章节中...
      </div>
    );
  }

  return <Outlet />;
}
