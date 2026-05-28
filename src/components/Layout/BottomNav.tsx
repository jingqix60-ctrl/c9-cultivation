import { useNavigate, useLocation } from 'react-router-dom';
import { useProgressStore } from '../../store/useProgressStore';

const BASE = '/c9-cultivation';

function NavIcon({ icon }: { icon: string }) {
  if (icon === 'xinmo') {
    return (
      <img src={`${BASE}/images/xinmo.jpg`} alt="心魔本"
        style={{ width: 22, height: 22, objectFit: 'cover', borderRadius: 3, background: '#F7F1E6' }} />
    );
  }
  if (icon === 'shouye') {
    return (
      <img src={`${BASE}/images/shouye.jpg`} alt="首页"
        style={{ width: 22, height: 22, objectFit: 'cover', borderRadius: 3 }} />
    );
  }
  return <span className="nav-icon">{icon}</span>;
}

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const chapterId = useProgressStore(s => s.chapterId);
  const retryCount = useProgressStore(s => s.stats.retryCount ?? 0);
  const chapterTitle = useProgressStore(s => s.chapterTitle);

  const inChapter = location.pathname.includes('/chapter/') && chapterTitle;

  if (inChapter) {
    const items = [
      { path: '/', label: '首页', icon: 'shouye' },
      { path: `/chapter/${chapterId}/task`, label: '修炼', icon: '⚔️' },
      { path: `/chapter/${chapterId}/review`, label: '心魔本', icon: 'xinmo' },
    ];
    const isActive = (path: string) => {
      if (path === '/') return location.pathname === '/';
      return location.pathname.includes(path.split('/').slice(-2).join('/'));
    };
    return (
      <nav className="bottom-nav">
        {items.map(item => (
          <button key={item.path} className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            onClick={() => navigate(item.path)}>
            <NavIcon icon={item.icon} />
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

  // 阶段/学科选择页：只有首页
  const isStageOrSubject = /^\/stage\//.test(location.pathname) && !location.pathname.includes('/chapter/');
  if (isStageOrSubject) {
    return (
      <nav className="bottom-nav">
        <button className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
          onClick={() => navigate('/')}>
          <NavIcon icon="shouye" />
          <span>首页</span>
        </button>
      </nav>
    );
  }

  // 首页极简导航：只保留 首页 / 心魔本
  const isHome = location.pathname === '/';
  if (isHome) {
    const items = [
      { path: '/', label: '首页', icon: 'shouye' },
      { path: `/chapter/${chapterId || 10}/review`, label: '心魔本', icon: 'xinmo' },
    ];
    return (
      <nav className="bottom-nav">
        {items.map(item => (
          <button key={item.path} className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}>
            <NavIcon icon={item.icon} />
            <span>
              {item.label}
              {item.label === '心魔本' && retryCount > 0 && (
                <span style={{ background:'var(--red)',color:'#fff',borderRadius:10,padding:'0 5px',fontSize:9,fontWeight:700,lineHeight:'16px',marginLeft:4 }}>{retryCount}</span>
              )}
            </span>
          </button>
        ))}
      </nav>
    );
  }

  const items = [
    { path: '/', label: '首页', icon: 'shouye' },
    { path: `/chapter/${chapterId || 10}/review`, label: '心魔', icon: 'xinmo' },
    { path: '/import', label: '导入', icon: '📥' },
  ];
  return (
    <nav className="bottom-nav">
      {items.map(item => (
        <button key={item.path} className={`nav-item ${location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path)) ? 'active' : ''}`}
          onClick={() => navigate(item.path)}>
          <NavIcon icon={item.icon} />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
