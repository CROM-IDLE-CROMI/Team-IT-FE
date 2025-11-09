// src/services/auth.api.ts
import { apiRequest } from '../utils/api';
import type {
  SignupPayload,
  LoginPayload,
  AuthResponse,
  refreshTokenPayload as RefreshPayload, // 네 타입 이름 그대로 사용
} from './auth.types';

// 서버 응답 예시:
// { success:true, message:"200", code:"success", data:{ accessToken, tokenType, expiresIn, refreshToken, uid } }
const normalizeAuth = (raw: any): AuthResponse => {
  const d = raw?.data ?? raw;

  const accessToken =
    d?.accessToken ?? raw?.accessToken ?? raw?.data?.access_token ?? raw?.access_token;

  const refreshToken =
    d?.refreshToken ?? raw?.refreshToken ?? raw?.data?.refresh_token ?? raw?.refresh_token;

  // 네 타입에서 user가 필수이므로, uid만 있을 때 최소 user를 합성
  const uid = d?.uid ?? raw?.uid ?? raw?.data?.uid ?? '';
  const user = { uid, nickName: uid || '', email: '' };

  return {
    user,
    accessToken: accessToken ?? undefined,
    refreshToken: refreshToken ?? undefined,
  };
};

const EP = {
  SIGNUP:  '/v1/auth/users',
  LOGIN:   '/v1/auth/login',
  REFRESH: '/v1/auth/refresh-token',
  LOGOUT:  '/v1/auth/logout',
} as const;

export const apiAuth = {
  signup(payload: SignupPayload) {
    // 비인증, 쿠키 미사용
    return apiRequest<any>(EP.SIGNUP, {
      method: 'POST',
      body: payload,
      requireAuth: false,
    }).then(normalizeAuth);
  },

  login(payload: LoginPayload) {
    // 비인증, Bearer 미사용
    return apiRequest<any>(EP.LOGIN, {
      method: 'POST',
      body: payload,
      requireAuth: false,
    }).then(normalizeAuth);
  },

  // 리프레시: body에 { refreshToken } 전달 (Bearer/쿠키 사용 안 함)
  refresh(payload: RefreshPayload) {
    return apiRequest<any>(EP.REFRESH, {
      method: 'POST',
      body: payload,
      requireAuth: false,
    }).then(normalizeAuth);
  },

  // 로그아웃: 토큰 만료와 무관하게 호출되도록 requireAuth: false
  // 서버가 refreshToken을 요구한다면 body로 전달
  logout(payload?: { refreshToken?: string }) {
    return apiRequest<void>(EP.LOGOUT, {
      method: 'POST',
      body: payload?.refreshToken ? { refreshToken: payload.refreshToken } : undefined,
      requireAuth: false,
    });
  },
};
