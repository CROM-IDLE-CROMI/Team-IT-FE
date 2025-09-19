// 스크랩 관련 타입 정의

export interface ScrapedPost {
  id: number;
  postId: number; // 원본 게시글 ID
  title: string;
  author: string;
  content: string;
  category: string;
  date: string;
  views: number;
  scrapedAt: string; // 스크랩한 날짜
  originalPost: {
    id: number;
    title: string;
    author: string;
    content: string;
    category: string;
    date: string;
    views: number;
  };
}

export interface ScrapData {
  userId: string;
  scraps: ScrapedPost[];
  lastUpdated: string;
}

// 스크랩 액션 타입
export type ScrapAction = 'add' | 'remove' | 'getAll' | 'clear';

// 스크랩 관리 함수 타입
export interface ScrapManager {
  addScrap: (post: Omit<ScrapedPost, 'id' | 'scrapedAt'>) => void;
  removeScrap: (postId: number) => void;
  getAllScraps: () => ScrapedPost[];
  isScraped: (postId: number) => boolean;
  clearAllScraps: () => void;
}

// 타입들을 named export로만 사용
// TypeScript에서 interface와 type은 값이 아니므로 default export에서 제거
