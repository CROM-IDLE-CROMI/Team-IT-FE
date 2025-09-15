
// --- 프로젝트 상태 ---
export type ProjectStatus = 'RECRUITING' | 'ONGOING' | 'COMPLETED';

// --- 모집 포지션 ---
export interface RecruitPosition {
  position: string;
  count: number;
}

// --- 프로젝트 멤버 ---
export interface Member {
  id: string;
  name: string;
  role: string;
}

// --- 마일스톤 ---
export interface Milestone {
  id: string;
  title: string;
  progress: number;
}

// --- 프로젝트 데이터 ---
export interface ProjectData {
  id: number;
  title: string;
  status: ProjectStatus;
  description: string;
  progress: number | null;
  recruit_positions: RecruitPosition[] | null;
  required_stacks: string[] | null;
  members: Member[] | null;
  milestones: Milestone[] | null;
  logoUrl?: string;
}