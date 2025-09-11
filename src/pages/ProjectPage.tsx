import Header from "../layouts/Header";
import '../App.css';
import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SideBox from "../components/ProjectPageDetail/SideBox";
import { techStacksInit } from "../styles/TechStack";

interface FilterState {
  selectedActivity: string[];
  selectedPositions: string[];
  selectedTechStacks: string[];
  selectedLocations: string[];
  selectedRegion: string;
  selectedProgress: string[];
  selectedMethod: string[];
  recruitEndDate: string;
  projectStartDate: string;
  projectEndDate: string;
}

// 더미 프로젝트 데이터
const dummyProjects = [
  {
    id: 1,
    title: "웹 개발 프로젝트 팀원 모집",
    author: "김한성",
    date: "2025.01.15",
    location: "서울 특별시",
    techStack: ["React","MongoDB"],
    positions: ["웹"],
    likes: 12,
    views: 45,
    description: "혁신적인 웹 서비스를 개발하는 프로젝트입니다. React와 Node.js를 사용하여 풀스택 개발을 진행합니다.",
    status: "모집중",
    teamSize: "3-5명",
    duration: "3-6개월",
    recruitCount: "2명",
    recruitPositions: ["프론트", "백"],
    recruitPeriod: "3개월",
    startDate: "2025.02.01",
    endDate: "2025.05.01",
    activityType: "웹",
    progress: "아이디어 구상 중",
    method: "온/오프라인",
    recruitEndDate: "2025.01.30"
  },
  {
    id: 2,
    title: "모바일 앱 개발자 구합니다",
    author: "이지은",
    date: "2025.01.14",
    location: "부산 광역시",
    techStack: ["Flutter", "Firebase"],
    positions: ["앱"],
    likes: 8,
    views: 32,
    description: "Flutter를 사용한 크로스 플랫폼 모바일 앱을 개발합니다. UI/UX에 관심 있는 개발자를 찾습니다.",
    status: "모집중",
    teamSize: "2-3명",
    duration: "2-4개월",
    recruitCount: "1명",
    recruitPositions: ["프론트"],
    recruitPeriod: "2개월",
    startDate: "2025.01.20",
    endDate: "2025.03.20",
    activityType: "앱",
    progress: "아이디어 기획 중",
    method: "온라인",
    recruitEndDate: "2025.01.25"
  },
  {
    id: 3,
    title: "AI 프로젝트 팀원 모집",
    author: "박민수",
    date: "2025.01.13",
    location: "대구 광역시",
    techStack: ["Python", "TensorFlow", "FastAPI"],
    positions: ["앱"],
    likes: 15,
    views: 67,
    description: "머신러닝을 활용한 예측 모델을 개발하는 프로젝트입니다. 데이터 분석과 AI 모델링 경험이 있는 분을 찾습니다.",
    status: "모집중",
    teamSize: "4-6명",
    duration: "6-12개월",
    recruitCount: "2명",
    recruitPositions: ["데이터", "백"],
    recruitPeriod: "6개월",
    startDate: "2025.02.15",
    endDate: "2025.08.15",
    activityType: "앱",
    progress: "개발 진행 중",
    method: "오프라인",
    recruitEndDate: "2025.02.10"
  },
  {
    id: 4,
    title: "게임 개발 프로젝트",
    author: "최영희",
    date: "2025.01.12",
    location: "인천 광역시",
    techStack: ["Unity", "C#"],
    positions: ["게임"],
    likes: 20,
    views: 89,
    description: "Unity를 사용한 3D 게임을 개발합니다. 게임 개발 경험이 있거나 열정이 있는 분을 찾습니다.",
    status: "모집중",
    teamSize: "5-8명",
    duration: "8-12개월",
    recruitCount: "3명",
    recruitPositions: ["기획", "디자인"],
    recruitPeriod: "8개월",
    startDate: "2025.03.01",
    endDate: "2025.11.01",
    activityType: "게임",
    progress: "아이디어 구상 중",
    method: "온/오프라인",
    recruitEndDate: "2025.02.25"
  },
  {
    id: 5,
    title: "블록체인 프로젝트 팀원",
    author: "정현우",
    date: "2025.01.11",
    location: "광주 광역시",
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
    recruitPositions: ["프론트", "백"],
    recruitPeriod: "4개월",
    startDate: "2025.01.25",
    endDate: "2025.05.25",
    activityType: "앱",
    progress: "아이디어 기획 중",
    method: "온라인",
    recruitEndDate: "2025.01.20"
  },
  {
    id: 6,
    title: "데이터 분석 프로젝트",
    author: "한소영",
    date: "2025.01.10",
    location: "대전 광역시",
    techStack: ["Python"],
    positions: ["앱"],
    likes: 9,
    views: 41,
    description: "대용량 데이터를 분석하고 시각화하는 프로젝트입니다. 통계학적 지식과 데이터 분석 경험이 있는 분을 찾습니다.",
    status: "모집중",
    teamSize: "2-4명",
    duration: "3-6개월",
    contact: "han@email.com",
    recruitCount: "2명",
    recruitPositions: ["데이터", "기획"],
    recruitPeriod: "3개월",
    startDate: "2025.01.30",
    endDate: "2025.04.30",
    activityType: "앱",
    progress: "개발 진행 중",
    method: "오프라인",
    recruitEndDate: "2025.01.25"
  }
];

