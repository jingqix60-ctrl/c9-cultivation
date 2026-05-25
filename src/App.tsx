import { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { useProgressStore } from './store/useProgressStore';
import { chapter10Data } from './data/math/zhangyu30/chapter10';
import AppShell from './components/Layout/AppShell';
import HomePage from './pages/HomePage';
import StagePage from './pages/StagePage';
import SubjectPage from './pages/SubjectPage';
import ChapterShell from './pages/ChapterShell';
import ImportPage from './pages/ImportPage';
import Dashboard from './components/Dashboard/Dashboard';
import ChapterMap from './components/ChapterMap/ChapterMap';
import TaskPage from './components/Task/TaskPage';
import ReviewQueue from './components/Review/ReviewQueue';
import KnowledgeMatrix from './components/Knowledge/KnowledgeMatrix';
import FinalReport from './components/Report/FinalReport';

export default function App() {
  const init = useProgressStore(s => s.init);

  useEffect(() => {
    init(10, chapter10Data);
  }, [init]);

  return (
    <HashRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/stage/:stageId" element={<StagePage />} />
          <Route path="/stage/:stageId/:subjectId" element={<SubjectPage />} />
          <Route path="/chapter/:chapterId/*" element={<ChapterShell />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="map" element={<ChapterMap />} />
            <Route path="task" element={<TaskPage />} />
            <Route path="task/:taskId" element={<TaskPage />} />
            <Route path="review" element={<ReviewQueue />} />
            <Route path="knowledge" element={<KnowledgeMatrix />} />
            <Route path="report" element={<FinalReport />} />
          </Route>
          <Route path="/import" element={<ImportPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
