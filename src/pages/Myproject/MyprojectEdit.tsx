import React, { useState, useEffect } from "react";
import { useNavigate, useBeforeUnload, useParams } from "react-router-dom";
import "../../App.css";
import { usePrompt } from "../../hooks/usePrompt";
import Header from "../../layouts/Header";

import type { ProjectData } from "../../types/project";

export default function MyprojectEdit() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [teamName, setTeamName] = useState("");
  const [teamLogo, setTeamLogo] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [isDirty, setIsDirty] = useState(false);

  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

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
        setTeamName(data.title || ""); // 기본값 세팅
        setProgress(data.progress || 0);
      })
      .catch((err) => {
        console.error(err);
        setProject(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // 파일 선택
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTeamLogo(e.target.files[0]);
      setIsDirty(true);
    }
  };

  // 저장
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    console.log({
      ...project,
      title: teamName,
      teamLogo: teamLogo?.name,
      progress,
    });
    alert("저장되었습니다.");
    setIsDirty(false);
    nav(-1);
  };

  // 취소
  const handleCancel = () => {
    if (isDirty) {
      const confirmLeave = window.confirm(
        "변경 사항이 저장되지 않았습니다. 페이지를 떠나시겠습니까?"
      );
      if (!confirmLeave) return;
    }
    nav(-1);
  };

  // 완료 전환
  const handleCompleteProject = () => {
    if (window.confirm("프로젝트를 완료 상태로 전환하시겠습니까?")) {
      if (project) {
        setProject({ ...project, status: "COMPLETED" });
      }
      alert('프로젝트가 완료 처리되었습니다.');

    }
  };

  // 팀 이름 변경 핸들러
  const handleChangeTeamName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeamName(e.target.value);
    setIsDirty(true);
  };

  // 진행률 변경 핸들러
  const handleChangeProgress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Math.min(100, Number(e.target.value)));
    setProgress(value);
    setIsDirty(true);
  };

  // 새로고침/닫기 경고
  useBeforeUnload((e: BeforeUnloadEvent) => {
    if (isDirty) {
      e.preventDefault();
      e.returnValue = "";
    }
  });

  // 라우터 이동 경고
  usePrompt(
    "변경 사항이 저장되지 않았습니다. 페이지를 떠나시겠습니까?",
    isDirty
  );

  if (loading) return <div>Loading...</div>;
  if (!project) return <div>Project not found.</div>;

  return (
    <>
      <div className="content-header">
        <Header />
      </div>
      <div className="edit-container">
        <div className="completion-button-wrapper">
          <button onClick={handleCompleteProject} className="complete-btn">
            프로젝트 완료로 전환
          </button>
        </div>

        <form className="edit-form" onSubmit={handleSave}>
          <div className="form-group">
            <label htmlFor="teamName">팀 이름</label>
            <input
              type="text"
              id="teamName"
              value={teamName}
              onChange={handleChangeTeamName}
            />
          </div>

          <div className="form-group">
            <label htmlFor="teamLogo">팀 로고</label>
            <div className="file-input-wrapper">
              <input
                type="text"
                readOnly
                value={
                  teamLogo
                    ? teamLogo.name
                    : project.logoUrl || "TEAMIT_로고.jpg"
                }
                placeholder="파일을 선택하세요"
              />
              <input
                type="file"
                id="teamLogo"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <button
                type="button"
                onClick={() => document.getElementById("teamLogo")?.click()}
                className="find-btn"
              >
                찾아보기
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="progress">프로젝트 진행률</label>
            <div className="progress-input-wrapper">
              <input
                type="number"
                id="progress"
                value={progress}
                onChange={handleChangeProgress}
                min="0"
                max="100"
              />
              <span>%</span>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="save-btn">저장</button>
            <button type="button" onClick={handleCancel} className="cancel-btn">취소</button>
          </div>
        </form>
      </div>
    </>
  );
}
