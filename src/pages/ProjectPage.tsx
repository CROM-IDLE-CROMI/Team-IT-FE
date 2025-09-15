// src/pages/ProjectPage.tsx
import Header from "../layouts/Header";
import '../App.css';
import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SideBox from "../components/ProjectPageDetail/SideBox";
import { techStacksInit } from "../styles/TechStack";
import "../pages/ProjectPage.css";

// ... (Interface Project, FilterState, dummyProjects는 이전과 동일하게 유지) ...

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

interface Project {
  id: number;
  title: string;
  author: string;
  date: string;
  location: string;
  techStack: string[];
  positions: string[];
  likes: number;
  views: number;
  description: string;
  status: string; 
  teamSize?: string;
  duration?: string;
  recruitCount?: string;
  recruitPositions?: string[];
  recruitPeriod?: string;
  startDate?: string;
  endDate?: string;
  activityType?: string;
  progress?: string;
  method?: string;
  recruitEndDate?: string;
  contact?: string;
}

const dummyProjects: Project[] = [
  {
    id: 1,
    title: "웹 개발 프로젝트 팀원 모집",
    author: "김한성",
    date: "2025.01.15",
    location: "서울특별시 강남구",
    techStack: ["React", "MongoDB"],
    positions: ["프론트", "백"],
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
    location: "부산광역시 해운대구",
    techStack: ["Flutter", "Firebase"],
    positions: ["프론트"],
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
    location: "대구광역시 수성구",
    techStack: ["Python", "TensorFlow", "FastAPI"],
    positions: ["백", "데이터"],
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
    location: "인천광역시 연수구",
    techStack: ["Unity", "C#"],
    positions: ["기획", "디자인"],
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
    location: "광주광역시 서구",
    techStack: ["Solidity", "React"],
    positions: ["프론트", "백"],
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
    location: "대전광역시 유성구",
    techStack: ["Python"],
    positions: ["데이터", "기획"],
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
  },
  {
    id: 7,
    title: "IoT 스마트홈 프로젝트",
    author: "김태현",
    date: "2025.01.09",
    location: "서울특별시 마포구",
    techStack: ["Arduino", "Raspberry Pi", "Python"],
    positions: ["프론트", "백", "기획"],
    likes: 14,
    views: 52,
    description: "IoT 센서를 활용한 스마트홈 시스템을 개발합니다. 하드웨어와 소프트웨어 모두 경험이 있는 분을 찾습니다.",
    status: "모집중",
    teamSize: "4-6명",
    duration: "6-9개월",
    recruitCount: "3명",
    recruitPositions: ["프론트", "백", "기획"],
    recruitPeriod: "6개월",
    startDate: "2025.02.01",
    endDate: "2025.08.01",
    activityType: "웹",
    progress: "아이디어 구상 중",
    method: "온/오프라인",
    recruitEndDate: "2025.01.28"
  },
  {
    id: 8,
    title: "VR/AR 교육 콘텐츠",
    author: "박서연",
    date: "2025.01.08",
    location: "부산광역시 중구",
    techStack: ["Unity", "C#", "Blender"],
    positions: ["기획", "디자인", "프론트"],
    likes: 18,
    views: 73,
    description: "VR/AR을 활용한 교육 콘텐츠를 개발합니다. 3D 모델링과 게임 개발 경험이 있는 분을 찾습니다.",
    status: "모집중",
    teamSize: "5-7명",
    duration: "8-12개월",
    recruitCount: "4명",
    recruitPositions: ["기획", "디자인", "프론트"],
    recruitPeriod: "8개월",
    startDate: "2025.03.01",
    endDate: "2025.11.01",
    activityType: "게임",
    progress: "아이디어 기획 중",
    method: "오프라인",
    recruitEndDate: "2025.02.28"
  },
];

