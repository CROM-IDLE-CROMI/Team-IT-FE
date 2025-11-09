// src/utils/api.ts

/**
 * API 기본 URL
 * .env의 VITE_API_URL 사용 (없으면 빈 문자열)
 */
export const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? '';

/** ─────────────────────────────────────────
 * AuthContext에서 주입받을 헬퍼들
 *  - getAccessToken: accessToken 읽기
 *  - refreshOnce: 401 시 1회 리프레시 → true/false
 *  - logout: 리프레시 실패 시 정리
 * 순환참조 방지용으로 여기서는 시그니처만 알고, 실제 구현은 AuthContext에 있음
 * ───────────────────────────────────────── */
let _getAccessToken: () => string | null = () => localStorage.getItem('accessToken');
let _refreshOnce: (() => Promise<boolean>) | null = null;
let _logout: (() => Promise<void> | void) | null = null;

export const injectAuthHelpers = (helpers: {
  getAccessToken?: () => string | null;
  refreshOnce?: () => Promise<boolean>;
  logout?: () => Promise<void> | void;
}) => {
  if (helpers.getAccessToken) _getAccessToken = helpers.getAccessToken;
  if (helpers.refreshOnce) _refreshOnce = helpers.refreshOnce;
  if (helpers.logout) _logout = helpers.logout;
};

/**
 * API 요청 옵션 인터페이스
 */
interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
  requireAuth?: boolean; // 기본: true
}

/**
 * 내부: 헤더 구성(FormData면 Content-Type 생략)
 */
const buildHeaders = (
  requireAuth: boolean,
  extra?: Record<string, string>,
  body?: any
) => {
  const headers: Record<string, string> = { ...(extra ?? {}) };

  // FormData가 아닐 때만 Content-Type 지정
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  if (!isFormData) {
    headers['Content-Type'] = headers['Content-Type'] ?? 'application/json';
  }

  if (requireAuth) {
    const tok = _getAccessToken?.();
    if (tok) headers['Authorization'] = `Bearer ${tok}`;
  }
  return headers;
};

/**
 * 공통 API 요청 함수
 *
 * @param endpoint - API 엔드포인트 (예: '/v1/projects')
 * @param options  - 요청 옵션
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const {
    method = 'GET',
    body,
    headers = {},
    requireAuth = true,
  } = options;

  // 요청 URL
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  // 실제 요청 보내는 함수(최대 2회 호출: 최초 1회 + 필요시 리프레시 후 1회)
  const send = async (): Promise<Response> => {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

    const fetchOptions: RequestInit = {
      method,
      headers: buildHeaders(requireAuth, headers, body),
      // 쿠키는 절대 사용하지 않음
      credentials: 'omit',
      body: body === undefined ? undefined : (isFormData ? body : JSON.stringify(body)),
    };

    // 로깅은 필요 시 유지
    // console.log(`🚀 API 요청: ${method} ${url}`, body ? { body } : '');

    return fetch(url, fetchOptions);
  };

  // 1차 시도
  let res = await send();

  // 401: refreshOnce() 성공 시 1회 재시도
  if (res.status === 401 && requireAuth && _refreshOnce) {
    try {
      const ok = await _refreshOnce();
      if (ok) {
        res = await send();
      } else {
        if (_logout) await _logout();
      }
    } catch {
      if (_logout) await _logout();
    }
  }

  // 204 No Content
  if (res.status === 204) {
    return undefined as unknown as T;
  }

  // 에러 처리
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const asJson = await res.json();
      if (asJson?.message) msg = `${res.status} ${asJson.message}`;
      else msg = `${res.status} ${JSON.stringify(asJson)}`;
    } catch {
      try {
        const asText = await res.text();
        if (asText) msg = `${res.status} ${asText}`;
      } catch {/* noop */}
    }
    throw new Error(msg);
  }

  // 성공(JSON 파싱 시도)
  try {
    return (await res.json()) as T;
  } catch {
    // JSON이 아니면 undefined 반환
    return undefined as unknown as T;
  }
}

/**
 * GET/POST/PUT/DELETE/PATCH 헬퍼
 */
export const apiGet    = <T = any>(endpoint: string, requireAuth = true) =>
  apiRequest<T>(endpoint, { method: 'GET', requireAuth });