const ProjectPage = () => {
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearchTerm, setAppliedSearchTerm] = useState("");
  const [likedProjects, setLikedProjects] = useState<Set<number>>(new Set());
  
  // 임시 필터 (사이드바에서 선택하는 필터)
  const [tempFilters, setTempFilters] = useState<FilterState>({
    selectedActivity: [],
    selectedPositions: [],
    selectedTechStacks: [],
    selectedLocations: [],
    selectedRegion: "서울특별시",
    selectedProgress: [],
    selectedMethod: [],
    recruitEndDate: "",
    projectStartDate: "",
    projectEndDate: ""
  });

  // 디버깅용: tempFilters 변경 감지 (useEffect로 이동)
  // console.log('ProjectPage tempFilters:', tempFilters); // 디버깅용
  
  // 적용된 필터 (실제로 프로젝트를 필터링하는 필터)
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    selectedActivity: [],
    selectedPositions: [],
    selectedTechStacks: [],
    selectedLocations: [],
    selectedRegion: "서울특별시",
    selectedProgress: [],
    selectedMethod: [],
    recruitEndDate: "",
    projectStartDate: "",
    projectEndDate: ""
  });
  
  const navigate = useNavigate();

  // 필터링 로직
  const filteredProjects = useMemo(() => {
    return dummyProjects.filter(project => {
      // 검색어 필터링
      const matchesSearch = appliedSearchTerm === "" || 
        project.title.toLowerCase().includes(appliedSearchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(appliedSearchTerm.toLowerCase()) ||
        project.techStack.some(tech => tech.toLowerCase().includes(appliedSearchTerm.toLowerCase()));

      // 플랫폼 필터링
      const matchesActivity = appliedFilters.selectedActivity.length === 0 || 
        appliedFilters.selectedActivity.includes(project.activityType);

      // 모집 직군 필터링
      const matchesPositions = appliedFilters.selectedPositions.length === 0 || 
        appliedFilters.selectedPositions.some(pos => project.recruitPositions.includes(pos));

      // 기술 스택 필터링
      const matchesTechStack = appliedFilters.selectedTechStacks.length === 0 || 
        appliedFilters.selectedTechStacks.some(tech => project.techStack.includes(tech));

      // 위치 필터링
      const matchesLocation = appliedFilters.selectedLocations.length === 0 || 
        appliedFilters.selectedLocations.includes(project.location);

      // 진행 상황 필터링
      const matchesProgress = appliedFilters.selectedProgress.length === 0 || 
        appliedFilters.selectedProgress.includes(project.progress);

      // 진행 방식 필터링
      const matchesMethod = appliedFilters.selectedMethod.length === 0 || 
        appliedFilters.selectedMethod.includes(project.method);

      // 모집 종료 기한 필터링
      const matchesRecruitEndDate = appliedFilters.recruitEndDate === "" || 
        new Date(project.recruitEndDate) >= new Date(appliedFilters.recruitEndDate);

      // 프로젝트 기간 필터링
      const matchesProjectDate = (appliedFilters.projectStartDate === "" && appliedFilters.projectEndDate === "") ||
        (appliedFilters.projectStartDate === "" || new Date(project.startDate) >= new Date(appliedFilters.projectStartDate)) &&
        (appliedFilters.projectEndDate === "" || new Date(project.endDate) <= new Date(appliedFilters.projectEndDate));

      return matchesSearch && matchesActivity && matchesPositions && matchesTechStack && 
             matchesLocation && matchesProgress && matchesMethod && matchesRecruitEndDate && matchesProjectDate;
    });
  }, [appliedSearchTerm, appliedFilters]);

  // 검색 핸들러
  const handleSearch = () => {
    setAppliedSearchTerm(searchTerm);
  };

  // 검색 초기화 핸들러
  const handleClearSearch = () => {
    setSearchTerm("");
    setAppliedSearchTerm("");
  };

  // 엔터키 검색 핸들러
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 카드 클릭 핸들러
  const handleCardClick = (projectId: number) => {
    navigate(`/project/${projectId}`);
  };

  // 좋아요 토글
  const handleLikeClick = (e: React.MouseEvent, projectId: number) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    setLikedProjects(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(projectId)) {
        newLiked.delete(projectId);
      } else {
        newLiked.add(projectId);
      }
      return newLiked;
    });
  };

  // 필터 적용 함수
  const handleApplyFilters = useCallback(() => {
    setAppliedFilters(tempFilters);
    setIsOptionOpen(false); // 사이드바 닫기
  }, [tempFilters]);

  // 필터 초기화 함수
  const handleResetFilters = useCallback(() => {
    const emptyFilters: FilterState = {
      selectedActivity: [],
      selectedPositions: [],
      selectedTechStacks: [],
      selectedLocations: [],
      selectedRegion: "서울특별시",
      selectedProgress: [],
      selectedMethod: [],
      recruitEndDate: "",
      projectStartDate: "",
      projectEndDate: ""
    };
    setTempFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
  }, []);

  // tempFilters 업데이트 함수를 메모이제이션
  const handleTempFiltersChange = useCallback((newFilters: FilterState) => {
    setTempFilters(newFilters);
  }, []);

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
            onKeyPress={handleKeyPress}
          />
          <button className="search-btn" onClick={handleSearch}>
            검색
          </button>
          {(searchTerm || appliedSearchTerm) && (
            <button className="clear-btn" onClick={handleClearSearch} title="검색 초기화">
              ✕
            </button>
          )}
        </div>
        </div>

        <div className="card-container">
          {filteredProjects.map(project => (
            <div key={project.id} className="card" onClick={() => handleCardClick(project.id)}>
              <h3>
                {project.title} 
                <span 
                  className={`heart ${likedProjects.has(project.id) ? 'liked' : ''}`}
                  onClick={(e) => handleLikeClick(e, project.id)}
                >
                  {likedProjects.has(project.id) ? '♥' : '♡'}
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
        <SideBox 
          isOpen={isOptionOpen} 
          onClose={() => setIsOptionOpen(false)}
          filters={tempFilters}
          onFiltersChange={handleTempFiltersChange}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
        />
      </div>
    </div>
  );
};

export default ProjectPage;
