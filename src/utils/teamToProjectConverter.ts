// 팀원 모집 데이터를 API 요청 본문 형식으로 변환하는 유틸리티
import type { TeamFormData } from '../types/Draft';
import type { TeamRecruitCreateRequest } from '../services/teamRecruitService';
import type { Project } from '../data/popularProjects';

/**
 * 날짜 문자열을 ISO 8601 형식(YYYY-MM-DDTHH:mm:ss.sssZ)으로 변환
 */
const formatDateToISO = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString();
};

/**
 * TeamFormData를 TeamRecruitCreateRequest로 변환
 */
export const convertTeamDataToProject = (teamData: TeamFormData): TeamRecruitCreateRequest => {
  // 기본 정보에서 데이터 추출
  const basicInfo = teamData.basicInfo;
  const projectInfo = teamData.projectInfo;
  const situation = teamData.situation;
  const workEnviron = teamData.workEnviron;
  const applicantInfo = teamData.applicantInfo;

  // 프로젝트 제목 (situation.title 또는 projectInfo.teamName 사용)
  const title = situation.title || projectInfo.teamName || '팀원 모집';

  // 프로젝트명 (projectInfo.teamName 사용)
  const projectName = projectInfo.teamName || title;

  // 플랫폼 (basicInfo.platform 사용)
  const platform = basicInfo.platform || 'WEB';

  // 플랫폼 상세 (basicInfo.customPlatform 사용)
  const platformDetail = basicInfo.customPlatform || undefined;

  // 모집 포지션 추출 (객체 배열인 경우 value 속성만 추출)
  const recruitPositions = (basicInfo.selectedJobs || []).map((job: any) => 
    typeof job === 'object' && job !== null ? job.value : job
  );

  // 모집 상세 (projectInfo.selectedJobs 추가 정보)
  const recruitDetail = projectInfo.selectedJobs 
    ? (projectInfo.selectedJobs || []).map((job: any) => 
        typeof job === 'object' && job !== null ? job.value : job
      )
    : undefined;

  // 필수 기술 스택 추출 (객체 배열인 경우 value 속성만 추출)
  const requireStack = (basicInfo.selectedTechStacks || []).map((tech: any) => 
    typeof tech === 'object' && tech !== null ? tech.value : tech
  );

  // 카테고리 및 카테고리 상세
  const category = projectInfo.playType || undefined;
  const categoryDetail = projectInfo.customPlayType || undefined;

  // 날짜 변환 (ISO 8601 형식)
  const startDate = basicInfo.startDate ? formatDateToISO(basicInfo.startDate) : undefined;
  const endDate = basicInfo.endDate ? formatDateToISO(basicInfo.endDate) : undefined;
  const expectedStartDate = projectInfo.projectStartDate 
    ? formatDateToISO(projectInfo.projectStartDate) 
    : undefined;

  // 프로젝트 상태
  const projectStatus = situation.progress || undefined;
  const statusDetail = situation.customProgress || undefined;

  // 아이디어 설명 (situation.content 사용)
  const ideaExplain = situation.content || '';

  // 미팅 방식 (workEnviron.meetingType 사용)
  const meetingApproach = workEnviron.meetingType || undefined;

  // 지역 정보 (locations 배열로 변환)
  const locations: string[] = [];
  if (workEnviron.selectedRegion) {
    locations.push(workEnviron.selectedRegion);
  }
  if (workEnviron.selectedLocations && workEnviron.selectedLocations.length > 0) {
    workEnviron.selectedLocations.forEach((loc: any) => {
      const locationStr = typeof loc === 'object' && loc !== null ? loc.value : loc;
      if (locationStr && !locations.includes(locationStr)) {
        locations.push(locationStr);
      }
    });
  }

  // 최소 요건
  const minRequest = applicantInfo.minRequirement || undefined;

  // 지원자 질문
  const applicantQuestions = applicantInfo.questions && applicantInfo.questions.length > 0
    ? applicantInfo.questions
    : undefined;

  // API 요청 본문 생성
  const requestData: TeamRecruitCreateRequest = {
    title,
    projectName,
    platform,
    ...(platformDetail && { platformDetail }),
    recruitPositions,
    ...(recruitDetail && recruitDetail.length > 0 && { recruitDetail }),
    requireStack,
    ...(category && { category }),
    ...(categoryDetail && { categoryDetail }),
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
    ...(expectedStartDate && { expectedStartDate }),
    ...(projectStatus && { projectStatus }),
    ...(statusDetail && { statusDetail }),
    ideaExplain,
    ...(meetingApproach && { meetingApproach }),
    locations,
    ...(minRequest && { minRequest }),
    ...(applicantQuestions && { applicantQuestions }),
  };

  return requestData;
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

// TODO: 백엔드 API로 프로젝트 저장
export const saveProjectToStorage = (project: Project): void => {
  try {
    // TODO: 백엔드 API 호출로 대체 필요
    // 예시: POST /api/team-recruit
    console.log('프로젝트 저장 데이터:', project);
  } catch (error) {
    console.error('프로젝트 저장 중 오류 발생:', error);
  }
};

// TODO: 백엔드 API에서 팀원 모집 프로젝트 목록 가져오기
export const getTeamRecruitProjects = (): Project[] => {
  try {
    // TODO: 백엔드 API 호출로 대체 필요
    // 예시: GET /api/team-recruit
    console.log('팀원 모집 프로젝트 목록 조회');
    return [];
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
