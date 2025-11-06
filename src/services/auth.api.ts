import { apiRequest } from '../utils/api';
import type { SignupPayload, LoginPayload, refreshTokenPayload } from './auth.types';

export interface AuthUser { uid: string; nickName: string; email: string };
export interface AuthResponse { user: AuthUser; accessToken: string; refreshToken?: string };

const EP = {
  SIGNUP: '/v1/auth/users',
  LOGIN: '/v1/auth/login',
  REFRESH: '/v1/auth/refresh-token',   // 서버 경로에 맞게 필요 시 수정
  UID_CHECK: '/v1/auth/users-uid-check',      // ?uid=
  EMAIL_CHECK: '/v1/auth/users-email-check',  // ?email=
} as const;

export const apiAuth = {
  signup(payload: SignupPayload) {
    return apiRequest<AuthResponse>(EP.SIGNUP, { method: 'POST', body: payload, requireAuth: false });
  },

  // 로그인 (서버 스펙: { uid, password })
  login(payload: LoginPayload) {
    return apiRequest<AuthResponse>(EP.LOGIN, { method: 'POST', body: payload, requireAuth: false });
  },

  // 토큰 재발급 (경로/응답 키는 서버에 맞춰 조정)
  refresh(body: refreshTokenPayload) {
    return apiRequest<{ accessToken: string; refreshToken?: string }>(EP.REFRESH, {
      method: 'POST',
      body: body,
      requireAuth: false,
    });
  },

  // (옵션) 중복 체크가 필요할 때만
  uidExists(uid: string) {
    return apiRequest<{ exists: boolean }>(`${EP.UID_CHECK}?uid=${encodeURIComponent(uid)}`, { method: 'GET', requireAuth: false });
  },
  emailExists(email: string) {
    return apiRequest<{ exists: boolean }>(`${EP.EMAIL_CHECK}?email=${encodeURIComponent(email)}`, { method: 'GET', requireAuth: false });
  },
};
