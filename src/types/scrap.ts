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
  addScrap: (post: Omit<ScrapedPost, 'id' | 'scrapedAt'>) => Promise<void>;
  removeScrap: (postId: number) => Promise<void>;
  getAllScraps: () => Promise<ScrapedPost[]>;
  isScraped: (postId: number) => boolean;
  clearAllScraps: () => Promise<void>;
}
