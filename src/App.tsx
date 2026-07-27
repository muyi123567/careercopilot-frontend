import { Routes, Route } from 'react-router-dom';
import { MatrixLandingPage } from './features/matrix/MatrixLandingPage';
import { AuthPage } from './features/auth/AuthPage';
import { RequireAuth } from './shared/auth/RequireAuth';
import { MapPage } from './features/career-map/MapPage';
import { ComparePage } from './features/path-compare/ComparePage';
import { EvidencePage } from './features/evidence/EvidencePage';
import { ActionsPage } from './features/actions/ActionsPage';

export default function App() {
  return (
    <Routes>
      {/* 公开路由：匿名 Demo */}
      <Route path="/" element={<MatrixLandingPage />} />
      <Route path="/auth" element={<AuthPage />} />

      {/* 账户态路由：需登录 */}
      <Route path="/dashboard" element={<RequireAuth><MapPage /></RequireAuth>} />
      <Route path="/compare" element={<RequireAuth><ComparePage /></RequireAuth>} />
      <Route path="/evidence" element={<RequireAuth><EvidencePage /></RequireAuth>} />
      <Route path="/actions" element={<RequireAuth><ActionsPage /></RequireAuth>} />
    </Routes>
  );
}
