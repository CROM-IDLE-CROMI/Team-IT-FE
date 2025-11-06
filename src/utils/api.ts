// src/utils/api.ts
// 백엔드 API 요청을 위한 유틸리티 함수

/**
 * API 기본 URL
 * .env 파일의 VITE_API_URL 값을 사용하거나, 없으면 기본값 사용
 */
const API_BASE_URL = '';

/**
 * 저장된 토큰 가져오기 (로그인 시 저장된 토큰)
 */
const getAuthToken = (): string | null => {
  return localStorage.getItem('accessToken');
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
 * @param endpoint - API 엔드포인트 (예: '/api/team-recruit')
 * @param options - 요청 옵션
 * @returns API 응답 데이터
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const {
    method = 'GET',
    body,
    headers = {},
    requireAuth = true
  } = options;

  // 요청 URL 생성
  const url = `${API_BASE_URL}${endpoint}`;

  // 기본 헤더 설정
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // 인증이 필요한 경우 토큰 추가
  if (requireAuth) {
    const token = getAuthToken();
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  // fetch 옵션 설정
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

  try {
    // API 요청
    console.log(`🚀 API 요청: ${method} ${url}`, body ? { body } : '');
    
    const response = await fetch(url, fetchOptions);

    // 응답 상태 확인
    if (!response.ok) {
      // 에러 응답 처리
      let errorMessage = `API 오류: ${response.status}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        errorMessage = await response.text() || errorMessage;
      }

      throw new Error(errorMessage);
    }

    // 성공 응답 데이터 파싱
    const data = await response.json();
    console.log('✅ API 응답:', data);
    
    return data as T;
    
  } catch (error) {
    console.error('❌ API 요청 실패:', error);
    throw error;
  }
};

/**
 * GET 요청 헬퍼 함수
 */
export const apiGet = <T = any>(endpoint: string, requireAuth = true): Promise<T> => {
  return apiRequest<T>(endpoint, { method: 'GET', requireAuth });
};

/**
 * POST 요청 헬퍼 함수
 */
export const apiPost = <T = any>(endpoint: string, body: any, requireAuth = true): Promise<T> => {
  return apiRequest<T>(endpoint, { method: 'POST', body, requireAuth });
};

/**
 * PUT 요청 헬퍼 함수
 */
export const apiPut = <T = any>(endpoint: string, body: any, requireAuth = true): Promise<T> => {
  return apiRequest<T>(endpoint, { method: 'PUT', body, requireAuth });
};

/**
 * DELETE 요청 헬퍼 함수
 */
export const apiDelete = <T = any>(endpoint: string, requireAuth = true): Promise<T> => {
  return apiRequest<T>(endpoint, { method: 'DELETE', requireAuth });
};

/**
 * PATCH 요청 헬퍼 함수
 */
export const apiPatch = <T = any>(endpoint: string, body: any, requireAuth = true): Promise<T> => {
  return apiRequest<T>(endpoint, { method: 'PATCH', body, requireAuth });
};

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
