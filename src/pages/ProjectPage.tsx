import Header from "../layouts/Header";
import '../App.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBox from "../components/ProjectPageDetail/SideBox";
import { techStacksInit } from "../styles/TechStack";

// 더미 프로젝트 데이터
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

const ProjectPage = () => {
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // 검색 필터링
  const filteredProjects = dummyProjects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.techStack.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // 카드 클릭 핸들러
  const handleCardClick = (projectId: number) => {
    navigate(`/project/${projectId}`);
  };

  // 좋아요 토글
  const handleLikeClick = (e: React.MouseEvent, projectId: number) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    // 좋아요 로직 구현 (나중에 실제 데이터와 연동)
    console.log(`Project ${projectId} liked!`);
  };

  return (
    <div style={{ padding: "4rem 0" }}>
      <Header />
      <div className="ProjectWrapper">
      <div className="horizontal-section">
        <section className="half-section">
          <h2><span className="emoji">✨</span>요즘 인기있는 프로젝트</h2>
          <div className="card-container">
            {dummyProjects.slice(0, 2).map(project => (
              <div key={project.id} className="card" onClick={() => handleCardClick(project.id)}>
                <h3>{project.title}</h3>
                <div className="info">
                  {project.author}<br />
                  {project.date}<br />
                  <span className="tech-icons">
                    {project.techStack.slice(0, 3).map(tech => {
    const stack = techStacksInit.find(item => item.value === tech);
    return stack ? (
      <img 
        key={tech} 
        src={stack.icon} 
        alt={stack.label} 
        title={stack.label} 
        className="tech-icon-img"
      />
    ) : (
      <span key={tech}>🔧 {tech}</span> // 매칭 실패 시 fallback
    );
  })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="half-section">
          <h2><span className="emoji">🔥</span>최근 핫한 게시물</h2>
          <div className="card-container">
            {dummyProjects.slice(2, 4).map(project => (
              <div key={project.id} className="card" onClick={() => handleCardClick(project.id)}>
                <h3>{project.title}</h3>
                <div className="info">
                  {project.author}<br />
                  좋아요 {project.likes}개<br />
                  조회수 {project.views}회
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="section">
        <div className="Minisection">
        <div className="Option" onClick={() => setIsOptionOpen(true)}>
          <img src="/Option.png" alt="옵션" />
        </div>
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="제목, 내용을 검색하세요..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        </div>

        <div className="card-container">
          {filteredProjects.map(project => (
            <div key={project.id} className="card" onClick={() => handleCardClick(project.id)}>
              <h3>
                {project.title} 
                <span 
                  className="heart" 
                  onClick={(e) => handleLikeClick(e, project.id)}
                >
                  ♡
                </span>
              </h3>
              <div className="info">
                {project.author}<br />
                {project.date}<br />
                📍 {project.location}<br />
                <span className="tech-icons">
                  {project.techStack.map(tech => {
    const stack = techStacksInit.find(item => item.value === tech);
    return stack ? (
      <img 
        key={tech} 
        src={stack.icon} 
        alt={stack.label} 
        title={stack.label} 
        className="tech-icon-img"
      />
    ) : (
      <span key={tech}>🔧 {tech}</span> // 매칭 실패 시 fallback
    );
  })}
                </span><br />
                👥 {project.positions.join(', ')}
              </div>
            </div>
          ))}
        </div>
        </div>
        <SideBox isOpen={isOptionOpen} onClose={() => setIsOptionOpen(false)} />
      </div>
    </div>
  );
};

export default ProjectPage;
