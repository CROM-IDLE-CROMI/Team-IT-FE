
import  type { Draft as DraftType } from "../types/Draft";

const KEY = "TeamPage:drafts";       // Draft[]를 보관하는 단일 키
const MAX_DRAFTS = 10;                  // 최대 10개
const isBrowser =
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

// Safari 프라이빗 모드, SSR 등 대비 메모리 폴백
const memoryFallback = new Map<string, string>();
// localStorageUtils.ts
export type Draft = DraftType;


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
    // 용량 초과/프라이빗 모드 등 → 메모리에라도 보관
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
  } catch {
    // ignore
  }
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
    // 손상 시 정리
    removeItemSafe(KEY);
    return [];
  }
}

function writeList(list: Draft[]) {
  // 저장 전 정렬(최신 우선) 보장 및 상한 적용
  const sorted = [...list].sort(
    (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
  );
  const limited = sorted.slice(0, MAX_DRAFTS);
  setItemSafe(KEY, JSON.stringify(limited));
}

// ──────────────────────────────────────────────────────────────
// 공개 API
// ──────────────────────────────────────────────────────────────

/** 전체 목록 가져오기(최신순) */
export function getDrafts(): Draft[] {
  return readList().sort(
    (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
    
  );
}
/** id로 단건 조회 */
export function getDraftById(id: string): Draft | undefined {
  return getDrafts().find(d => d.id === id);
}

/** 존재 여부 빠르게 확인 */
export function hasDrafts(): boolean {
  return getDrafts().length > 0;
}

/** 저장/갱신 (id가 같으면 갱신, 없으면 새로 추가). 반환값은 저장 후의 전체 목록 */
export function saveDraft(next: Draft): Draft[] {
  const list = readList();
  const idx = list.findIndex(d => d.id === next.id);
  if (idx >= 0) {
    // 갱신: 기존 항목을 새 값으로 교체
    list.splice(idx, 1, next);
  } else {
    // 새로 추가: 맨 앞으로
    list.unshift(next);
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

/** 전체 비우기(동일 키만) */
export function clearDrafts() {
  removeItemSafe(KEY);
}

/**
 * 다른 탭에서 변경되었을 때 감지하려면 window의 "storage" 이벤트를 사용하세요.
 *   window.addEventListener("storage", (e) => { if (e.key === KEY) { ... } });
 * 이 유틸은 순수 데이터 계층만 담당합니다.
 */
