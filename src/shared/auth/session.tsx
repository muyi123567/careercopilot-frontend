import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { createClientSessionId, type AccessMode, type MockScenario } from '../api/client';

interface AuthState {
  mode: AccessMode;
  token: string;
  mockScenario: MockScenario;
  sessionId: string;
  setMode: (mode: AccessMode) => void;
  setToken: (token: string) => void;
  setMockScenario: (s: MockScenario) => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<AccessMode>('demo');
  const [token, setToken] = useState('');
  const [mockScenario, setMockScenario] = useState<MockScenario>('ok');
  const sessionId = useMemo(() => createClientSessionId(), []);

  const value: AuthState = {
    mode,
    token,
    mockScenario,
    sessionId,
    setMode,
    setToken,
    setMockScenario,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth 必须在 AuthProvider 内使用');
  return ctx;
}
