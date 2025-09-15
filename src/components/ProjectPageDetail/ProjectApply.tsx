import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../layouts/Header";
import "./ProjectApply.css";

// API 응답에 맞춰 프로젝트 데이터 타입을 정의합니다.
interface Project {
  id: number;
  title: string;
  author: string;
  description: string;
  recruitPositions?: string[];
  questions?: string[]; // 질문을 배열로 받도록 수정
} // 백엔드한테 받는 정보

// 폼 데이터 타입을 정의합니다.
interface FormData {
  title: string;
  position: string;
  motivation: string;
  minRequirement: string;
  answers: string[]; // 답변을 배열로 받도록 수정
  agreeToTerms: boolean;
} // 백엔드에 보내는 정보

// API가 실패했을 때 사용할 더미 프로젝트 데이터
const dummyProject: Project = {
  id: 1,
  title: "혁신적인 웹 서비스 개발 프로젝트",
  author: "김한성",
  description: "이 프로젝트는 React와 Node.js를 사용하여 혁신적인 웹 서비스를 개발합니다. 열정 있는 팀원을 모집합니다.",
  recruitPositions: ["프론트엔드", "백엔드", "디자이너"],
  questions: [ // 질문을 배열로 정의
    "프로젝트에 기여할 수 있는 기술은 무엇인가요?",
    "가장 기억에 남는 프로젝트 경험에 대해 설명해주세요."
  ]
};

