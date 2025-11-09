// src/services/projectService.ts
// 프로젝트 관련 모든 API 호출을 관리하는 서비스

import { apiGet, apiPost, apiPatch, apiDelete, API_ENDPOINTS } from '../utils/api';
import type {
  ProjectCommentApiResponse,
  ProjectCommentListResponse,
  ProjectCommentCreateRequest,
  ProjectCommentUpdateRequest,
  ProjectCommentCreateResponse,
  ProjectCommentUpdateResponse,
} from '../types/project';

/**
 * API 응답 공통 구조
 */
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

/**
 * 프로젝트 목록 항목 타입
 */
export interface ProjectListItem {
  projectId: number;
  title: string;
  projectName: string;
  projectStatus: string;
  recruitPositions: string[];
  requireStack: string[];
  creatorId: string;
  viewCount: number;
  createdAt: string;
  creatorNickname: string;
  creatorProfileImageUrl: string;
}

/**
 * 페이지네이션된 프로젝트 목록 응답 타입 (GET)
 */
export interface ProjectListResponse {
  page: number;
  size: number;
  content: ProjectListItem[];
  totalElements: number;
  totalPages: number;
}

/**
 * POST 검색 요청 본문 타입
 */
export interface ProjectSearchRequest {
  page?: number;
  size?: number;
  q?: string; // 검색어
  activity?: string[]; // 활동 유형
  position?: string[]; // 포지션
  techStack?: string[]; // 기술 스택
  region?: string; // 지역
  district?: string[]; // 구/군
  progress?: string[]; // 진행 상황
  method?: string[]; // 진행 방식
  recruitEndDate_gte?: string; // 모집 마감일 이상
  startDate_gte?: string; // 프로젝트 시작일 이상
  endDate_lte?: string; // 프로젝트 종료일 이하
}

/**
 * 정렬 정보 타입
 */
interface SortInfo {
  sorted: boolean;
  empty: boolean;
  unsorted: boolean;
}

/**
 * 페이지네이션 정보 타입
 */
interface PageableInfo {
  paged: boolean;
  pageNumber: number;
  pageSize: number;
  offset: number;
  sort: SortInfo;
  unpaged: boolean;
}

/**
 * POST 검색 응답 타입 (Spring Data Page 구조)
 */
