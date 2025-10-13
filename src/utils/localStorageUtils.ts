// TODO: 백엔드 API로 임시저장 기능 구현 필요
// 모든 함수를 백엔드 API 호출로 대체해야 합니다.

import type { Draft as DraftType } from "../types/Draft";

export type Draft = DraftType & {
  startDate?: string | Date | null;
  endDate?: string | Date | null;
  projectStartDate?: string | Date | null;
  selectedJobs?: { value: string; label: string }[];
};

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
// 외부 API - 백엔드 연동 필요
// ──────────────────────────────────────────────────────────────

/** 전체 목록 가져오기(최신순, 복원 포함) */
export function getDrafts(): Draft[] {
  // TODO: 백엔드 API 호출로 대체 필요
  // 예시: GET /api/drafts
  console.log('임시저장 목록 조회');
  return [];
}

/** id로 단건 조회 */
export function getDraftById(id: string): Draft | undefined {
  // TODO: 백엔드 API 호출로 대체 필요
  // 예시: GET /api/drafts/:id
  console.log('임시저장 단건 조회:', id);
  return undefined;
}

/** 존재 여부 */
export function hasDrafts(): boolean {
  // TODO: 백엔드 API 호출로 대체 필요
  // 예시: GET /api/drafts/count
  console.log('임시저장 존재 여부 확인');
  return false;
}

/** 저장/갱신 (id가 같으면 갱신, 없으면 새로 추가) */
export function saveDraft(next: Draft): Draft[] {
  // TODO: 백엔드 API 호출로 대체 필요
  // 예시: POST /api/drafts (신규) 또는 PUT /api/drafts/:id (수정)
  console.log('임시저장 저장/갱신:', next);
  return [];
}

/** 삭제 후 목록 반환 */
export function deleteDraft(id: string): Draft[] {
  // TODO: 백엔드 API 호출로 대체 필요
  // 예시: DELETE /api/drafts/:id
  console.log('임시저장 삭제:', id);
  return [];
}

/** 전체 삭제 */
export function clearDrafts() {
  // TODO: 백엔드 API 호출로 대체 필요
  // 예시: DELETE /api/drafts
  console.log('임시저장 전체 삭제');
}
