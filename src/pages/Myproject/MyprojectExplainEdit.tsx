import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ProjectSidebar from "../../components/myproject/ProjectSidebar";

import type { ProjectData } from "../../types/project";

interface LocationState {
  project: ProjectData;
}

const MyprojectExplainEdit: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { project } = location.state as LocationState;
  const [description, setDescription] = useState(project?.description || "");

  const handleSave = () => {
    console.log("저장된 소개:", description);
    navigate(-1);
  };

  return (
    <div className="myproject-layout">
      <ProjectSidebar project={project} />

      <main className="explain-page-container">
        <div className="explain-page-back-wrapper">
          <button onClick={() => navigate(-1)} className="explain-page-back-btn">
            ← 뒤로가기
          </button>
        </div>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="프로젝트 소개 수정란"
          className="explain-page-textarea"
        />

        <button onClick={handleSave} className="explain-page-save-btn">
          저장하기
        </button>
      </main>
    </div>
  );
};

export default MyprojectExplainEdit;
