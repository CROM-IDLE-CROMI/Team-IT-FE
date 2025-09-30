import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProjectSidebar from "../../components/myproject/ProjectSidebar";
import "../../App.css";

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
    fetch(`/mocks/project-${id}.json`)
      .then((response) => response.json())
      .then((data) => {
        setProject(data);
        setMembers(data.members || []);
      })
      .catch((error) =>
        console.error("데이터를 불러오는 데 실패했습니다:", error)
      )
      .finally(() => setLoading(false));
  }, [id]);

  const handleGoBack = () => nav(-1);
  const handleEdit = () => nav(`/myproject/${id}/member/edit`);

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
          <button className="back-button" onClick={handleGoBack}>← 돌아가기</button>
          { project.status !== 'COMPLETED' && (
            <button className="edit-button" onClick={handleEdit}>수정하기</button>
          )}
        </div>
        <div className="card_1">
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
                    <td>{member.email}</td>
                    <td>{member.role}</td>
                    <td>{member.techStack}</td>
                    <td>{member.rating.toFixed(2)}</td>
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
  );
}
