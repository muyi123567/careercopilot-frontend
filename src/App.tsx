import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useAppStore } from '@/shared/store/app-store'
import { Layout } from '@/shared/ui/Layout'
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary'

const HomePage = lazy(() => import('@/routes/HomePage').then(m => ({ default: m.HomePage })))
const StartPage = lazy(() => import('@/routes/StartPage').then(m => ({ default: m.StartPage })))
const MapPage = lazy(() => import('@/routes/MapPage').then(m => ({ default: m.MapPage })))
const EvidencePage = lazy(() => import('@/routes/EvidencePage').then(m => ({ default: m.EvidencePage })))
const ComparePage = lazy(() => import('@/routes/ComparePage').then(m => ({ default: m.ComparePage })))
const DecisionPage = lazy(() => import('@/routes/DecisionPage').then(m => ({ default: m.DecisionPage })))
const ActionsPage = lazy(() => import('@/routes/ActionsPage').then(m => ({ default: m.ActionsPage })))
const RadarPage = lazy(() => import('@/routes/RadarPage').then(m => ({ default: m.RadarPage })))
const PrivacyPage = lazy(() => import('@/routes/PrivacyPage').then(m => ({ default: m.PrivacyPage })))

export default function App() {
  const mode = useAppStore((s) => s.mode)

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <div data-mode={mode} className="min-h-screen bg-(--canvas)">
          <Layout>
            <Suspense fallback={<div className="p-8 text-center text-(--muted)">加载中…</div>}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/start" element={<StartPage />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/evidence" element={<EvidencePage />} />
                <Route path="/compare" element={<ComparePage />} />
                <Route path="/decisions/:id" element={<DecisionPage />} />
                <Route path="/actions" element={<ActionsPage />} />
                <Route path="/radar" element={<RadarPage />} />
                <Route path="/settings/privacy" element={<PrivacyPage />} />
              </Routes>
            </Suspense>
          </Layout>
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  )
}
