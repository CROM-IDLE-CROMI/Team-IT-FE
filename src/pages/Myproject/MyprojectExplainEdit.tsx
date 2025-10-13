import React, { useState } from "react";
import { useNavigate, useLocation, useBeforeUnload } from "react-router-dom";
import ProjectSidebar from "../../components/myproject/ProjectSidebar";
import { usePrompt } from "../../hooks/usePrompt";

import type { ProjectData } from "../../types/project";

interface LocationState {
  project: ProjectData;
}

const MyprojectExplainEdit: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { project } = location.state as LocationState;

  const [description, setDescription] = useState(project?.description || "");
  const [isDirty, setIsDirty] = useState(false);

  const handleSave = () => {
    console.log("저장된 소개:", description);
    setIsDirty(false); // 저장 후 더 이상 dirty 아님
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

  // textarea 수정 시 isDirty = true
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
    <div className="myproject-layout">
      <ProjectSidebar project={project} />

      <main className="explain-edit-container">
        <div className="content-header">
          <button onClick={handleBack} className="back-button">
            ← 돌아가기
          </button>
        </div>

        <div className="card-main">
          <h3 className="explain-edit-title">프로젝트 소개 수정</h3>
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
        </div>
      </main>
    </div>
  );
};

export default MyprojectExplainEdit;