const ProjectApply = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 폼 데이터 상태
  const [formData, setFormData] = useState<FormData>({
    title: "",
    position: "", // 초기값을 빈 문자열로 설정하여 동적으로 채움
    motivation: "",
    minRequirement: "예",
    answers: [], // 초기값을 빈 배열로 설정
    agreeToTerms: false
  });

  // 프로젝트 데이터 상태 (API 또는 더미)
  const [project, setProject] = useState<Project | null>(null);
  // 로딩 상태 및 메시지
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");

  // 프로젝트 데이터 불러오기
  useEffect(() => {
    const fetchProject = async () => {
      setIsLoading(true);
      const projectId = parseInt(id || "1", 10);
      const API_BASE = "http://localhost:5173";
      const API_ENDPOINT = `${API_BASE}/api/projects/${projectId}`;

        try { //백엔드 한테 받아서 프론트에 보여주는 코드
          const res = await fetch(API_ENDPOINT);
          if (!res.ok) {
            throw new Error(`API error: ${res.status}`);
          }
          const data: Project = await res.json();
          setProject(data);
          setFormData(prev => ({ 
            ...prev, 
            title: `[지원서] ${data.title} (${data.author})`,
            position: data.recruitPositions?.[0] || "",
            answers: new Array(data.questions?.length || 0).fill(""),
          }));
          console.info("✅ 프로젝트 정보 불러오기 성공");
        } catch (error) {
          console.warn("⚠️ 프로젝트 정보 불러오기 실패 - 더미 데이터 사용", error);
          setProject(dummyProject);
          setFormData(prev => ({ 
            ...prev, 
            title: `[지원서] ${dummyProject.title} (${dummyProject.author})`,
            position: dummyProject.recruitPositions?.[0] || "",
            answers: new Array(dummyProject.questions?.length || 0).fill(""),
          }));
        } finally {
          setIsLoading(false);
        }
    };

    fetchProject();
  }, [id]);

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAnswerChange = (index: number, value: string) => {
    setFormData(prev => {
      const newAnswers = [...prev.answers];
      newAnswers[index] = value;
      return {
        ...prev,
        answers: newAnswers
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage("");

    // 유효성 검사
    if (!formData.title.trim() || !formData.motivation.trim()) {
      setStatusMessage("🚨 모든 필수 항목을 입력해주세요!");
      return;
    }

    if (!formData.agreeToTerms) {
      setStatusMessage("🚨 개인정보 제공에 동의해주세요!");
      return;
    }

    const API_BASE = "http://localhost:5173";
    const API_ENDPOINT = `${API_BASE}/api/applications`;

    try { //백엔드한테 보내는 코드
      const res = await fetch(API_ENDPOINT, {
        method: 'POST', // 이 방식으로
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // formData를 JSON 문자열로 변환하여 보냄
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const result = await res.json();
      console.log("✅ 지원서 제출 성공:", result);
      setStatusMessage("🎉 지원이 완료되었습니다!");

    } catch (error) {
      console.error("⚠️ 지원서 제출 실패:", error);
      setStatusMessage("⚠️ 지원서 제출에 실패했습니다. 다시 시도해주세요.");
    }
  };

  if (isLoading) {
    return (
      <div className="project-apply-container">
        <Header />
        <div className="apply-layout">
          <div className="loading-message">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-apply-container">
        <Header />
        <div className="apply-layout">
          <div className="error-message">프로젝트 정보를 찾을 수 없습니다.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="project-apply-container">
      <Header />
      
      <div className="apply-layout">
        {/* 왼쪽 패널 - 지원서 폼 */}
        <div className="apply-form-panel">
          <form onSubmit={handleSubmit} className="apply-form">
            {/* 제목 섹션 */}
            <div className="form-section">
              <label className="form-label">제목</label>
              <input
                type="text"
                className="form-input"
                placeholder="제목을 입력하세요"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>

            {/* 지원 직군 섹션 */}
            <div className="form-section">
              <label className="form-label">지원 직군</label>
              <div className="position-buttons">
                {project.recruitPositions?.map((position) => (
                  <button
                    key={position}
                    type="button"
                    className={`position-btn ${formData.position === position ? 'selected' : ''}`}
                    onClick={() => handleInputChange('position', position)}
                  >
                    {position}
                  </button>
                ))}
              </div>
            </div>

            {/* 참여 동기 섹션 */}
            <div className="form-section">
              <label className="form-label">참여 동기</label>
              <textarea
                className="form-textarea"
                placeholder="지원 동기를 입력해주세요 (최소 100자)"
                value={formData.motivation}
                onChange={(e) => handleInputChange('motivation', e.target.value)}
                rows={4}
              />
            </div>

            {/* 최소 요건 충족 여부 */}
            <div className="form-section">
              <label className="form-label">최소 요건 충족 여부</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="minRequirement"
                    value="예"
                    checked={formData.minRequirement === '예'}
                    onChange={(e) => handleInputChange('minRequirement', e.target.value)}
                  />
                  예
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="minRequirement"
                    value="아니요"
                    checked={formData.minRequirement === '아니요'}
                    onChange={(e) => handleInputChange('minRequirement', e.target.value)}
                  />
                  아니요
                </label>
              </div>
            </div>

            {/* 질문에 대한 답변 섹션 */}
            <div className="form-section">
              <label className="form-label">질문에 대한 답변</label>
              
              {project.questions?.map((question, index) => (
                <div key={index} className="question-group">
                  <label className="question-label">{index + 1}. {question}</label>
                  <textarea
                    className="form-textarea"
                    placeholder="답변을 입력해주세요"
                    value={formData.answers[index] || ""}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    rows={3}
                  />
                </div>
              ))}
            </div>

            {/* 개인정보 동의 체크박스 */}
            <div className="form-section">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                />
                본인 정보 제공에 동의하십니까? (필수)
              </label>
            </div>

            {/* 제출 버튼 */}
            <button type="submit" className="submit-btn">
              제출하기
            </button>
            {statusMessage && <div className="status-message">{statusMessage}</div>}
          </form>
        </div>

        {/* 오른쪽 패널 - 본문 내용 */}
        <div className="content-panel">
          <h3 className="content-title">본문 내용</h3>
          <div className="content-display">
            <div style={{ marginTop: '1rem', padding: '1rem', background: '#fff', borderRadius: '8px', border: '1px solid #e9ecef' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>프로젝트 개요</h4>
              <p style={{ margin: '0 0 1rem 0', color: '#666', fontSize: '0.9rem' }}>
                {project.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectApply;
