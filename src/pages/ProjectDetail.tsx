import Header from "../layouts/Header";
import "../pages/ProjectDetail.css";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProjectComment from "../components/ProjectPageDetail/ProjectComment";
import { requireAuth, getCurrentUser } from "../utils/authUtils";
import { getAllProjects } from "../utils/teamToProjectConverter";
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
  location: {
    region: string;
    districts: string[];
  }
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
  startDate?: string;
  endDate?: string;
  activityType?: string;
  progress?: string;
  method?: string;
  recruitEndDate?: string;
  contact?: string;
}



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
        // API 실패 시 팀원 모집 프로젝트에서 먼저 찾기
        const teamRecruitProjects = getAllProjects();
        const teamProject = teamRecruitProjects.find(p => p.id === projectId);
        if (teamProject) {
          // 팀원 모집 프로젝트를 Project 타입으로 변환
          const convertedProject: Project = {
            ...teamProject,
            likes: 0, // 팀원 모집 프로젝트는 likes가 없으므로 0으로 설정
            duration: teamProject.recruitPeriod || '미정'
          };
          setProject(convertedProject);
          console.info("✅ 팀원 모집 프로젝트에서 데이터 불러오기 성공");
          return; // 성공적으로 찾았으므로 더미 데이터 검색 생략
        }
        if (err.name === "AbortError") {
          console.warn("⏱️ API 요청 타임아웃/취소 - 더미 데이터 사용");
        } else {
          console.warn("⚠️ API 불러오기 실패 - 더미 데이터 사용", err);
        }

        // 모든 데이터에서 찾지 못하면 이전 페이지로 리디렉션
        navigate("/project");
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
      navigate(`/project/${project?.id}/apply`);
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
          <div className="title-section">
            <h1 className="recruit-title">{project.title}</h1>
          </div>
          
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
              <label>프로젝트 기간</label>
              <span>{project.startDate}~{project.endDate}</span>
            </div>
          
            <div className="info-item">
              <label>지역</label>
              <span>
                {project.location.region}
                {project.location.districts && project.location.districts.length > 0
                  ? ` (${project.location.districts.join(", ")})`
                  : ""}
              </span>
            </div>
            
            <div className="info-item">
              <label>활동 종류</label>
              <span>{project.activityType}</span>
            </div>
            
             <div className="info-item">
              <label>프로젝트 모집 종료</label>
              <span>{project.recruitEndDate}</span>
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
