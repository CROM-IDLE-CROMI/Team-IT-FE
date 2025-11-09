// src/pages/ProjectPage.tsx
import Header from "../layouts/Header";
import '../App.css';
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import SideBox from "../components/ProjectPageDetail/SideBox";
import { techStacksInit } from "../styles/TechStack";
import { getPopularProjects } from "../data/popularProjects";
import { getAllProjects } from "../utils/teamToProjectConverter";
import { projectService, type ProjectListItem, type HotBoardItem, type ProjectSearchRequest } from "../services/projectService";
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


// API 응답을 Project 인터페이스로 변환하는 함수
const convertApiProjectToProject = (apiProject: ProjectListItem): Project => {
  return {
    id: apiProject.projectId,
    title: apiProject.title || apiProject.projectName,
    author: apiProject.creatorNickname || '',
    date: new Date(apiProject.createdAt).toLocaleDateString('ko-KR'),
    location: {
      region: '', // API 응답에 지역 정보가 없을 수 있음
      districts: []
    },
    techStack: apiProject.requireStack || [],
    positions: apiProject.recruitPositions || [],
    views: apiProject.viewCount || 0,
    description: '',
    status: apiProject.projectStatus || 'RECRUITING',
  };
};

const dummyProjectForTesting: Project = {
  id: 1,
  title: "🚀 [더미] AI 기반 사이드 프로젝트",
  author: "김한성",
  date: new Date().toLocaleDateString('ko-KR'),
  location: {
    region: "서울",
    districts: ["강남구"],
  },
  techStack: ["React", "TypeScript"],
  positions: ["프론트엔드", "백엔드"],
  views: 123,
  description: "이것은 API 연결 전 테스트용 더미 프로젝트 상세 설명입니다.",
  status: "RECRUITING",
  teamSize: "3명",
  recruitEndDate: "2025-12-31",
  startDate: "2025-11-10",
  endDate: "2026-03-01",
  activityType: "사이드 프로젝트",
  progress: "기획",
  method: "온라인",
};

