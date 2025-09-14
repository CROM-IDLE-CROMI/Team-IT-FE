// src/pages/ProjectPage.tsx
import Header from "../layouts/Header";
import '../App.css';
import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SideBox from "../components/ProjectPageDetail/SideBox";
import { techStacksInit } from "../styles/TechStack";
import "../pages/ProjectPage.css";

/**
 * 필터 상태 타입: 사이드바에서 선택/설정한 값들을 담습니다.
 * (원본 코드의 FilterState와 동일하게 유지)
 */
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

/**
 * 프로젝트 데이터 타입 (백엔드 응답 또는 더미 데이터에 맞춰 유연하게 설정)
 * 원본 더미 데이터가 문자열로 표현한 필드가 있기 때문에,
 * 안전하게 일부 필드는 optional로 둡니다.
 */
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
  status: string; // 예: "모집중", "모집완료"
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

/**
 * FALLBACK 더미 데이터
 * - API가 없을 때(또는 실패할 때) UI 확인용으로 사용됩니다.
 * - PR에 올릴 때 백엔드가 바로 준비되지 않아도 화면이 깨지지 않도록 합니다.
 */
const dummyProjects: Project[] = [
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
  },
  {
    id: 7,
    title: "IoT 스마트홈 프로젝트",
    author: "김태현",
    date: "2025.01.09",
    location: "서울특별시",
    techStack: ["Arduino", "Raspberry Pi", "Python"],
    positions: ["웹"],
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
    location: "부산 광역시",
    techStack: ["Unity", "C#", "Blender"],
    positions: ["게임"],
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
  // (필요하면 나머지 원본 더미 항목도 여기에 둡니다. 실제 파일엔 네가 올려준 전체 더미를 그대로 두면 됩니다.)
];

/**
 * 메인 컴포넌트
 * - 조건부 연동 로직:
 *   1) 초기 UI 친화성: 초기에 더미 데이터로 화면을 띄움 (즉시 렌더)
 *   2) 마운트 시 API 호출 시도 -> 성공하면 API 데이터로 교체
 *   3) 실패(또는 타임아웃) 시 경고하고 더미 데이터 유지
 *
 * 이유: PR/리뷰 시 백엔드가 준비되지 않아도 화면 확인이 가능하고,
 * 백엔드가 준비되면 자동으로 실제 데이터가 표시됩니다.
 */
