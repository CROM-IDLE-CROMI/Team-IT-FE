import Header from "../layouts/Header";
import "../pages/ProjectDetail.css";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProjectComment from "../components/ProjectPageDetail/ProjectComment";
import { requireAuth, getCurrentUser } from "../utils/authUtils";
import { getAllProjects } from "../utils/teamToProjectConverter";
import "../styles/TechStack";
import { apiGet, apiPost, API_ENDPOINTS } from "../utils/api";
import type { ProjectApiResponse } from "../types/project";
import { projectService } from "../services/projectService";
import type { ProjectCommentApiResponse } from "../types/project";

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

// 더미 프로젝트 데이터 (API 실패 시 폴백용)
const dummyProjectDetail: Project = {
  id: 1,
  title: "🚀 [더미] AI 기반 사이드 프로젝트",
  author: "김한성",
  date: new Date().toLocaleDateString('ko-KR'),
  location: {
    region: "서울",
    districts: ["강남구"]
  },
  techStack: ["React", "TypeScript"],
  positions: ["프론트엔드", "백엔드"],
  likes: 10,
  views: 123,
  description: "이것은 API 연결 전 테스트용 더미 프로젝트 상세 설명입니다. \n\n 줄바꿈도 잘 표시됩니다.",
  status: "RECRUITING",
  teamSize: "3명",
  duration: "3개월",
  recruitCount: "3",
  recruitPositions: ["프론트엔드", "백엔드"],
  startDate: new Date("2025-01-01").toLocaleDateString('ko-KR'),
  endDate: new Date("2025-03-31").toLocaleDateString('ko-KR'),
  activityType: "온라인",
  progress: "아이디어 구상",
  method: "웹사이트",
  recruitEndDate: new Date("2024-12-31").toLocaleDateString('ko-KR'),
  contact: "test@example.com",
};


// 댓글 타입은 ProjectCommentApiResponse를 사용

