// src/services/applicationService.ts
// 팀원 모집 지원 관련 모든 API 호출을 관리하는 서비스

import { apiGet, apiPost, API_ENDPOINTS } from '../utils/api';

/**
 * 지원 데이터 타입
 */
export interface ApplicationData {
  id?: number;
  teamRecruitId: number;  // 지원할 팀원 모집 ID
  position: string;        // 지원 직군
  message: string;         // 지원 메시지
  portfolio?: string;      // 포트폴리오 URL
  answers?: {              // 지원 질문에 대한 답변
    questionId: number;
    answer: string;
  }[];
  status?: 'pending' | 'accepted' | 'rejected';  // 지원 상태
  createdAt?: string;
}

/**
 * 지원 등록 응답 타입
 */
export interface ApplicationCreateResponse {
  success: boolean;
  id: number;
  message: string;
  data?: ApplicationData;
}

/**
 * 지원 목록 응답 타입
 */
export interface ApplicationListResponse {
  data: ApplicationData[];
  total: number;
}

/**
 * 지원 서비스 클래스
 */
class ApplicationService {
  /**
   * 1️⃣ 팀원 모집 지원하기
   * @param data 지원 데이터
   * @returns 지원 결과
   */
  async submit(data: ApplicationData): Promise<ApplicationCreateResponse> {
    try {
      console.log('📤 팀원 모집 지원 요청:', data);
      
      const response = await apiPost<ApplicationCreateResponse>(
        API_ENDPOINTS.APPLICATION.SUBMIT,
        data,
        true // 인증 필요
      );
      
      console.log('✅ 팀원 모집 지원 성공:', response);
      return response;
      
    } catch (error) {
      console.error('❌ 팀원 모집 지원 실패:', error);
      throw error;
    }
  }

  /**
   * 2️⃣ 내 지원 목록 조회
   * @returns 내가 지원한 목록
   */
  async getMyApplications(): Promise<ApplicationListResponse> {
    try {
      console.log('📥 내 지원 목록 조회');
      
      const response = await apiGet<ApplicationListResponse>(
        API_ENDPOINTS.APPLICATION.MY_APPLICATIONS,
        true // 인증 필요
      );
      
      console.log('✅ 내 지원 목록 조회 성공:', response);
      return response;
      
    } catch (error) {
      console.error('❌ 내 지원 목록 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 3️⃣ 특정 팀원 모집에 대한 지원 목록 조회 (작성자용)
   * @param teamRecruitId 팀원 모집 ID
   * @returns 해당 팀원 모집의 지원자 목록
   */
  async getApplicationsByTeamRecruit(teamRecruitId: number): Promise<ApplicationListResponse> {
    try {
      console.log('📥 팀원 모집 지원자 목록 조회:', teamRecruitId);
      
      const response = await apiGet<ApplicationListResponse>(
        `${API_ENDPOINTS.APPLICATION.LIST}?teamRecruitId=${teamRecruitId}`,
        true // 인증 필요
      );
      
      console.log('✅ 팀원 모집 지원자 목록 조회 성공:', response);
      return response;
      
    } catch (error) {
      console.error('❌ 팀원 모집 지원자 목록 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 4️⃣ 지원 상세 조회
   * @param id 지원 ID
   * @returns 지원 상세 정보
   */
  async getDetail(id: number): Promise<ApplicationData> {
    try {
      console.log('📥 지원 상세 조회:', id);
      
      const response = await apiGet<ApplicationData>(
        API_ENDPOINTS.APPLICATION.DETAIL(id),
        true // 인증 필요
      );
      
      console.log('✅ 지원 상세 조회 성공:', response);
      return response;
      
    } catch (error) {
      console.error('❌ 지원 상세 조회 실패:', error);
      throw error;
    }
  }
}

// 싱글톤 인스턴스 생성 및 export
export const applicationService = new ApplicationService();




