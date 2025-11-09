import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ProjectTable from "../../components/myproject/ProjectTable";
import "../../App.css";
import Header from "../../layouts/Header";

import type { ProjectData, ProjectStatus, Platform } from "../../types/project";
import { Platform as PlatformConst } from "../../types/project";

// ---- 환경/토큰 ----
const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ?? "";

const getAuthToken = () => {
  const raw = localStorage.getItem("accessToken");
  if (!raw) return null;
  const t = raw.trim();
  return t && t !== "undefined" && t !== "null" ? t : null;
};

// --- platform 변환 함수 ---
function toPlatform(v: string): Platform {
  switch ((v ?? "").toString().toUpperCase()) {
    case "WEB":
      return PlatformConst.WEB;
    case "APP":
      return PlatformConst.APP;
    case "GAME":
      return PlatformConst.GAME;
    case "ETC":
      return PlatformConst.ETC;
    default:
      throw new Error(`Unknown platform: ${v}`);
  }
}

// --- status 변환 함수 (소문자 → 대문자 보정) ---
function toStatus(v: string): ProjectStatus {
  const upper = (v ?? "").toString().toUpperCase();
  if (upper === "ONGOING" || upper === "RECRUITING" || upper === "COMPLETED") {
    return upper as ProjectStatus;
  }
  throw new Error(`Unknown status: ${v}`);
}

// --- 상태 표시 함수 ---
function getStatusLabel(project: ProjectData, isCompleted: boolean): string {
  if (isCompleted) {
    return project.isComplete ? "완료됨" : "미완료";
  }
  if (project.status === "RECRUITING") return "모집중";
  return "진행중";
}

// --- API 우선, 실패 시 목 폴백 ---
async function fetchProjectsWithFallback(signal?: AbortSignal): Promise<ProjectData[]> {
  // 1) API 시도
  if (API_BASE_URL) {
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_BASE_URL}/v1/my-projects`, {
        method: "GET",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Content-Type": "application/json",
        },
        signal,
      });
      if (res.ok) {
        const data = (await res.json()) as ProjectData[];
        if (Array.isArray(data) && data.length >= 0) return data;
        // 데이터 구조가 예상과 달라도 폴백
      }
    } catch (err) {
      // 네트워크/권한 문제 → 폴백
    }
  }

  // 2) 목 파일 폴백
  const mockRes = await fetch("/mocks/my-projects.json", { signal });
  if (!mockRes.ok) throw new Error("목 데이터 로드 실패");
  return (await mockRes.json()) as ProjectData[];
}

export default function MyProjectMain() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const raw = await fetchProjectsWithFallback(controller.signal);

        // 플랫폼/상태 보정
        const formatted: ProjectData[] = raw.map((p) => ({
          ...p,
          platform:
            typeof p.platform === "string" ? toPlatform(p.platform) : p.platform,
          status: typeof p.status === "string" ? toStatus(p.status) : p.status,
        }));

        setProjects(formatted);
      } catch (err) {
        console.error("프로젝트 데이터를 불러오지 못했습니다:", err);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  const handleProjectClick = (id: number) => {
    navigate(`/myproject/${id}`);
  };

  const ongoing = useMemo(
    () => projects.filter((p) => p.status === "ONGOING" || p.status === "RECRUITING"),
    [projects]
  );

  const completed = useMemo(
    () => projects.filter((p) => p.status === "COMPLETED"),
    [projects]
  );

  if (loading) {
    return <div>프로젝트 목록을 불러오는 중...</div>;
  }

  const renderRow = (project: ProjectData, isCompleted: boolean) => (
    <tr key={project.id.toString()}>
      <td>
        <button onClick={() => handleProjectClick(project.id)} className="project-link">
          {project.project_name ?? project.title}
        </button>
      </td>
      <td>{project.owner_id}</td>
      <td>{project.platform}</td>
      <td>{project.role}</td>
      <td>{project.start_date}</td>
      {isCompleted && <td>{project.end_date}</td>}
      <td>{getStatusLabel(project, isCompleted)}</td>
    </tr>
  );

  return (
    <>
      <div className="content-header">
        <Header />
      </div>
      <div className="myproject-container">
        <ProjectTable
          title="내가 진행중인 프로젝트"
          headers={["프로젝트 이름", "팀장", "플랫폼", "직군", "프로젝트 시작일", "진행 상태"]}
        >
          {ongoing.map((p) => renderRow(p, false))}
        </ProjectTable>

        <ProjectTable
          title="내가 완료한 프로젝트"
          headers={[
            "프로젝트 이름",
            "팀장",
            "플랫폼",
            "직군",
            "프로젝트 시작일",
            "프로젝트 마감일",
            "진행 상태",
          ]}
        >
          {completed.map((p) => renderRow(p, true))}
        </ProjectTable>
      </div>
    </>
  );
}
