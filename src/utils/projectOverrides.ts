// src/utils/projectOverrides.ts
import type { ProjectData } from "../types/project";

const KEY = "my-project-overrides"; // { [id]: ProjectData(partial) }

type Overrides = Record<string, Partial<ProjectData>>;

export function getOverride(id: number | string): Partial<ProjectData> | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  const map: Overrides = JSON.parse(raw);
  return map[String(id)] ?? null;
}

export function setOverride(id: number | string, patch: Partial<ProjectData>) {
  const raw = localStorage.getItem(KEY);
  const map: Overrides = raw ? JSON.parse(raw) : {};
  map[String(id)] = { ...(map[String(id)] ?? {}), ...patch };
  localStorage.setItem(KEY, JSON.stringify(map));
}
