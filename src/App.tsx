import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { AppShell } from './shared/components/layout/AppShell';
import { RequireAuth } from './shared/auth/RequireAuth';
import { LandingPage } from './features/landing/LandingPage';
import { LoginPage } from './features/auth/LoginPage';
import { NotFoundPage } from './features/errors/NotFoundPage';
import { LegalPage } from './features/legal/LegalPage';
import { OnboardingPage } from './features/onboarding/OnboardingPage';
import { OccupationSearchPage } from './features/occupations/OccupationSearchPage';
import { OccupationDetailPage } from './features/occupations/OccupationDetailPage';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { CareerMapPage } from './features/career-map/CareerMapPage';
import { EvidenceLedgerPage } from './features/evidence/EvidenceLedgerPage';
import { DocumentsPage } from './features/documents/DocumentsPage';
import { DocumentDetailPage } from './features/documents/DocumentDetailPage';
import { ProfilePage } from './features/profile/ProfilePage';
import { SettingsPage } from './features/settings/SettingsPage';
import { ActionsPage } from './features/actions/ActionsPage';
import { DecisionsPage } from './features/decisions/DecisionsPage';
import { RadarPage } from './features/radar/RadarPage';

export default function App() {
  const navigate = useNavigate();

  // Global 401 listener: redirect to login
  useEffect(() => {
    function handleUnauthorized() {
      navigate('/login');
    }
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [navigate]);

  return (
    <Routes>
      {/* Public pages */}
      <Route index element={<LandingPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="onboarding" element={<OnboardingPage />} />
      <Route path="occupations" element={<OccupationSearchPage />} />
      <Route path="occupations/:slug" element={<OccupationDetailPage />} />
      <Route path="terms" element={<LegalPage type="terms" />} />
      <Route path="privacy" element={<LegalPage type="privacy" />} />

      {/* Authenticated app pages */}
      <Route path="app" element={<RequireAuth><AppShell /></RequireAuth>}>
        <Route index element={<DashboardPage />} />
        <Route path="career-map" element={<CareerMapPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="profile/evidence" element={<EvidenceLedgerPage />} />
        <Route path="documents" element={<DocumentsPage />} />
        <Route path="documents/:id" element={<DocumentDetailPage />} />
        <Route path="actions" element={<ActionsPage />} />
        <Route path="decisions" element={<DecisionsPage />} />
        <Route path="radar" element={<RadarPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* 404 fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
