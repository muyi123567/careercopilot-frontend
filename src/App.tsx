import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router';
import { AppShell } from './shared/components/layout/AppShell';
import { RequireAuth } from './shared/auth/RequireAuth';
import { RouteFallback } from './shared/components/RouteFallback';

// Lazy-loaded pages (named export -> default adapter)
const LandingPage = lazy(() => import('./features/landing/LandingPage').then(m => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('./features/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const WorkspacePage = lazy(() => import('./features/workspace/WorkspacePage').then(m => ({ default: m.WorkspacePage })));
const ResultsPage = lazy(() => import('./features/results/ResultsPage').then(m => ({ default: m.ResultsPage })));
const ForgotPasswordPage = lazy(() => import('./features/auth/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('./features/auth/ResetPasswordPage').then(m => ({ default: m.ResetPasswordPage })));
const VerifyEmailPage = lazy(() => import('./features/auth/VerifyEmailPage').then(m => ({ default: m.VerifyEmailPage })));
const NotFoundPage = lazy(() => import('./features/errors/NotFoundPage').then(m => ({ default: m.NotFoundPage })));
const ForbiddenPage = lazy(() => import('./features/errors/HttpErrorPage').then(m => ({ default: m.ForbiddenPage })));
const RateLimitedPage = lazy(() => import('./features/errors/HttpErrorPage').then(m => ({ default: m.RateLimitedPage })));
const ServiceUnavailablePage = lazy(() => import('./features/errors/HttpErrorPage').then(m => ({ default: m.ServiceUnavailablePage })));
const LegalPage = lazy(() => import('./features/legal/LegalPage').then(m => ({ default: m.LegalPage })));
const OnboardingPage = lazy(() => import('./features/onboarding/OnboardingPage').then(m => ({ default: m.OnboardingPage })));
const OccupationSearchPage = lazy(() => import('./features/occupations/OccupationSearchPage').then(m => ({ default: m.OccupationSearchPage })));
const OccupationDetailPage = lazy(() => import('./features/occupations/OccupationDetailPage').then(m => ({ default: m.OccupationDetailPage })));
const DashboardPage = lazy(() => import('./features/dashboard/DashboardPage').then(m => ({ default: m.DashboardPage })));
const CareerMapPage = lazy(() => import('./features/career-map/CareerMapPage').then(m => ({ default: m.CareerMapPage })));
const EvidenceLedgerPage = lazy(() => import('./features/evidence/EvidenceLedgerPage').then(m => ({ default: m.EvidenceLedgerPage })));
const DocumentsPage = lazy(() => import('./features/documents/DocumentsPage').then(m => ({ default: m.DocumentsPage })));
const DocumentDetailPage = lazy(() => import('./features/documents/DocumentDetailPage').then(m => ({ default: m.DocumentDetailPage })));
const ProfilePage = lazy(() => import('./features/profile/ProfilePage').then(m => ({ default: m.ProfilePage })));
const SettingsPage = lazy(() => import('./features/settings/SettingsPage').then(m => ({ default: m.SettingsPage })));
const ActionsPage = lazy(() => import('./features/actions/ActionsPage').then(m => ({ default: m.ActionsPage })));
const CheckinPage = lazy(() => import('./features/actions/CheckinPage').then(m => ({ default: m.CheckinPage })));
const DecisionsPage = lazy(() => import('./features/decisions/DecisionsPage').then(m => ({ default: m.DecisionsPage })));
const RadarPage = lazy(() => import('./features/radar/RadarPage').then(m => ({ default: m.RadarPage })));
const PathsNewPage = lazy(() => import('./features/paths/PathsNewPage').then(m => ({ default: m.PathsNewPage })));
const AssistantPage = lazy(() => import('./features/assistant/AssistantPage').then(m => ({ default: m.AssistantPage })));
const MemoryPage = lazy(() => import('./features/memory/MemoryPage').then(m => ({ default: m.MemoryPage })));
const CreditsHistoryPage = lazy(() => import('./features/credits/CreditsHistoryPage').then(m => ({ default: m.CreditsHistoryPage })));
const SubscriptionPage = lazy(() => import('./features/subscription/SubscriptionPage').then(m => ({ default: m.SubscriptionPage })));

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

  // Global api:error listener: navigate to the matching error page so the user
  // sees a clear prompt for 403 (no permission), 429 (rate limit), 503 (down).
  useEffect(() => {
    function handleApiError(e: Event) {
      const status = (e as CustomEvent<{ status?: number }>).detail?.status;
      if (status === 403) navigate('/403');
      else if (status === 429) navigate('/429');
      else if (status === 503) navigate('/503');
    }
    window.addEventListener('api:error', handleApiError);
    return () => window.removeEventListener('api:error', handleApiError);
  }, [navigate]);

  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        {/* Public pages */}
        <Route index element={<LandingPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="workspace" element={<WorkspacePage />} />
        <Route path="results" element={<RequireAuth><ResultsPage /></RequireAuth>} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="verify-email" element={<VerifyEmailPage />} />
        <Route path="onboarding" element={<OnboardingPage />} />
        <Route path="occupations" element={<OccupationSearchPage />} />
        <Route path="occupations/:slug" element={<OccupationDetailPage />} />
        <Route path="terms" element={<LegalPage type="terms" />} />
        <Route path="privacy" element={<LegalPage type="privacy" />} />

        {/* Error pages */}
        <Route path="403" element={<ForbiddenPage />} />
        <Route path="429" element={<RateLimitedPage />} />
        <Route path="503" element={<ServiceUnavailablePage />} />

        {/* Authenticated app pages */}
        <Route path="app" element={<RequireAuth><AppShell /></RequireAuth>}>
          <Route index element={<DashboardPage />} />
          <Route path="career-map" element={<CareerMapPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="profile/evidence" element={<EvidenceLedgerPage />} />
          <Route path="documents" element={<DocumentsPage />} />
          <Route path="documents/:id" element={<DocumentDetailPage />} />
          <Route path="actions" element={<ActionsPage />} />
          <Route path="check-ins/:id" element={<CheckinPage />} />
          <Route path="decisions" element={<DecisionsPage />} />
          <Route path="radar" element={<RadarPage />} />
          <Route path="paths/new" element={<PathsNewPage />} />
          <Route path="assistant" element={<AssistantPage />} />
          <Route path="memory" element={<MemoryPage />} />
          <Route path="credits/history" element={<CreditsHistoryPage />} />
          <Route path="subscription" element={<SubscriptionPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* 404 fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