export const apiPost   = <T = any>(endpoint: string, body: any, requireAuth = true) =>
  apiRequest<T>(endpoint, { method: 'POST', body, requireAuth });

export const apiPut    = <T = any>(endpoint: string, body: any, requireAuth = true) =>
  apiRequest<T>(endpoint, { method: 'PUT', body, requireAuth });

export const apiDelete = <T = any>(endpoint: string, requireAuth = true) =>
  apiRequest<T>(endpoint, { method: 'DELETE', requireAuth });

export const apiPatch  = <T = any>(endpoint: string, body: any, requireAuth = true) =>
  apiRequest<T>(endpoint, { method: 'PATCH', body, requireAuth });

/**
 * API 엔드포인트 상수
 * ※ 서버 라우팅에 맞게 '/v1' 기준으로 통일. 실제 경로가 다르면 여기만 바꿔주면 됨.
 */
export const API_ENDPOINTS = {
  // 팀원 모집
  TEAM_RECRUIT: {
    LIST: '/v1/teams',                         // GET: 목록, POST: 등록
    DETAIL: (id: number) => `/v1/teams/${id}`, // GET/PUT/DELETE
  },

  // 프로젝트
  PROJECTS: {
    LIST: '/v1/projects',
    SEARCH: '/v1/projects/search', // POST
    DETAIL: (id: number) => `/v1/projects/${id}`,
    APPLY: (id: number) => `/v1/projects/${id}/apply`,
    POPULAR: '/v1/projects/popular-projects',
    HOT_BOARDS: '/v1/projects/hot-boards',
    COMMENTS: (id: number) => `/v1/projects/${id}/comments`, // GET/POST
    COMMENT: (projectId: number, commentId: number) =>
      `/v1/projects/${projectId}/comments/${commentId}`,     // PATCH/DELETE
  },

  // 지원
  APPLICATION: {
    SUBMIT: '/v1/applications',                 // POST
    LIST: '/v1/applications',                   // GET
    DETAIL: (id: number) => `/v1/applications/${id}`,
    MY_APPLICATIONS: '/v1/applications/my',     // GET
  },

  // 마이페이지
  MYPAGE: {
    PROFILE: (uid: string) => `/v1/mypage/${uid}`,      // GET
    AWARDS:  (uid: string) => `/v1/mypage/${uid}/awards`, // GET/POST/PATCH
    STACKS: '/v1/mypage/stacks',                       // GET/PATCH
    RATING: (uid: string) => `/v1/mypage/${uid}/rating`, // GET
  },
  
  // 게시판 관련
  BOARD: {
    LIST: '/v1/board', // GET: 게시글 목록 조회
    DETAIL: (id: number) => `/v1/board/${id}`, // GET: 게시글 상세 조회, PUT: 게시글 수정, DELETE: 게시글 삭제
    CREATE: '/v1/board', // POST: 게시글 작성
    COMMENTS: (postId: number) => `/v1/board/${postId}/comments`, // GET: 댓글 목록, POST: 댓글 작성
    COMMENT: (postId: number, commentId: number) => `/v1/board/${postId}/comments/${commentId}`, // PATCH: 댓글 수정, DELETE: 댓글 삭제
    SCRAP: (postId: number) => `/v1/board/${postId}/scrap`, // POST: 스크랩 추가, DELETE: 스크랩 제거
    SCRAP_LIST: '/v1/board/scrap', // GET: 스크랩 목록 조회
  },

  // 인증
  AUTH: {
    SIGNUP: '/v1/auth/users',                    // POST
    EMAIL_CHECK: '/v1/auth/users-email-check',   // GET ?email=...
    UID_CHECK: '/v1/auth/users-uid-check',       // GET ?uid=...
    LOGIN: '/v1/auth/login',                     // POST
    LOGIN_ID_FIND: '/v1/auth/login-id-find',     // GET ?email=...
    PW_RESET: '/v1/auth/login-pw-reset',         // PUT
    KAKAO_LOGIN: '/v1/auth/login/kakao',         // GET (필요 시)
    REFRESH: '/v1/auth/refresh',           // POST { refreshToken }
  },
};

