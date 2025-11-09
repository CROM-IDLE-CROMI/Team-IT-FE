import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProjectSidebar from "../../components/myproject/ProjectSidebar";
import "../../App.css";
import Header from "../../layouts/Header";

import type { ProjectData, Milestone } from "../../types/project";
import { getOverride, setOverride } from "../../utils/projectOverrides";

const MyprojectMilestoneEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    fetch(`/mocks/my-projects.json`)
      .then((res) => {
        if (!res.ok) throw new Error("프로젝트 데이터를 불러오지 못했습니다.");
        return res.json();
      })
      .then((data) => {
        // ✅ data가 배열/객체 모두 대비
        let base: ProjectData | null = null;

        if (Array.isArray(data)) {
          base = data.find((p: ProjectData) => Number(p.id) === Number(id)) ?? null;
        } else if (data && typeof data === "object") {
          base = data as ProjectData;
          // (만약 단일 json이지만 id가 다르면 무시)
          if (Number((base as any).id) !== Number(id)) base = null;
        }

        if (!base) {
          throw new Error(`해당 ID(${id})의 프로젝트를 찾지 못했습니다.`);
        }

        // ✅ override 얕은 병합
        const ov = getOverride(id!);
        const merged: ProjectData = ov ? { ...base, ...ov } : base;

        setProject(merged);
        setMilestones(Array.isArray(merged.milestones) ? merged.milestones : []);
      })
      .catch((err) => {
        console.error(err);
        setProject(null);
        setMilestones([]);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = (rowId: number) => {
    if (window.confirm("정말로 이 마일스톤을 삭제하시겠습니까?")) {
      setMilestones((prev) => prev.filter((m) => m.id !== rowId));
      setIsDirty(true);
    }
  };

  const handleAddRow = () => {
    const newMilestone: Milestone = {
      id: Date.now(),
      title: "",
      nickname: "",
      deadline: "",
      progress: 0,
    };
    setMilestones((prev) => [...prev, newMilestone]);
    setIsDirty(true);
  };

  const handleChange = (
    rowId: number,
    field: keyof Milestone,
    value: string | number
  ) => {
    setMilestones((prev) =>
      prev.map((m) => (m.id === rowId ? { ...m, [field]: value } : m))
    );
    setIsDirty(true);
  };

  const handleSave = () => {
    if (!id) return;
    const normalized = milestones.map((m) => ({
      ...m,
      progress: Math.max(0, Math.min(100, Number(m.progress) || 0)),
    }));
    setOverride(id, { milestones: normalized }); // ✅ 로컬 오버라이드 저장
    console.log("저장된 마일스톤(override):", normalized);
    alert("저장되었습니다.");
    setIsDirty(false);
    // navigate(`/myproject/${id}/milestone`);
  };

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
          <div className="card-main">
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
                            handleChange(
                              milestone.id,
                              "nickname",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={milestone.deadline}
                          onChange={(e) =>
                            handleChange(
                              milestone.id,
                              "deadline",
                              e.target.value
                            )
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
    </div>
  );
};

export default MyprojectMilestoneEdit;
