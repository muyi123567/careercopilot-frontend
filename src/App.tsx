import { Routes, Route } from 'react-router-dom';
import { AppShell } from './shared/components/layout/AppShell';
import { LandingPage } from './features/landing/LandingPage';
import { WorkspacePage } from './features/workspace/WorkspacePage';
import { ResultsPage } from './features/results/ResultsPage';
import { LoginPage } from './features/auth/LoginPage';

export default function App() {
  return (
    <Routes>
      {/* 第一页：吸睛着陆页（全宽独立布局） */}
      {/* 登录页：全宽独立布局 */}
      <Route path="login" element={<LoginPage />} />
      <Route index element={<LandingPage />} />
      {/* 第二页 + 第三页：AppShell 布局 */}
      <Route element={<AppShell />}>
        <Route path="workspace" element={<WorkspacePage />} />
        <Route path="results" element={<ResultsPage />} />
      </Route>
    </Routes>
  );
}


