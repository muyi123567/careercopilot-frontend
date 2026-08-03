/**
 * Cookie-session auth hook backed by CookieAuthProvider.
 * Keeps the historical return shape (token/uid aliases) so callers stay in
 * sync with the same session state used by RequireAuth.
 */
import { useCallback } from 'react';
import { useCookieAuth } from '../../shared/auth/AuthContext';

interface UserInfo {
  user_id: string;
  status: string;
  display_name: string | null;
  email?: string;
}

export function useAuth() {
  const { user, isLoading, error, login, register, logout, isAuthenticated } = useCookieAuth();

  const safeLogin = useCallback(async (email: string, password: string) => {
    try {
      await login(email, password);
      return true;
    } catch {
      return false;
    }
  }, [login]);

  const safeRegister = useCallback(async (email: string, password: string) => {
    try {
      await register(email, password);
      return true;
    } catch {
      return false;
    }
  }, [register]);

  return {
    user: user as UserInfo | null,
    loading: isLoading,
    error,
    token: null, // backward compat
    uid: user?.user_id ?? null,
    login: safeLogin,
    register: safeRegister,
    logout,
    isAuthenticated,
  };
}