const ProjectPage = () => {
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearchTerm, setAppliedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [popularSlideIndex, setPopularSlideIndex] = useState(0);
  const popularProjectsPerSlide = 2;
  
  // 인기 프로젝트 및 인기 게시물 상태
  const [popularProjects, setPopularProjects] = useState<Project[]>([]);
  const [hotBoards, setHotBoards] = useState<HotBoardItem[]>([]);
  const [isLoadingPopular, setIsLoadingPopular] = useState(true);
  
  // 인기 프로젝트 및 인기 게시물 로드
  useEffect(() => {
    const fetchPopularData = async () => {
      setIsLoadingPopular(true);
      try {
        // 인기 프로젝트 조회
        const popularProjectsData = await projectService.getPopularProjects();
        const convertedPopularProjects = popularProjectsData
          .slice(0, 4)
          .map(convertApiProjectToProject);
        setPopularProjects(convertedPopularProjects);
        
        // 인기 게시물 조회
        const hotBoardsData = await projectService.getHotBoards();
        setHotBoards(hotBoardsData.slice(0, 4));
        
      } catch (error) {
        console.error('인기 프로젝트/게시물 로드 실패:', error);
        // 실패 시 더미 데이터 사용
        setPopularProjects(getPopularProjects(4));
        setHotBoards([]);
      } finally {
        setIsLoadingPopular(false);
      }
    };
    
    fetchPopularData();
  }, []);
  
  // 슬라이드 함수들
  const nextSlide = () => {
    const maxSlides = Math.ceil(hotBoards.length / popularProjectsPerSlide);
    setPopularSlideIndex((prev) => (prev + 1) % maxSlides);
  };
  
  const prevSlide = () => {
    const maxSlides = Math.ceil(hotBoards.length / popularProjectsPerSlide);
    setPopularSlideIndex((prev) => (prev - 1 + maxSlides) % maxSlides);
  };
  
  // 현재 슬라이드에 표시할 게시물들
  const currentPosts = hotBoards.slice(
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

  // 프로젝트 목록 페이지네이션 상태
  const [totalPagesFromApi, setTotalPagesFromApi] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // 프로젝트 데이터 로드 (API + 팀원 모집 프로젝트 통합)
  // POST /v1/projects/search 사용 (사이드바 필터 옵션)
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setIsApiSuccess(false);
      
      try {
        // POST 검색 요청 본문 구성
        const searchRequest: ProjectSearchRequest = {
          page: currentPage - 1, // API는 0부터 시작
          size: itemsPerPage,
        };
        
        // 검색어 추가
        if (appliedSearchTerm) {
          searchRequest.q = appliedSearchTerm;
        }
        
        // 필터 옵션 추가 (사이드바에서 설정한 필터)
        if (appliedFilters.selectedActivity.length > 0) {
          searchRequest.activity = appliedFilters.selectedActivity;
        }
        if (appliedFilters.selectedPositions.length > 0) {
          searchRequest.position = appliedFilters.selectedPositions;
        }
        if (appliedFilters.selectedTechStacks.length > 0) {
          searchRequest.techStack = appliedFilters.selectedTechStacks;
        }
        if (appliedFilters.selectedLocations.region) {
          searchRequest.region = appliedFilters.selectedLocations.region;
        }
        if (appliedFilters.selectedLocations.districts.length > 0) {
          searchRequest.district = appliedFilters.selectedLocations.districts;
        }
        if (appliedFilters.selectedProgress.length > 0) {
          searchRequest.progress = appliedFilters.selectedProgress;
        }
        if (appliedFilters.selectedMethod.length > 0) {
          searchRequest.method = appliedFilters.selectedMethod;
        }
        if (appliedFilters.recruitEndDate) {
          searchRequest.recruitEndDate_gte = appliedFilters.recruitEndDate;
        }
        if (appliedFilters.projectStartDate) {
          searchRequest.startDate_gte = appliedFilters.projectStartDate;
        }
        if (appliedFilters.projectEndDate) {
          searchRequest.endDate_lte = appliedFilters.projectEndDate;
        }

        // POST 검색 API 호출
        const apiResponse = await projectService.searchProjects(searchRequest);
        
        // API 응답을 Project 인터페이스로 변환
        const apiProjects = apiResponse.content.map(convertApiProjectToProject);
        
        // 팀원 모집 프로젝트 가져오기
        const teamRecruitProjects = getAllProjects();
        
        // API 데이터와 팀원 모집 프로젝트 통합
        const allProjects = [...apiProjects, ...teamRecruitProjects, dummyProjectForTesting];
        
        setProjects(allProjects);
        setTotalPagesFromApi(apiResponse.totalPages);
        setTotalElements(apiResponse.totalElements);
        setIsApiSuccess(true);
        
        if (import.meta.env.MODE !== 'production') {
          console.info("✅ 프로젝트 검색 성공 (POST)", {
            apiProjects: apiProjects.length,
            teamRecruitProjects: teamRecruitProjects.length,
            dummyProjects: 1,
            total: allProjects.length,
            totalPages: apiResponse.totalPages,
            currentPage: currentPage,
            pageable: apiResponse.pageable
          });
        }
      } catch (err: any) {
        if (import.meta.env.MODE !== 'production') {
          console.warn("⚠️ API 불러오기 실패 - 더미 데이터 사용", err);
        }
        // API 실패 시 팀원 모집 프로젝트만 사용
        const teamRecruitProjects = getAllProjects();
        setProjects([...teamRecruitProjects, dummyProjectForTesting]);
        setIsApiSuccess(false); // API 실패 상태로 설정
        setTotalPagesFromApi(1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [appliedFilters, appliedSearchTerm, currentPage]);

  // 서버에서 이미 필터링된 데이터이므로 그대로 사용
  // (POST /v1/projects/search API에서 필터링 처리)


  // 등록순으로 정렬 (ID 기준 오름차순)
  const sortedProjects = [...projects].sort((a, b) => a.id - b.id);
  
  // 페이지네이션 계산 (서버에서 페이지네이션 처리, API 실패 시 클라이언트 페이지네이션)
  const totalPages = isApiSuccess 
    ? Math.max(1, totalPagesFromApi)
    : Math.max(1, Math.ceil(sortedProjects.length / itemsPerPage));
  
  const startIndex = isApiSuccess ? 0 : (currentPage - 1) * itemsPerPage;
  const endIndex = isApiSuccess ? sortedProjects.length : startIndex + itemsPerPage;
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

  // 인기 프로젝트 슬라이드 계산
  const totalPopularSlides = Math.ceil(popularProjects.length / popularProjectsPerSlide);
  const currentPopularProjects = popularProjects.slice(
    popularSlideIndex * popularProjectsPerSlide,
    (popularSlideIndex + 1) * popularProjectsPerSlide
  );
  const handlePopularSlideNext = () => setPopularSlideIndex((prev) => (prev + 1) % Math.max(1, totalPopularSlides));
  const handlePopularSlidePrev = () => setPopularSlideIndex((prev) => (prev - 1 + totalPopularSlides) % Math.max(1, totalPopularSlides));

  return (
    <div style={{ padding: "4rem 0" }}>
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
              {isLoadingPopular ? (
                <div className="empty-state">
                  <p>로딩 중...</p>
                </div>
              ) : currentPopularProjects.length > 0 ? (
                currentPopularProjects.map(project => (
                  <div key={project.id} className="simple-card" onClick={() => handleCardClick(project.id)}>
                    <div className="card-title">{project.title}</div>
                    <div className="card-info">
                      <span className="author">작성자: {project.author}</span>
                      <span className="date">작성일자: {project.date}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>인기 프로젝트가 없습니다.</p>
                </div>
              )}
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
              {isLoadingPopular ? (
                <div className="empty-state">
                  <p>로딩 중...</p>
                </div>
              ) : currentPosts.length > 0 ? (
                currentPosts.map((post) => (
                  <div key={post.postId} className="simple-card" onClick={() => navigate(`/board/${post.postId}`)}>
                    <div className="card-title">{post.title}</div>
                    <div className="card-info">
                      <span className="author">{post.authorNickname}</span>
                      <div className="stats-row">
                        <span className="category">{post.category}</span>
                        <span className="views">👁 {post.viewCount}</span>
                        <span className="likes">❤️ {post.likeCount}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>인기 게시물이 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 구분선 */}
        <hr className="section-divider" />

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
            ) : projects.length === 0 ? (
                <div>표시할 프로젝트가 없습니다.</div>
            ) : currentProjects.length > 0 ? (
              currentProjects.map(project => {
                // 팀원 모집 프로젝트인지 확인 (ID가 큰 경우 팀원 모집으로 간주)
                const isTeamRecruit = project.id > 10000; // 팀원 모집 프로젝트는 큰 ID 사용
                
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
                        {(project.techStack || []).map((tech: any, index) => {
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
                      👥 {(project.positions || []).map((pos: any) => 
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