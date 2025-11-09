// utils/teamDraftUtils.ts
import type { TeamFormData, Draft } from '../types/Draft';

const DRAFT_STORAGE_KEY = 'team_recruit_draft';

// 빈 값은 허용하지만, 루트 저장 문자열이 깨진 경우만 거르는 가드
const isBadStoredValue = (v: string | null) => {
  if (v === null) return true;
  const t = v.trim();
  return t === '' || t === 'undefined' || t === 'null';
};

const safeParse = <T = any>(raw: string): T | null => {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

// 폼 기본형 (빈 값 허용)
const defaultFormData = (): TeamFormData => ({
  basicInfo: {
    startDate: '', endDate: '', platform: '', customPlatform: '',
    selectedJobs: [], customJob: '', peopleCount: '', selectedTechStacks: []
  },
  projectInfo: {
    teamName: '', selectedJobs: [], customJob: '', otherText: '',
    playType: '', customPlayType: '', startDate: '', endDate: '', projectStartDate: ''
  },
  situation: {
    title: '', progress: '', customProgress: '', content: '', otherText: ''
  },
  workEnviron: {
    meetingType: '', locationComplete: false, selectedLocations: [], selectedRegion: '서울특별시'
  },
  applicantInfo: {
    questions: [], minRequirement: ''
  },
});

// 저장 시 undefined가 들어가지 않게 보정
export const saveTeamDraft = (formData: TeamFormData): void => {
  try {
    const data: TeamFormData = {
      ...defaultFormData(),
      basicInfo:   { ...defaultFormData().basicInfo,   ...formData.basicInfo },
      projectInfo: { ...defaultFormData().projectInfo, ...formData.projectInfo },
      situation:   { ...defaultFormData().situation,   ...formData.situation },
      workEnviron: { ...defaultFormData().workEnviron, ...formData.workEnviron },
      applicantInfo:{...defaultFormData().applicantInfo,...formData.applicantInfo },
    };

    const draft: Draft = {
      id: 'current_draft',
      title: data.situation.title || '임시저장된 팀원 모집',
      data,
      savedAt: new Date().toISOString(),
    };

    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
  } catch (error) {
    console.error('임시저장 실패:', error);
  }
};

// 불러올 때는 루트 문자열만 검증, 내부 필드는 빈 값 허용
export const loadTeamDraft = (): TeamFormData | null => {
  try {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (isBadStoredValue(raw)) return null;

    const draft = safeParse<Draft>(raw!);
    if (!draft || !draft.data) return null;

    // ⚠️ 날짜를 Date 객체로 바꾸지 않음(폼은 문자열을 기대)
    const merged: TeamFormData = {
      ...defaultFormData(),
      basicInfo:     { ...defaultFormData().basicInfo,     ...(draft.data.basicInfo ?? {}) },
      projectInfo:   { ...defaultFormData().projectInfo,   ...(draft.data.projectInfo ?? {}) },
      situation:     { ...defaultFormData().situation,     ...(draft.data.situation ?? {}) },
      workEnviron:   { ...defaultFormData().workEnviron,   ...(draft.data.workEnviron ?? {}) },
      applicantInfo: { ...defaultFormData().applicantInfo, ...(draft.data.applicantInfo ?? {}) },
    };

    return merged;
  } catch (error) {
    console.error('임시저장 데이터 불러오기 실패:', error);
    return null;
  }
};

export const clearTeamDraft = (): void => {
  try {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch (error) {
    console.error('임시저장 데이터 삭제 실패:', error);
  }
};

// 존재 여부 판단 시 'undefined'/'null'/빈문자열은 없음으로 간주
export const hasTeamDraft = (): boolean => {
  try {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
    return !isBadStoredValue(raw);
  } catch (error) {
    console.error('임시저장 데이터 확인 실패:', error);
    return false;
  }
};

export const getTeamDraftInfo = (): { title: string; savedAt: string } | null => {
  try {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (isBadStoredValue(raw)) return null;

    const draft = safeParse<Draft>(raw!);
    if (!draft) return null;

    return { title: draft.title, savedAt: draft.savedAt };
  } catch (error) {
    console.error('임시저장 정보 가져오기 실패:', error);
    return null;
  }
};
