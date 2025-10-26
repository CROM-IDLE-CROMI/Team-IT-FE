// ProjectDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../App.css";
import ProgressBar from "../../components/ProgressBar";
import ProjectSidebar from "../../components/myproject/ProjectSidebar";
import Header from "../../layouts/Header";

import type { ProjectData } from "../../types/project";

// --- 메인 컴포넌트 ---
export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    fetch(`/mocks/project-${id}.json`)
      .then((response) => response.json())
      .then((data) => setProject(data))
      .catch((error) =>
        console.error("데이터를 불러오는 데 실패했습니다:", error)
      )
      .finally(() => setLoading(false));
  }, [id]);

  // 수정 버튼 클릭 시 경로를 올바르게 수정
  const handleEditClick = () => {
    navigate(`/myproject/${id}/edit`);
  };

  // 메인 컨텐츠를 상태에 따라 다르게 렌더링
  const renderMainContent = () => {
    if (!project) return null;

    switch (project.status) {
      case "ONGOING":
        return (
          <>
            <div className="edit-button-wrapper">
              <button className="edit-button" onClick={handleEditClick}>
                수정하기
              </button>
            </div>
            <div className="myproject-card-main">
              <div className="myproject-card-header">
                <h3>프로젝트 소개 (진행중)</h3>
              </div>
              <p>{project.description}</p>
            </div>
            <div className="content-grid">
              <div className="myproject-card-main">
                <h4>멤버</h4>
                {/* 멤버 목록 */}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                }}
              >
                <div className="myproject-card-main">
                  <div className="myproject-card-main-header">
                    <h4>진행률</h4>
                    <span>{project.progress ?? 0}%</span>
                  </div>
                  <ProgressBar progress={project.progress ?? 0} />
                </div>
                <div className="myproject-card-main">
                  <h4>마일스톤</h4>
                  {/* 마일스톤 목록 */}
                </div>
              </div>
            </div>
          </>
        );
      case "RECRUITING":
        return (
          <>
            <div className="edit-button-wrapper">
              <button className="edit-button" onClick={handleEditClick}>
                수정하기
              </button>
            </div>
            <div className="myproject-card-main">
              <div className="myproject-card-main-header">
                <h3>프로젝트 소개 (모집중)</h3>
              </div>
              <p>{project.description}</p>
              <h4>모집 분야</h4>
              <ul>
                {project.recruit_positions?.map((p) => (
                  <li key={p.position}>
                    {p.position}: {p.count}명
                  </li>
                ))}
              </ul>
              <h4>기술 스택</h4>
              <div>{project.required_stacks?.join(", ")}</div>
            </div>
          </>
        );
      case "COMPLETED":
        return (
          <div className="myproject-card-main">
            <div className="myproject-card-main-header">
              <h3>프로젝트 소개 (완료)</h3>
            </div>
            <p>{project.description}</p>
          </div>
        );
      default:
        return <div>알 수 없는 프로젝트 상태입니다.</div>;
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (!project) return <div>프로젝트를 찾을 수 없습니다.</div>;

  return (
    <>
      <div className="content-header">
        <Header />
      </div>
      <div className="project-detail-layout">
        {/* 사이드바 컴포넌트 활용 */}
        <ProjectSidebar
          project={{
            id: Number(project.id),
            title: project.title,
            status: project.status,
            logoUrl: project.logoUrl,
          }}
        />

        <main className="project-main-content">{renderMainContent()}</main>
      </div>
    </>
  );
}