import { Outlet } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';
import RewardToast from '../Task/RewardToast';

export default function AppShell() {
  return (
    <div className="app-shell">
      <Header />
      <Outlet />
      <BottomNav />
      <RewardToast />
    </div>
  );
}
