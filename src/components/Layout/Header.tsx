import { useNavigate, useLocation } from 'react-router-dom';
import { useProgressStore } from '../../store/useProgressStore';
import { chapter10Meta } from '../../data/chapter10';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const stats = useProgressStore(s => s.stats);
  const realm = stats.realm ?? { name: '炼气入门', className: 'realm-r0' };
  const isHome = location.pathname === '/';

  return (
    <div className="header">
      <div className="header-icon">{isHome ? '🗡️' : '⬅️'}</div>
      <div className="header-info">
        <div className="header-title">{chapter10Meta.subtitle}</div>
        <div className="header-sub">
          张宇30讲主线 · 四辅融合 · C9征服系统
        </div>
      </div>
      <span className={`realm ${realm.className}`}>{realm.name}</span>
      {!isHome && (
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/')}>
          返回
        </button>
      )}
    </div>
  );
}
