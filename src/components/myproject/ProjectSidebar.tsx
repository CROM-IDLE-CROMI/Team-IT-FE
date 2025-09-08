import React from 'react';
import { Link } from 'react-router-dom';

// --- 부모 컴포넌트로부터 받을 데이터 타입 정의 ---
type ProjectStatus = 'RECRUITING' | 'ONGOING' | 'COMPLETED';

// ProjectData 타입의 일부만 필요하므로, 사이드바에 필요한 속성만 정의합니다.
interface SidebarProjectData {
  id: bigint | number;
  title: string;
  status: ProjectStatus;
  logoUrl?: string;
}

interface ProjectSidebarProps {
  project: SidebarProjectData;
}

// --- 사이드바 컴포넌트 ---
export default function ProjectSidebar({ project }: ProjectSidebarProps) {
  const { id, title, status, logoUrl } = project;

  let statusText = '';
  let navItems: string[] = [];

  // URL 경로를 관리하는 맵
  const pathMap: { [key: string]: string } = {
    '프로젝트 소개': `/myproject/${id}/explain`,
    '멤버': `/myproject/${id}/members`,
    '마일스톤 기능': `/myproject/${id}/milestones`,
    '지원서 보기': `/myproject/${id}/applications`,
  };

  // 프로젝트 상태(status)에 따라 표시할 텍스트와 메뉴 아이템을 결정합니다.
  switch (status) {
    case 'ONGOING':
      statusText = '진행중';
      navItems = ['프로젝트 소개', '멤버', '마일스톤 기능'];
      break;
    case 'RECRUITING':
      statusText = '모집중';
      navItems = ['프로젝트 소개', '멤버', '지원서 보기'];
      break;
    case 'COMPLETED':
      statusText = '완료됨';
      navItems = ['프로젝트 소개', '멤버'];
      break;
  }

  return (
    <aside className="project-sidebar">
      <img src={logoUrl || 'https://placehold.co/180x180/EFEFEF/333?text=Logo'} alt="팀 로고" className="team-logo" />
      <nav className="sidebar-nav">
        <h2>{title}</h2>
        <span className={`status-badge status-${status.toLowerCase()}`}>{statusText}</span>
        <ul>
          {navItems.map(item => (
            <li key={item}>
              <Link to={pathMap[item] || '#'}>{item}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}