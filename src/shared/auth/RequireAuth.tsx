/**
 * Route guard: redirects unauthenticated users to login.
 * Shows loading state while auth check is in progress.
 */
import type { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useCookieAuth } from './AuthContext';

export function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useCookieAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-paper">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-ink-200 border-t-accent-500" />
          <p className="text-sm text-ink-400">验证登录状态...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
