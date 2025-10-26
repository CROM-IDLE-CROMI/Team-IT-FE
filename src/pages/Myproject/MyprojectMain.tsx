import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ProjectTable from "../../components/myproject/ProjectTable";
import "../../App.css";
import Header from "../../layouts/Header";

import type { ProjectData, ProjectStatus, Platform } from "../../types/project";
import { Platform as PlatformConst } from "../../types/project";

// --- platform 변환 함수 ---
function toPlatform(v: string): Platform {
  switch (v.toUpperCase()) {
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
  const upper = v.toUpperCase();
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

export default function MyProjectMain() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    fetch("/mocks/my-projects.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch projects");
        return res.json() as Promise<ProjectData[]>;
      })
      .then((data) => {
        if (cancelled) return;
        const formatted: ProjectData[] = data.map((p) => ({
          ...p,
          platform: toPlatform(p.platform as string),
          status: toStatus(p.status as string),
        }));
        setProjects(formatted);
      })
      .catch((err) => {
        console.error("프로젝트 데이터를 불러오지 못했습니다:", err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleProjectClick = (id: number) => {
    navigate(`/myproject/${id}`);
  };

  const ongoing = useMemo(
    () =>
      projects.filter(
        (p) => p.status === "ONGOING" || p.status === "RECRUITING"
      ),
    [projects]
  );

  const completed = useMemo(
    () => projects.filter((p) => p.status === "COMPLETED"),
    [projects]
  );

  if (loading) {
    return <div>프로젝트 목록을 불러오는 중...</div>;
  }

  // 공통 행 렌더링 함수
  const renderRow = (project: ProjectData, isCompleted: boolean) => (
    <tr key={project.id.toString()}>
      <td>
        <button
          onClick={() => handleProjectClick(project.id)}
          className="project-link"
        >
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
          headers={[
            "프로젝트 이름",
            "팀장",
            "플랫폼",
            "직군",
            "프로젝트 시작일",
            "진행 상태",
          ]}
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
