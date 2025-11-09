// MyprojectEdit.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useBeforeUnload, useParams } from "react-router-dom";
import "../../App.css";
import { usePrompt } from "../../hooks/usePrompt";
import type { ProjectData } from "../../types/project";
import { getOverride, setOverride } from "../../utils/projectOverrides";
import Header from "../../layouts/Header";

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

    // 1차: 배열 JSON에서 찾기
    fetch("/mocks/my-projects.json")
      .then((res) => {
        if (!res.ok) throw new Error("배열 JSON 없음");
        return res.json();
      })
      .then((arr: ProjectData[]) => {
        const base = arr.find((i) => i.id === Number(id)) || null;
        return base;
      })
      .catch(() => {
        // 2차: 단일 파일 fallback
        return fetch(`/mocks/project-${id}.json`)
          .then((res) => {
            if (!res.ok) throw new Error("단일 JSON도 없음");
            return res.json();
          })
          .catch(() => null);
      })
      .then((base: ProjectData | null) => {
        if (!base) {
          setProject(null);
          return;
        }
        // ✅ 기존 오버라이드 반영해 편집 폼 초기화
        const ov = getOverride(id);
        const merged = ov ? ({ ...base, ...ov } as ProjectData) : base;

        setProject(merged);
        setTeamName(merged.title ?? "");
        setProgress(merged.progress ?? 0);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTeamLogo(e.target.files[0]);
      setIsDirty(true);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !id) return;

    // ✅ 로컬 오버라이드에 저장(목 환경용)
    setOverride(id, {
      title: teamName,
      progress,
      // 실제 업로드 처리는 없으니 파일명만 저장(목)
      logoUrl: teamLogo ? teamLogo.name : project.logoUrl,
    });

    alert("저장되었습니다.");
    setIsDirty(false);
    nav(`/myproject/${id}`); // 상세로 복귀
  };

  const handleCancel = () => {
    if (isDirty) {
      const confirmLeave = window.confirm("변경 사항이 저장되지 않았습니다. 페이지를 떠나시겠습니까?");
      if (!confirmLeave) return;
    }
    nav(-1);
  };

  const handleCompleteProject = () => {
    if (!id) return;
    if (window.confirm("프로젝트를 완료 상태로 전환하시겠습니까?")) {
      // ✅ 상태만 COMPLETED로 오버라이드
      setOverride(id, { status: "COMPLETED" as const });
      alert("프로젝트가 완료 처리되었습니다.");
      nav(`/myproject/${id}`); // ✅ 오타 수정
    }
  };

  const handleChangeTeamName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeamName(e.target.value);
    setIsDirty(true);
  };

  const handleChangeProgress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(0, Math.min(100, Number(e.target.value)));
    setProgress(val);
    setIsDirty(true);
  };

  useBeforeUnload((e: BeforeUnloadEvent) => {
    if (isDirty) {
      e.preventDefault();
      e.returnValue = "";
    }
  });

  usePrompt("변경 사항이 저장되지 않았습니다. 페이지를 떠나시겠습니까?", isDirty);

  if (loading) return <div>Loading...</div>;
  if (!project) return <div>Project not found.</div>;

  return (
    <div className="edit-container">
      <div className="content-header">
        <Header />
      </div>
      <div className="completion-button-wrapper">
        <button onClick={handleCompleteProject} className="complete-btn">
          프로젝트 완료로 전환
        </button>
      </div>

      <form className="edit-form" onSubmit={handleSave}>
        <div className="form-group">
          <label htmlFor="teamName">팀 이름</label>
          <input type="text" id="teamName" value={teamName} onChange={handleChangeTeamName} />
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
            <input type="file" id="teamLogo" onChange={handleFileChange} style={{ display: "none" }} />
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
  );
}
