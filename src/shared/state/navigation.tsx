import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { CareerNavigationResponse, NavigationRequestInput } from '../api/contract';
import { postNavigation } from '../api/client';
import { useAuth } from '../auth/session';

export type RequestPhase = 'idle' | 'loading' | 'done' | 'error';

interface NavigationState {
  phase: RequestPhase;
  input: NavigationRequestInput | null;
  response: CareerNavigationResponse | null;
  error: string | null;
  submit: (input: NavigationRequestInput, opts?: { mockScenario?: Parameters<typeof postNavigation>[1]['mockScenario'] }) => Promise<void>;
  reset: () => void;
  addToCompare: (pathId: string) => void;
  compareIds: string[];
}

const NavigationContext = createContext<NavigationState | null>(null);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const { mode, token, mockScenario } = useAuth();
  const [phase, setPhase] = useState<RequestPhase>('idle');
  const [input, setInput] = useState<NavigationRequestInput | null>(null);
  const [response, setResponse] = useState<CareerNavigationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  const submit: NavigationState['submit'] = useCallback(
    async (reqInput, opts) => {
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      setPhase('loading');
      setError(null);
      setInput(reqInput);
      setCompareIds([]);
      try {
        const res = await postNavigation(reqInput, {
          mode,
          token,
          mockScenario: opts?.mockScenario ?? mockScenario,
          signal: ctrl.signal,
        });
        setResponse(res);
        setPhase('done');
      } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') return;
        setError(e instanceof Error ? e.message : String(e));
        setPhase('error');
      }
    },
    [mode, token, mockScenario],
  );

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setPhase('idle');
    setInput(null);
    setResponse(null);
    setError(null);
    setCompareIds([]);
  }, []);

  const addToCompare = useCallback((pathId: string) => {
    setCompareIds((prev) => (prev.includes(pathId) ? prev : [...prev, pathId].slice(0, 3)));
  }, []);

  return (
    <NavigationContext.Provider
      value={{ phase, input, response, error, submit, reset, addToCompare, compareIds }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation(): NavigationState {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error('useNavigation 必须在 NavigationProvider 内使用');
  return ctx;
}
