import { Routes, Route } from 'react-router-dom';
import { AppShell } from './shared/components/layout/AppShell';
import { LandingPage } from './features/landing/LandingPage';
import { WorkspacePage } from './features/workspace/WorkspacePage';
import { ResultsPage } from './features/results/ResultsPage';
import { LoginPage } from './features/auth/LoginPage';
import { SettingsPage } from './features/settings/SettingsPage';
import { ProfilePage } from './features/profile/ProfilePage';
import { NotFoundPage } from './features/errors/NotFoundPage';
import { LegalPage } from './features/legal/LegalPage';
import { OnboardingPage } from './features/onboarding/OnboardingPage';
import { HistoryPage } from './features/history/HistoryPage';
import { CareerMapPage } from './features/career-map/CareerMapPage';
import { RadarPage } from './features/radar/RadarPage';

export default function App() {
  return (
    <Routes>
      {/* 全宽独立布局页面 */}
      <Route index element={<LandingPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="onboarding" element={<OnboardingPage />} />
      <Route path="terms" element={<LegalPage type="terms" />} />
      <Route path="privacy" element={<LegalPage type="privacy" />} />
      <Route path="404" element={<NotFoundPage />} />

      {/* AppShell 布局页面 */}
      <Route element={<AppShell />}>
        <Route path="workspace" element={<WorkspacePage />} />
        <Route path="results" element={<ResultsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="career-map" element={<CareerMapPage />} />
        <Route path="radar" element={<RadarPage />} />
      </Route>

      {/* 404 兜底 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
