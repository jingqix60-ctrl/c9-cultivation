import { useState, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useProgressStore } from '../../store/useProgressStore';
import Header from './Header';
import BottomNav from './BottomNav';
import LeftSidebar from './LeftSidebar';
import RightSidebar, { QuestionNav, TodayNotes, ChapterOps } from './RightSidebar';
import RewardToast from '../Task/RewardToast';
import { useWindowWidth } from '../../utils/useWindowWidth';

const LS_LEFT = 'c9_left_collapsed';
const LS_RIGHT = 'c9_right_collapsed';

export default function AppShell() {
  const width = useWindowWidth();
  const location = useLocation();
  const [leftCollapsed, setLeftCollapsed] = useState(() => localStorage.getItem(LS_LEFT) === '1');
  const [rightCollapsed, setRightCollapsed] = useState(() => localStorage.getItem(LS_RIGHT) === '1');
  const [tabletLeftOpen, setTabletLeftOpen] = useState(false);
  const [tabletRightOpen, setTabletRightOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'nav' | 'notes' | 'ops'>('nav');

  const isDesktop = width >= 1200;
  const isTablet = width >= 768 && width < 1200;

  const persist = useCallback((key: string, val: boolean) => {
    localStorage.setItem(key, val ? '1' : '0');
  }, []);

  // ═══ DESKTOP: Three-column grid ═══
  if (isDesktop) {
    const cls = [
      'app-shell',
      leftCollapsed && 'collapsed-left',
      rightCollapsed && 'collapsed-right',
    ].filter(Boolean).join(' ');

    return (
      <div className={cls}>
        <div className="shell-header"><Header /></div>
        <div className="shell-left">
          {!leftCollapsed && (
            <LeftSidebar onCollapse={() => { setLeftCollapsed(true); persist(LS_LEFT, true); }} />
          )}
          {leftCollapsed && (
            <button className="sidebar-toggle-btn" style={{ position: 'fixed', left: 8, top: 80, zIndex: 10 }}
              onClick={() => { setLeftCollapsed(false); persist(LS_LEFT, false); }}>▶</button>
          )}
        </div>
        <div className="shell-main"><Outlet /></div>
        <div className="shell-right">
          {!rightCollapsed && (
            <RightSidebar onCollapse={() => { setRightCollapsed(true); persist(LS_RIGHT, true); }} />
          )}
          {rightCollapsed && (
            <button className="sidebar-toggle-btn" style={{ position: 'fixed', right: 8, top: 80, zIndex: 10 }}
              onClick={() => { setRightCollapsed(false); persist(LS_RIGHT, false); }}>◀</button>
          )}
        </div>
        <BottomNav />
        <RewardToast />
      </div>
    );
  }

  // ═══ TABLET: Sidebars as slide-out drawers ═══
  if (isTablet) {
    const taskPage = location.pathname.includes('/task');
    const knowledgePage = location.pathname.includes('/knowledge');
    const rightLabel = taskPage ? '📝 题号' : knowledgePage ? '⚙️ 操作' : '📋 小札';

    return (
      <div className="app-shell">
        <div className="shell-header"><Header /></div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 6, padding: '0 12px' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setTabletLeftOpen(true)}>📖 修炼路径</button>
          <button className="btn btn-ghost btn-sm" onClick={() => setTabletRightOpen(true)}>{rightLabel}</button>
        </div>
        <div className="shell-main"><Outlet /></div>

        {tabletLeftOpen && <div className="sidebar-overlay" onClick={() => setTabletLeftOpen(false)} />}
        <div className={`shell-left ${tabletLeftOpen ? 'open' : ''}`}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
            <button className="sidebar-toggle-btn" onClick={() => setTabletLeftOpen(false)}>✕</button>
          </div>
          <LeftSidebar />
        </div>

        {tabletRightOpen && <div className="sidebar-overlay" onClick={() => setTabletRightOpen(false)} />}
        <div className={`shell-right ${tabletRightOpen ? 'open' : ''}`}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
            <button className="sidebar-toggle-btn" onClick={() => setTabletRightOpen(false)}>✕</button>
          </div>
          {taskPage ? <QuestionNav /> : knowledgePage ? <ChapterOps /> : <TodayNotes />}
        </div>

        <BottomNav />
        <RewardToast />
      </div>
    );
  }

  // ═══ MOBILE: Single column + bottom drawer ═══
  const taskPage = location.pathname.includes('/task');
  const knowledgePage = location.pathname.includes('/knowledge');

  return (
    <div className="app-shell">
      <div className="shell-header"><Header /></div>
      <MobileBreadcrumb />
      <div style={{ display: 'flex', gap: 6, marginBottom: 8, padding: '0 4px' }}>
        {taskPage && <button className="btn btn-ghost btn-sm" onClick={() => { setDrawerMode('nav'); setDrawerOpen(true); }}>📝 题号</button>}
        {knowledgePage && <button className="btn btn-ghost btn-sm" onClick={() => { setDrawerMode('ops'); setDrawerOpen(true); }}>⚙️ 操作</button>}
        <button className="btn btn-ghost btn-sm" onClick={() => { setDrawerMode('notes'); setDrawerOpen(true); }}>📋 小札</button>
      </div>
      <div className="shell-main"><Outlet /></div>

      {drawerOpen && <div className="sidebar-overlay" onClick={() => setDrawerOpen(false)} />}
      <div className={`bottom-drawer ${drawerOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontWeight: 700, fontSize: 12, color: 'var(--accent)' }}>
            {drawerMode === 'nav' ? '📝 题号导航' : drawerMode === 'ops' ? '⚙️ 本章操作' : '📋 今日小札'}
          </span>
          <button className="sidebar-toggle-btn" onClick={() => setDrawerOpen(false)}>✕</button>
        </div>
        {drawerMode === 'nav' ? <QuestionNav /> : drawerMode === 'ops' ? <ChapterOps /> : <TodayNotes />}
      </div>

      <BottomNav />
      <RewardToast />
    </div>
  );
}

// ── Mobile breadcrumb ──
function MobileBreadcrumb() {
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
