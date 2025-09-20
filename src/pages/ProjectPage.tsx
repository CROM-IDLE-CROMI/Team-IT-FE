// src/pages/ProjectPage.tsx
import Header from "../layouts/Header";
import '../App.css';
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import SideBox from "../components/ProjectPageDetail/SideBox";
import { techStacksInit } from "../styles/TechStack";
import { getPopularProjects } from "../data/popularProjects";
import { getPopularPosts } from "../data/popularPosts";
import { getAllProjects } from "../utils/teamToProjectConverter";
import "../pages/ProjectPage.css";

// ... (Interface Project, FilterState, dummyProjects는 이전과 동일하게 유지) ...

interface FilterState {
  selectedActivity: string[];
  selectedPositions: string[];
  selectedTechStacks: string[];
  selectedLocations: {
    region: string;
    districts: string[];
  };
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
  location: {
    region: string;
    districts: string[];
  };
  techStack: string[];
  positions: string[];
  views: number;
  description: string;
  status: string;
  teamSize?: string;
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
    location: { region: "서울특별시", districts: ["강남구"] },
    techStack: ["React", "MongoDB"],
    positions: ["프론트", "백"],
    views: 45,
    description: "혁신적인 웹 서비스를 개발하는 프로젝트입니다. React와 Node.js를 사용하여 풀스택 개발을 진행합니다.",
    status: "모집중",
    teamSize: "3명",
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
    location: { region: "부산광역시", districts: ["해운대구"] },
    techStack: ["Flutter", "Firebase"],
    positions: ["프론트"],
    views: 32,
    description: "Flutter를 사용한 크로스 플랫폼 모바일 앱을 개발합니다. UI/UX에 관심 있는 개발자를 찾습니다.",
    status: "모집중",
    teamSize: "2명",
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
    location: { region: "대구광역시", districts: ["수성구"] },
    techStack: ["Python", "TensorFlow", "FastAPI"],
    positions: ["백", "기타"],
    views: 67,
    description: "머신러닝을 활용한 예측 모델을 개발하는 프로젝트입니다. 데이터 분석과 AI 모델링 경험이 있는 분을 찾습니다.",
    status: "모집중",
    teamSize: "4명",
    recruitPositions: ["기타", "백"],
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
    location: { region: "인천광역시", districts: ["연수구"] },
    techStack: ["Unity", "C#"],
    positions: ["기획", "디자인"],
    views: 89,
    description: "Unity를 사용한 3D 게임을 개발합니다. 게임 개발 경험이 있거나 열정이 있는 분을 찾습니다.",
    status: "모집중",
    teamSize: "5명",
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
    location: { region: "광주광역시", districts: ["서구"] },
    techStack: ["Solidity", "React"],
    positions: ["프론트", "백"],
    views: 28,
    description: "이더리움 기반의 DApp을 개발하는 프로젝트입니다. 블록체인 기술에 관심 있는 개발자를 찾습니다.",
    status: "모집중",
    teamSize: "3명",
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
    location: { region: "대전광역시", districts: ["유성구"] },
    techStack: ["Python"],
    positions: ["기타", "기획"],
    views: 41,
    description: "대용량 데이터를 분석하고 시각화하는 프로젝트입니다. 통계학적 지식과 데이터 분석 경험이 있는 분을 찾습니다.",
    status: "모집중",
    teamSize: "2명",
    recruitPositions: ["기타", "기획"],
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
    location: { region: "서울특별시", districts: ["마포구"] },
    techStack: ["Arduino", "Raspberry Pi", "Python"],
    positions: ["프론트", "백", "PM"],
    views: 52,
    description: "IoT 센서를 활용한 스마트홈 시스템을 개발합니다. 하드웨어와 소프트웨어 모두 경험이 있는 분을 찾습니다.",
    status: "모집중",
    teamSize: "4명",
    recruitPositions: ["프론트", "백", "PM"],
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
    location: { region: "부산광역시", districts: ["중구"] },
    techStack: ["Unity", "C#", "Blender"],
    positions: ["기획", "디자인", "프론트"],
    views: 73,
    description: "VR/AR을 활용한 교육 콘텐츠를 개발합니다. 3D 모델링과 게임 개발 경험이 있는 분을 찾습니다.",
    status: "모집중",
    teamSize: "5명",
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

// 클라이언트-측에서 더미 데이터를 필터링하는 함수
const filterDummyProjects = (
  projects: Project[],
  filters: FilterState,
  searchTerm: string
) => {
  if (import.meta.env.MODE !== 'production') {
    console.log('🔍 클라이언트 필터링 시작:', {
      projectsCount: projects.length,
      selectedActivity: filters.selectedActivity,
      searchTerm: searchTerm
    });
  }

  return projects.filter(project => {
    // 검색어 필터링
    const matchesSearch = !searchTerm || 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()));
    if (!matchesSearch) return false;

    // 활동 유형 필터링
    const matchesActivity = filters.selectedActivity.length === 0 || 
      (project.activityType && filters.selectedActivity.includes(project.activityType));
    if (!matchesActivity) return false;

    // 포지션 필터링
    const matchesPosition = filters.selectedPositions.length === 0 || 
      filters.selectedPositions.some(pos => project.positions.includes(pos));
    if (!matchesPosition) return false;

    // 기술스택 필터링
    const matchesTechStack = filters.selectedTechStacks.length === 0 ||
      filters.selectedTechStacks.some(tech => project.techStack.includes(tech));
    if (!matchesTechStack) return false;

    // 지역 필터링
    const matchesLocation = (!filters.selectedLocations.region && !filters.selectedLocations.districts.length) ||
      (project.location.region === filters.selectedLocations.region &&
        (filters.selectedLocations.districts.length === 0 ||
          filters.selectedLocations.districts.some(district => project.location.districts.includes(district))));
    if (!matchesLocation) return false;

    // 진행상황 필터링
    const matchesProgress = filters.selectedProgress.length === 0 || 
      (project.progress && filters.selectedProgress.includes(project.progress));
    if (!matchesProgress) return false;
    
    // 진행방식 필터링
    const matchesMethod = filters.selectedMethod.length === 0 || 
      (project.method && filters.selectedMethod.includes(project.method));
    if (!matchesMethod) return false;

    // 모집 마감일 필터링
    if (filters.recruitEndDate && project.recruitEndDate) {
      const projectEndDate = new Date(project.recruitEndDate);
      const filterEndDate = new Date(filters.recruitEndDate);
      if (projectEndDate < filterEndDate) return false;
    }

    // 프로젝트 기간 필터링
    if (filters.projectStartDate || filters.projectEndDate) {
      const projectStartDate = new Date(project.startDate || '');
      const projectEndDate = new Date(project.endDate || '');

      if (filters.projectStartDate) {
        const filterStartDate = new Date(filters.projectStartDate);
        if (projectStartDate < filterStartDate) return false;
      }
      if (filters.projectEndDate) {
        const filterEndDate = new Date(filters.projectEndDate);
        if (projectEndDate > filterEndDate) return false;
      }
    }
    
    return true;
  });
};


