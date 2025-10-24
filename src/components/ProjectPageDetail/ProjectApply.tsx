import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../layouts/Header";
import { getAllProjects } from "../../utils/teamToProjectConverter";
import { applicationService } from "../../services/applicationService";
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
    const fetchProject = () => {
      setIsLoading(true);
      const projectId = parseInt(id || "1", 10);
      
      try {
        // 1. 팀원 모집 프로젝트에서 먼저 찾기
        const teamRecruitProjects = getAllProjects();
        console.log('🔍 팀원 모집 프로젝트 목록:', teamRecruitProjects);
        console.log('🔍 찾고 있는 프로젝트 ID:', projectId);
        
        const teamProject = teamRecruitProjects.find(p => p.id === projectId);
        console.log('🔍 찾은 팀원 모집 프로젝트:', teamProject);
        console.log('🔍 프로젝트 ID 타입 비교:', {
          projectId,
          projectIdType: typeof projectId,
          teamProjectIds: teamRecruitProjects.map(p => ({ id: p.id, type: typeof p.id }))
        });
        
        if (teamProject) {
          // 팀원 모집 프로젝트를 Project 타입으로 변환
          const convertedProject: Project = {
            id: teamProject.id,
            title: teamProject.title,
            author: teamProject.author,
            description: teamProject.applicationDescription || teamProject.description || "프로젝트에 대한 자세한 설명이 없습니다.",
            recruitPositions: teamProject.positions || [],
            questions: teamProject.applicationQuestions || [
              "프로젝트에 기여할 수 있는 기술은 무엇인가요?",
              "가장 기억에 남는 프로젝트 경험에 대해 설명해주세요.",
              "이 프로젝트에 지원하게 된 동기는 무엇인가요?"
            ]
          };
          
          console.log('🔍 변환된 프로젝트 데이터:', convertedProject);
          console.log('🔍 질문 데이터:', convertedProject.questions);
          
          setProject(convertedProject);
          setFormData(prev => ({ 
            ...prev, 
            title: `[지원서] ${convertedProject.title} (${convertedProject.author})`,
            position: convertedProject.recruitPositions?.[0] || "",
            answers: new Array(convertedProject.questions?.length || 0).fill(""),
          }));
          console.info("✅ 팀원 모집 프로젝트에서 정보 불러오기 성공");
          return;
        }
        
        // 2. 팀원 모집 프로젝트에도 없으면 더미 데이터 사용
        console.warn("⚠️ 팀원 모집 프로젝트를 찾을 수 없음 - 더미 데이터 사용");
        setProject(dummyProject);
        setFormData(prev => ({ 
          ...prev, 
          title: `[지원서] ${dummyProject.title} (${dummyProject.author})`,
          position: dummyProject.recruitPositions?.[0] || "",
          answers: new Array(dummyProject.questions?.length || 0).fill(""),
        }));
        console.info("✅ 더미 데이터 사용");
        
      } catch (error) {
        console.error("❌ 프로젝트 정보 불러오기 실패:", error);
        // 에러 발생 시 더미 데이터 사용
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

    // 1️⃣ 유효성 검사
    if (!formData.title.trim() || !formData.motivation.trim()) {
      setStatusMessage("🚨 모든 필수 항목을 입력해주세요!");
      return;
    }

    if (!formData.agreeToTerms) {
      setStatusMessage("🚨 개인정보 제공에 동의해주세요!");
      return;
    }

    if (!project?.id) {
      setStatusMessage("🚨 프로젝트 정보를 찾을 수 없습니다!");
      return;
    }

    try {
      // 2️⃣ 지원 데이터 준비
      const applicationData = {
        teamRecruitId: project.id,
        position: formData.position,
        message: formData.motivation,
        portfolio: formData.title, // 제목을 포트폴리오 URL로 사용 (실제로는 별도 필드 필요)
        answers: project.questions?.map((question, index) => ({
          questionId: index + 1,
          answer: formData.answers[index] || ""
        })) || []
      };
      
      // 3️⃣ 지원 서비스를 통해 제출
      const response = await applicationService.submit(applicationData);
      
      // 4️⃣ 성공 처리
      setStatusMessage("🎉 지원서가 성공적으로 제출되었습니다!");
      
      // 5️⃣ 3초 후 프로젝트 목록 페이지로 이동
      setTimeout(() => {
        navigate('/Projects');
      }, 2000);

    } catch (error: any) {
      // 6️⃣ 에러 처리
      console.error("❌ 지원서 제출 실패:", error);
      const errorMessage = error.message || "지원서 제출에 실패했습니다. 다시 시도해주세요.";
      setStatusMessage(`⚠️ ${errorMessage}`);
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
              
              {project.questions && project.questions.length > 0 ? (
                project.questions.map((question, index) => (
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
                ))
              ) : (
                <div className="no-questions-message">
                  <p>이 프로젝트에는 추가 질문이 없습니다.</p>
                </div>
              )}
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

        {/* 오른쪽 패널 - 프로젝트 정보 */}
        <div className="content-panel">
          <h3 className="content-title">프로젝트 정보</h3>
          <div className="content-display">
            {/* 프로젝트 기본 정보 */}
            <div style={{ marginTop: '1rem', padding: '1rem', background: '#fff', borderRadius: '8px', border: '1px solid #e9ecef' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>프로젝트 개요</h4>
              <p style={{ margin: '0 0 1rem 0', color: '#666', fontSize: '0.9rem' }}>
                {project.description}
              </p>
              
              {/* 팀원 모집 프로젝트인 경우 추가 정보 표시 */}
              {project.id > 10000 && (
                <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '6px', border: '1px solid #dee2e6' }}>
                  <h5 style={{ margin: '0 0 0.5rem 0', color: '#495057', fontSize: '0.9rem' }}>📋 모집 정보</h5>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8rem' }}>
                    <div>
                      <strong>모집 직군:</strong> {project.recruitPositions?.join(', ') || '정보 없음'}
                    </div>
                    <div>
                      <strong>작성자:</strong> {project.author}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* 지원 가능한 직군 */}
            <div style={{ marginTop: '1rem', padding: '1rem', background: '#fff', borderRadius: '8px', border: '1px solid #e9ecef' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>모집 직군</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {project.recruitPositions?.map((position, index) => (
                  <span
                    key={index}
                    style={{
                      padding: '0.25rem 0.5rem',
                      background: '#e3f2fd',
                      color: '#1976d2',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: '500'
                    }}
                  >
                    {position}
                  </span>
                )) || <span style={{ color: '#666', fontSize: '0.9rem' }}>모집 직군 정보가 없습니다.</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectApply;
