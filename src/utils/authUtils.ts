// utils/authorUtils.ts
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  userId: string; // 백엔드 토큰에 들어가는 사용자 ID 필드
  exp?: number;   // 만료 시간 (옵션)
  iat?: number;   // 발급 시간 (옵션)
}

/**
 * 로그인 여부 확인
 * - 우선 JWT 토큰(accessToken) 확인
 * - 없으면 localStorage의 isLoggedIn 플래그 확인
 */
export const isLoggedIn = (): boolean => {
  const token = localStorage.getItem("accessToken");
  if (token) return true;

  const stored = localStorage.getItem("isLoggedIn");
  return stored === "true";
};

/**
 * 현재 로그인된 사용자 ID 반환
 * - JWT 토큰이 있으면 decode해서 userId 반환
 * - 없으면 localStorage의 currentUserId 반환
 * - 없으면 localStorage에 저장된 userData에서 id 반환
 */
export const getCurrentUser = (): string | null => {
  // 1. JWT 기반 (백엔드 연동 후)
  const token = localStorage.getItem("accessToken");
  if (token) {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.userId;
    } catch (e) {
      console.error("토큰 decode 실패:", e);
      return null;
    }
  }

  // 2. currentUserId 우선 확인
  const currentUserId = localStorage.getItem("currentUserId");
  if (currentUserId) {
    return currentUserId;
  }

  // 3. 프론트 전용 fallback (현재 단계)
  const keys = Object.keys(localStorage);
  for (const key of keys) {
    if (key !== "isLoggedIn" && key !== "IsLoggedIn" && key !== "currentUserId") {
      try {
        const userData = JSON.parse(localStorage.getItem(key) || "");
        if (userData && userData.id) {
          return userData.id;
        }
      } catch {
        // JSON 파싱 실패 시 무시
      }
    }
  }

  return null;
};

/**
 * 현재 로그인된 사용자의 닉네임 반환
 * - JWT 토큰이 있으면 decode해서 nickname 반환
 * - 없으면 localStorage의 userData에서 name 반환
 */
export const getCurrentUserNickname = (): string | null => {
  // 1. JWT 기반 (백엔드 연동 후)
  const token = localStorage.getItem("accessToken");
  if (token) {
    try {
      const decoded = jwtDecode<DecodedToken & { nickname?: string }>(token);
      return decoded.nickname || null;
    } catch (e) {
      console.error("토큰 decode 실패:", e);
      return null;
    }
  }

  // 2. currentUserId로 userData 찾기
  const currentUserId = localStorage.getItem("currentUserId");
  if (currentUserId) {
    try {
      const userData = JSON.parse(localStorage.getItem(currentUserId) || "");
      if (userData && userData.name) {
        return userData.name;
      }
    } catch {
      // JSON 파싱 실패 시 무시
    }
  }

  // 3. 프론트 전용 fallback
  const keys = Object.keys(localStorage);
  for (const key of keys) {
    if (key !== "isLoggedIn" && key !== "IsLoggedIn" && key !== "currentUserId") {
      try {
        const userData = JSON.parse(localStorage.getItem(key) || "");
        if (userData && userData.name) {
          return userData.name;
        }
      } catch {
        // JSON 파싱 실패 시 무시
      }
    }
  }

  return null;
};

/**
 * 인증이 필요한 동작을 실행하는 헬퍼
 * - 로그인 안 되어 있으면 경고 후 종료
 * - 로그인 되어 있으면 callback 실행
 */
export const requireAuth = (callback: () => void): void => {
  if (!isLoggedIn()) {
    alert("로그인이 필요한 서비스입니다. 로그인해주세요.");
    return;
  }
  callback();
};
