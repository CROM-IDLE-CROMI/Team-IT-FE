// src/data/popularProjects.ts
export interface Project {
  id: number;
  title: string;
  author: string;
  date: string;
  location: {
    region: string;
    districts: string[];
  };
  techStack: string[];
  positions: string[];
  views: number;
  description: string;
  status: string;
  teamSize?: string;
  recruitPositions?: string[];
  recruitPeriod?: string;
  startDate?: string;
  endDate?: string;
  activityType?: string;
  progress?: string;
  method?: string;
  recruitEndDate?: string;
  contact?: string;
  // 지원서 관련 필드
  applicationQuestions?: string[];
  applicationDescription?: string;
}

// 인기 프로젝트 데이터 (실제 API에서 가져올 예정)
export const popularProjects: Project[] = [];

// 인기 프로젝트를 조회수 기준으로 정렬하는 함수
export const getPopularProjects = (limit: number = 4): Project[] => {
  return popularProjects
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
};
