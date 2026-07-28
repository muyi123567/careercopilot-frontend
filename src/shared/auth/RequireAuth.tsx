/**
 * 路由守卫：未登录用户重定向到登录页。
 */
import type { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useJwtAuth } from './AuthContext';

export function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useJwtAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}
