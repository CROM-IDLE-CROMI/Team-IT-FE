// src/services/mypageService.ts
// 마이페이지 관련 모든 API 호출을 관리하는 서비스

import { apiGet, apiPost, apiPatch, API_ENDPOINTS } from '../utils/api';

/**
 * API 응답 공통 구조
 */
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

/**
 * ApiResponse 타입 가드
 */
function isApiResponse<T = any>(obj: unknown): obj is ApiResponse<T> {
  return obj !== null && typeof obj === 'object' && 'data' in (obj as object) && 'code' in (obj as object);
}

/**
 * 수상 내역 타입
 */
export interface Award {
  awardName: string;
  organization: string;
  awardDate: string; // YYYY-MM-DD 형식
  description: string;
}

/**
 * 스택 정보 타입
 */
export interface Stack {
  stackId: number;
  level: 'high' | 'medium' | 'low';
  isRepresentative: boolean;
  iconUrl: string;
}

/**
 * 스택 정보 (조회용 - 스택 이름 포함)
 */
export interface StackDetail {
  stackName: string;
  icon: string;
  level: string;
}

/**
 * 마이페이지 프로필 정보 타입
 */
export interface MyPageProfile {
  nickName: string;
  birthDay: string; // ISO 8601 형식
  organization: string;
  email: string;
  position: string;
  description: string;
  profileImg: string;
  backgroundImg: string;
  border: string;
  badge: string;
  projects: string[];
  stacks: StackDetail[];
  awards: Award[];
  stars: number;
}

/**
 * 평가 정보 타입
 */
export interface Rating {
  id: number;
  reviewerId: string;
  reviewerNickName: string;
  score: number;
  content: string;
  updatedAt: string; // ISO 8601 형식
  projectName: string;
  platform: string;
}

/**
 * 마이페이지 서비스 클래스
 */
