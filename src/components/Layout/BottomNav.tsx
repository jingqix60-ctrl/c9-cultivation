import { useNavigate, useLocation } from 'react-router-dom';
import { useProgressStore } from '../../store/useProgressStore';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const chapterId = useProgressStore(s => s.chapterId);
  const retryCount = useProgressStore(s => s.stats.retryCount ?? 0);
  const chapterTitle = useProgressStore(s => s.chapterTitle);

  const inChapter = location.pathname.includes('/chapter/') && chapterTitle;

  if (inChapter) {
    const items = [
      { path: `/chapter/${chapterId}/dashboard`, label: '仪表盘', icon: '📊' },
      { path: `/chapter/${chapterId}/map`, label: '地图', icon: '🗺️' },
      { path: `/chapter/${chapterId}/task`, label: '修炼', icon: '⚔️' },
      { path: `/chapter/${chapterId}/review`, label: '心魔本', icon: '📖' },
      { path: `/chapter/${chapterId}/knowledge`, label: '知识', icon: '📋' },
    ];
    return (
      <nav className="bottom-nav">
        {items.map(item => (
          <button key={item.path} className={`nav-item ${location.pathname.includes(item.path.split('/').slice(-2).join('/')) ? 'active' : ''}`}
            onClick={() => navigate(item.path)}>
            <span className="nav-icon">{item.icon}</span>
            <span style={{ display:'flex',alignItems:'center',gap:2 }}>
              {item.label}
              {item.label === '心魔本' && retryCount > 0 && (
                <span style={{ background:'var(--red)',color:'#fff',borderRadius:10,padding:'0 5px',fontSize:9,fontWeight:700,lineHeight:'16px' }}>{retryCount}</span>
              )}
            </span>
          </button>
        ))}
      </nav>
    );
  }

  const items = [
    { path: '/', label: '首页', icon: '🏠' },
    { path: '/stage/foundation', label: '阶段', icon: '📘' },
    { path: `/chapter/${chapterId || 10}/review`, label: '心魔', icon: '📖' },
    { path: '/import', label: '导入', icon: '📥' },
  ];
  return (
    <nav className="bottom-nav">
      {items.map(item => (
        <button key={item.path} className={`nav-item ${location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path)) ? 'active' : ''}`}
          onClick={() => navigate(item.path)}>
          <span className="nav-icon">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
