import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './shared/auth/session';
import { NavigationProvider } from './shared/state/navigation';
import { AppShell } from './shared/components/layout/AppShell';
import { HomePage } from './features/home/HomePage';
import { MapPage } from './features/career-map/MapPage';
import { ComparePage } from './features/path-compare/ComparePage';
import { EvidencePage } from './features/evidence/EvidencePage';
import { ActionsPage } from './features/actions/ActionsPage';
import { RadarPage } from './features/market-radar/RadarPage';
import { DecisionsPage } from './features/decisions/DecisionsPage';
import { PrivacyPage } from './features/privacy/PrivacyPage';

export default function App() {
  return (
    <AuthProvider>
      <NavigationProvider>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/evidence" element={<EvidencePage />} />
            <Route path="/actions" element={<ActionsPage />} />
            <Route path="/radar" element={<RadarPage />} />
            <Route path="/decisions" element={<DecisionsPage />} />
            <Route path="/settings/privacy" element={<PrivacyPage />} />
            <Route path="*" element={<HomePage />} />
          </Route>
        </Routes>
      </NavigationProvider>
    </AuthProvider>
  );
}
