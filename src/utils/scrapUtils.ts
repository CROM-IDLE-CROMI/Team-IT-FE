// 스크랩 데이터 관리 유틸리티 (백엔드 연동 준비)
import type { ScrapedPost, ScrapData, ScrapManager } from '../types/scrap';

// TODO: 백엔드 연동 시 구현할 함수들
// 스크랩 추가
export const addScrap = (post: Omit<ScrapedPost, 'id' | 'scrapedAt'>): void => {
  // TODO: 백엔드 API 호출로 스크랩 추가
  console.log('스크랩 추가:', post);
};

// 스크랩 제거
export const removeScrap = (postId: number): void => {
  // TODO: 백엔드 API 호출로 스크랩 제거
  console.log('스크랩 제거:', postId);
};

// 모든 스크랩 가져오기
export const getAllScraps = (): ScrapedPost[] => {
  // TODO: 백엔드 API 호출로 스크랩 목록 가져오기
  return [];
};

// 스크랩 여부 확인
export const isScraped = (postId: number): boolean => {
  // TODO: 백엔드 API 호출로 스크랩 여부 확인
  return false;
};

// 모든 스크랩 삭제
export const clearAllScraps = (): void => {
  // TODO: 백엔드 API 호출로 모든 스크랩 삭제
  console.log('모든 스크랩 삭제');
};

// 스크랩 관리자 객체
export const scrapManager: ScrapManager = {
  addScrap,
  removeScrap,
  getAllScraps,
  isScraped,
  clearAllScraps
};
