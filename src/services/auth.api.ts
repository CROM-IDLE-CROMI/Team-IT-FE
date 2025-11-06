import { apiRequest } from '../utils/api';
import type { SignupPayload, LoginPayload, refreshTokenPayload, AuthResponse } from './auth.types';

const EP = {
  SIGNUP: '/v1/auth/users',
  LOGIN: '/v1/auth/login',
  REFRESH: '/v1/auth/refresh-token',   // 서버 경로에 맞게 필요 시 수정
  LOGOUT: '/v1/auth/logout',
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
      body,
      requireAuth: false,
    });
  },

  // 로그아웃
  logout() {
    return apiRequest<void>(EP.LOGOUT, { method: 'POST', requireAuth: true });
  },
};
