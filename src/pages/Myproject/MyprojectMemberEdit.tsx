import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useBeforeUnload } from "react-router-dom";
import ProjectSidebar from "../../components/myproject/ProjectSidebar";
import { usePrompt } from "../../hooks/usePrompt";
import Header from "../../layouts/Header";

import type { Member, ProjectData } from "../../types/project";

const MyprojectMemberEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [project, setProject] = useState<ProjectData | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDirty, setIsDirty] = useState(false); // 변경 여부 추적

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    fetch(`/mocks/project-${id}.json`)
      .then((res) => res.json())
      .then((data: ProjectData) => {
        setProject(data);
        setMembers(data.members || []);
      })
      .catch((err) =>
        console.error("멤버 데이터를 불러오는 데 실패했습니다:", err)
      )
      .finally(() => setLoading(false));
  }, [id]);

  const handleRemove = (id: number) => {
    if (window.confirm("정말로 이 멤버를 삭제하시겠습니까?")) {
      setMembers((prev) => prev.filter((m) => m.id !== id));
      setIsDirty(true);
    }
  };

  // 새로고침/창 닫기 경고
  useBeforeUnload(
    (e: BeforeUnloadEvent) => {
      if (!isDirty) return; // ← 여기서 조건 체크
      e.preventDefault();
      e.returnValue = ""; // 크롬/사파리에서 경고창 표시
    },
    { capture: true } // 선택: 캡처 단계에서 먼저 잡도록
  );

  // 라우터 전환 경고
  usePrompt(
    "변경 사항이 저장되지 않았습니다. 페이지를 떠나시겠습니까?",
    isDirty
  );

  const handleGoBack = () => {
    navigate(`/myproject/${id}`);
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
            id: project.id,
            title: project.title,
            status: project.status,
            logoUrl: project.logoUrl,
          }}
        />

        <main className="project-main-content">
          {/* 팀장 위임하기 버튼 */}
          <div className="member-edit-header">
            <button
              onClick={() =>
                navigate(`/myproject/${id}/member/edit/change-leader`)
              }
              className="member-edit-leader-btn"
            >
              팀장 위임하기
            </button>
          </div>
          <div className="card-main">
            {/* 멤버 테이블 */}
            <table className="member-edit-table">
              <thead>
                <tr>
                  <th>닉네임</th>
                  <th>이메일</th>
                  <th>직군</th>
                  <th>기술 스택</th>
                  <th>개발자 평점</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {members.length > 0 ? (
                  members.map((member) => (
                    <tr key={member.id}>
                      <td>{member.nickname}</td>
                      <td>{member.email}</td>
                      <td>{member.role}</td>
                      <td>{member.techStack}</td>
                      <td>
                        {member.rating?.toFixed
                          ? member.rating.toFixed(2)
                          : member.rating}
                      </td>
                      <td>
                        <button
                          onClick={() => handleRemove(member.id)}
                          className="member-edit-remove-btn"
                        >
                          X
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6}>등록된 멤버가 없습니다.</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* 하단 수정/취소 버튼 */}
            <div className="member-edit-actions">
              <button
                className="member-edit-save-btn"
                onClick={() => {
                  setIsDirty(false); // 저장 후 더 이상 dirty 아님
                  alert("저장되었습니다!");
                }}
              >
                수정 완료
              </button>
              <button className="member-edit-cancel-btn" onClick={handleGoBack}>
                취소
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyprojectMemberEdit;