const ProjectPage = () => {
  // UI 상태들 (원본 코드와 동일하게 유지)
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearchTerm, setAppliedSearchTerm] = useState("");
  const [likedProjects, setLikedProjects] = useState<Set<number>>(new Set());

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 인기 슬라이드 상태
  const [popularSlideIndex, setPopularSlideIndex] = useState(0);
  const popularProjectsPerSlide = 2;

  // 필터 상태 (사이드바에서 임시로 선택하는 값)
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

  // 실제로 적용되는 필터 (Apply 버튼 누르면 이 값으로 바뀜)
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

  /**
   * projects 상태:
   * - 초기값으로 dummyProjects를 넣어 두면 API 응답 전에도 UI가 바로 보입니다.
   * - API 호출 성공 시 실제 데이터로 덮어씌웁니다.
   */
  const [projects, setProjects] = useState<Project[]>(dummyProjects);

  /**
   * usingFallback: 현재 더미 데이터를 사용중인지 표시하는 flag
   * - 디버깅 / PR 코멘트에 유용
   */
  const [usingFallback, setUsingFallback] = useState<boolean>(true);

  /**
   * API 요청: useEffect에 넣어 한 번만 호출
   * - 환경변수 REACT_APP_API_URL 사용 권장 (없으면 로컬호스트 사용)
   * - AbortController + timeout: 네트워크 지연 시 fetch를 중단해서 사용자가 오래 기다리지 않도록 함
   */
  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5173";
    const API_ENDPOINT = `${API_BASE}/api/projects`;

    const controller = new AbortController();
    const timeoutMs = 5000; // 5초 타임아웃 (필요하면 늘리세요)
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const fetchProjects = async () => {
      try {
        // fetch 시도
        const res = await fetch(API_ENDPOINT, { signal: controller.signal });

        if (!res.ok) {
          // 2xx가 아니라면 에러로 처리해서 fallback으로 진입
          throw new Error(`API error: ${res.status}`);
        }

        // 성공하면 JSON 배열을 기대
        const data: Project[] = await res.json();

        // 받아온 데이터 검증(간단): 배열인지 확인
        if (!Array.isArray(data)) {
          throw new Error("API 응답이 배열이 아님");
        }

        // 성공: 상태 업데이트, 더미 데이터 사용 플래그 끄기
        setProjects(data);
        setUsingFallback(false);
        console.info("✅ API에서 프로젝트 불러오기 성공", data.length, "items");
      } catch (err: any) {
        // 네트워크 에러, 타임아웃, JSON 파싱 에러 등 모든 경우를 잡아서 더미 사용
        if (err.name === "AbortError") {
          console.warn("⏱️ API 요청 타임아웃/취소 - 더미 데이터 사용");
        } else {
          console.warn("⚠️ API 불러오기 실패 - 더미 데이터 사용", err);
        }
        // projects는 이미 dummyProjects로 초기화되어 있으므로 그대로 냅둠.
        setUsingFallback(true);
        // (선택) 필요하면 setProjects(dummyProjects)로 명시적으로 재설정 가능
        // setProjects(dummyProjects);
      } finally {
        clearTimeout(timeoutId);
      }
    };

    // 실제 호출
    fetchProjects();

    // cleanup: 컴포넌트 언마운트 시 fetch 중단
    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, []); // 마운트시에만 실행

  /**
   * 필터링 로직
   * - 원본 코드의 필터 조건을 최대한 그대로 유지하되,
   * - 프로젝트 객체의 optional 필드를 안전하게 처리합니다.
   */
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // 검색어 필터링 (title, description, techStack)
      const q = appliedSearchTerm.trim().toLowerCase();
      const matchesSearch = q === "" ||
        project.title.toLowerCase().includes(q) ||
        project.description.toLowerCase().includes(q) ||
        (project.techStack || []).some(t => t.toLowerCase().includes(q));

      // 플랫폼(활동 종류) 필터링
      const matchesActivity = appliedFilters.selectedActivity.length === 0 ||
        (project.activityType ? appliedFilters.selectedActivity.includes(project.activityType) : false);

      // 모집 직군 필터링
      const projectRecruitPositions = project.recruitPositions ?? [];
      const matchesPositions = appliedFilters.selectedPositions.length === 0 ||
        appliedFilters.selectedPositions.some(pos => projectRecruitPositions.includes(pos));

      // 기술 스택 필터링
      const matchesTechStack = appliedFilters.selectedTechStacks.length === 0 ||
        appliedFilters.selectedTechStacks.some(tech => (project.techStack || []).includes(tech));

      // 위치 필터링
      const matchesLocation = appliedFilters.selectedLocations.length === 0 ||
        appliedFilters.selectedLocations.includes(project.location);

      // 진행 상황 필터링
      const matchesProgress = appliedFilters.selectedProgress.length === 0 ||
        (project.progress ? appliedFilters.selectedProgress.includes(project.progress) : false);

      // 진행 방식 필터링
      const matchesMethod = appliedFilters.selectedMethod.length === 0 ||
        (project.method ? appliedFilters.selectedMethod.includes(project.method) : false);

      // 모집 종료 기한 필터링 (날짜 비교)
      const matchesRecruitEndDate = appliedFilters.recruitEndDate === "" ||
        (project.recruitEndDate ? new Date(project.recruitEndDate) >= new Date(appliedFilters.recruitEndDate) : false);

      // 프로젝트 기간 필터링 (startDate / endDate 비교)
      const matchesProjectDate = (appliedFilters.projectStartDate === "" && appliedFilters.projectEndDate === "") ||
        ((appliedFilters.projectStartDate === "" || (project.startDate ? new Date(project.startDate) >= new Date(appliedFilters.projectStartDate) : false)) &&
         (appliedFilters.projectEndDate === "" || (project.endDate ? new Date(project.endDate) <= new Date(appliedFilters.projectEndDate) : false)));

      return matchesSearch && matchesActivity && matchesPositions && matchesTechStack &&
             matchesLocation && matchesProgress && matchesMethod && matchesRecruitEndDate && matchesProjectDate;
    });
  }, [projects, appliedSearchTerm, appliedFilters]);

  // 페이지네이션 계산
  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = filteredProjects.slice(startIndex, endIndex);

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    // 안전하게 범위 체크
    const newPage = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 검색 적용
  const handleSearch = () => {
    setAppliedSearchTerm(searchTerm);
    setCurrentPage(1);
  };

  // 엔터 키로 검색
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 카드 클릭 시 상세 페이지로 이동
  const handleCardClick = (projectId: number) => {
    navigate(`/project/${projectId}`);
  };

  // 좋아요 토글 (클릭 시 카드 클릭 이벤트 버블링을 막기 위해 e.stopPropagation)
  const handleLikeClick = (e: React.MouseEvent, projectId: number) => {
    e.stopPropagation();
    setLikedProjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) newSet.delete(projectId);
      else newSet.add(projectId);
      return newSet;
    });
  };

  // 인기 프로젝트(상단 슬라이드) 계산: 현재는 projects의 상위 4개 사용
  const popularProjects = projects.slice(0, 4);
  const totalPopularSlides = Math.ceil(popularProjects.length / popularProjectsPerSlide);
  const currentPopularProjects = popularProjects.slice(
    popularSlideIndex * popularProjectsPerSlide,
    (popularSlideIndex + 1) * popularProjectsPerSlide
  );

  const handlePopularSlideNext = () => {
    setPopularSlideIndex((prev) => (prev + 1) % Math.max(1, totalPopularSlides));
  };

  const handlePopularSlidePrev = () => {
    setPopularSlideIndex((prev) => (prev - 1 + totalPopularSlides) % Math.max(1, totalPopularSlides));
  };

  // 필터 적용(사이드바에서 Apply 누를 때)
  const handleApplyFilters = useCallback(() => {
    setAppliedFilters(tempFilters);
    setIsOptionOpen(false);
    setCurrentPage(1);
  }, [tempFilters]);

  // 필터 초기화
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
    setCurrentPage(1);
  }, []);

  // tempFilters 변경 콜백 (SideBox로 전달)
  const handleTempFiltersChange = useCallback((filters: FilterState | ((prev: FilterState) => FilterState)) => {
    setTempFilters(filters as FilterState);
  }, []);

  return (
    <div style={{ padding: "4rem 0" }}>
      <Header />
      <div className="ProjectWrapper">
        <div className="horizontal-section">
          <section className="half-section">
            <div className="section-header">
              <h2><span className="emoji">✨</span>요즘 인기있는 프로젝트</h2>

              {/* 슬라이드 컨트롤 (슬라이드가 1개 이하이면 숨김) */}
              {totalPopularSlides > 1 && (
                <div className="slide-controls">
                  <button
                    className="slide-btn prev-btn"
                    onClick={handlePopularSlidePrev}
                    disabled={popularSlideIndex === 0}
                  >
                    ‹
                  </button>
                  <span className="slide-indicator">
                    {popularSlideIndex + 1} / {totalPopularSlides}
                  </span>
                  <button
                    className="slide-btn next-btn"
                    onClick={handlePopularSlideNext}
                    disabled={popularSlideIndex === totalPopularSlides - 1}
                  >
                    ›
                  </button>
                </div>
              )}
            </div>

            {/* 인기 프로젝트 카드들 */}
            <div className="card-container">
              {currentPopularProjects.map(project => (
                <div key={project.id} className="card" onClick={() => handleCardClick(project.id)}>
                  <h3>{project.title}</h3>
                  <div className="info">
                    {project.author}<br />
                    {project.date}<br />
                    <span className="tech-icons">
                      {(project.techStack || []).slice(0, 3).map(tech => {
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
                          <span key={tech}>🔧 {tech}</span>
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
              {/* 상단 '핫한 게시물'도 projects에서 가져오도록 변경 (원본은 dummyProjects.slice) */}
              {projects.slice(2, 4).map(project => (
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

        <hr className="divider_1"/>

        <div className="section">
          <div className="Minisection">
            {/* 옵션(필터) 오픈 */}
            <div className="Option" onClick={() => setIsOptionOpen(true)}>
              <img src="/Option.png" alt="옵션" />
            </div>

            {/* 검색 바 */}
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
            </div>
          </div>

          {/* 프로젝트 리스트 카드 */}
          <div className="card-container">
            {currentProjects.map(project => (
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
                    {(project.techStack || []).map(tech => {
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
                        <span key={tech}>🔧 {tech}</span>
                      );
                    })}
                  </span><br />
                  👥 {(project.positions || []).join(', ')}
                </div>
              </div>
            ))}
          </div>

          {/* 페이지네이션 UI: filteredProjects.length가 0이 아니라면 표시 */}
          {filteredProjects.length > 0 && (
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

          {/* 사이드바 컴포넌트: 필터 변경 콜백들과 연동 */}
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

      {/* 개발/디버깅용: 현재 더미 사용중인지 콘솔 확인 가능하게 표시 (원하면 UI로 바꿀 수 있음) */}
      {/* 예: {usingFallback && <div className="fallback-badge">데이터: 더미 사용중</div>} */}
    </div>
  );
};

export default ProjectPage;
