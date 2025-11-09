import Header from "../layouts/Header";
import "../pages/ProjectDetail.css";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProjectComment from "../components/ProjectPageDetail/ProjectComment";
import { requireAuth } from "../utils/authUtils";
import { getAllProjects } from "../utils/teamToProjectConverter";
import "../styles/TechStack";
import { apiGet, apiPost, API_ENDPOINTS } from "../utils/api";
import type { ProjectApiResponse } from "../types/project";
import { projectService } from "../services/projectService";
import type { ProjectCommentApiResponse } from "../types/project";

interface Project {
  id: number;
  title: string;
  author: string;
  date: string;
  location: { region: string; districts: string[] };
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
  startDate?: string;
  endDate?: string;
  activityType?: string;
  progress?: string;
  method?: string;
  recruitEndDate?: string;
  contact?: string;
}

// 더미 프로젝트들을 배열로 관리
const dummyProjects: Project[] = [
  {
    id: 1,
    title: "같이 공모전 나갈 사람 찾습니다~",
    author: "양도영",
    date: new Date().toLocaleDateString('ko-KR'),
    location: { region: "서울", districts: ["강남구"] },
    techStack: ["TypeScript", "React"],
    positions: ["프론트엔드", "백엔드"],
    likes: 10,
    views: 123,
    description: "같이 공모전 나갈 팀원 모집합니다. 관심있으신 분들은 연락주세요!",
    status: "RECRUITING",
    teamSize: "3명",
    duration: "3개월",
    recruitCount: "3",
    recruitPositions: ["프론트엔드", "백엔드"],
    startDate: new Date("2025-11-11").toLocaleDateString('ko-KR'),
    endDate: new Date("2026-03-31").toLocaleDateString('ko-KR'),
    activityType: "오프라인",
    progress: "아이디어 구상",
    method: "웹사이트",
    recruitEndDate: new Date("2025-11-09").toLocaleDateString('ko-KR'),
    contact: "test@example.com",
  },
  {
    id: 2,
    title: "장기 프로젝트 같이 하실 분",
    author: "유즈",
    date: new Date().toLocaleDateString('ko-KR'),
    location: { region: "서울시", districts: ["강남구"] },
    techStack: ["TypeScript", "React"],
    positions: ["프론트엔드"],
    likes: 5,
    views: 45,
    description: "장기 프로젝트 같이 하실 분 모집합니다",
    status: "RECRUITING",
    teamSize: "4명",
    duration: "6개월",
    recruitCount: "4",
    recruitPositions: ["프론트엔드"],
    startDate: new Date("2025-12-01").toLocaleDateString('ko-KR'),
    endDate: new Date("2026-05-31").toLocaleDateString('ko-KR'),
    activityType: "온라인",
    progress: "데이터 수집 중",
    method: "GitHub / Slack",
    recruitEndDate: new Date("2025-11-25").toLocaleDateString('ko-KR'),
    contact: "ai-team@example.com",
  }
];

// API 응답을 Project 인터페이스로 변환
const convertApiResponseToProject = (apiData: ProjectApiResponse): Project => {
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("ko-KR");
  const region = apiData.locations && apiData.locations.length > 0 ? apiData.locations[0] : "미정";
  const districts = apiData.locations && apiData.locations.length > 1 ? apiData.locations.slice(1) : [];

  return {
    id: apiData.projectId,
    title: apiData.title,
    author: apiData.creatorNickname || apiData.creatorId,
    date: formatDate(apiData.createdAt),
    location: { region, districts },
    techStack: apiData.requireStack || [],
    positions: apiData.recruitPositions || [],
    likes: 0,
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

  const [project, setProject] = useState<Project | null>(null);
  const [comments, setComments] = useState<ProjectCommentApiResponse[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);

  const fetchComments = async (projectId: number) => {
    setCommentsLoading(true);
    try {
      const commentsDataRaw: unknown = await projectService.getProjectComments(projectId);
      const commentsData: ProjectCommentApiResponse[] = Array.isArray(commentsDataRaw)
        ? (commentsDataRaw as ProjectCommentApiResponse[])
        : [];

      const rootComments = commentsData.filter(c => c.parentCommentId === null);
      const repliesMap = new Map<number, ProjectCommentApiResponse[]>();
      commentsData.forEach(c => {
        if (c.parentCommentId !== null) {
          if (!repliesMap.has(c.parentCommentId)) repliesMap.set(c.parentCommentId, []);
          repliesMap.get(c.parentCommentId)!.push(c);
        }
      });

      const commentsWithReplies = rootComments.map(c => ({ ...c, replies: repliesMap.get(c.id) || [] }));
      setComments(commentsWithReplies);
      console.log("✅ 댓글 목록 조회 성공");
    } catch (err) {
      console.error("⚠️ 댓글 목록 조회 실패:", err);
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleCommentSubmit = async (commentText: string, parentCommentId?: number | null) => {
    if (commentText.trim() === "" || !project) return;

    try {
      const commentData = { content: commentText.trim(), parentCommentId: parentCommentId || null };
      console.log("📤 댓글 전송 시도:", commentData);

      await apiPost(API_ENDPOINTS.PROJECTS.COMMENTS(project.id), commentData, true);
      await fetchComments(project.id);
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
        const response = await apiGet<any>(API_ENDPOINTS.PROJECTS.DETAIL(projectId), false);

        let apiData: ProjectApiResponse;
        if (response && typeof response === 'object' && 'code' in response) {
          if (response.code === 0 && response.data) apiData = response.data;
          else throw new Error(response.message || '프로젝트 조회 실패');
        } else apiData = response as ProjectApiResponse;

        setProject(convertApiResponseToProject(apiData));
        console.info("✅ API에서 프로젝트 상세 데이터 불러오기 성공");
        await fetchComments(projectId);
      } catch (err: any) {
        console.warn("⚠️ API 불러오기 실패:", err);

        const teamRecruitProjects = getAllProjects();
        const teamProject = teamRecruitProjects.find(p => p.id === projectId);
        if (teamProject) {
          setProject({ ...teamProject, likes: 0, duration: teamProject.recruitPeriod || '미정' });
          console.info("✅ 팀원 모집 프로젝트에서 데이터 불러오기 성공");
          return;
        }

        // 더미 프로젝트에서 찾기
        const dummyProject = dummyProjects.find(p => p.id === projectId);
        if (dummyProject) {
          setProject(dummyProject);
          setComments([]);
          console.info(`✅ 더미 프로젝트 데이터 불러오기 성공 (ID: ${projectId})`);
          setIsLoading(false);
          return;
        }

        console.error("프로젝트를 찾을 수 없습니다.");
        navigate("/project");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id, navigate]);

  const handleApply = () => {
    requireAuth(() => {
      navigate(`/project/${project?.id}/apply`);
    });
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (!project) return <div>프로젝트 정보를 찾을 수 없습니다.</div>;

  return (
    <div className="project-detail-container">
      <Header />
      <div className="project-detail-layout">
        <main className="project-main-content">
          <div className="title-section">
            <h1 className="recruit-title">{project.title}</h1>
          </div>
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
          <hr className="divider"/>
          <div className="project-intro-section">
            <h2>프로젝트 소개</h2>
            <div className="intro-content">
              <p>{project.description}</p>
            </div>
          </div>
        </main>
      </div>
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
