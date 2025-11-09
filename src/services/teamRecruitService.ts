// src/services/teamRecruitService.ts
// 팀원 모집 관련 모든 API 호출을 관리하는 서비스

import { apiGet, apiPost, apiPut, apiDelete, API_ENDPOINTS } from '../utils/api';
import type { ProjectApiResponse } from '../types/project';

/**
 * 팀원 모집 등록 요청 본문 타입
 */
export interface TeamRecruitCreateRequest {
  title: string;
  projectName: string;
  platform: string;
  platformDetail?: string;
  recruitPositions: string[];
  recruitDetail?: string[];
  requireStack: string[];
  category?: string;
  categoryDetail?: string;
  startDate?: string;
  endDate?: string;
  expectedStartDate?: string;
  projectStatus?: string;
  statusDetail?: string;
  ideaExplain: string;
  meetingApproach?: string;
  locations: string[];
  minRequest?: string;
  applicantQuestions?: string[];
}

/**
 * 팀원 모집 등록 응답 타입 (API 응답 구조)
 */
export interface TeamRecruitCreateResponse {
  code: number;
  message: string;
  data: ProjectApiResponse;
}

/**
 * 팀원 모집 상세 조회 응답 타입 (API 응답 구조)
 */
export interface TeamRecruitDetailResponse {
  code: number;
  message: string;
  data: ProjectApiResponse;
}

/**
 * 팀원 모집 목록 조회 응답 타입 (API 응답 구조)
 */
export interface TeamRecruitListResponse {
  code: number;
  message: string;
  data: {
    projects: ProjectApiResponse[];
    total: number;
    page?: number;
    pageSize?: number;
  };
}

/**
 * 팀원 모집 서비스 클래스
 */
class TeamRecruitService {
  /**
   * 1️⃣ 팀원 모집 등록
   * @param data 팀원 모집 등록 요청 데이터
   * @returns 생성된 팀원 모집 정보
   */
  async create(data: TeamRecruitCreateRequest): Promise<TeamRecruitCreateResponse> {
    try {
      console.log('📤 팀원 모집 등록 요청:', data);
      
      const response = await apiPost<TeamRecruitCreateResponse>(
        API_ENDPOINTS.TEAM_RECRUIT.LIST,
        data,
        true // 인증 필요
      );
      
      console.log('✅ 팀원 모집 등록 성공:', response);
      return response;
      
    } catch (error) {
      console.error('❌ 팀원 모집 등록 실패:', error);
      throw error;
    }
  }

  /**
   * 2️⃣ 팀원 모집 목록 조회
   * @param filters 필터 옵션 (선택사항)
   * @returns 팀원 모집 목록
   */
  async getList(filters?: {
    page?: number;
    pageSize?: number;
    search?: string;
    activityType?: string[];
    positions?: string[];
    techStack?: string[];
    region?: string;
    progress?: string[];
  }): Promise<TeamRecruitListResponse> {
    try {
      // 쿼리 파라미터 생성
      let endpoint = API_ENDPOINTS.TEAM_RECRUIT.LIST;
      
      if (filters) {
        const params = new URLSearchParams();
        
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());
        if (filters.search) params.append('q', filters.search);
        if (filters.region) params.append('region', filters.region);
        
        if (filters.activityType) {
          filters.activityType.forEach(type => params.append('activityType', type));
        }
        if (filters.positions) {
          filters.positions.forEach(pos => params.append('position', pos));
        }
        if (filters.techStack) {
          filters.techStack.forEach(tech => params.append('techStack', tech));
        }
        if (filters.progress) {
          filters.progress.forEach(prog => params.append('progress', prog));
        }
        
        const queryString = params.toString();
        if (queryString) {
          endpoint = `${endpoint}?${queryString}`;
        }
      }
      
      console.log('📥 팀원 모집 목록 조회:', endpoint);
      
      const response = await apiGet<TeamRecruitListResponse>(
        endpoint,
        false // 목록 조회는 인증 불필요 (공개)
      );
      
      console.log('✅ 팀원 모집 목록 조회 성공:', response);
      return response;
      
    } catch (error) {
      console.error('❌ 팀원 모집 목록 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 3️⃣ 팀원 모집 상세 조회
   * @param id 팀원 모집 ID
   * @returns 팀원 모집 상세 정보
   */
  async getDetail(id: number): Promise<TeamRecruitDetailResponse> {
    try {
      console.log('📥 팀원 모집 상세 조회:', id);
      
      const response = await apiGet<TeamRecruitDetailResponse>(
        API_ENDPOINTS.TEAM_RECRUIT.DETAIL(id),
        false // 상세 조회는 인증 불필요 (공개)
      );
      
      console.log('✅ 팀원 모집 상세 조회 성공:', response);
      return response;
      
    } catch (error) {
      console.error('❌ 팀원 모집 상세 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 4️⃣ 팀원 모집 수정
   * @param id 팀원 모집 ID
   * @param data 수정할 데이터
   * @returns 수정된 팀원 모집 정보
   */
  async update(id: number, data: Partial<TeamRecruitCreateRequest>): Promise<TeamRecruitDetailResponse> {
    try {
      console.log('📝 팀원 모집 수정 요청:', { id, data });
      
      const response = await apiPut<TeamRecruitDetailResponse>(
        API_ENDPOINTS.TEAM_RECRUIT.DETAIL(id),
        data,
        true // 인증 필요
      );
      
      console.log('✅ 팀원 모집 수정 성공:', response);
      return response;
      
    } catch (error) {
      console.error('❌ 팀원 모집 수정 실패:', error);
      throw error;
    }
  }

  /**
   * 5️⃣ 팀원 모집 삭제
   * @param id 팀원 모집 ID
   * @returns 삭제 결과
   */
  async delete(id: number): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🗑️ 팀원 모집 삭제 요청:', id);
      
      const response = await apiDelete<{ success: boolean; message: string }>(
        API_ENDPOINTS.TEAM_RECRUIT.DETAIL(id),
        true // 인증 필요
      );
      
      console.log('✅ 팀원 모집 삭제 성공:', response);
      return response;
      
    } catch (error) {
      console.error('❌ 팀원 모집 삭제 실패:', error);
      throw error;
    }
  }
}

// 싱글톤 인스턴스 생성 및 export
export const teamRecruitService = new TeamRecruitService();




