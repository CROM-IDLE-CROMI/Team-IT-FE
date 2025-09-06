import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import '../../App.css';
import ProgressBar from '../../components/ProgressBar';

// --- ERD 및 UI 기반 타입 정의 ---
// ERD의 ENUM 타입들을 문자열 리터럴 타입으로 정의
type ProjectStatus = 'RECRUITING' | 'ONGOING' | 'COMPLETED';

// ERD의 JSON 컬럼들을 위한 타입
interface RecruitPosition {
  position: string; // ex: "FRONTEND"
  count: number;
}

// 가상 데이터 타입을 정의 (ERD에 명시되지 않은 부분)
interface Member {
  id: string;
  name: string;
  role: string;
}

interface Milestone {
  id: string;
  title: string;
  progress: number;
}

// project_table을 기반으로 한 메인 데이터 타입
interface ProjectData {
  id: bigint;
  title: string;
  status: ProjectStatus;
  description: string;
  progress: number | null; // 진행중일 때만 사용
  recruit_positions: RecruitPosition[] | null; // 모집중일 때만 사용
  required_stacks: string[] | null; // 모집중일 때 사용
  members: Member[] | null; // 진행중, 완료일 때 사용
  milestones: Milestone[] | null; // 진행중일 때만 사용
  logoUrl?: string;
}

// --- 메인 컴포넌트 ---
export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  // 페이지 로드 관련 함수
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    
    // fetch를 사용해 public 폴더의 json 파일을 불러옴
    fetch(`/mocks/project-${id}.json`)
      .then(response => {
        if (!response.ok) {
          throw new Error('네트워크 응답이 올바르지 않습니다.');
        }
        return response.json(); // 응답을 JSON으로 파싱
      })
      .then(data => {
        setProject(data); // 파싱된 데이터를 state에 저장
      })
      .catch(error => {
        console.error('데이터를 불러오는 데 실패했습니다:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  // 수정버튼 클릭시
  const handleEditClick = () => {
    nav('/myproject/edit/${id}');
  };

  // --- 상태별 UI 렌더링 함수 ---
  // 사이드바 메뉴를 상태에 따라 다르게 렌더링
  const renderSidebarNav = () => {
    if (!project) return null;
    let statusText = '';
    let navItems: string[] = [];

    // URL 경로를 쉽게 관리하기 위한 맵
    const pathMap: { [key: string]: string } = {
      '프로젝트 소개': `/myproject/${id}/explain`,
      '멤버': `/myproject/${id}/members`,
      '마일스톤 기능': `/myproject/${id}/milestones`,
      '지원서 보기': `/myproject/${id}/applications`,
    };

    switch (project.status) {
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
      <nav className="sidebar-nav">
        <h2>{project.title}</h2>
        <span className={`status-badge status-${project.status.toLowerCase()}`}>{statusText}</span>
        <ul>
          {navItems.map(item => (
            <li key={item}>
              <Link to={pathMap[item] || '#'}>{item}</Link>
            </li>
          ))}
        </ul>
      </nav>
    );
  };

  // 메인 컨텐츠를 상태에 따라 다르게 렌더링
  const renderMainContent = () => {
    if (!project) return null;

    switch (project.status) {
      case 'ONGOING':
        return (
          <>
            <div className="edit-button-wrapper">
              <button className="edit-button" onClick={handleEditClick}>수정하기</button>
            </div>
            <div className="card">
              <div className="card-header">
                <h3>프로젝트 소개 (진행중)</h3>
              </div>
              <p>{project.description}</p>
            </div>
            <div className="content-grid">
              <div className="card"><h4>멤버</h4>{/* 멤버 목록 */}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="card">
                  <div className="card-header">
                    <h4>진행률</h4>
                    <span>{project.progress ?? 0}%</span>
                  </div>
                  <ProgressBar progress={project.progress ?? 0} />
                </div>
                <div className="card"><h4>마일스톤</h4>{/* 마일스톤 목록 */}</div>
              </div>
            </div>
          </>
        );
      case 'RECRUITING':
        return (
          <>
            <div className="edit-button-wrapper">
              <button className="edit-button" onClick={handleEditClick}>수정하기</button>
            </div>
            <div className="card">
              <div className="card-header">
                <h3>프로젝트 소개 (모집중)</h3>
              </div>
              <p>{project.description}</p>
              <h4>모집 분야</h4>
              <ul>{project.recruit_positions?.map(p => <li key={p.position}>{p.position}: {p.count}명</li>)}</ul>
              <h4>기술 스택</h4>
              <div>{project.required_stacks?.join(', ')}</div>
            </div>
          </>
        );
      case 'COMPLETED':
        return (
          <div className="card">
            <div className="card-header">
              <h3>프로젝트 소개 (완료)</h3>
            </div>
            <p>{project.description}</p>
          </div>
        );
      default:
        return <div>알 수 없는 프로젝트 상태입니다.</div>;
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (!project) return <div>프로젝트를 찾을 수 없습니다.</div>;

  return (
    <>
      <div className="project-detail-layout">
        <aside className="project-sidebar">
          <img src="/image.png" alt="팀 로고" className="team-logo" />
          {renderSidebarNav()}
        </aside>
        <main className="project-main-content">
          {renderMainContent()}
        </main>
      </div>
    </>
  );
}