import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../App.css";
import ProjectSidebar from "../../components/myproject/ProjectSidebar";
import Header from "../../layouts/Header";

import type { ProjectData } from "../../types/project";
import { getOverride } from "../../utils/projectOverrides"; // ✅ 추가

export default function MyprojectExplain() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    // 1) /mocks/project-<id>.json 시도
    fetch(`/mocks/project-${id}.json`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("no per-id json"))))
      .then((data: ProjectData) => {
        // ✅ 로컬 오버라이드 병합
        const ov = getOverride(id);
        const merged: ProjectData = ov ? { ...data, ...ov } : data;
        setProject(merged);
      })
      // 2) 실패 시 /mocks/my-projects.json에서 해당 id 찾기
      .catch(() =>
        fetch(`/mocks/my-projects.json`)
          .then((response) => {
            if (!response.ok) throw new Error("Network response was not ok");
            return response.json();
          })
          .then((data) => {
            let found: ProjectData | null = null;
            if (Array.isArray(data)) {
              found =
                data.find(
                  (item: ProjectData) => Number(item.id) === Number(id)
                ) ?? null;
            } else if (data && typeof data === "object") {
              const maybe = data as ProjectData;
              if (Number(maybe.id) === Number(id)) found = maybe;
            }
            if (!found) throw new Error(`Project with id=${id} not found in mocks`);

            // ✅ 로컬 오버라이드 병합
            const ov = getOverride(id);
            const merged: ProjectData = ov ? { ...found, ...ov } : found;
            setProject(merged);
          })
      )
      .catch((error) => {
        console.error("Failed to fetch project data:", error);
        setProject(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleGoBack = () => navigate(-1);
  const handleEdit = () => {
    if (!id || !project) return;
    navigate(`/myproject/${id}/explain/edit`, { state: { project } });
  };

  if (loading) return <div>Loading...</div>;
  if (!project) return <div>Project not found.</div>;

  return (
    <div className="explain-container">
      <div className="content-header">
        <Header />
      </div>

      <div className="myproject-layout">
        <ProjectSidebar
          project={{
            id: Number(project.id),
            title: project.title,
            status: project.status,
            logoUrl: project.logoUrl,
          }}
        />

        <main className="project-main-content">
          <div className="explain-content-header">
            <button className="back-button" onClick={handleGoBack}>
              ← 돌아가기
            </button>
            {project.status !== "COMPLETED" && (
              <button className="edit-button" onClick={handleEdit}>
                수정하기
              </button>
            )}
          </div>

          <div className="introduction-card">
            <div className="introduction-content">
              <h2>프로젝트 소개</h2>
              <p>{project.description}</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
