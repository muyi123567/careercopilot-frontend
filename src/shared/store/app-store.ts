import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type AppMode = 'demo' | 'real'

export type Timeframe = '3months' | '6months' | '1year' | '2years'

export interface StartFormData {
  occupation: string
  region?: string
  experience?: number
  timeframe?: Timeframe
}

interface AppState {
  mode: AppMode
  setMode: (mode: AppMode) => void
  startData: StartFormData | null
  setStartData: (data: StartFormData) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      mode: 'real',
      setMode: (mode) => {
        if (mode === 'demo') {
          localStorage.removeItem('cc_token')
          localStorage.removeItem('cc_uid')
        }
        set({ mode })
      },
      startData: null,
      setStartData: (data) => set({ startData: data }),
    }),
    { name: 'cc-app-store' },
  ),
)
