import Header from "../layouts/Header";
import "../pages/ProjectDetail.css";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProjectComment from "../components/ProjectPageDetail/ProjectComment";
import { requireAuth, getCurrentUser } from "../utils/authUtils";
import "../styles/TechStack";

/**
 * 프로젝트 데이터 타입 (백엔드 응답 또는 더미 데이터에 맞춰 유연하게 설정)
 * 원본 더미 데이터와 동일하게 유지
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

// FALLBACK 더미 데이터
// API가 없을 때(또는 실패할 때) UI 확인용으로 사용됩니다.
const dummyProjects: Project[] = [
  {
    id: 1,
    title: "웹 개발 프로젝트 팀원 모집",
    author: "김한성",
    date: "2025.01.15",
    location: "서울 특별시",
    techStack: ["React", "MongoDB"],
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
    techStack: ["Solidity", "React"],
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
];


interface Reply {
  id: string;
  text: string;
  author: string;
  date: string;
}

interface Comment {
  id: string;
  text: string;
  author: string;
  date: string;
  replies: Reply[];
}

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 상태 관리: API 데이터와 로딩 상태
  const [project, setProject] = useState<Project | null>(null);
  const [comments, setComments] = useState<Comment[]>([]); // 댓글 상태 (타입 수정)
  const [newComment, setNewComment] = useState(""); // 새로운 댓글 입력 상태
  const [isLoading, setIsLoading] = useState(true);

  // 댓글 전송 로직
  const handleCommentSubmit = async (commentText: string) => {
    // 폼이 비어있으면 전송하지 않음
    if (commentText.trim() === "") {
      return;
    }

    // 백엔드 서버 URL로 수정
    const API_BASE = "http://localhost:4000";
    const API_ENDPOINT = `${API_BASE}/api/projects/${project?.id}/comments`;

    try {
      const currentUser = getCurrentUser();
      const newCommentData = {
        projectId: project?.id,
        author: currentUser || "익명", // 실제 로그인한 사용자 ID 사용
        text: commentText,
        date: new Date().toISOString().split('T')[0],
      };

      console.log("📤 댓글 전송 시도:", newCommentData);
      console.log("🔗 API 엔드포인트:", API_ENDPOINT);

      const res = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCommentData),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status} - ${res.statusText}`);
      }
      
      const savedComment = await res.json();
      console.log("✅ 댓글 전송 성공:", savedComment);
      
      // 로컬 상태를 업데이트하여 화면에 즉시 반영
      setComments(prev => [...prev, savedComment]);
      // 입력창 비우기
      setNewComment('');

    } catch (err) {
      console.error("⚠️ 댓글 전송 실패:", err);
      console.log("💡 백엔드 서버가 실행 중인지 확인해주세요. (http://localhost:4000)");
      
      // 백엔드가 없을 때 임시로 로컬에 추가하여 테스트 가능하게 함
      const currentUser = getCurrentUser();
      const tempComment: Comment = { 
        id: Date.now().toString(),
        author: currentUser || "익명",
        text: commentText,
        date: new Date().toLocaleDateString("ko-KR"),
        replies: []
      };
      setComments(prev => [...prev, tempComment]);
      setNewComment('');
      console.log("🔄 임시 댓글 추가됨 (백엔드 없이 테스트용)");
    }
  };


  useEffect(() => {
    const projectId = parseInt(id || "1", 10);
    
    // 백엔드 서버 URL로 통일
    const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5173";
    const API_ENDPOINT = `${API_BASE}/api/projects/${projectId}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5초 타임아웃

    const fetchProject = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(API_ENDPOINT, { signal: controller.signal });

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }

        const data: Project = await res.json();
        setProject(data);
        console.info("✅ API에서 프로젝트 상세 데이터 불러오기 성공");
      } catch (err: any) {
        if (err.name === "AbortError") {
          console.warn("⏱️ API 요청 타임아웃/취소 - 더미 데이터 사용");
        } else {
          console.warn("⚠️ API 불러오기 실패 - 더미 데이터 사용", err);
        }

        // API 실패 시 더미 데이터에서 찾아서 사용
        const foundProject = dummyProjects.find(p => p.id === projectId);
        if (foundProject) {
          setProject(foundProject);
        } else {
          // 더미 데이터에도 없으면 이전 페이지로 리디렉션
          navigate("/projects");
        }
      } finally {
        clearTimeout(timeoutId);
        setIsLoading(false);
      }
    };

    fetchProject();

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [id, navigate]); // id와 navigate가 변경될 때마다 재실행

  const handleApply = () => {
    requireAuth(() => {
      navigate("/apply");
    });
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (!project) {
    return <div>프로젝트 정보를 찾을 수 없습니다.</div>;
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
              <span>{project.recruitPositions ? project.recruitPositions.join(", ") : '정보 없음'}</span>
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
        projectId={project.id}
        comments={comments} 
        setComments={setComments}
        onCommentSubmit={handleCommentSubmit}
        onApply={handleApply}
        newComment={newComment}
        setNewComment={setNewComment}
      />
    </div>
  );
};

export default ProjectDetail;
