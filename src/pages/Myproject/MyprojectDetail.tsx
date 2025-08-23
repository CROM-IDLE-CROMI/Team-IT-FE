import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../App.css';

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
  status: '완료' | '진행중';
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


// --- API Mock 함수 ---
// 실제 앱에서는 API 호출로 대체됩니다.
const fetchProjectById = (id: string): Promise<ProjectData> => {
  // id 값에 따라 다른 상태의 목업 데이터를 반환합니다.
  const mockDatabase: { [key: string]: ProjectData } = {
    "1": { // 진행중인 프로젝트
      id: 1n,
      title: '북으로 가자',
      status: 'ONGOING',
      description: '팀원들과 함께 성장하며 즐겁게 진행하는 사이드 프로젝트입니다. (진행중)',
      progress: 75,
      recruit_positions: null,
      required_stacks: null,
      members: [
        { id: 'm1', name: '홍길동', role: '팀장 / 백엔드' },
        { id: 'm2', name: '김철수', role: '프론트엔드' },
        { id: 'm3', name: '이영희', role: '디자이너' },
      ],
      milestones: [
        { id: 'ms1', title: '1차 프로토타입 개발', status: '완료' },
        { id: 'ms2', title: '알파 테스트', status: '진행중' },
      ],
      logoUrl: 'https://via.placeholder.com/150/007BFF/FFFFFF?text=Ongoing',
    },
    "2": { // 모집중인 프로젝트
      id: 2n,
      title: 'TEAM-IT 신규 서비스',
      status: 'RECRUITING',
      description: '새로운 소셜 네트워킹 서비스를 기획하고 있습니다. 함께 성장할 열정적인 팀원을 모집합니다. React, Node.js 경험자 우대합니다. (모집중)',
      progress: null,
      recruit_positions: [
        { position: 'FRONTEND', count: 2 },
        { position: 'BACKEND', count: 1 },
        { position: 'DESIGNER', count: 1 },
      ],
      required_stacks: ['React', 'TypeScript', 'Node.js', 'Express'],
      members: [{ id: 'm1', name: '박팀장', role: '기획 / 팀장' }],
      milestones: null,
      logoUrl: 'https://via.placeholder.com/150/28A745/FFFFFF?text=Recruiting',
    },
    "3": { // 완료된 프로젝트
      id: 3n,
      title: '지난 날의 우리',
      status: 'COMPLETED',
      description: '2024년 하반기를 뜨겁게 달군 커뮤니티 서비스입니다. 성공적으로 런칭을 마쳤으며, 사용자들에게 좋은 반응을 얻었습니다. (완료)',
      progress: 100,
      recruit_positions: null,
      required_stacks: null,
      members: [
        { id: 'm1', name: '최선장', role: 'PM' },
        { id: 'm2', name: '이항해', role: '개발' },
        { id: 'm3', name: '김디쟌', role: '디자인' },
      ],
      milestones: null,
      logoUrl: 'https://via.placeholder.com/150/6C757D/FFFFFF?text=Completed',
    }
  };

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (mockDatabase[id]) {
        resolve(mockDatabase[id]);
      } else {
        reject(new Error('Project not found'));
      }
    }, 500);
  });
};


// --- 메인 컴포넌트 ---
export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchProjectById(id)
      .then(data => setProject(data))
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  }, [id]);

  // --- 상태별 UI 렌더링 함수 ---

  // 사이드바 메뉴를 상태에 따라 다르게 렌더링
  const renderSidebarNav = () => {
    if (!project) return null;
    let statusText = '';
    let navItems: string[] = [];

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
          {navItems.map(item => <li key={item}>{item}</li>)}
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
            <div className="card">
              <div className="card-header">
                <h3>프로젝트 소개 (진행중)</h3>
                <button className="edit-button">수정하기</button>
              </div>
              <p>{project.description}</p>
            </div>
            <div className="content-grid">
              <div className="card"><h4>멤버</h4>{/* 멤버 목록 */}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="card"><h4>진행률: {project.progress}%</h4>{/* 진행률 바 */}</div>
                <div className="card"><h4>마일스톤</h4>{/* 마일스톤 목록 */}</div>
              </div>
            </div>
          </>
        );
      case 'RECRUITING':
        return (
          <div className="card">
            <div className="card-header">
              <h3>프로젝트 소개 (모집중)</h3>
               <button className="edit-button">수정하기</button>
            </div>
            <p>{project.description}</p>
            <h4>모집 분야</h4>
            <ul>{project.recruit_positions?.map(p => <li key={p.position}>{p.position}: {p.count}명</li>)}</ul>
            <h4>기술 스택</h4>
            <div>{project.required_stacks?.join(', ')}</div>
          </div>
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