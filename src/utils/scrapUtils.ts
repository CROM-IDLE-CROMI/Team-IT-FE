// 스크랩 데이터 관리 유틸리티 (백엔드 연동)
import type { ScrapedPost, ScrapData, ScrapManager } from '../types/scrap';
import { apiPost, apiDelete, apiGet } from './api';

// API 응답 타입 정의
interface ScrapApiResponse {
  code: number;
  message: string;
  data: {
    postId: number;
    postTitle: string;
    userId: string;
    scrappedAt: string;
    totalScrapCount: number;
  };
}

interface ScrapListApiResponse {
  code: number;
  message: string;
  data: {
    page: number;
    size: number;
    content: {
      postId: number;
      postTitle: string;
      authorNickname: string;
      authorProfileImageUrl: string;
      category: string;
      viewCount: number;
      createdAt: string;
      scrappedAt: string;
    }[];
    totalElements: number;
    totalPages: number;
  };
}

// 스크랩 추가
export const addScrap = async (post: Omit<ScrapedPost, 'id' | 'scrapedAt'>): Promise<void> => {
  try {
    const endpoint = `/v1/board/${post.postId}/scrap`;
    const response = await apiPost<ScrapApiResponse>(endpoint, {}, true);
    
    if (response.code === 0) {
      console.log('스크랩 추가 성공:', response.data);
    } else {
      console.error('스크랩 추가 실패:', response.message);
      throw new Error(response.message);
    }
  } catch (error) {
    console.error('스크랩 추가 오류:', error);
    throw error;
  }
};

// 스크랩 제거
export const removeScrap = async (postId: number): Promise<void> => {
  try {
    const endpoint = `/v1/board/${postId}/scrap`;
    const response = await apiDelete<{ code: number; message: string }>(endpoint, true);
    
    if (response.code === 0) {
      console.log('스크랩 제거 성공');
    } else {
      console.error('스크랩 제거 실패:', response.message);
      throw new Error(response.message);
    }
  } catch (error) {
    console.error('스크랩 제거 오류:', error);
    throw error;
  }
};

// 모든 스크랩 가져오기
export const getAllScraps = async (): Promise<ScrapedPost[]> => {
  try {
    const endpoint = '/v1/board/scrap';
    const response = await apiGet<ScrapListApiResponse>(endpoint, true);
    
    if (response.code === 0 && response.data) {
      // API 응답을 ScrapedPost 타입으로 변환
      const convertedScraps: ScrapedPost[] = response.data.content.map((item, index) => {
        const date = new Date(item.createdAt);
        const formattedDate = date.toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });

        return {
          id: index + 1, // 임시 ID
          postId: item.postId,
          title: item.postTitle,
          author: item.authorNickname,
          content: '', // 목록에는 내용이 없음
          category: item.category,
          date: formattedDate,
          views: item.viewCount,
          scrapedAt: item.scrappedAt,
          originalPost: {
            id: item.postId,
            title: item.postTitle,
            author: item.authorNickname,
            content: '',
            category: item.category,
            date: formattedDate,
            views: item.viewCount
          }
        };
      });
      
      return convertedScraps;
    } else {
      console.error('스크랩 목록 조회 실패:', response.message);
      return [];
    }
  } catch (error) {
    console.error('스크랩 목록 조회 오류:', error);
    return [];
  }
};

// 스크랩 여부 확인 (현재 목록에서 확인)
let scrapedPostIds: Set<number> = new Set();

// 스크랩 ID 캐시 업데이트
export const updateScrapedCache = async (): Promise<void> => {
  const scraps = await getAllScraps();
  scrapedPostIds = new Set(scraps.map(s => s.postId));
};

// 스크랩 여부 확인
export const isScraped = (postId: number): boolean => {
  return scrapedPostIds.has(postId);
};

// 모든 스크랩 삭제 (개별 삭제를 통한 일괄 삭제)
export const clearAllScraps = async (): Promise<void> => {
  try {
    const scraps = await getAllScraps();
    
    // 모든 스크랩 개별 삭제
    await Promise.all(scraps.map(scrap => removeScrap(scrap.postId)));
    
    console.log('모든 스크랩 삭제 완료');
  } catch (error) {
    console.error('모든 스크랩 삭제 오류:', error);
    throw error;
  }
};

// 스크랩 관리자 객체
export const scrapManager: ScrapManager = {
  addScrap,
  removeScrap,
  getAllScraps,
  isScraped,
  clearAllScraps
};
