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

import TaskPage from './components/Task/TaskPage';
import ReviewQueue from './components/Review/ReviewQueue';
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
          {/* 首页 — 三个阶段入口 */}
          <Route path="/" element={<HomePage />} />

          {/* 新路由结构：阶段 → 学科 → 章节 */}
          <Route path="/stage/:stageId" element={<StagePage />} />
          <Route path="/stage/:stageId/subject/:subjectId" element={<SubjectPage />} />
          <Route path="/stage/:stageId/subject/:subjectId/chapter/:chapterId/*" element={<ChapterShell />}>
            <Route index element={<TaskPage />} />
            <Route path="task" element={<TaskPage />} />
            <Route path="task/:taskId" element={<TaskPage />} />
            <Route path="review" element={<ReviewQueue />} />
            <Route path="report" element={<FinalReport />} />
          </Route>

          {/* 兼容旧路由：/chapter/:chapterId */}
          <Route path="/chapter/:chapterId/*" element={<ChapterShell />}>
            <Route index element={<TaskPage />} />
            <Route path="task" element={<TaskPage />} />
            <Route path="task/:taskId" element={<TaskPage />} />
            <Route path="review" element={<ReviewQueue />} />
            <Route path="report" element={<FinalReport />} />
          </Route>

          <Route path="/import" element={<ImportPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
