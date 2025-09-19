import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProjectSidebar from "../../components/myproject/ProjectSidebar";
import ProgressBar from "../../components/ProgressBar";
import "../../App.css";

import type { ProjectData, Milestone } from "../../types/project";

export default function MyprojectMilestone() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();

  const [project, setProject] = useState<ProjectData | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    fetch(`/mocks/project-${id}.json`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("프로젝트 데이터를 불러오지 못했습니다.");
        }
        return res.json();
      })
      .then((data: ProjectData) => {
        setProject(data);

        // milestone이 null, undefined, 혹은 배열이 아닐 경우 빈 배열로 처리
        if (Array.isArray(data.milestones)) {
          setMilestones(data.milestones);
        } else {
          setMilestones([]);
        }
      })
      .catch((err) => {
        console.error(err);
        setProject(null);
        setMilestones([]);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleGoBack = () => nav(-1);
  const handleEdit = () => nav(`/myproject/${id}/milestone/edit`);

  if (loading) return <div>Loading...</div>;
  if (!project) return <div>Project not found.</div>;

  return (
    <div className="myproject-layout">
      <ProjectSidebar
        project={{
          id: project.id,
          title: project.title,
          status: project.status,
          logoUrl: project.logoUrl,
        }}
      />

      <main className="project-main-content">
        <div className="content-header">
          <button className="back-button" onClick={handleGoBack}>
            ← 돌아가기
          </button>
          <button className="edit-button" onClick={handleEdit}>
            수정하기
          </button>
        </div>

        <div className="card">
          {milestones.length > 0 ? (
            <table className="milestone-table">
              <thead>
                <tr>
                  <th>마일스톤 이름</th>
                  <th>닉네임</th>
                  <th>종료일</th>
                  <th>진행률</th>
                </tr>
              </thead>
              <tbody>
                {milestones.map((milestone) => (
                  <tr key={milestone.id}>
                    <td>{milestone.title}</td>
                    <td>{milestone.nickname}</td>
                    <td>{milestone.deadline}</td>
                    <td>
                      <div className="milestone-progress">
                        <ProgressBar progress={milestone.progress} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ padding: "1rem", textAlign: "center" }}>
              등록된 마일스톤이 없습니다.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
