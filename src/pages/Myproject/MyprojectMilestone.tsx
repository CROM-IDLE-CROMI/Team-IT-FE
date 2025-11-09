import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProjectSidebar from "../../components/myproject/ProjectSidebar";
import ProgressBar from "../../components/ProgressBar";
import "../../App.css";
import Header from "../../layouts/Header";

import type { ProjectData } from "../../types/project";
import { getOverride } from "../../utils/projectOverrides";

// ─────────────────────────────────────────────
// 마일스톤 정규화: 키/형식 제각각인 목 데이터도 수용
// ─────────────────────────────────────────────
type UIMilestone = {
  id: string;
  title: string;
  nickname?: string;
  deadline?: string;
  progress: number; // 0~100 보장
};

function normalizeMilestones(src: any): UIMilestone[] {
  if (!src) return [];

  const container =
    (Array.isArray(src.milestones) && src.milestones) ||
    (Array.isArray(src.milestone) && src.milestone) ||
    (Array.isArray(src.milestoneList) && src.milestoneList) ||
    (Array.isArray(src.milestones_list) && src.milestones_list) ||
    (Array.isArray(src.tasks) && src.tasks) ||
    (Array.isArray(src.todo) && src.todo) ||
    [];

  return container.map((m: any, i: number): UIMilestone => {
    const title =
      m.title ?? m.name ?? m.subject ?? m.milestoneTitle ?? `마일스톤 ${i + 1}`;

    const deadline = m.deadline ?? m.dueDate ?? m.due_date ?? m.due ?? undefined;

    let prog =
      m.progress ??
      m.percent ??
      m.percentage ??
      (typeof m.completed === "boolean" ? (m.completed ? 100 : 0) : undefined);

    if (prog == null && (m.status === "DONE" || m.state === "DONE")) prog = 100;
    if (prog == null) prog = 0;
    if (typeof prog === "number" && prog <= 1) prog = prog * 100; // 0~1 스케일 처리
    prog = Math.max(0, Math.min(100, Number(prog))); // 0~100 클램프

    const nickname = m.nickname ?? m.assignee ?? m.owner ?? m.user ?? undefined;

    return {
      id: String(m.id ?? m.milestoneId ?? i),
      title: String(title),
      nickname: nickname ? String(nickname) : undefined,
      deadline: deadline ? String(deadline) : undefined,
      progress: Number(prog),
    };
  });
}

// ─────────────────────────────────────────────

export default function MyprojectMilestone() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();

  const [project, setProject] = useState<ProjectData | null>(null);
  const [rawMilestones, setRawMilestones] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    // 1) project-<id>.json 시도 → 2) my-projects.json에서 해당 id 찾기
    fetch(`/mocks/project-${id}.json`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("no per-id json"))))
      .then((data: ProjectData) => {
        // ✅ 오버라이드(로컬 저장) 적용
        const ov = getOverride(id);
        const merged: ProjectData = ov ? { ...data, ...ov } : data;

        setProject(merged);
        setRawMilestones(merged); // 정규화 함수에 통째로 넘김
      })
      .catch(() =>
        fetch(`/mocks/my-projects.json`)
          .then((res) => {
            if (!res.ok) throw new Error("my-projects.json load fail");
            return res.json();
          })
          .then((arr: ProjectData[]) => {
            const found = Array.isArray(arr)
              ? arr.find((p) => Number(p.id) === Number(id))
              : null;
            if (!found) throw new Error("project not found in array");

            // ✅ 오버라이드 적용
            const ov = getOverride(id!);
            const merged: ProjectData = ov ? { ...found, ...ov } : found;

            setProject(merged);
            setRawMilestones(merged);
          })
      )
      .catch((err) => {
        console.error(err);
        setProject(null);
        setRawMilestones(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const milestones: UIMilestone[] = useMemo(
    () => normalizeMilestones(rawMilestones),
    [rawMilestones]
  );

  const handleGoBack = () => nav(-1);
  const handleEdit = () => nav(`/myproject/${id}/milestone/edit`);

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
          <div className="milestone-content-header">
            <button className="back-button" onClick={handleGoBack}>
              ← 돌아가기
            </button>
            <button className="edit-button" onClick={handleEdit}>
              수정하기
            </button>
          </div>

          <div className="card-main">
            {milestones.length > 0 ? (
              <table className="milestone-table">
                <thead>
                  <tr>
                    <th>마일스톤 이름</th>
                    <th>닉네임</th>
                    <th>종료일</th>
                    <th>진행률</th>
                  </tr>
                </thead>
                <tbody>
                  {milestones.map((m) => (
                    <tr key={m.id}>
                      <td>{m.title}</td>
                      <td>{m.nickname ?? "-"}</td>
                      <td>{m.deadline ?? "-"}</td>
                      <td>
                        <div className="milestone-progress">
                          <ProgressBar progress={m.progress} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ padding: "1rem", textAlign: "center" }}>
                등록된 마일스톤이 없습니다.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
