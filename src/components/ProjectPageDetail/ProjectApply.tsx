import React, { useState, useEffect, useRef } from "react";
import Header from "../../layouts/Header";
import "./ProjectApply.css";

const ProjectApply = () => {
  const [formData, setFormData] = useState({
    title: "",
    position: "프론트엔드",
    motivation: "",
    minRequirement: "예",
    question1: "",
    answer1: "",
    question2: "",
    answer2: "",
    agreeToTerms: false
  });

  const contentPanelRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  // 스크롤 이벤트 리스너
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.motivation.trim()) {
      alert("모든 필수 항목을 입력해주세요!");
      return;
    }

    if (!formData.agreeToTerms) {
      alert("개인정보 제공에 동의해주세요!");
      return;
    }

    console.log("지원서 제출:", formData);
    alert("지원이 완료되었습니다!");
  };

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
                <button
                  type="button"
                  className={`position-btn ${formData.position === '프론트엔드' ? 'selected' : ''}`}
                  onClick={() => handleInputChange('position', '프론트엔드')}
                >
                  프론트엔드
                </button>
                <button
                  type="button"
                  className={`position-btn ${formData.position === '디자인' ? 'selected' : ''}`}
                  onClick={() => handleInputChange('position', '디자인')}
                >
                  디자인
                </button>
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
              
              {/* 질문 1 */}
              <div className="question-group">
                <label className="question-label">1.</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="질문을 입력하세요"
                  value={formData.question1}
                  onChange={(e) => handleInputChange('question1', e.target.value)}
                />
                <textarea
                  className="form-textarea"
                  placeholder="답변을 입력해주세요"
                  value={formData.answer1}
                  onChange={(e) => handleInputChange('answer1', e.target.value)}
                  rows={3}
                />
              </div>

              {/* 질문 2 */}
              <div className="question-group">
                <label className="question-label">2.</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="질문을 입력하세요"
                  value={formData.question2}
                  onChange={(e) => handleInputChange('question2', e.target.value)}
                />
                <textarea
                  className="form-textarea"
                  placeholder="답변을 입력해주세요"
                  value={formData.answer2}
                  onChange={(e) => handleInputChange('answer2', e.target.value)}
                  rows={3}
                />
              </div>
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
          </form>
        </div>

        {/* 오른쪽 패널 - 본문 내용 */}
        <div 
          ref={contentPanelRef}
          className="content-panel"
          style={{
            transform: `translateY(${Math.min(scrollY * 0.15, 50)}px) rotateX(${Math.min(scrollY * 0.02, 5)}deg)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          <h3 className="content-title">본문 내용</h3>
          <div className="content-display">
            {/* 프로젝트 상세 내용이 여기에 표시될 예정 */}
            <p>프로젝트 상세 정보가 여기에 표시됩니다.</p>
            <div style={{ marginTop: '1rem', padding: '1rem', background: '#fff', borderRadius: '8px', border: '1px solid #e9ecef' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>프로젝트 개요</h4>
              <p style={{ margin: '0 0 1rem 0', color: '#666', fontSize: '0.9rem' }}>
                이 프로젝트는 혁신적인 웹 서비스를 개발하는 것을 목표로 합니다.
              </p>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>기술 스택</h4>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ background: '#e3f2fd', color: '#1976d2', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>React</span>
                <span style={{ background: '#e8f5e8', color: '#2e7d32', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>Node.js</span>
                <span style={{ background: '#fff3e0', color: '#f57c00', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>MongoDB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectApply;
