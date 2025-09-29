import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProjectSidebar from "../../components/myproject/ProjectSidebar";
import "../../App.css";

import type { ProjectData } from "../../types/project";

interface Application {
  id: number;
  nickname: string;
  email: string;
  role: string;
  motivation: string;
  questions: string[];
  answers: string[];
}

export default function MyprojectApplications() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    fetch(`/mocks/project-${id}.json`)
      .then((res) => res.json())
      .then((data) => {
        setProject(data);
        setApplications(data.applications || []);
      })
      .catch((err) => console.error("데이터를 불러오지 못했습니다:", err))
      .finally(() => setLoading(false));
  }, [id]);

  // 모달 상태를 string[] | null 로 변경
  const [modalContent, setModalContent] = useState<string[] | null>(null);
  const [modalType, setModalType] = useState<"motivation" | "qa" | null>(null);

  const openModal = (content: string) => {
    setModalType("motivation");
    setModalContent([content]);
  };

  const openQAModal = (questions: string[], answers: string[]) => {
    setModalType("qa");
    const merged = questions.map((q, i) => `${q}\n${answers[i] || ""}`);
    setModalContent(merged);
  };

  const handleGoBack = () => navigate(`/myproject/${id}`);

  const closeModal = () => {
    setModalType(null);
    setModalContent(null);
  };

  if (loading) return <div>Loading...</div>;
  if (!project) return <div>Project not found.</div>;


  return (
    <div className="myproject-layout">
      {/* 왼쪽 사이드바 */}
      {project && <ProjectSidebar project={project} />}

      {/* 오른쪽 메인 컨텐츠 */}
      <div className="project-main-content">
        <div className="application-back-wrapper">
          <button className="back-button" onClick={handleGoBack}>
            ← 돌아가기
          </button>
        </div>
        <div className="card">
          <h2>지원서 보기</h2>
          <table className="application-table">
            <thead>
              <tr>
                <th>닉네임</th>
                <th>이메일</th>
                <th>지원 직군</th>
                <th>지원 동기</th>
                <th>질문에 대한 답변</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id}>
                  <td>{app.nickname}</td>
                  <td>{app.email}</td>
                  <td>{app.role}</td>
                  <td>
                    <button
                      className="application-read-btn"
                      onClick={() => openModal(app.motivation)}
                    >
                      읽어보기
                    </button>
                  </td>
                  <td>
                    <button
                      className="application-read-btn"
                      onClick={() => openQAModal(app.questions, app.answers)}
                    >
                      읽어보기
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 모달 */}
      {modalContent && (
        <div className="application-modal">
          <div className="application-modal-content">
            {modalType === "motivation" && (
              <>
                <h3>지원 동기</h3>
                <p className="qa-answer">{modalContent[0]}</p>
              </>
            )}

            {modalType === "qa" && (
              <>
                <h3>지원서 질문/답변</h3>
                <ul className="qa-list">
                  {modalContent.map((item, idx) => {
                    const [q, ...rest] = item.split("\n");
                    const a = rest.join("\n");
                    return (
                      <li key={idx} className="qa-item">
                        <p className="qa-question">{q}</p>
                        <p className="qa-answer">{a}</p>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
            <button className="application-modal-close" onClick={closeModal}>
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