const ProjectPage = () => {
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearchTerm, setAppliedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [popularSlideIndex, setPopularSlideIndex] = useState(0);
  const popularProjectsPerSlide = 2;
  
  // 인기 게시물 데이터 가져오기
  const popularPosts = getPopularPosts(4);
  
  // 슬라이드 함수들
  const nextSlide = () => {
    const maxSlides = Math.ceil(popularPosts.length / popularProjectsPerSlide);
    setPopularSlideIndex((prev) => (prev + 1) % maxSlides);
  };
  
  const prevSlide = () => {
    const maxSlides = Math.ceil(popularPosts.length / popularProjectsPerSlide);
    setPopularSlideIndex((prev) => (prev - 1 + maxSlides) % maxSlides);
  };
  
  // 현재 슬라이드에 표시할 게시물들
  const currentPosts = popularPosts.slice(
    popularSlideIndex * popularProjectsPerSlide,
    (popularSlideIndex + 1) * popularProjectsPerSlide
  );
  
  const initialFilters: FilterState = useMemo(() => ({
    selectedActivity: [],
    selectedPositions: [],
    selectedTechStacks: [],
    selectedLocations: { region: "", districts: [] },
    selectedProgress: [],
    selectedMethod: [],
    recruitEndDate: "",
    projectStartDate: "",
    projectEndDate: ""
  }), []);

  const [tempFilters, setTempFilters] = useState<FilterState>(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(initialFilters);
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]); // 초기 상태를 빈 배열로 설정
  const [isLoading, setIsLoading] = useState(true);
  const [isApiSuccess, setIsApiSuccess] = useState(false); // API 호출 성공 여부 상태

  // 프로젝트 데이터 로드 (API + 팀원 모집 프로젝트 통합)
  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
    
    const buildQueryString = () => {
      const params = new URLSearchParams();
      if (appliedSearchTerm) params.append('q', appliedSearchTerm);
      appliedFilters.selectedActivity.forEach(v => params.append('activity', v));
      appliedFilters.selectedPositions.forEach(v => params.append('position', v));
      appliedFilters.selectedTechStacks.forEach(v => params.append('techStack', v));
      if (appliedFilters.selectedLocations.region) params.append('region', appliedFilters.selectedLocations.region);
      appliedFilters.selectedLocations.districts.forEach(d => params.append('district', d));
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
      setIsApiSuccess(false);
      const queryString = buildQueryString();
      const API_ENDPOINT = `${API_BASE}/api/projects?${queryString}`;
      
      if (import.meta.env.MODE !== 'production') {
        console.log(`🚀 API 요청: ${API_ENDPOINT}`);
      }

      try {
        const res = await fetch(API_ENDPOINT, { signal: controller.signal });
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        
        const apiData: Project[] = await res.json();
        if (!Array.isArray(apiData)) throw new Error("API 응답이 배열이 아님");
        
        // 팀원 모집 프로젝트 가져오기
        const teamRecruitProjects = getAllProjects();
        
        // API 데이터와 팀원 모집 프로젝트 통합
        const allProjects = [...apiData, ...teamRecruitProjects];
        
        setProjects(allProjects);
        setIsApiSuccess(true);
        
        if (import.meta.env.MODE !== 'production') {
          console.info("✅ 프로젝트 불러오기 성공", {
            apiProjects: apiData.length,
            teamRecruitProjects: teamRecruitProjects.length,
            total: allProjects.length
          });
        }
      } catch (err: unknown) {
        if (import.meta.env.MODE !== 'production') {
          if (err.name === "AbortError") {
            console.warn("⏱️ API 요청 타임아웃/취소 - 더미 데이터 사용");
          } else {
            console.warn("⚠️ API 불러오기 실패 - 더미 데이터 사용", err);
          }
        }
        // API 실패 시 더미 데이터와 팀원 모집 프로젝트 통합
        const teamRecruitProjects = getAllProjects();
        const fallbackProjects = [...dummyProjects, ...teamRecruitProjects];
        setProjects(fallbackProjects);
        setIsApiSuccess(false); // API 실패 상태로 설정
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
  }, [appliedFilters, appliedSearchTerm]);

  // filteredProjects는 API 성공 여부에 따라 다른 로직을 적용
  const filteredProjects = useMemo(() => {
    if (isApiSuccess) {
      // API가 성공했을 경우, 서버에서 이미 필터링된 데이터이므로 그대로 사용
      return projects;
    } else {
      // API가 실패했을 경우, 더미 데이터를 클라이언트-측에서 필터링
      return filterDummyProjects(projects, appliedFilters, appliedSearchTerm);
    }
  }, [projects, appliedFilters, appliedSearchTerm, isApiSuccess]);


  // 등록순으로 정렬 (ID 기준 오름차순)
  const sortedProjects = [...filteredProjects].sort((a, b) => a.id - b.id);
  
  // 페이지네이션 계산
  const totalPages = Math.max(1, Math.ceil(sortedProjects.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = sortedProjects.slice(startIndex, endIndex);
  
  // 디버깅용 로그
  console.log('페이지네이션 정보:', {
    totalProjects: sortedProjects.length,
    itemsPerPage,
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    currentProjectsCount: currentProjects.length
  });

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

  // 필터 적용 및 초기화 핸들러 (useCallback 제거)
  const handleApplyFilters = () => {
    setAppliedFilters(tempFilters);
    setIsOptionOpen(false);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setTempFilters(initialFilters);
    setAppliedFilters(initialFilters);
    setCurrentPage(1);
  };
  
  const handleTempFiltersChange = (filters: FilterState | ((prev: FilterState) => FilterState)) => {
    setTempFilters(filters);
  };

  // 인기 프로젝트 (공통 데이터 소스에서 가져오기)
  const popularProjects = useMemo(() => getPopularProjects(4), []);
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
                <button className="slide-btn prev" onClick={prevSlide}>‹</button>
                <button className="slide-btn next" onClick={nextSlide}>›</button>
              </div>
            </div>
            <div className="cards-row">
              {currentPosts.map((post) => (
                <div key={post.id} className="simple-card" onClick={() => navigate(`/board/${post.id}`)}>
                  <div className="card-title">{post.title}</div>
                  <div className="card-info">
                    <span className="author">{post.author}</span>
                    <div className="stats-row">
                      <span className="category">{post.category}</span>
                      <span className="views">👁 {post.views}</span>
                    </div>
                  </div>
                </div>
              ))}
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

          {/* 프로젝트 리스트 카드 */}
          <div className="card-container">
            {isLoading ? (
              <div>로딩 중...</div>
            ) : filteredProjects.length === 0 ? (
                <div>표시할 프로젝트가 없습니다.</div>
            ) : currentProjects.length > 0 ? (
              currentProjects.map(project => {
                // 팀원 모집 프로젝트인지 확인 (ID가 큰 경우 팀원 모집으로 간주)
                // const isTeamRecruit = project.id > 10000; // 팀원 모집 프로젝트는 큰 ID 사용
                
                return (
                  <div key={project.id} className="card" onClick={() => handleCardClick(project.id)}>
                    <div className="card-header">
                      <h3>{project.title}</h3>
                    </div>
                    <div className="info">
                      {project.author}<br />
                      {project.date}<br />
                      📍 {project.location.region} {project.location.districts.join(" ")}<br />
                      <span className="tech-icons">
                        {(project.techStack || []).map((tech: string | { value: string }, index) => {
                          // tech가 객체인 경우 value 속성 사용, 문자열인 경우 그대로 사용
                          const techValue = typeof tech === 'object' && tech !== null ? tech.value : tech;
                          const stack = techStacksInit.find(item => item.value === techValue);
                          return stack ? (
                            <img key={`${project.id}-tech-${index}`} src={stack.icon} alt={stack.label} title={stack.label} className="tech-icon-img" />
                          ) : (
                            <span key={`${project.id}-tech-${index}`}>🔧 {techValue}</span>
                          );
                        })}
                      </span><br />
                      👥 {(project.positions || []).map((pos: string | { value: string }) =>
                        typeof pos === 'object' && pos !== null ? pos.value : pos
                      ).join(', ')}
                    </div>
                  </div>
                );
              })
            ) : (
                <div>현재 페이지에 표시할 프로젝트가 없습니다.</div>
            )}
          </div>

          {/* 페이지네이션 UI */}
          {!isLoading && sortedProjects.length > 0 && (
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