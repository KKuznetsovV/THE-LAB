import type { ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bindUnauthorized, identityHttp } from '../../../services/auth-aware/clients';
import { AdminAuthContext, type AdminAuthValue } from './admin-context';
import { clearToken, loadToken, readSession, storeToken } from './session';

export default function AdminAuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(loadToken);
  const user = useMemo(() => (token ? readSession(token) : null), [token]);

  const logout = useCallback(() => {
    clearToken();
    setToken(null);
    navigate('/admin/login', { replace: true });
  }, [navigate]);

  const accept = useCallback((jwt: string) => {
    if (!readSession(jwt)) throw new Error('invalid email or password');
    storeToken(jwt);
    setToken(jwt);
  }, []);

  useEffect(() => {
    bindUnauthorized(logout);
  }, [logout]);

  useEffect(() => {
    if (!user) return;
    const delay = user.exp * 1000 - Date.now();
    const timer = window.setTimeout(() => logout(), Math.max(delay, 0));
    return () => window.clearTimeout(timer);
  }, [logout, user]);

  useEffect(() => {
    if (!token) return;
    void identityHttp.get('/api/auth/me').catch(() => undefined);
  }, [token]);

  const value = useMemo<AdminAuthValue>(() => ({ user, accept, logout }), [accept, logout, user]);

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}
