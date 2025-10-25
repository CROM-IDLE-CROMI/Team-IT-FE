import type { TeamFormData, Draft } from '../types/Draft';

const DRAFT_STORAGE_KEY = 'team_recruit_draft';

// 임시저장 데이터 저장
export const saveTeamDraft = (formData: TeamFormData): void => {
  try {
    console.log('저장할 formData:', formData); // 디버깅용
    
    const draft: Draft = {
      id: 'current_draft',
      title: formData.situation.title || '임시저장된 팀원 모집',
      data: {
        basicInfo: formData.basicInfo,
        projectInfo: formData.projectInfo,
        situation: formData.situation,
        workEnviron: formData.workEnviron,
        applicantInfo: formData.applicantInfo,
      },
      savedAt: new Date().toISOString(),
    };
    
    console.log('저장할 draft:', draft); // 디버깅용
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    console.log('팀원 모집 임시저장 완료');
  } catch (error) {
    console.error('임시저장 실패:', error);
  }
};

// 임시저장 데이터 불러오기
export const loadTeamDraft = (): TeamFormData | null => {
  try {
    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    console.log('로컬스토리지에서 불러온 데이터:', savedDraft); // 디버깅용
    
    if (!savedDraft) {
      console.log('저장된 데이터가 없습니다.');
      return null;
    }
    
    const draft: Draft = JSON.parse(savedDraft);
    console.log('파싱된 draft:', draft); // 디버깅용
    
    // 날짜 필드들을 Date 객체로 변환
    const convertDates = (stepData: any) => {
      const dateFields = ['startDate', 'endDate', 'projectStartDate'];
      const converted = { ...stepData };
      
      dateFields.forEach(field => {
        if (converted[field] && typeof converted[field] === 'string') {
          converted[field] = new Date(converted[field]);
        }
      });
      
      return converted;
    };
    
    const result = {
      basicInfo: convertDates(draft.data.basicInfo || {}),
      projectInfo: convertDates(draft.data.projectInfo || {}),
      situation: draft.data.situation || {},
      workEnviron: draft.data.workEnviron || {},
      applicantInfo: draft.data.applicantInfo || {},
    };
    
    console.log('변환된 TeamFormData:', result); // 디버깅용
    return result;
  } catch (error) {
    console.error('임시저장 데이터 불러오기 실패:', error);
    return null;
  }
};

// 임시저장 데이터 삭제
export const clearTeamDraft = (): void => {
  try {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    console.log('임시저장 데이터 삭제 완료');
  } catch (error) {
    console.error('임시저장 데이터 삭제 실패:', error);
  }
};

// 임시저장 데이터 존재 여부 확인
export const hasTeamDraft = (): boolean => {
  try {
    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    return savedDraft !== null;
  } catch (error) {
    console.error('임시저장 데이터 확인 실패:', error);
    return false;
  }
};

// 임시저장 데이터 정보 가져오기 (제목, 저장 시간 등)
export const getTeamDraftInfo = (): { title: string; savedAt: string } | null => {
  try {
    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!savedDraft) return null;
    
    const draft: Draft = JSON.parse(savedDraft);
    return {
      title: draft.title,
      savedAt: draft.savedAt,
    };
  } catch (error) {
    console.error('임시저장 정보 가져오기 실패:', error);
    return null;
  }
};
