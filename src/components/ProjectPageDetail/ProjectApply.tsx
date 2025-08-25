import React, { useState } from "react";
import "./ProjectApply.css";

const ProjectApply = () => {
  const [title, setTitle] = useState("");
  const [intro, setIntro] = useState("");
  const [position, setPosition] = useState("frontend");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !intro.trim()) {
      alert("모든 항목을 입력해주세요!");
      return;
    }

    // 서버로 데이터 전송하거나 로컬스토리지 저장 등 가능
    console.log("지원서 제출:", { name, intro, position });

    alert("지원이 완료되었습니다!");
  };

  return (
    <div className="apply-page">
      <div className="apply-form">
        <h2>사이드 프로젝트 지원서</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="자기소개"
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
          />

          <select value={position} onChange={(e) => setPosition(e.target.value)}>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="designer">Designer</option>
          </select>

          <button type="submit" className="submit-btn">
            제출하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProjectApply;
