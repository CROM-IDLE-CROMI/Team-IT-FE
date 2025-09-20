// 팀원 모집 데이터를 프로젝트 형식으로 변환하는 유틸리티
import type { TeamFormData } from '../types/Draft';
import type { Project } from '../data/popularProjects';
import { getCurrentUser, getCurrentUserNickname } from './authUtils';

export const convertTeamDataToProject = (teamData: TeamFormData): Project => {
  const currentUser = getCurrentUser();
  const currentUserNickname = getCurrentUserNickname();
  
  // 현재 날짜를 YYYY.MM.DD 형식으로 변환
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  // 날짜 문자열을 Date 객체로 변환
  const parseDate = (dateString: string): Date => {
    return new Date(dateString);
  };

  // 날짜를 YYYY.MM.DD 형식으로 변환
  const formatDateString = (dateString: string): string => {
    if (!dateString) return '';
    const date = parseDate(dateString);
    return formatDate(date);
  };

  // 기본 정보에서 데이터 추출
  const basicInfo = teamData.basicInfo;
  const projectInfo = teamData.projectInfo;
  const situation = teamData.situation;
  const workEnviron = teamData.workEnviron;
  const applicantInfo = teamData.applicantInfo;

  // 프로젝트 제목 생성 (팀명 또는 기본 제목)
  const projectTitle = projectInfo.teamName || 
    `${basicInfo.platform || '프로젝트'} 팀원 모집`;

  // 기술 스택 추출 (객체 배열인 경우 value 속성만 추출)
  const techStack = (basicInfo.selectedTechStacks || []).map((tech: string | { value: string }) =>
    typeof tech === 'object' && tech !== null ? tech.value : tech
  );

  // 모집 포지션 추출 (객체 배열인 경우 value 속성만 추출)
  const positions = (basicInfo.selectedJobs || []).map((job: string | { value: string }) =>
    typeof job === 'object' && job !== null ? job.value : job
  );

  // 지역 정보 추출
  const location = {
    region: workEnviron.selectedRegion || '서울특별시',
    districts: (workEnviron.selectedLocations || []).map((loc: string | { value: string }) =>
      typeof loc === 'object' && loc !== null ? loc.value : loc
    )
  };

  // 프로젝트 설명 생성
  const description = situation.content || 
    `${basicInfo.platform || '프로젝트'} 개발을 위한 팀원을 모집합니다.`;

  // 팀 크기 계산
  const teamSize = `${(basicInfo.selectedJobs?.length || 0) + 1}명`;

  // 모집 기간 계산
  const startDate = basicInfo.startDate ? formatDateString(basicInfo.startDate) : '';
  const endDate = basicInfo.endDate ? formatDateString(basicInfo.endDate) : '';
  
  // 모집 마감일
  const recruitEndDate = basicInfo.endDate ? formatDateString(basicInfo.endDate) : '';

  // 활동 유형 (플랫폼)
  const activityType = basicInfo.platform || '웹';

  // 진행 상황
  const progress = situation.situation || '아이디어 구상 중';

  // 진행 방식
  const method = workEnviron.meetingType === '온라인' ? '온라인' : 
                 workEnviron.meetingType === '오프라인' ? '오프라인' : '온/오프라인';

  // 연락처 정보
  const contact = applicantInfo.contact || '';

  // 프로젝트 생성
  const project: Project = {
    id: Date.now(), // 고유 ID 생성
    title: projectTitle,
    author: currentUserNickname || currentUser || '익명',
    date: formatDate(new Date()),
    location,
    techStack,
    positions,
    views: 0, // 초기 조회수
    description,
    status: '모집중', // 팀원 모집 상태
    teamSize,
    recruitPositions: positions,
    recruitPeriod: projectInfo.period || '미정',
    startDate,
    endDate,
    activityType,
    progress,
    method,
    recruitEndDate,
    contact,
    // 지원서에 필요한 정보 추가
    applicationQuestions: applicantInfo.questions || [
      "프로젝트에 기여할 수 있는 기술은 무엇인가요?",
      "가장 기억에 남는 프로젝트 경험에 대해 설명해주세요.",
      "이 프로젝트에 지원하게 된 동기는 무엇인가요?"
    ],
    applicationDescription: description
  };

  return project;
};

// 팀원 모집 데이터 유효성 검사
export const validateTeamData = (teamData: TeamFormData): boolean => {
  const basicInfo = teamData.basicInfo;
  const projectInfo = teamData.projectInfo;
  const situation = teamData.situation;
  const workEnviron = teamData.workEnviron;
  const applicantInfo = teamData.applicantInfo;

  // 필수 필드 검사
  const requiredFields = [
    basicInfo.platform,
    basicInfo.selectedJobs?.length > 0,
    basicInfo.startDate,
    basicInfo.endDate,
    projectInfo.teamName,
    situation.content,
    workEnviron.meetingType,
    workEnviron.selectedRegion
  ];

  const isValid = requiredFields.every(field => field);
  
  if (!isValid) {
    console.log('팀원 모집 데이터 유효성 검사 실패:', {
      platform: basicInfo.platform,
      selectedJobs: basicInfo.selectedJobs,
      startDate: basicInfo.startDate,
      endDate: basicInfo.endDate,
      teamName: projectInfo.teamName,
      content: situation.content,
      meetingType: workEnviron.meetingType,
      selectedRegion: workEnviron.selectedRegion
    });
  }

  return isValid;
};

// 프로젝트 데이터를 localStorage에 저장
export const saveProjectToStorage = (project: Project): void => {
  try {
    const existingProjects = JSON.parse(localStorage.getItem('teamRecruitProjects') || '[]');
    const updatedProjects = [project, ...existingProjects];
    localStorage.setItem('teamRecruitProjects', JSON.stringify(updatedProjects));
  } catch (error) {
    console.error('프로젝트 저장 중 오류 발생:', error);
  }
};

// localStorage에서 팀원 모집 프로젝트 목록 가져오기
export const getTeamRecruitProjects = (): Project[] => {
  try {
    return JSON.parse(localStorage.getItem('teamRecruitProjects') || '[]');
  } catch (error) {
    console.error('프로젝트 불러오기 중 오류 발생:', error);
    return [];
  }
};

// 모든 프로젝트 (기존 + 팀원 모집) 가져오기
export const getAllProjects = (): Project[] => {
  const teamRecruitProjects = getTeamRecruitProjects();
  // 기존 popularProjects는 별도로 관리되므로 여기서는 팀원 모집 프로젝트만 반환
  return teamRecruitProjects;
};