export interface ProjectSearchResponse {
  totalElements: number;
  totalPages: number;
  pageable: PageableInfo;
  size: number;
  content: ProjectListItem[];
  number: number;
  sort: SortInfo;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

/**
 * 인기 게시물 항목 타입
 */
export interface HotBoardItem {
  postId: number;
  title: string;
  category: string;
  viewCount: number;
  likeCount: number;
  createdAt: string;
  authorNickname: string;
  authorProfileImageUrl: string;
}

/**
 * 프로젝트 서비스 클래스
 */
class ProjectService {
  getProjectComments(projectId: number) {
    throw new Error("Method not implemented.");
  }
  /**
   * 2️⃣ 인기 프로젝트 조회
   * @returns 인기 프로젝트 목록
   */
  updateProjectComment(projectId: number, replyId: number, arg2: { content: string; }) {
    throw new Error("Method not implemented.");
  }
  deleteProjectComment(projectId: number, replyId: number) {
    throw new Error("Method not implemented.");
  }
  applyProject(id: number, applyData: { title: string; position: string; motivation: string; answers: string[]; requirements: boolean; }) {
    throw new Error("Method not implemented.");
  }
  /**
   * 프로젝트 목록 조회 (페이지네이션)
   * @param params 쿼리 파라미터
   * @returns 프로젝트 목록
   */
  async getProjects(params?: {
    page?: number;
    size?: number;
    q?: string; // 검색어
    activity?: string[]; // 활동 유형
    position?: string[]; // 포지션
    techStack?: string[]; // 기술 스택
    region?: string; // 지역
    district?: string[]; // 구/군
    progress?: string[]; // 진행 상황
    method?: string[]; // 진행 방식
    recruitEndDate_gte?: string; // 모집 마감일 이상
    startDate_gte?: string; // 프로젝트 시작일 이상
    endDate_lte?: string; // 프로젝트 종료일 이하
  }): Promise<ProjectListResponse> {
    try {
      // 쿼리 파라미터 생성
      let endpoint = API_ENDPOINTS.PROJECTS.LIST;
      
      if (params) {
        const queryParams = new URLSearchParams();
        
        if (params.page !== undefined) queryParams.append('page', params.page.toString());
        if (params.size !== undefined) queryParams.append('size', params.size.toString());
        if (params.q) queryParams.append('q', params.q);
        if (params.region) queryParams.append('region', params.region);
        
        if (params.activity) {
          params.activity.forEach(v => queryParams.append('activity', v));
        }
        if (params.position) {
          params.position.forEach(v => queryParams.append('position', v));
        }
        if (params.techStack) {
          params.techStack.forEach(v => queryParams.append('techStack', v));
        }
        if (params.district) {
          params.district.forEach(v => queryParams.append('district', v));
        }
        if (params.progress) {
          params.progress.forEach(v => queryParams.append('progress', v));
        }
        if (params.method) {
          params.method.forEach(v => queryParams.append('method', v));
        }
        if (params.recruitEndDate_gte) {
          queryParams.append('recruitEndDate_gte', params.recruitEndDate_gte);
        }
        if (params.startDate_gte) {
          queryParams.append('startDate_gte', params.startDate_gte);
        }
        if (params.endDate_lte) {
          queryParams.append('endDate_lte', params.endDate_lte);
        }
        
        const queryString = queryParams.toString();
        if (queryString) {
          endpoint = `${endpoint}?${queryString}`;
        }
      }
      
      console.log('📥 프로젝트 목록 조회:', endpoint);
      
      const response = await apiGet<ApiResponse<ProjectListResponse>>(
        endpoint,
        false // 목록 조회는 인증 불필요 (공개)
      );
      
      console.log('✅ 프로젝트 목록 조회 성공:', response);
      
      // API 응답 구조에서 data 추출
      if (response.code === 0) {
        return response.data;
      } else {
        throw new Error(response.message || '프로젝트 목록 조회 실패');
      }
      
    } catch (error) {
      console.error('❌ 프로젝트 목록 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 2️⃣ 인기 프로젝트 조회
   * @returns 인기 프로젝트 목록
   */
  async getPopularProjects(): Promise<ProjectListItem[]> {
    try {
      console.log('📥 인기 프로젝트 조회');
      
      const response = await apiGet<ApiResponse<ProjectListItem[]>>(
        API_ENDPOINTS.PROJECTS.POPULAR,
        false // 인증 불필요 (공개)
      );
      
      console.log('✅ 인기 프로젝트 조회 성공:', response);
      
      // API 응답 구조에서 data 추출
      if (response.code === 0) {
        return response.data;
      } else {
        throw new Error(response.message || '인기 프로젝트 조회 실패');
      }
      
    } catch (error) {
      console.error('❌ 인기 프로젝트 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 3️⃣ 인기 게시물 조회
   * @returns 인기 게시물 목록
   */
  async getHotBoards(): Promise<HotBoardItem[]> {
    try {
      console.log('📥 인기 게시물 조회');
      
      const response = await apiGet<ApiResponse<HotBoardItem[]>>(
        API_ENDPOINTS.PROJECTS.HOT_BOARDS,
        false // 인증 불필요 (공개)
      );
      
      console.log('✅ 인기 게시물 조회 성공:', response);
      
      // API 응답 구조에서 data 추출
      if (response.code === 0) {
        return response.data;
      } else {
        throw new Error(response.message || '인기 게시물 조회 실패');
      }
      
    } catch (error) {
      console.error('❌ 인기 게시물 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 4️⃣ 프로젝트 검색 (POST 방식 - 사이드바 필터 옵션 사용)
   * @param searchRequest 검색 요청 본문
   * @returns 검색된 프로젝트 목록 (Spring Data Page 구조)
   */
  async searchProjects(searchRequest: ProjectSearchRequest): Promise<ProjectSearchResponse> {
    try {
      console.log('📥 프로젝트 검색 (POST):', searchRequest);
      
      const response = await apiPost<ApiResponse<ProjectSearchResponse>>(
        API_ENDPOINTS.PROJECTS.SEARCH,
        searchRequest,
        false // 인증 불필요 (공개)
      );
      
      console.log('✅ 프로젝트 검색 성공:', response);
      
      // API 응답 구조에서 data 추출
      if (response.code === 0) {
        return response.data;
      } else {
        throw new Error(response.message || '프로젝트 검색 실패');
      }
      
    } catch (error) {
      console.error('❌ 프로젝트 검색 실패:', error);
      throw error;
    }
  }
}

// 싱글톤 인스턴스 생성 및 export
export const projectService = new ProjectService();

