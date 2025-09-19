import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProjectSidebar from "../../components/myproject/ProjectSidebar";
import "../../App.css";

import type { ProjectData, Milestone } from "../../types/project";

const MyprojectMilestoneEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDirty, setIsDirty] = useState(false); // 변경 여부 추적
  const navigate = useNavigate();

  // JSON 파일에서 데이터 불러오기
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

  // 행 삭제
  const handleDelete = (id: number) => {
    if (window.confirm("정말로 이 마일스톤을 삭제하시겠습니까?")) {
      setMilestones(milestones.filter((m) => m.id !== id));
      setIsDirty(true);
    }
  };

  // 행 추가
  const handleAddRow = () => {
    const newMilestone: Milestone = {
      id: Date.now(),
      title: "",
      nickname: "",
      deadline: "",
      progress: 0,
    };
    setMilestones([...milestones, newMilestone]);
    setIsDirty(true);
  };

  // 입력 변경
  const handleChange = (
    id: number,
    field: keyof Milestone,
    value: string | number
  ) => {
    setMilestones(
      milestones.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
    setIsDirty(true);
  };

  // 저장 버튼
  const handleSave = () => {
    console.log("저장된 마일스톤:", milestones);
    alert("저장되었습니다.");
    setIsDirty(false);
    // 실제로는 fetch/axios로 서버에 PATCH/PUT 요청을 보내야 함
  };

  // 취소 버튼
  const handleCancel = () => {
    if (isDirty) {
      const confirmLeave = window.confirm(
        "변경 사항이 저장되지 않았습니다. 페이지를 떠나시겠습니까?"
      );
      if (!confirmLeave) return;
    }
    navigate(-1);
  };

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

      <main className="project-main-container">
        <div className="card">
          <table className="milestone-edit-table">
            <thead>
              <tr>
                <th>마일스톤 이름</th>
                <th>담당자 닉네임</th>
                <th>데드라인</th>
                <th>진척도</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {milestones.length > 0 ? (
                milestones.map((milestone) => (
                  <tr key={milestone.id}>
                    <td>
                      <input
                        type="text"
                        value={milestone.title}
                        onChange={(e) =>
                          handleChange(milestone.id, "title", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={milestone.nickname}
                        onChange={(e) =>
                          handleChange(milestone.id, "nickname", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={milestone.deadline}
                        onChange={(e) =>
                          handleChange(milestone.id, "deadline", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={milestone.progress}
                        onChange={(e) =>
                          handleChange(
                            milestone.id,
                            "progress",
                            Number(e.target.value)
                          )
                        }
                      />
                    </td>
                    <td>
                      <button
                        className="milestone-delete-btn"
                        onClick={() => handleDelete(milestone.id)}
                      >
                        X
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>등록된 마일스톤이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* 하단 버튼 */}
          <div className="milestone-edit-actions">
            <button className="milestone-add-btn" onClick={handleAddRow}>
              줄 추가하기
            </button>
            <div className="milestone-edit-bottom-btns">
              <button onClick={handleSave} className="milestone-save-btn">
                저장
              </button>
              <button onClick={handleCancel} className="milestone-cancel-btn">
                취소
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyprojectMilestoneEdit;
