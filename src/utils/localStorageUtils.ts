// 로컬스토리지 기반 임시저장 기능 구현

import type { Draft as DraftType } from "../types/Draft";

export type Draft = DraftType & {
  startDate?: string | Date | null;
  endDate?: string | Date | null;
  projectStartDate?: string | Date | null;
  selectedJobs?: { value: string; label: string }[];
};

const STORAGE_KEY = 'crom_drafts';

// ──────────────────────────────────────────────────────────────
// Draft 역직렬화: Date/selectedJobs 복원
// ──────────────────────────────────────────────────────────────
export function parseDraft(d: Draft): Draft {
  return {
    ...d,
    startDate: d.startDate ? new Date(d.startDate) : null,
    endDate: d.endDate ? new Date(d.endDate) : null,
    projectStartDate: d.projectStartDate ? new Date(d.projectStartDate) : null,
    selectedJobs: Array.isArray(d.selectedJobs)
      ? d.selectedJobs.map((job: any) =>
          typeof job === "string" ? { value: job, label: job } : job
        )
      : [],
  };
}

// ──────────────────────────────────────────────────────────────
// 로컬스토리지 헬퍼 함수들
// ──────────────────────────────────────────────────────────────

/** 로컬스토리지에서 모든 임시저장 가져오기 */
function getAllDraftsFromStorage(): Draft[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('임시저장 목록 불러오기 실패:', error);
    return [];
  }
}

/** 로컬스토리지에 임시저장 목록 저장 */
function saveDraftsToStorage(drafts: Draft[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
  } catch (error) {
    console.error('임시저장 목록 저장 실패:', error);
  }
}

// ──────────────────────────────────────────────────────────────
// 외부 API - 로컬스토리지 기반 구현
// ──────────────────────────────────────────────────────────────

/** 전체 목록 가져오기(최신순, 복원 포함) */
export function getDrafts(): Draft[] {
  const drafts = getAllDraftsFromStorage();
  // 최신순 정렬 (savedAt 기준 내림차순)
  return drafts.sort((a, b) => 
    new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
  ).map(parseDraft);
}

/** id로 단건 조회 */
export function getDraftById(id: string): Draft | undefined {
  const drafts = getAllDraftsFromStorage();
  const draft = drafts.find(d => d.id === id);
  return draft ? parseDraft(draft) : undefined;
}

/** 존재 여부 */
export function hasDrafts(): boolean {
  const drafts = getAllDraftsFromStorage();
  return drafts.length > 0;
}

/** 저장/갱신 (id가 같으면 갱신, 없으면 새로 추가) */
export function saveDraft(next: Draft): Draft[] {
  const drafts = getAllDraftsFromStorage();
  const existingIndex = drafts.findIndex(d => d.id === next.id);
  
  if (existingIndex !== -1) {
    // 기존 임시저장 갱신
    drafts[existingIndex] = {
      ...next,
      savedAt: new Date().toISOString(),
    };
  } else {
    // 새로운 임시저장 추가
    drafts.push({
      ...next,
      savedAt: new Date().toISOString(),
    });
  }
  
  saveDraftsToStorage(drafts);
  return getDrafts();
}

/** 삭제 후 목록 반환 */
export function deleteDraft(id: string): Draft[] {
  const drafts = getAllDraftsFromStorage();
  const filtered = drafts.filter(d => d.id !== id);
  saveDraftsToStorage(filtered);
  return getDrafts();
}

/** 전체 삭제 */
export function clearDrafts() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('임시저장 전체 삭제 실패:', error);
  }
}
