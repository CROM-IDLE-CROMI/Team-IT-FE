import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useBeforeUnload, useParams } from "react-router-dom";
import ProjectSidebar from "../../components/myproject/ProjectSidebar";
import { usePrompt } from "../../hooks/usePrompt";
import Header from "../../layouts/Header";

import type { ProjectData } from "../../types/project";
import { getOverride, setOverride } from "../../utils/projectOverrides"; // ✅ 추가

interface LocationState {
  project: ProjectData;
}

const MyprojectExplainEdit: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ id: string }>();

  // location.state로 전달된 프로젝트(없을 수도 있음)
  const incoming = (location.state as LocationState | null)?.project ?? null;

  // id는 우선 route params, 없으면 incoming?.id 사용
  const pid = params.id ?? (incoming ? String(incoming.id) : undefined);

  const [project, setProject] = useState<ProjectData | null>(incoming);
  const [description, setDescription] = useState<string>("");
  const [isDirty, setIsDirty] = useState(false);

  // 초기화: override 병합하여 textarea 기본값 세팅
  useEffect(() => {
    if (!pid) return;

    // 1) location.state가 있으면 그걸 base로 사용
    let base = incoming as ProjectData | null;

    // 2) override를 병합
    const ov = getOverride(pid);
    const merged = ov && base ? ({ ...base, ...ov } as ProjectData)
                 : ov && !base ? ({ id: Number(pid), title: "", status: "ONGOING", logoUrl: "", description: "", ...ov } as unknown as ProjectData)
                 : base;

    if (merged) {
      setProject(merged);
      setDescription(merged.description ?? "");
    } else {
      // (옵션) location.state가 없을 때를 대비해 최소 보정
      setDescription("");
    }
  }, [pid, incoming]);

  const handleSave = () => {
    if (!pid) return;
    // ✅ 설명만 부분 오버라이드 저장
    setOverride(pid, { description });
    setIsDirty(false);
    alert("저장되었습니다.");
    navigate(-1);
  };

  const handleBack = () => {
    if (isDirty) {
      const confirmLeave = window.confirm(
        "변경 사항이 저장되지 않았습니다. 페이지를 떠나시겠습니까?"
      );
      if (!confirmLeave) return;
    }
    navigate(-1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    setIsDirty(true);
  };

  // 새로고침/창 닫기 경고
  useBeforeUnload((e: BeforeUnloadEvent) => {
    if (isDirty) {
      e.preventDefault();
      e.returnValue = "";
    }
  });

  // 라우터 전환 경고
  usePrompt("변경 사항이 저장되지 않았습니다. 페이지를 떠나시겠습니까?", isDirty);

  return (
    <div className="explain-container">
      <div className="content-header">
        <Header />
      </div>
      <div className="myproject-layout">
        {/* Sidebar는 안전하게 필요한 필드만 전달 */}
        <ProjectSidebar
          project={{
            id: Number(project?.id ?? pid ?? 0),
            title: project?.title ?? "",
            status: project?.status ?? "ONGOING",
            logoUrl: project?.logoUrl,
          }}
        />

        <main className="project-main-content">
          <h2 className="explain-edit-title">프로젝트 소개 수정</h2>
          <textarea
            value={description}
            onChange={handleChange}
            placeholder="프로젝트 소개 내용을 입력하세요..."
            className="explain-edit-textarea"
          />

          <div className="explain-edit-actions">
            <button onClick={handleSave} className="explain-edit-save-btn">
              저장하기
            </button>
            <button onClick={handleBack} className="explain-edit-cancel-btn">
              취소
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyprojectExplainEdit;
