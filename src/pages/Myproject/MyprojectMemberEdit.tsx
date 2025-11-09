import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useBeforeUnload } from "react-router-dom";
import ProjectSidebar from "../../components/myproject/ProjectSidebar";
import { usePrompt } from "../../hooks/usePrompt";
import Header from "../../layouts/Header";

import type { Member, ProjectData } from "../../types/project";
import { getOverride, setOverride } from "../../utils/projectOverrides"; // ✅ 추가

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

    // 1) project-<id>.json 시도 → 2) my-projects.json에서 해당 id 찾기
    fetch(`/mocks/project-${id}.json`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("no per-id json"))))
      .then((data: ProjectData) => {
        const ov = getOverride(id);
        const merged: ProjectData = ov ? { ...data, ...ov } : data; // ✅ 얕은 병합
        setProject(merged);
        setMembers(Array.isArray(merged.members) ? merged.members : []);
      })
      .catch(() =>
        fetch(`/mocks/my-projects.json`)
          .then((res) => {
            if (!res.ok) throw new Error("my-projects.json load fail");
            return res.json();
          })
          .then((arr: ProjectData[]) => {
            const found =
              Array.isArray(arr) ? arr.find((p) => Number(p.id) === Number(id)) : null;
            if (!found) throw new Error("project not found in array");
            const ov = getOverride(id);
            const merged: ProjectData = ov ? { ...found, ...ov } : found; // ✅
            setProject(merged);
            setMembers(Array.isArray(merged.members) ? merged.members : []);
          })
      )
      .catch((err) =>
        console.error("멤버 데이터를 불러오는 데 실패했습니다:", err)
      )
      .finally(() => setLoading(false));
  }, [id]);

  const handleRemove = (mid: number) => {
    if (window.confirm("정말로 이 멤버를 삭제하시겠습니까?")) {
      setMembers((prev) => prev.filter((m) => m.id !== mid));
      setIsDirty(true);
    }
  };

  // (선택) 멤버 필드 인라인 수정이 필요하면 이 핸들러로 업데이트
  const handleChange = <K extends keyof Member>(mid: number, field: K, value: Member[K]) => {
    setMembers((prev) => prev.map((m) => (m.id === mid ? { ...m, [field]: value } : m)));
    setIsDirty(true);
  };

  // 새로고침/창 닫기 경고
  useBeforeUnload(
    (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = "";
    },
    { capture: true }
  );

  // 라우터 전환 경고
  usePrompt(
    "변경 사항이 저장되지 않았습니다. 페이지를 떠나시겠습니까?",
    isDirty
  );

  const handleSave = () => {
    if (!id) return;
    setOverride(id, { members }); // ✅ 오버라이드 저장
    setIsDirty(false);
    alert("저장되었습니다!");
    // 필요하면 상세로 이동: navigate(`/myproject/${id}/member`);
  };

  const handleGoBack = () => {
    if (isDirty) {
      const ok = window.confirm("변경 사항이 저장되지 않았습니다. 페이지를 떠나시겠습니까?");
      if (!ok) return;
    }
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
            id: Number(project.id),
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
                      <td>
                        <input
                          type="text"
                          value={member.nickname}
                          onChange={(e) => handleChange(member.id, "nickname", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="email"
                          value={member.email}
                          onChange={(e) => handleChange(member.id, "email", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={member.role}
                          onChange={(e) => handleChange(member.id, "role", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={member.techStack}
                          onChange={(e) => handleChange(member.id, "techStack", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.01"
                          value={typeof member.rating === "number" ? member.rating : Number(member.rating || 0)}
                          onChange={(e) => handleChange(member.id, "rating", Number(e.target.value))}
                        />
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
              <button className="member-edit-save-btn" onClick={handleSave}>
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
