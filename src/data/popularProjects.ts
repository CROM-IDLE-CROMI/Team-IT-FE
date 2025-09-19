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

// 인기 프로젝트 데이터 (좋아요 수 기준으로 정렬)
export const popularProjects: Project[] = [
  {
    id: 1,
    title: "웹 개발 프로젝트 팀원 모집",
    author: "김한성",
    date: "2025.01.15",
    location: { region: "서울특별시", districts: ["강남구"] },
    techStack: ["React", "MongoDB"],
    positions: ["프론트", "백"],
    views: 45,
    description: "혁신적인 웹 서비스를 개발하는 프로젝트입니다. React와 Node.js를 사용하여 풀스택 개발을 진행합니다.",
    status: "모집중",
    teamSize: "3명",
    recruitPositions: ["프론트", "백"],
    recruitPeriod: "3개월",
    startDate: "2025.02.01",
    endDate: "2025.05.01",
    activityType: "웹",
    progress: "아이디어 구상 중",
    method: "온/오프라인",
    recruitEndDate: "2025.01.30"
  },
  {
    id: 3,
    title: "AI 프로젝트 팀원 모집",
    author: "박민수",
    date: "2025.01.13",
    location: { region: "대구광역시", districts: ["수성구"] },
    techStack: ["Python", "TensorFlow", "FastAPI"],
    positions: ["백", "기타"],
    views: 67,
    description: "머신러닝을 활용한 예측 모델을 개발하는 프로젝트입니다. 데이터 분석과 AI 모델링 경험이 있는 분을 찾습니다.",
    status: "모집중",
    teamSize: "4명",
    recruitPositions: ["기타", "백"],
    recruitPeriod: "6개월",
    startDate: "2025.02.15",
    endDate: "2025.08.15",
    activityType: "앱",
    progress: "개발 진행 중",
    method: "오프라인",
    recruitEndDate: "2025.02.10"
  },
  {
    id: 4,
    title: "게임 개발 프로젝트",
    author: "최영희",
    date: "2025.01.12",
    location: { region: "인천광역시", districts: ["연수구"] },
    techStack: ["Unity", "C#"],
    positions: ["기획", "디자인"],
    views: 89,
    description: "Unity를 사용한 3D 게임을 개발합니다. 게임 개발 경험이 있거나 열정이 있는 분을 찾습니다.",
    status: "모집중",
    teamSize: "5명",
    recruitPositions: ["기획", "디자인"],
    recruitPeriod: "8개월",
    startDate: "2025.03.01",
    endDate: "2025.11.01",
    activityType: "게임",
    progress: "아이디어 구상 중",
    method: "온/오프라인",
    recruitEndDate: "2025.02.25"
  },
  {
    id: 7,
    title: "IoT 스마트홈 프로젝트",
    author: "김태현",
    date: "2025.01.09",
    location: { region: "서울특별시", districts: ["마포구"] },
    techStack: ["Arduino", "Raspberry Pi", "Python"],
    positions: ["프론트", "백", "PM"],
    views: 52,
    description: "IoT 센서를 활용한 스마트홈 시스템을 개발합니다. 하드웨어와 소프트웨어 모두 경험이 있는 분을 찾습니다.",
    status: "모집중",
    teamSize: "4명",
    recruitPositions: ["프론트", "백", "PM"],
    recruitPeriod: "6개월",
    startDate: "2025.02.01",
    endDate: "2025.08.01",
    activityType: "웹",
    progress: "아이디어 구상 중",
    method: "온/오프라인",
    recruitEndDate: "2025.01.28"
  },
  {
    id: 8,
    title: "VR/AR 교육 콘텐츠",
    author: "박서연",
    date: "2025.01.08",
    location: { region: "부산광역시", districts: ["중구"] },
    techStack: ["Unity", "C#", "Blender"],
    positions: ["기획", "디자인", "프론트"],
    views: 73,
    description: "VR/AR을 활용한 교육 콘텐츠를 개발합니다. 3D 모델링과 게임 개발 경험이 있는 분을 찾습니다.",
    status: "모집중",
    teamSize: "5명",
    recruitPositions: ["기획", "디자인", "프론트"],
    recruitPeriod: "8개월",
    startDate: "2025.03.01",
    endDate: "2025.11.01",
    activityType: "게임",
    progress: "아이디어 기획 중",
    method: "오프라인",
    recruitEndDate: "2025.02.28"
  },
  {
    id: 2,
    title: "모바일 앱 개발자 구합니다",
    author: "이지은",
    date: "2025.01.14",
    location: { region: "부산광역시", districts: ["해운대구"] },
    techStack: ["Flutter", "Firebase"],
    positions: ["프론트"],
    views: 32,
    description: "Flutter를 사용한 크로스 플랫폼 모바일 앱을 개발합니다. UI/UX에 관심 있는 개발자를 찾습니다.",
    status: "모집중",
    teamSize: "2명",
    recruitPositions: ["프론트"],
    recruitPeriod: "2개월",
    startDate: "2025.01.20",
    endDate: "2025.03.20",
    activityType: "앱",
    progress: "아이디어 기획 중",
    method: "온라인",
    recruitEndDate: "2025.01.25"
  },
];

// 인기 프로젝트를 조회수 기준으로 정렬하는 함수
export const getPopularProjects = (limit: number = 4): Project[] => {
  return popularProjects
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
};
