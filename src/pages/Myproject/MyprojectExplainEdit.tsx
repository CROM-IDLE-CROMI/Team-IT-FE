import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const MyprojectExplainEdit: React.FC = () => {
  const navigate = useNavigate();
  const [description, setDescription] = useState("");

  const handleSave = () => {
    // 저장 로직 (예: API 호출)
    console.log("저장된 소개:", description);
    navigate(-1); // 저장 후 뒤로가기
  };

  return (
    <div className="explain-edit-container">
      {/* 뒤로가기 버튼 */}
      <div className="explain-edit-back-wrapper">
        <button
          onClick={() => navigate(-1)}
          className="explain-edit-back-btn"
        >
          ← 뒤로가기
        </button>
      </div>

      {/* 프로젝트 소개 수정란 */}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="프로젝트 소개 수정란"
        className="explain-edit-textarea"
      />

      {/* 저장하기 버튼 */}
      <button
        onClick={handleSave}
        className="explain-edit-save-btn"
      >
        저장하기
      </button>
    </div>
  );
};

export default MyprojectExplainEdit;
