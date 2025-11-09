import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProjectSidebar from "../../components/myproject/ProjectSidebar";
import "../../App.css";
import Header from "../../layouts/Header";

import type { ProjectData } from "../../types/project";
import type { MemberData } from "../../types/member";

export default function MyprojectMember() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [members, setMembers] = useState<MemberData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    fetch(`/mocks/my-projects.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        // my-projects.json은 배열 형태 → id로 특정 프로젝트 찾기
        const foundProject = data.find(
          (item: ProjectData) => item.id === Number(id)
        );

        if (!foundProject) {
          throw new Error("해당 ID의 프로젝트를 찾을 수 없습니다.");
        }

        setProject(foundProject);
        setMembers(foundProject.members || []);
      })
      .catch((error) => {
        console.error("데이터를 불러오는 데 실패했습니다:", error);
        setProject(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleGoBack = () => nav(-1);
  const handleEdit = () => nav(`/myproject/${id}/member/edit`);

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
            id: project.id,
            title: project.title,
            status: project.status,
            logoUrl: project.logoUrl,
          }}
        />
        <main className="project-main-content">
          <div className="member-content-header">
            <button className="back-button" onClick={handleGoBack}>
              ← 돌아가기
            </button>
            {project.status !== "COMPLETED" && (
              <button className="edit-button" onClick={handleEdit}>
                수정하기
              </button>
            )}
          </div>
          <div className="card-main">
            <table className="member-table">
              <thead>
                <tr>
                  <th>닉네임</th>
                  <th>이메일</th>
                  <th>직군</th>
                  <th>기술 스택</th>
                  <th>개발자 평점</th>
                </tr>
              </thead>
              <tbody>
                {members && members.length > 0 ? (
                  members.map((member) => (
                    <tr key={member.id}>
                      <td>{member.nickname}</td>
                      <td>{member.email || "-"}</td>
                      <td>{member.role}</td>
                      <td>
                        {Array.isArray(member.techStack)
                          ? member.techStack.join(", ")
                          : member.techStack || "-"}
                      </td>
                      <td>
                        {member.rating
                          ? member.rating.toFixed(2)
                          : "평가 없음"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5}>등록된 멤버가 없습니다.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
