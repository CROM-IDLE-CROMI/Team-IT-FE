import type { Draft as DraftType } from "../types/Draft";

export type Draft = DraftType & {
  startDate?: string | Date | null;
  endDate?: string | Date | null;
  projectStartDate?: string | Date | null;
  selectedJobs?: { value: string; label: string }[];
};


const KEY = "TeamPage:drafts";       // Draft[]를 보관하는 단일 키
const MAX_DRAFTS = 10;               // 최대 10개
const isBrowser =
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

// Safari 프라이빗 모드, SSR 등 대비 메모리 폴백
const memoryFallback = new Map<string, string>();

// ──────────────────────────────────────────────────────────────
// 안전한 localStorage get/set/remove
// ──────────────────────────────────────────────────────────────
function getItemSafe(k: string): string | null {
  if (!isBrowser) return memoryFallback.get(k) ?? null;
  try {
    const v = window.localStorage.getItem(k);
    return v !== null ? v : memoryFallback.get(k) ?? null;
  } catch {
    return memoryFallback.get(k) ?? null;
  }
}

function setItemSafe(k: string, v: string) {
  if (!isBrowser) {
    memoryFallback.set(k, v);
    return;
  }
  try {
    window.localStorage.setItem(k, v);
  } catch {
    memoryFallback.set(k, v);
  }
}

function removeItemSafe(k: string) {
  if (!isBrowser) {
    memoryFallback.delete(k);
    return;
  }
  try {
    window.localStorage.removeItem(k);
  } catch {}
  memoryFallback.delete(k);
}

// ──────────────────────────────────────────────────────────────
// 내부용: Draft[] 읽고/쓰기
// ──────────────────────────────────────────────────────────────
function readList(): Draft[] {
  const raw = getItemSafe(KEY);
  if (!raw) return [];
  try {
    const list = JSON.parse(raw) as Draft[];
    if (!Array.isArray(list)) return [];
    return list;
  } catch {
    removeItemSafe(KEY);
    return [];
  }
}

function writeList(list: Draft[]) {
  const sorted = [...list].sort(
    (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
  );
  const limited = sorted.slice(0, MAX_DRAFTS);
  setItemSafe(KEY, JSON.stringify(limited));
}

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
// 외부 API
// ──────────────────────────────────────────────────────────────

/** 전체 목록 가져오기(최신순, 복원 포함) */
export function getDrafts(): Draft[] {
  return readList()
    .sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime())
    .map(parseDraft);
}

/** id로 단건 조회 */
export function getDraftById(id: string): Draft | undefined {
  const draft = getDrafts().find(d => d.id === id);
  return draft ? parseDraft(draft) : undefined;
}

/** 존재 여부 */
export function hasDrafts(): boolean {
  return getDrafts().length > 0;
}

/** 저장/갱신 (id가 같으면 갱신, 없으면 새로 추가) */
export function saveDraft(next: Draft): Draft[] {
  const list = readList();
  const idx = list.findIndex(d => d.id === next.id);
  const toSave: Draft = {
    ...next,
    // 직렬화: Date -> string, selectedJobs -> {value,label}
    startDate: next.startDate ? next.startDate.toString() : "",
    endDate: next.endDate ? next.endDate.toString() : "",
    projectStartDate: next.projectStartDate ? next.projectStartDate.toString() : "",
    selectedJobs: Array.isArray(next.selectedJobs)
      ? next.selectedJobs.map(j => ({ value: j.value, label: j.label }))
      : [],
  };

  if (idx >= 0) {
    list.splice(idx, 1, toSave);
  } else {
    list.unshift(toSave);
  }
  writeList(list);
  return getDrafts();
}

/** 삭제 후 목록 반환 */
export function deleteDraft(id: string): Draft[] {
  const remain = readList().filter(d => d.id !== id);
  writeList(remain);
  return getDrafts();
}

/** 전체 삭제 */
export function clearDrafts() {
  removeItemSafe(KEY);
}
