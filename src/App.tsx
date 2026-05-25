import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useProgressStore } from './store/useProgressStore';
import { chapter10Tasks } from './data/chapter10';
import AppShell from './components/Layout/AppShell';
import Dashboard from './components/Dashboard/Dashboard';
import ChapterMap from './components/ChapterMap/ChapterMap';
import TaskPage from './components/Task/TaskPage';
import ReviewQueue from './components/Review/ReviewQueue';
import KnowledgeMatrix from './components/Knowledge/KnowledgeMatrix';
import FinalReport from './components/Report/FinalReport';

function AppInit({ children }: { children: React.ReactNode }) {
  const init = useProgressStore(s => s.init);

  useEffect(() => {
    init(10, chapter10Tasks);
  }, [init]);

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInit>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/map" element={<ChapterMap />} />
            <Route path="/task" element={<TaskPage />} />
            <Route path="/task/:id" element={<TaskPage />} />
            <Route path="/review" element={<ReviewQueue />} />
            <Route path="/knowledge" element={<KnowledgeMatrix />} />
            <Route path="/report" element={<FinalReport />} />
          </Route>
        </Routes>
      </AppInit>
    </BrowserRouter>
  );
}
