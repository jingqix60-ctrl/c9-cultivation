import { useNavigate, useLocation } from 'react-router-dom';
import { useProgressStore } from '../../store/useProgressStore';

const NAV_ITEMS = [
  { path: '/', label: '仪表盘', icon: '📊' },
  { path: '/map', label: '章节地图', icon: '🗺️' },
  { path: '/task', label: '修炼', icon: '⚔️' },
  { path: '/review', label: '心魔本', icon: '📖' },
  { path: '/knowledge', label: '知识矩阵', icon: '📋' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const retryCount = useProgressStore(s => s.stats.retryCount ?? 0);

  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map(item => {
        const isActive = location.pathname === item.path ||
          (item.path !== '/' && location.pathname.startsWith(item.path));
        return (
          <button
            key={item.path}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {item.label}
              {item.path === '/review' && retryCount > 0 && (
                <span style={{
                  background: 'var(--red)',
                  color: '#fff',
                  borderRadius: '10px',
                  padding: '0 5px',
                  fontSize: '9px',
                  fontWeight: 700,
                  lineHeight: '16px',
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