// API 응답을 Project 인터페이스로 변환하는 함수
const convertApiResponseToProject = (apiData: ProjectApiResponse): Project => {
  // 날짜를 YYYY-MM-DD 형식으로 변환
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR");
  };

  // locations 배열에서 지역 정보 추출 (첫 번째 요소를 region으로, 나머지는 districts로)
  const region = apiData.locations && apiData.locations.length > 0 ? apiData.locations[0] : "미정";
  const districts = apiData.locations && apiData.locations.length > 1 ? apiData.locations.slice(1) : [];

  return {
    id: apiData.projectId,
    title: apiData.title,
    author: apiData.creatorNickname || apiData.creatorId,
    date: formatDate(apiData.createdAt),
    location: {
      region,
      districts
    },
    techStack: apiData.requireStack || [],
    positions: apiData.recruitPositions || [],
    likes: 0, // API 응답에 없으므로 기본값
    views: apiData.viewCount,
    description: apiData.ideaExplain || apiData.minRequest || "",
    status: apiData.projectStatus || "모집중",
    recruitCount: apiData.memberNum.toString(),
    recruitPositions: apiData.recruitPositions,
    startDate: formatDate(apiData.startDate),
    endDate: formatDate(apiData.endDate),
    activityType: apiData.meetingApproach || apiData.categoryDetail,
    progress: apiData.statusDetail,
    method: apiData.platformDetail || apiData.platform,
    recruitEndDate: formatDate(apiData.validTo),
  };
};

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 상태 관리: API 데이터와 로딩 상태
  const [project, setProject] = useState<Project | null>(null);
  const [comments, setComments] = useState<ProjectCommentApiResponse[]>([]); // 댓글 상태
  const [newComment, setNewComment] = useState(""); // 새로운 댓글 입력 상태
  const [isLoading, setIsLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);

  // 댓글 조회 로직
  const fetchComments = async (projectId: number) => {
    setCommentsLoading(true);
    try {
      const commentsDataRaw: unknown = await projectService.getProjectComments(projectId);
      const commentsData: ProjectCommentApiResponse[] = Array.isArray(commentsDataRaw)
        ? (commentsDataRaw as ProjectCommentApiResponse[])
        : [];
      
      // replies가 올바르게 구조화되도록 처리 (API에서 부모-자식 관계를 올바르게 매핑)
      // parentCommentId가 null인 것만 최상위 댓글로 처리
      const rootComments = commentsData.filter((c: ProjectCommentApiResponse) => c.parentCommentId === null);
      const repliesMap = new Map<number, ProjectCommentApiResponse[]>();
      
      commentsData.forEach((comment: ProjectCommentApiResponse) => {
        if (comment.parentCommentId !== null) {
          if (!repliesMap.has(comment.parentCommentId)) {
            repliesMap.set(comment.parentCommentId, []);
          }
          repliesMap.get(comment.parentCommentId)!.push(comment);
        }
      });
      
      // 루트 댓글에 replies 매핑
      const commentsWithReplies = rootComments.map((comment: ProjectCommentApiResponse) => ({
        ...comment,
        replies: repliesMap.get(comment.id) || []
      }));
      
      setComments(commentsWithReplies);
      console.log("✅ 댓글 목록 조회 성공");
    } catch (err) {
      console.error("⚠️ 댓글 목록 조회 실패:", err);
      setComments([]); // 실패 시 빈 배열
    } finally {
      setCommentsLoading(false);
    }
  };

  // 댓글 전송 로직
  const handleCommentSubmit = async (commentText: string, parentCommentId?: number | null) => {
    // 폼이 비어있으면 전송하지 않음
    if (commentText.trim() === "" || !project) {
      return;
    }

    try {
      const commentData = {
        content: commentText.trim(),
        parentCommentId: parentCommentId || null,
      };

      console.log("📤 댓글 전송 시도:", commentData);

      const savedComment = await apiPost(
        API_ENDPOINTS.PROJECTS.COMMENTS(project.id),
        commentData,
        true
      );
      console.log("✅ 댓글 전송 성공:", savedComment);
      
      // 댓글 목록을 다시 조회하여 최신 상태로 업데이트
      await fetchComments(project.id);
      
      // 입력창 비우기
      setNewComment('');

    } catch (err: any) {
      console.error("⚠️ 댓글 전송 실패:", err);
      alert(err.message || "댓글 작성에 실패했습니다.");
    }
  };


  useEffect(() => {
    const projectId = parseInt(id || "1", 10);

    const fetchProject = async () => {
      setIsLoading(true);
      try {
        // 새로운 API 엔드포인트 사용
        const response = await apiGet<any>(
          API_ENDPOINTS.PROJECTS.DETAIL(projectId),
          false // 프로젝트 상세는 인증 없이도 볼 수 있다고 가정
        );
        
        // 응답이 {code, message, data} 래퍼 구조인지 확인
        let apiData: ProjectApiResponse;
        if (response && typeof response === 'object' && 'code' in response) {
          // 래퍼 구조인 경우
          if (response.code === 0 && response.data) {
            apiData = response.data as ProjectApiResponse;
          } else {
            throw new Error(response.message || '프로젝트 조회 실패');
          }
        } else {
          // 직접 ProjectApiResponse가 반환된 경우
          apiData = response as ProjectApiResponse;
        }
        
        // API 응답을 Project 인터페이스로 변환
        const convertedProject = convertApiResponseToProject(apiData);
        setProject(convertedProject);
        console.info("✅ API에서 프로젝트 상세 데이터 불러오기 성공");
        
        // 프로젝트 로드 후 댓글 목록 조회
        await fetchComments(projectId);
      } catch (err: any) {
        console.warn("⚠️ API 불러오기 실패:", err);
        
        // API 실패 시 팀원 모집 프로젝트에서 먼저 찾기 (폴백)
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

        // 팀원 모집에도 없으면 더미 데이터 확인 (ID 9999)
        if (projectId === dummyProjectDetail.id) {
          setProject(dummyProjectDetail);
          console.info("✅ 더미 프로젝트 데이터 불러오기 성공 (ID: 9999)");
          // 더미 데이터의 댓글은 불러오지 않음 (또는 더미 댓글 설정)
          setComments([]); 
          setIsLoading(false); // 로딩 완료 처리
          return;
        }

        // 모든 데이터에서 찾지 못하면 이전 페이지로 리디렉션
        console.error("프로젝트를 찾을 수 없습니다.");
        navigate("/project");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
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
        commentsLoading={commentsLoading}
      />
    </div>
  );
};

export default ProjectDetail;