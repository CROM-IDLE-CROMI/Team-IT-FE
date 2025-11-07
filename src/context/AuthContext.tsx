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
  refresh: () => Promise<void>;

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

  // refresh 동시 호출 방지
  const refreshingRef = useRef<Promise<void> | null>(null);

  // 세션 저장/삭제
  const saveSession = useCallback((res: AuthResponse) => {
    setUser(res.user);
    setAccessToken(res.accessToken ?? null);
    setRefreshToken(res.refreshToken ?? null);

    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    if (res.accessToken) localStorage.setItem(ACCESS_KEY, res.accessToken);
    if (res.refreshToken) localStorage.setItem(REFRESH_KEY, res.refreshToken);

    // 호환용: 예전 컴포넌트가 참조할 수 있도록
    localStorage.setItem(LEGACY_LOGIN_FLAG, 'true');
  }, []);

  const clearSession = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);

    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);

    // 호환용
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

        // accessToken은 없고 refreshToken만 있으면 즉시 재발급 시도
        if (!at && rt) {
          try {
            const r = await apiAuth.refresh({ refreshToken: rt });
            if (r?.accessToken) {
              setAccessToken(r.accessToken);
              localStorage.setItem(ACCESS_KEY, r.accessToken);
            }
            if (r?.refreshToken) {
              setRefreshToken(r.refreshToken);
              localStorage.setItem(REFRESH_KEY, r.refreshToken);
            }
            localStorage.setItem(LEGACY_LOGIN_FLAG, 'true'); // 호환 플래그
          } catch {
            // refresh 실패 시 세션 클리어
            clearSession();
          }
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [clearSession]);

  // ─────────────────────────────────────────
  // Actions
  // ─────────────────────────────────────────
  const signup = useCallback(
    async (body: SignupPayload) => {
      const res = await apiAuth.signup(body);
      // 서버가 회원가입 즉시 세션을 줄 수도/안 줄 수도 있으니, accessToken 있는 경우만 저장
      if (res?.accessToken) saveSession(res);
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
      await apiAuth.logout(); // POST /v1/auth/logout (Authorization 필요)
    } catch {
      // 서버 실패해도 클라 세션은 정리
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const refresh = useCallback(async () => {
    // 이미 진행 중이면 해당 Promise 재사용
    if (refreshingRef.current) return refreshingRef.current;
    if (!refreshToken) {
      clearSession();
      return;
    }

    refreshingRef.current = (async () => {
      try {
        // POST /v1/auth/refresh { refreshToken }
        const r = await apiAuth.refresh({ refreshToken });
        if (r?.accessToken) {
          setAccessToken(r.accessToken);
          localStorage.setItem(ACCESS_KEY, r.accessToken);
        }
        if (r?.refreshToken) {
          setRefreshToken(r.refreshToken);
          localStorage.setItem(REFRESH_KEY, r.refreshToken);
        }
      } catch (e) {
        // 재발급 실패 → 세션 종료
        clearSession();
        throw e;
      } finally {
        refreshingRef.current = null;
      }
    })();

    return refreshingRef.current;
  }, [refreshToken, clearSession]);

  // ── api 래퍼에 헬퍼 주입 (경고 해결: deps 포함)
  useEffect(() => {
    injectAuthHelpers({
      getAccessToken: () => localStorage.getItem(ACCESS_KEY),
      refresh: async () => { await refresh(); },
      logout:  async () => { await logout();  },
    });
  }, [refresh, logout]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user && !!accessToken,
      loading,
      signup,
      login,
      logout,
      refresh,
      setUser,
    }),
    [user, accessToken, loading, signup, login, logout, refresh]
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
