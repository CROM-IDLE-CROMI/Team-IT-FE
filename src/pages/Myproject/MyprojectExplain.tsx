import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import '../../App.css';

// --- Type Definitions (as provided) ---
type ProjectStatus = 'RECRUITING' | 'ONGOING' | 'COMPLETED';

interface RecruitPosition {
  position: string;
  count: number;
}

interface Member {
  id: string;
  name: string;
  role: string;
}

interface Milestone {
  id: string;
  title: string;
  progress: number;
}

interface ProjectData {
  id: number; // Changed from bigint for simplicity in JSON
  title: string;
  status: ProjectStatus;
  description: string;
  progress: number | null;
  recruit_positions: RecruitPosition[] | null;
  required_stacks: string[] | null;
  members: Member[] | null;
  milestones: Milestone[] | null;
  logoUrl?: string;
}

export default function MyprojectExplain() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    // Fetch the dummy JSON file from the public/mocks folder
    fetch(`/mocks/project-${id}.json`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setProject(data);
      })
      .catch(error => {
        console.error("Failed to fetch project data:", error);
        setProject(null); // Clear project data on error
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  // 뒤로 가기 버튼
  const handleGoBack = () => {
    navigate(-1);
  };

  // 수정하기 버튼
  const handleEdit = () => {
    navigate(`/myproject/${id}/explain/edit`);
  };

  if (loading) {
    return <div>Loading project details...</div>;
  }

  if (!project) {
    return <div>Project not found.</div>;
  }

  return (
    <div className="explain-page-layout">
      {/* Sidebar with dynamic data */}
      <aside className="project-sidebar">
        <div className="team-logo-placeholder">
          <img src={project.logoUrl || '/image.png'} alt={`${project.title} Logo`} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
        </div>
        <h2>{project.title}</h2>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link to={`/myproject/${id}/explain`} className="active">프로젝트 소개</Link>
            </li>
            <li>
              <Link to={`/myproject/${id}/member`}>멤버</Link>
            </li>
            <li>
              <Link to={`/myproject/${id}/milestone`}>마일스톤 기능</Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content with dynamic data */}
      <main className="project-main-content">
        <div className="content-header">
          <button className="back-button" onClick={handleGoBack}>← 돌아가기</button>
          <button className="edit-button" onClick={handleEdit}>수정하기</button>
        </div>
        <div className="introduction-card">
          {/* The main content area now shows the project description */}
          <div className="introduction-content">
             <h2>프로젝트 소개</h2>
             <p>{project.description}</p>
          </div>
        </div>
      </main>
    </div>
  );
}