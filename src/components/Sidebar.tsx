import React from 'react';
import "./Sidebar.css";

interface SidebarProps {
  currentStep: number;
  onClickStep: (index: number) => void;
}

const Sidebar = ({ currentStep, onClickStep }: SidebarProps) => {
  const steps = ['기본정보', '프로젝트 정보', '프로젝트 상황', '근무 환경', '지원자 정보'];

  return (
    <div className="sidebar">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`sidebar-item ${index === currentStep ? 'active' : ''}`}
          onClick={() => onClickStep(index)}
        >
          {/* 원형 아이콘 */}
          <div className="circle" />
          {/* 단계명 */}
          <span>{step}</span>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