class MyPageService {
  /**
   * 1️⃣ 마이페이지 프로필 정보 조회
   * @param uid 사용자 ID
   * @returns 프로필 정보
   */
  async getProfile(uid: string): Promise<MyPageProfile> {
    try {
      console.log('📥 마이페이지 프로필 조회:', uid);

      const response = await apiGet<unknown>(
        API_ENDPOINTS.MYPAGE.PROFILE(uid),
        true // 인증 필요
      );

      console.log('✅ 마이페이지 프로필 조회 성공:', response);

      // 응답이 ApiResponse 구조인 경우 data 추출
      if (isApiResponse<MyPageProfile>(response) && response.code === 0) {
        return response.data;
      }

      // 그 외는 직접 프로필 객체로 간주
      return response as MyPageProfile;
    } catch (error) {
      console.error('❌ 마이페이지 프로필 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 2️⃣ 수상 내역 조회
   * @param uid 사용자 ID
   * @returns 수상 내역 목록
   */
  async getAwards(uid: string): Promise<Award[]> {
    try {
      console.log('📥 수상 내역 조회:', uid);

      const response = await apiGet<unknown>(
        API_ENDPOINTS.MYPAGE.AWARDS(uid),
        true // 인증 필요
      );

      console.log('✅ 수상 내역 조회 성공:', response);

      // 응답이 배열인 경우 그대로 반환
      if (Array.isArray(response)) {
        return response;
      }

      // ApiResponse 구조인 경우 data 추출
      if (isApiResponse<Award[]>(response) && response.code === 0) {
        return response.data;
      }

      return [];
    } catch (error) {
      console.error('❌ 수상 내역 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 3️⃣ 수상 내역 생성
   * @param uid 사용자 ID
   * @param awards 수상 내역 배열
   * @returns 생성된 수상 내역 목록
   */
  async createAwards(uid: string, awards: Award[]): Promise<Award[]> {
    try {
      console.log('📤 수상 내역 생성 요청:', { uid, awards });

      const response = await apiPost<unknown>(
        API_ENDPOINTS.MYPAGE.AWARDS(uid),
        awards,
        true // 인증 필요
      );

      console.log('✅ 수상 내역 생성 성공:', response);

      // 응답이 배열인 경우 그대로 반환
      if (Array.isArray(response)) {
        return response;
      }

      // ApiResponse 구조인 경우 data 추출
      if (isApiResponse<Award[]>(response) && response.code === 0) {
        return response.data;
      }

      return [];
    } catch (error) {
      console.error('❌ 수상 내역 생성 실패:', error);
      throw error;
    }
  }

  /**
   * 4️⃣ 수상 내역 수정
   * @param uid 사용자 ID
   * @param awards 수정할 수상 내역 배열
   * @returns 수정된 수상 내역 목록
   */
  async updateAwards(uid: string, awards: Award[]): Promise<Award[]> {
    try {
      console.log('📝 수상 내역 수정 요청:', { uid, awards });

      const response = await apiPatch<unknown>(
        API_ENDPOINTS.MYPAGE.AWARDS(uid),
        awards,
        true // 인증 필요
      );

      console.log('✅ 수상 내역 수정 성공:', response);

      // 응답이 배열인 경우 그대로 반환
      if (Array.isArray(response)) {
        return response;
      }

      // ApiResponse 구조인 경우 data 추출
      if (isApiResponse<Award[]>(response) && response.code === 0) {
        return response.data;
      }

      return [];
    } catch (error) {
      console.error('❌ 수상 내역 수정 실패:', error);
      throw error;
    }
  }

  /**
   * 5️⃣ 스택 목록 조회
   * @returns 스택 목록
   */
  async getStacks(): Promise<Stack[]> {
    try {
      console.log('📥 스택 목록 조회');

      const response = await apiGet<unknown>(
        API_ENDPOINTS.MYPAGE.STACKS,
        true // 인증 필요
      );

      console.log('✅ 스택 목록 조회 성공:', response);

      // 응답이 배열인 경우 그대로 반환
      if (Array.isArray(response)) {
        return response;
      }

      // ApiResponse 구조인 경우 data 추출
      if (isApiResponse<Stack[]>(response) && response.code === 0) {
        return response.data;
      }

      return [];
    } catch (error) {
      console.error('❌ 스택 목록 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 6️⃣ 스택 수정
   * @param stacks 수정할 스택 배열
   * @returns 수정된 스택 목록
   */
  async updateStacks(stacks: Stack[]): Promise<Stack[]> {
    try {
      console.log('📝 스택 수정 요청:', stacks);

      const response = await apiPatch<unknown>(
        API_ENDPOINTS.MYPAGE.STACKS,
        stacks,
        true // 인증 필요
      );

      console.log('✅ 스택 수정 성공:', response);

      // 응답이 배열인 경우 그대로 반환
      if (Array.isArray(response)) {
        return response;
      }

      // ApiResponse 구조인 경우 data 추출
      if (isApiResponse<Stack[]>(response) && response.code === 0) {
        return response.data;
      }

      return [];
    } catch (error) {
      console.error('❌ 스택 수정 실패:', error);
      throw error;
    }
  }

  /**
   * 7️⃣ 평가 조회
   * @param uid 사용자 ID
   * @returns 평가 목록
   */
  async getRatings(uid: string): Promise<Rating[]> {
    try {
      console.log('📥 평가 조회:', uid);

      const response = await apiGet<unknown>(
        API_ENDPOINTS.MYPAGE.RATING(uid),
        true // 인증 필요
      );

      console.log('✅ 평가 조회 성공:', response);

      // 응답이 배열인 경우 그대로 반환
      if (Array.isArray(response)) {
        return response;
      }

      // ApiResponse 구조인 경우 data 추출
      if (isApiResponse<Rating[]>(response) && response.code === 0) {
        return response.data;
      }

      return [];
    } catch (error) {
      console.error('❌ 평가 조회 실패:', error);
      throw error;
    }
  }
}

// 싱글톤 인스턴스 생성 및 export
export const mypageService = new MyPageService();



