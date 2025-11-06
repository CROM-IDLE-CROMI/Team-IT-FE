/**
 * API 기본 URL
 * .env의 VITE_API_URL 사용 (없으면 빈 문자열)
 */
const API_BASE_URL = '';

/**
 * 저장된 토큰 가져오기 (로그인 시 저장된 토큰)
 */
const getAuthToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

/**
 * AuthContext에서 주입받을 헬퍼들
 * - 순환참조 방지: 여기선 타입만 알고, 실제 구현은 AuthContext에서 주입
 */
let injectedGetAccessToken: () => string | null = getAuthToken;
let injectedRefresh: (() => Promise<void>) | null = null;
let injectedLogout: (() => Promise<void>) | null = null;

/** AuthContext가 호출해 주입 */
export const injectAuthHelpers = (helpers: {
  getAccessToken?: () => string | null;
  refresh?: () => Promise<void>;
  logout?: () => Promise<void>;
}) => {
  if (helpers.getAccessToken) injectedGetAccessToken = helpers.getAccessToken;
  if (helpers.refresh) injectedRefresh = helpers.refresh;
  if (helpers.logout) injectedLogout = helpers.logout;
};

/**
 * API 요청 옵션 인터페이스
 */
interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
  requireAuth?: boolean; // 인증이 필요한 요청인지 여부
}

/**
 * 공통 API 요청 함수
 *
 * @param endpoint - API 엔드포인트 (예: '/v1/projects')
 * @param options - 요청 옵션
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
  const url = `${API_BASE_URL}${endpoint}`;

  // 실제 요청 보내는 내부 함수 (401 재시도 전에 1회 호출용)
  const send = async (): Promise<T> => {
    // 기본 헤더
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    // 인증이 필요한 경우 Authorization 추가
    if (requireAuth) {
      const token = injectedGetAccessToken?.();
      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
      }
    }

    // fetch 옵션
    const fetchOptions: RequestInit = {
      method,
      headers: requestHeaders,
    };

    if (body !== undefined) {
      fetchOptions.body =
        typeof body === 'string' || body instanceof FormData
          ? body
          : JSON.stringify(body);
    }

    console.log(`🚀 API 요청: ${method} ${url}`, body ? { body } : '');

    const response = await fetch(url, fetchOptions);

    // 204 No Content 처리
    if (response.status === 204) {
      console.log('✅ API 응답: 204 No Content');
      return undefined as unknown as T;
    }

    if (!response.ok) {
      // 에러 메시지 파싱
      let errText = `API 오류: ${response.status}`;
      try {
        const asJson = await response.json();
        errText = asJson?.message || errText;
      } catch {
        try {
          errText = (await response.text()) || errText;
        } catch {
          /* noop */
        }
      }
      throw new Error(`${response.status} ${errText}`);
    }

    const data = (await response.json()) as T;
    console.log('✅ API 응답:', data);
    return data;
  };

  try {
    // 1차 시도
    return await send();
  } catch (err: any) {
    const msg = String(err?.message ?? '');
    const is401 = msg.startsWith('401') || msg.includes(' 401');
    // 401이면 refresh 후 1회 재시도
    if (is401 && injectedRefresh) {
      try {
        await injectedRefresh();
        return await send();
      } catch (e) {
        // refresh 실패 → 세션 종료
        if (injectedLogout) await injectedLogout();
        console.error('❌ API 재시도 실패:', e);
        throw e;
      }
    }
    console.error('❌ API 요청 실패:', err);
    throw err;
  }
}

/**
 * GET/POST/PUT/DELETE/PATCH 헬퍼
 */
export const apiGet =  <T = any>(endpoint: string, requireAuth = true) =>
  apiRequest<T>(endpoint, { method: 'GET', requireAuth });

export const apiPost = <T = any>(endpoint: string, body: any, requireAuth = true) =>
  apiRequest<T>(endpoint, { method: 'POST', body, requireAuth });

export const apiPut =  <T = any>(endpoint: string, body: any, requireAuth = true) =>
  apiRequest<T>(endpoint, { method: 'PUT', body, requireAuth });

export const apiDelete = <T = any>(endpoint: string, requireAuth = true) =>
  apiRequest<T>(endpoint, { method: 'DELETE', requireAuth });

export const apiPatch = <T = any>(endpoint: string, body: any, requireAuth = true) =>
  apiRequest<T>(endpoint, { method: 'PATCH', body, requireAuth });


// API 엔드포인트 상수 (URL을 한 곳에서 관리)
export const API_ENDPOINTS = {
  // 팀원 모집 관련
  TEAM_RECRUIT: {
    LIST: '/api/team-recruit',           // GET: 목록 조회, POST: 등록
    DETAIL: (id: number) => `/api/team-recruit/${id}`,  // GET: 상세, PUT: 수정, DELETE: 삭제
  },
  
  // 프로젝트 관련
  PROJECTS: {
    LIST: '/v1/projects',
    SEARCH: '/v1/projects/search', // POST 방식 검색
    DETAIL: (id: number) => `/v1/projects/${id}`,
    APPLY: (id: number) => `/v1/projects/${id}/apply`, // 프로젝트 지원
    POPULAR: '/v1/projects/popular-projects',
    HOT_BOARDS: '/v1/projects/hot-boards',
    COMMENTS: (id: number) => `/v1/projects/${id}/comments`, // GET: 댓글 목록, POST: 댓글 작성
    COMMENT: (projectId: number, commentId: number) => `/v1/projects/${projectId}/comments/${commentId}`, // PATCH: 댓글 수정, DELETE: 댓글 삭제
  },
  
  // 지원 관련
  APPLICATION: {
    SUBMIT: '/api/applications',         // POST: 지원하기
    LIST: '/api/applications',           // GET: 지원 목록
    DETAIL: (id: number) => `/api/applications/${id}`,
    MY_APPLICATIONS: '/api/applications/my',  // GET: 내 지원 목록
  },
  
  // 마이페이지 관련
  MYPAGE: {
    PROFILE: (uid: string) => `/v1/mypage/${uid}`, // GET: 프로필 정보 조회
    AWARDS: (uid: string) => `/v1/mypage/${uid}/awards`, // GET: 수상 내역 조회, POST: 수상 내역 생성, PATCH: 수상 내역 수정
    STACKS: '/v1/mypage/stacks', // GET: 스택 목록 조회, PATCH: 스택 수정
    RATING: (uid: string) => `/v1/mypage/${uid}/rating`, // GET: 평가 조회
  },

  // 인증 관련
  AUTH: {
    // 회원가입
    SIGNUP: '/v1/auth/users',                      // POST

    // 중복 확인
    EMAIL_CHECK: '/v1/auth/users-email-check',     // GET ?email=...
    UID_CHECK: '/v1/auth/users-uid-check',         // GET ?uid=...

    // 로그인
    LOGIN: '/v1/auth/login',                       // POST
    LOGIN_ID_FIND: '/v1/auth/login-id-find',       // GET ?email=...
    PW_RESET: '/v1/auth/login-pw-reset',           // PUT

    // 소셜
    KAKAO_LOGIN: '/v1/auth/login/kakao',           // GET (리다이렉트/코드 교환)
  },
};
