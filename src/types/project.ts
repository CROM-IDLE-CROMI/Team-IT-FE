// --- 프로젝트 상태 ---
export type ProjectStatus = 'RECRUITING' | 'ONGOING' | 'COMPLETED';

// --- 플랫폼 종류 ---
export const Platform = {
  WEB: 'WEB',
  APP: 'APP',
  GAME: 'GAME',
  ETC: 'ETC',
} as const;

export type Platform = typeof Platform[keyof typeof Platform];

// 화면에 보여줄 한글 라벨 맵
export const PlatformLabel: Record<Platform, string> = {
  WEB: '웹',
  APP: '앱',
  GAME: '게임',
  ETC: '기타',
};

// --- 모집 포지션 ---
export interface RecruitPosition {
  position: string;
  count: number;
}

// --- 프로젝트 멤버 ---
export interface Member {
  id: number;
  name?: string;       // 상세에서는 name, 목록에서는 nickname 같은 변형 가능
  nickname?: string;
  email?: string;
  role: string;
  techStack?: string;
  rating?: number;
}

// --- 마일스톤 ---
export interface Milestone {
  id: number;
  title: string;
  nickname: string;
  progress: number;
  deadline: string;
}

// --- 프로젝트 데이터 ---
export interface ProjectData {
  // 공통
  id: number;
  title: string;                  // 상세
  project_name?: string;          // 목록 (백엔드 JSON이 다를 경우 대응)
  owner_id?: string;
  platform: Platform;
  role?: string;
  status: ProjectStatus;

  // 날짜
  start_date: string;
  end_date?: string;

  // 상세 정보
  description?: string;
  progress?: number | null;
  recruit_positions?: RecruitPosition[] | null;
  required_stacks?: string[] | null;
  members?: Member[] | null;
  milestones?: Milestone[] | null;

  // 부가정보
  type?: string;
  stack?: string;
  isComplete?: boolean;
  logoUrl?: string;
}

// --- JSON 원본 타입 (id, platform 변환 전 상태) ---
export type RawProject = Omit<ProjectData, 'id' | 'platform'> & {
  id: string | number;
  platform: string;
};

// --- 백엔드 API 응답 타입 (최신 API 스펙) ---
export interface ProjectApiResponse {
  projectId: number;
  title: string;
  projectName: string;
  createdAt: string;
  viewCount: number;
  memberNum: number;
  validFrom: string;
  validTo: string;
  platform: string;
  platformDetail: string;
  recruitPositions: string[];
  recruitDetail: string[];
  requireStack: string[];
  category: string;
  categoryDetail: string;
  startDate: string;
  endDate: string;
  expectedStartDate: string;
  projectStatus: string;
  statusDetail: string;
  ideaExplain: string;
  meetingApproach: string;
  locations: string[];
  minRequest: string;
  applicantQuestions: string[];
  creatorId: string;
  creatorNickname: string;
  creatorProfileImageUrl: string;
}

// --- 프로젝트 댓글 타입 ---
export interface ProjectCommentApiResponse {
  id: number;
  projectId: number;
  writerId: string;
  writerNickname: string;
  writerProfileImageUrl: string;
  content: string;
  parentCommentId: number | null;
  createdAt: string;
  updatedAt: string;
  replies: ProjectCommentApiResponse[]; // API 스펙에서는 string[]로 표시되지만 실제로는 객체 배열
}

export interface ProjectCommentListResponse extends Array<ProjectCommentApiResponse> {}

export interface ProjectCommentCreateRequest {
  content: string;
  parentCommentId?: number | null; // 대댓글인 경우 부모 댓글 ID
}

export interface ProjectCommentUpdateRequest {
  content: string;
}

export interface ProjectCommentCreateResponse {
  code: number;
  message: string;
  data: ProjectCommentApiResponse;
}

export interface ProjectCommentUpdateResponse {
  code: number;
  message: string;
  data: ProjectCommentApiResponse;
}