const ProjectPage = () => {
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearchTerm, setAppliedSearchTerm] = useState("");
  const [likedProjects, setLikedProjects] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [popularSlideIndex, setPopularSlideIndex] = useState(0);
  const popularProjectsPerSlide = 2;
  
  const initialFilters: FilterState = {
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

  const [tempFilters, setTempFilters] = useState<FilterState>(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(initialFilters);
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>(dummyProjects);
  const [isLoading, setIsLoading] = useState(true);

  // API 요청 로직 (Server-side filtering 적용)
  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5173";
    
    // 필터 객체를 쿼리 문자열로 변환하는 함수
    const buildQueryString = () => {
      const params = new URLSearchParams();

      if (appliedSearchTerm) {
        params.append('q', appliedSearchTerm);
      }
      appliedFilters.selectedActivity.forEach(v => params.append('activity', v));
      appliedFilters.selectedPositions.forEach(v => params.append('position', v));
      appliedFilters.selectedTechStacks.forEach(v => params.append('techStack', v));
      appliedFilters.selectedLocations.forEach(v => params.append('location', v));
      appliedFilters.selectedProgress.forEach(v => params.append('progress', v));
      appliedFilters.selectedMethod.forEach(v => params.append('method', v));
      if (appliedFilters.recruitEndDate) params.append('recruitEndDate_gte', appliedFilters.recruitEndDate);
      if (appliedFilters.projectStartDate) params.append('startDate_gte', appliedFilters.projectStartDate);
      if (appliedFilters.projectEndDate) params.append('endDate_lte', appliedFilters.projectEndDate);
      
      return params.toString();
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const fetchProjects = async () => {
      setIsLoading(true);
      const queryString = buildQueryString();
      const API_ENDPOINT = `${API_BASE}/api/projects?${queryString}`;
      console.log(`🚀 API 요청: ${API_ENDPOINT}`);

      try {
        const res = await fetch(API_ENDPOINT, { signal: controller.signal });
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        
        const data: Project[] = await res.json();
        if (!Array.isArray(data)) throw new Error("API 응답이 배열이 아님");

        setProjects(data);
        console.info("✅ API에서 필터링된 프로젝트 불러오기 성공", data.length, "items");
      } catch (err: any) {
        if (err.name === "AbortError") {
          console.warn("⏱️ API 요청 타임아웃/취소 - 더미 데이터 사용");
        } else {
          console.warn("⚠️ API 불러오기 실패 - 더미 데이터 사용", err);
        }
        // 실패 시 더미 데이터로 대체 (필터링 없이)
        setProjects(dummyProjects);
      } finally {
        setIsLoading(false);
        clearTimeout(timeoutId);
      }
    };

    fetchProjects();

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [appliedFilters, appliedSearchTerm]); // 검색어 또는 필터가 적용될 때마다 API 재요청

  // 클라이언트 사이드 필터링 로직
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // 검색어 필터링
      if (appliedSearchTerm && !project.title.toLowerCase().includes(appliedSearchTerm.toLowerCase()) &&
          !project.description.toLowerCase().includes(appliedSearchTerm.toLowerCase())) {
        return false;
      }

      // 활동 유형 필터링
      if (appliedFilters.selectedActivity.length > 0 && 
          !appliedFilters.selectedActivity.includes(project.activityType || '')) {
        return false;
      }

      // 포지션 필터링
      if (appliedFilters.selectedPositions.length > 0) {
        const hasMatchingPosition = appliedFilters.selectedPositions.some(position => 
          project.positions.some(projectPosition => 
            projectPosition.toLowerCase().includes(position.toLowerCase())
          )
        );
        if (!hasMatchingPosition) return false;
      }

      // 기술스택 필터링
      if (appliedFilters.selectedTechStacks.length > 0) {
        const hasMatchingTech = appliedFilters.selectedTechStacks.some(tech => 
          project.techStack.some(projectTech => 
            projectTech.toLowerCase().includes(tech.toLowerCase())
          )
        );
        if (!hasMatchingTech) return false;
      }

      // 지역 필터링 (시/도 또는 구 단위 매칭)
      if (appliedFilters.selectedLocations.length > 0) {
        const hasMatchingLocation = appliedFilters.selectedLocations.some(selectedLocation => {
          // 정확히 일치하는 경우
          if (project.location === selectedLocation) return true;
          
          // 시/도 단위로 일치하는 경우 (예: "서울특별시" 선택 시 "서울특별시 강남구" 매칭)
          if (project.location.startsWith(selectedLocation + " ")) return true;
          
          // 구 단위로 일치하는 경우 (예: "강남구" 선택 시 "서울특별시 강남구" 매칭)
          if (project.location.endsWith(" " + selectedLocation)) return true;
          
          return false;
        });
        if (!hasMatchingLocation) return false;
      }

      // 진행상황 필터링
      if (appliedFilters.selectedProgress.length > 0 && 
          !appliedFilters.selectedProgress.includes(project.progress || '')) {
        return false;
      }

      // 진행방식 필터링
      if (appliedFilters.selectedMethod.length > 0 && 
          !appliedFilters.selectedMethod.includes(project.method || '')) {
        return false;
      }

      // 모집 마감일 필터링
      if (appliedFilters.recruitEndDate) {
        const projectEndDate = new Date(project.recruitEndDate || '');
        const filterEndDate = new Date(appliedFilters.recruitEndDate);
        if (projectEndDate < filterEndDate) return false;
      }

      // 프로젝트 시작일 필터링
      if (appliedFilters.projectStartDate) {
        const projectStartDate = new Date(project.startDate || '');
        const filterStartDate = new Date(appliedFilters.projectStartDate);
        if (projectStartDate < filterStartDate) return false;
      }

      // 프로젝트 종료일 필터링
      if (appliedFilters.projectEndDate) {
        const projectEndDate = new Date(project.endDate || '');
        const filterEndDate = new Date(appliedFilters.projectEndDate);
        if (projectEndDate > filterEndDate) return false;
      }

      return true;
    });
  }, [projects, appliedFilters, appliedSearchTerm]);

  // 페이지네이션 계산
  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = filteredProjects.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    const newPage = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = () => {
    setAppliedSearchTerm(searchTerm);
    setCurrentPage(1);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleCardClick = (projectId: number) => {
    navigate(`/project/${projectId}`);
  };

  const handleLikeClick = (e: React.MouseEvent, projectId: number) => {
    e.stopPropagation();
    setLikedProjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) newSet.delete(projectId);
      else newSet.add(projectId);
      return newSet;
    });
  };

  const handleApplyFilters = useCallback(() => {
    setAppliedFilters(tempFilters);
    setIsOptionOpen(false);
    setCurrentPage(1);
  }, [tempFilters]);

  const handleResetFilters = useCallback(() => {
    setTempFilters(initialFilters);
    setAppliedFilters(initialFilters);
    setCurrentPage(1);
  }, [initialFilters]);

  const handleTempFiltersChange = useCallback((filters: FilterState | ((prev: FilterState) => FilterState)) => {
    setTempFilters(filters as FilterState);
  }, []);

  // 인기 프로젝트 (필터링된 프로젝트 중 상위 4개)
  const popularProjects = filteredProjects.slice(0, 4);
  const totalPopularSlides = Math.ceil(popularProjects.length / popularProjectsPerSlide);
  const currentPopularProjects = popularProjects.slice(
    popularSlideIndex * popularProjectsPerSlide,
    (popularSlideIndex + 1) * popularProjectsPerSlide
  );
  const handlePopularSlideNext = () => setPopularSlideIndex((prev) => (prev + 1) % Math.max(1, totalPopularSlides));
  const handlePopularSlidePrev = () => setPopularSlideIndex((prev) => (prev - 1 + totalPopularSlides) % Math.max(1, totalPopularSlides));


  return (
    <div style={{ padding: "8rem 0" }}>
      <Header />
      <div className="ProjectWrapper">
        {/* 상단 인기 섹션들 */}
        <div className="top-sections">
          {/* 인기 프로젝트 섹션 */}
          <div className="popular-section">
            <div className="section-header">
              <h2>✨ 요즘 인기있는 프로젝트</h2>
              <div className="slide-controls">
                <button 
                  className="slide-btn prev" 
                  onClick={handlePopularSlidePrev}
                  disabled={totalPopularSlides <= 1}
                >
                  ‹
                </button>
                <button 
                  className="slide-btn next" 
                  onClick={handlePopularSlideNext}
                  disabled={totalPopularSlides <= 1}
                >
                  ›
                </button>
              </div>
            </div>
            <div className="cards-row">
              {currentPopularProjects.map(project => (
                <div key={project.id} className="simple-card" onClick={() => handleCardClick(project.id)}>
                  <div className="card-title">{project.title}</div>
                  <div className="card-info">
                    <span className="author">작성자: {project.author}</span>
                    <span className="date">작성일자: {project.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 인기 게시글 섹션 */}
          <div className="posts-section">
            <div className="section-header">
              <h2>🔥 최근 핫한 게시물</h2>
              <div className="slide-controls">
                <button className="slide-btn prev">‹</button>
                <button className="slide-btn next">›</button>
              </div>
            </div>
            <div className="cards-row">
              <div className="simple-card">
                <div className="card-title">제목</div>
                <div className="card-info">
                  <span className="author">작성자</span>
                  <div className="stats-row">
                    <span className="likes">좋아요 수</span>
                    <span className="views">조회수</span>
                  </div>
                </div>
              </div>
              <div className="simple-card">
                <div className="card-title">제목</div>
                <div className="card-info">
                  <span className="author">작성자</span>
                  <div className="stats-row">
                    <span className="likes">좋아요 수</span>
                    <span className="views">조회수</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
              <button className="search-btn" onClick={handleSearch}>검색</button>
        </div>
        </div>

          {/* 프로젝트 리스트 카드 (이제 currentProjects를 사용) */}
        <div className="card-container">
            {isLoading ? (
              <div>Loading...</div>
            ) : currentProjects.length > 0 ? (
              currentProjects.map(project => (
            <div key={project.id} className="card" onClick={() => handleCardClick(project.id)}>
              <h3>
                {project.title} 
              </h3>
              <div className="info">
                {project.author}<br />
                {project.date}<br />
                📍 {project.location}<br />
                <span className="tech-icons">
                      {(project.techStack || []).map(tech => {
    const stack = techStacksInit.find(item => item.value === tech);
    return stack ? (
                          <img key={tech} src={stack.icon} alt={stack.label} title={stack.label} className="tech-icon-img" />
                        ) : (
                          <span key={tech}>🔧 {tech}</span>
    );
  })}
                </span><br />
                    👥 {(project.positions || []).join(', ')}
                  </div>
                </div>
              ))
            ) : (
              <div>표시할 프로젝트가 없습니다.</div>
            )}
          </div>

          {/* 페이지네이션 UI */}
          {!isLoading && filteredProjects.length > 0 && (
            <div className="pagination-container">
              <div className="pagination">
                <button
                  className="pagination-nav-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  이전
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={`pagination-page-btn ${currentPage === page ? 'active' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}
                <button
                  className="pagination-nav-btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  다음
                </button>
              </div>
            </div>
          )}

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
    </div>
  );
};

export default ProjectPage;