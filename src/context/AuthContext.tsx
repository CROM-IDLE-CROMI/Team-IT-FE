// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { apiAuth, type AuthUser } from '../services/auth.api';
import type { LoginPayload, SignupPayload } from '../services/auth.types';

type Ctx = {
  user: AuthUser | null;
  loading: boolean;
  login: (p: LoginPayload) => Promise<void>;
  signup: (p: SignupPayload) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // 앱 시작 시 세션 복구(/me가 없으면 이 블록 지워도 됨)
  useEffect(() => {
      try {
        const token = localStorage.getItem('accessToken');
      } finally {
        setLoading(false);
      }
  }, []);

  const afterAuth = useCallback((r: { accessToken: string; refreshToken?: string; user: AuthUser }) => {
    localStorage.setItem('accessToken', r.accessToken);
    if (r.refreshToken) localStorage.setItem('refreshToken', r.refreshToken);
    localStorage.setItem('isLoggedIn', 'true'); // 기존 Header 호환
    setUser(r.user);
  }, []);

  const doLogin = useCallback(async (p: LoginPayload) => {
    const r = await apiAuth.login(p);
    afterAuth(r);
  }, [afterAuth]);

  const doSignup = useCallback(async (p: SignupPayload) => {
    const r = await apiAuth.signup(p);
    afterAuth(r);
  }, [afterAuth]);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.setItem('isLoggedIn', 'false');
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login: doLogin, signup: doSignup, logout }),
    [user, loading, doLogin, doSignup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};