// src/context/AuthContext.tsx
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { apiAuth } from '../services/auth.api';
import type {
  AuthResponse,
  AuthUser,
  LoginPayload,
  SignupPayload,
} from '../services/auth.types';
import { injectAuthHelpers } from '../utils/api';

// ─────────────────────────────────────────────
// LocalStorage Keys
// ─────────────────────────────────────────────
const ACCESS_KEY = 'accessToken';
const REFRESH_KEY = 'refreshToken';
const USER_KEY = 'authUser';
const LEGACY_LOGIN_FLAG = 'isLoggedIn';

// ─────────────────────────────────────────────
// Context Types
// ─────────────────────────────────────────────
type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;

  signup: (body: SignupPayload) => Promise<void>;
  login: (body: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshOnce: () => Promise<boolean>; // ← 변경

  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ─────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────
export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // refresh 동시 호출 방지 (진행 중인 Promise 재사용)
  const refreshingRef = useRef<Promise<boolean> | null>(null);

  // 세션 저장/삭제
  const saveSession = useCallback((res: AuthResponse) => {
    if (res.user) {
      setUser(res.user);
      localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    }
    if (res.accessToken) {
      setAccessToken(res.accessToken);
      localStorage.setItem(ACCESS_KEY, res.accessToken);
    }
    if (res.refreshToken) {
      setRefreshToken(res.refreshToken);
      localStorage.setItem(REFRESH_KEY, res.refreshToken);
    }
    localStorage.setItem(LEGACY_LOGIN_FLAG, 'true'); // 호환 플래그
  }, []);

  const clearSession = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);

    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(LEGACY_LOGIN_FLAG);
  }, []);

  // 앱 시작 시 저장된 세션 부트스트랩
  useEffect(() => {
    (async () => {
      try {
        const u = localStorage.getItem(USER_KEY);
        const at = localStorage.getItem(ACCESS_KEY);
        const rt = localStorage.getItem(REFRESH_KEY);

        if (u) setUser(JSON.parse(u));
        if (at) setAccessToken(at);
        if (rt) setRefreshToken(rt);

        // accessToken은 없고 refreshToken만 있으면 즉시 재발급 시도
        if (!at && rt) {
          try {
            const r = await apiAuth.refresh({ refreshToken: rt });
            if (r) saveSession(r);
          } catch {
            clearSession();
          }
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [saveSession, clearSession]);

  // ─────────────────────────────────────────
  // Actions
  // ─────────────────────────────────────────
  const signup = useCallback(
    async (body: SignupPayload) => {
      const res = await apiAuth.signup(body);
      // 서버가 회원가입 즉시 세션을 안줄 수도 있으므로, 토큰이 있을 때만 저장
      if (res?.accessToken || res?.refreshToken || res?.user) saveSession(res);
    },
    [saveSession]
  );

  const login = useCallback(
    async (body: LoginPayload) => {
      const res = await apiAuth.login(body);
      saveSession(res);
    },
    [saveSession]
  );

  const logout = useCallback(async () => {
    try {
      // 서버 스펙에 맞춰 refreshToken 전달(Optional)
      await apiAuth.logout(refreshToken ? { refreshToken } : undefined);
    } catch {
      // 서버 실패해도 클라 세션은 정리
    } finally {
      clearSession();
    }
  }, [refreshToken, clearSession]);

  /** 401 대응: 1회 리프레시 (true=성공, false=실패) */
  const refreshOnce = useCallback(async (): Promise<boolean> => {
    // 이미 진행 중이면 그 Promise 반환
    if (refreshingRef.current) return refreshingRef.current;
    if (!refreshToken) {
      clearSession();
      return false;
    }

    const p = (async () => {
      try {
        const r = await apiAuth.refresh({ refreshToken });
        if (r) saveSession(r);
        return true;
      } catch {
        clearSession();
        return false;
      } finally {
        refreshingRef.current = null;
      }
    })();

    refreshingRef.current = p;
    return p;
  }, [refreshToken, saveSession, clearSession]);

  // utils/api.ts에 Bearer용 헬퍼 주입
  useEffect(() => {
    injectAuthHelpers({
      getAccessToken: () => localStorage.getItem(ACCESS_KEY),
      refreshOnce, // ← 변경
      logout,
    });
  }, [refreshOnce, logout]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!accessToken, // user 로딩 전이라도 토큰 있으면 인증 상태로 간주
      loading,
      signup,
      login,
      logout,
      refreshOnce,
      setUser,
    }),
    [user, accessToken, loading, signup, login, logout, refreshOnce]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
};
