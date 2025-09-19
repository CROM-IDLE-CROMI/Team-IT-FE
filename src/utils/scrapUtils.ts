// 스크랩 데이터 관리 유틸리티
import type { ScrapedPost, ScrapData, ScrapManager } from '../types/scrap';
import { getCurrentUser } from './authUtils';

const SCRAP_STORAGE_KEY = 'userScraps';

// 현재 사용자의 스크랩 데이터 가져오기
const getScrapData = (): ScrapData => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return { userId: '', scraps: [], lastUpdated: new Date().toISOString() };
  }

  const stored = localStorage.getItem(`${SCRAP_STORAGE_KEY}_${currentUser}`);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('스크랩 데이터 파싱 실패:', error);
    }
  }

  return {
    userId: currentUser,
    scraps: [],
    lastUpdated: new Date().toISOString()
  };
};

// 스크랩 데이터 저장하기
const saveScrapData = (data: ScrapData): void => {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  localStorage.setItem(`${SCRAP_STORAGE_KEY}_${currentUser}`, JSON.stringify(data));
};

// 스크랩 추가
export const addScrap = (post: Omit<ScrapedPost, 'id' | 'scrapedAt'>): void => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    alert('로그인이 필요합니다.');
    return;
  }

  const scrapData = getScrapData();
  
  // 이미 스크랩된 게시글인지 확인
  if (scrapData.scraps.some(scrap => scrap.postId === post.postId)) {
    alert('이미 스크랩한 게시글입니다.');
    return;
  }

  const newScrap: ScrapedPost = {
    ...post,
    id: Date.now(),
    scrapedAt: new Date().toISOString()
  };

  scrapData.scraps.unshift(newScrap); // 최신 스크랩을 맨 앞에 추가
  scrapData.lastUpdated = new Date().toISOString();
  
  saveScrapData(scrapData);
  alert('게시글을 스크랩했습니다.');
};

// 스크랩 제거
export const removeScrap = (postId: number): void => {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const scrapData = getScrapData();
  scrapData.scraps = scrapData.scraps.filter(scrap => scrap.postId !== postId);
  scrapData.lastUpdated = new Date().toISOString();
  
  saveScrapData(scrapData);
  alert('스크랩을 해제했습니다.');
};

// 모든 스크랩 가져오기
export const getAllScraps = (): ScrapedPost[] => {
  const scrapData = getScrapData();
  return scrapData.scraps;
};

// 스크랩 여부 확인
export const isScraped = (postId: number): boolean => {
  const scrapData = getScrapData();
  return scrapData.scraps.some(scrap => scrap.postId === postId);
};

// 모든 스크랩 삭제
export const clearAllScraps = (): void => {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const confirmClear = window.confirm('모든 스크랩을 삭제하시겠습니까?');
  if (!confirmClear) return;

  const scrapData: ScrapData = {
    userId: currentUser,
    scraps: [],
    lastUpdated: new Date().toISOString()
  };
  
  saveScrapData(scrapData);
  alert('모든 스크랩이 삭제되었습니다.');
};

// 스크랩 관리자 객체
export const scrapManager: ScrapManager = {
  addScrap,
  removeScrap,
  getAllScraps,
  isScraped,
  clearAllScraps
};
