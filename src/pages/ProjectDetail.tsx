import Header from "../layouts/Header";
import "../pages/ProjectDetail.css";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProjectComment from "../components/ProjectPageDetail/ProjectComment";
import { requireAuth } from "../utils/authUtils";
import "../styles/TechStack";

// 더미 프로젝트 데이터 (ProjectPage.tsx와 동일)
const dummyProjects = [
  {
    id: 1,
    title: "웹 개발 프로젝트 팀원 모집",
    author: "김한성",
    date: "2025.01.15",
    location: "서울",
    techStack: ["React","MongoDB"],
    positions: ["앱"],
    likes: 12,
    views: 45,
    description: "혁신적인 웹 서비스를 개발하는 프로젝트입니다. React와 Node.js를 사용하여 풀스택 개발을 진행합니다.",
    status: "모집중",
    teamSize: "3-5명",
    duration: "3-6개월",
    recruitCount: "2명",
    recruitPositions: ["프론트엔드", "백엔드"],
    recruitPeriod: "3개월",
    startDate: "2025.02.01",
    activityType: "공모전"
  },
  {
    id: 2,
    title: "모바일 앱 개발자 구합니다",
    author: "이지은",
    date: "2025.01.14",
    location: "부산",
    techStack: ["Flutter", "Firebase"],
    positions: ["웹"],
    likes: 8,
    views: 32,
    description: "Flutter를 사용한 크로스 플랫폼 모바일 앱을 개발합니다. UI/UX에 관심 있는 개발자를 찾습니다.",
    status: "모집중",
    teamSize: "2-3명",
    duration: "2-4개월",
    recruitCount: "1명",
    recruitPositions: ["프론트엔드"],
    recruitPeriod: "2개월",
    startDate: "2025.01.20",
    activityType: "사이드 프로젝트"
  },
  {
    id: 3,
    title: "AI 프로젝트 팀원 모집",
    author: "박민수",
    date: "2025.01.13",
    location: "대구",
    techStack: ["Python", "TensorFlow", "FastAPI"],
    positions: ["앱"],
    likes: 15,
    views: 67,
    description: "머신러닝을 활용한 예측 모델을 개발하는 프로젝트입니다. 데이터 분석과 AI 모델링 경험이 있는 분을 찾습니다.",
    status: "모집중",
    teamSize: "4-6명",
    duration: "6-12개월",
    recruitCount: "2명",
    recruitPositions: ["AI 엔지니어", "백엔드"],
    recruitPeriod: "6개월",
    startDate: "2025.02.15",
    activityType: "AI/머신러닝"
  },
  {
    id: 4,
    title: "게임 개발 프로젝트",
    author: "최영희",
    date: "2025.01.12",
    location: "인천",
    techStack: ["Unity", "C#"],
    positions: ["웹", "게임"],
    likes: 20,
    views: 89,
    description: "Unity를 사용한 3D 게임을 개발합니다. 게임 개발 경험이 있거나 열정이 있는 분을 찾습니다.",
    status: "모집중",
    teamSize: "5-8명",
    duration: "8-12개월",
    recruitCount: "3명",
    recruitPositions: ["게임 개발자", "3D 모델러", "UI/UX 디자이너"],
    recruitPeriod: "8개월",
    startDate: "2025.03.01",
    activityType: "공모전"
  },
  {
    id: 5,
    title: "블록체인 프로젝트 팀원",
    author: "정현우",
    date: "2025.01.11",
    location: "광주",
    techStack: ["Solidity","React"],
    positions: ["앱"],
    likes: 6,
    views: 28,
    description: "이더리움 기반의 DApp을 개발하는 프로젝트입니다. 블록체인 기술에 관심 있는 개발자를 찾습니다.",
    status: "모집중",
    teamSize: "3-4명",
    duration: "4-8개월",
    contact: "jung@email.com",
    recruitCount: "2명",
    recruitPositions: ["블록체인 개발자", "프론트엔드"],
    recruitPeriod: "4개월",
    startDate: "2025.01.25",
    activityType: "토이프로젝트"
  },
  {
    id: 6,
    title: "데이터 분석 프로젝트",
    author: "한소영",
    date: "2025.01.10",
    location: "대전",
    techStack: ["Python"],
    positions: ["AI"],
    likes: 9,
    views: 41,
    description: "대용량 데이터를 분석하고 시각화하는 프로젝트입니다. 통계학적 지식과 데이터 분석 경험이 있는 분을 찾습니다.",
    status: "모집중",
    teamSize: "2-4명",
    duration: "3-6개월",
    contact: "han@email.com",
    recruitCount: "2명",
    recruitPositions: ["데이터 분석가", "시각화 전문가"],
    recruitPeriod: "3개월",
    startDate: "2025.01.30",
    activityType: "사이드 프로젝트"
  }
];

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([
]);

  useEffect(() => {
    const projectId = parseInt(id || "1");
    const foundProject = dummyProjects.find(p => p.id === projectId);
    if (foundProject) {
      setProject(foundProject);
    } else {
      navigate("/projects");
    }
  }, [id, navigate]);

  const handleApply = () => {
    requireAuth(() => {
      navigate("/apply");
    });
  };


  if (!project) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="project-detail-container">
      <Header />
      
      <div className="project-detail-layout">
        {/* 메인 콘텐츠 */}
        <main className="project-main-content">
          {/* 모집 제목 */}
          <h1 className="recruit-title">{project.title}</h1>
          
          {/* 작성자 정보 섹션 */}
          <div className="author-info-section">
            <div className="author-profile-section">
              <div className="author-profile">
                <div className="author-avatar">👤</div>
                <div className="author-name">{project.author}</div>
              </div>
            </div>
            <div className="post-date-section">
              <div className="post-date">{project.date}</div>
            </div>
          </div>
          
          {/* 프로젝트 정보 */}
          <div className="project-info-section">
            <div className="info-item">
              <label>모집 인원</label>
              <span>{project.recruitCount}</span>
            </div>
            
            <div className="info-item">
              <label>모집 직군</label>
              <span>{project.recruitPositions.join(", ")}</span>
            </div>
            
            <div className="info-item">
              <label>모집 기간</label>
              <span>{project.recruitPeriod}</span>
            </div>
            
            <div className="info-item">
              <label>시작일</label>
              <span>{project.startDate}</span>
            </div>
            
            <div className="info-item">
              <label>지역</label>
              <span>{project.location}</span>
            </div>
            
            <div className="info-item">
              <label>활동 종류</label>
              <span>{project.activityType}</span>
            </div>
          </div>

          {/* 구분선 */}
          <hr className="divider"/>

          {/* 프로젝트 소개 */}
          <div className="project-intro-section">
            <h2>프로젝트 소개</h2>
            <div className="intro-content">
              <p>{project.description}</p>
            </div>
          </div>
        </main>
      </div>

      {/* 댓글 섹션 + 지원하기 버튼 */}
      <ProjectComment 
        comments={comments} 
        setComments={setComments} 
        onApply={handleApply}
      />
    </div>
  );
};

export default ProjectDetail;
