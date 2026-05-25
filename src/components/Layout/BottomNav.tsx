import { useNavigate, useLocation } from 'react-router-dom';
import { useProgressStore } from '../../store/useProgressStore';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const chapterId = useProgressStore(s => s.chapterId);
  const retryCount = useProgressStore(s => s.stats.retryCount ?? 0);
  const chapterTitle = useProgressStore(s => s.chapterTitle);

  // Determine if we're in a chapter context
  const inChapter = location.pathname.includes('/chapter/') && chapterTitle;

  if (inChapter) {
    const NAV_ITEMS = [
      { path: `/chapter/${chapterId}`, label: '仪表盘', icon: '📊' },
      { path: `/chapter/${chapterId}/map`, label: '章节地图', icon: '🗺️' },
      { path: `/chapter/${chapterId}/task`, label: '修炼', icon: '⚔️' },
      { path: `/chapter/${chapterId}/review`, label: '心魔本', icon: '📖' },
      { path: `/chapter/${chapterId}/knowledge`, label: '知识矩阵', icon: '📋' },
    ];

    return (
      <nav className="bottom-nav">
        {NAV_ITEMS.map(item => {
          const isActive = location.pathname === item.path ||
            (item.path.includes('/task') && location.pathname.includes('/task'));
          return (
            <button
              key={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {item.label}
                {item.path.includes('review') && retryCount > 0 && (
                  <span style={{
                    background: 'var(--red)', color: '#fff', borderRadius: '10px',
                    padding: '0 5px', fontSize: '9px', fontWeight: 700, lineHeight: '16px',
                  }}>
                    {retryCount}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </nav>
    );
  }

  // Platform nav (not in a chapter)
  const NAV_ITEMS = [
    { path: '/', label: '首页', icon: '🏠' },
    { path: '/math', label: '数学', icon: '📐' },
    { path: '/import', label: '导入', icon: '📥' },
  ];

  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map(item => (
        <button
          key={item.path}
          className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          onClick={() => navigate(item.path)}
        >
          <span className="nav-icon">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
