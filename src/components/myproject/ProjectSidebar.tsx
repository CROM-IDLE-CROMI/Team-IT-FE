import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../App.css';

// --- 타입 정의 ---
type ProjectStatus = 'RECRUITING' | 'ONGOING' | 'COMPLETED';

interface SidebarProjectData {
  id: number;
  title: string;
  status: ProjectStatus;
  logoUrl?: string;
}

interface ProjectSidebarProps {
  project: SidebarProjectData;
}

export default function ProjectSidebar({ project }: ProjectSidebarProps) {
  const { id, title, status, logoUrl } = project;

  let statusText = '';
  let navItems: { name: string; path: string }[] = [];

  // 프로젝트 상태에 따라 메뉴 아이템과 경로를 설정합니다.
  switch (status) {
    case 'ONGOING':
      statusText = '진행중';
      navItems = [
        { name: '프로젝트 소개', path: `/myproject/${id}/explain` },
        { name: '멤버', path: `/myproject/${id}/member` },
        { name: '마일스톤 기능', path: `/myproject/${id}/milestone` },
      ];
      break;
    case 'RECRUITING':
      statusText = '모집중';
      navItems = [
        { name: '프로젝트 소개', path: `/myproject/${id}/explain` },
        { name: '멤버', path: `/myproject/${id}/member` },
        { name: '지원서 보기', path: `/myproject/${id}/applications` },
      ];
      break;
    case 'COMPLETED':
      statusText = '완료됨';
      navItems = [
        { name: '프로젝트 소개', path: `/myproject/${id}/explain` },
        { name: '멤버', path: `/myproject/${id}/member` },
      ];
      break;
  }

  return (
    <aside className="project-sidebar">
      <div className="team-logo-placeholder">
        <img 
          src={logoUrl || 'https://placehold.co/220x220/f0f2f5/333?text=Logo'} 
          alt={`${title} 로고`}
        />
      </div>
      <h2>{title}</h2>
      <span className={`status-badge status-${status.toLowerCase()}`}>{statusText}</span>

      <nav className="sidebar-nav">
        <ul>
          {navItems.map(item => (
            <li key={item.name}>
              <NavLink 
                to={item.path}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}