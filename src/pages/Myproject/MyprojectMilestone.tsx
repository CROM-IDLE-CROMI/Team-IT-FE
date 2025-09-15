import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProjectSidebar from '../../components/myproject/ProjectSidebar';
import ProgressBar from '../../components/ProgressBar';
import '../../App.css';

type ProjectStatus = 'RECRUITING' | 'ONGOING' | 'COMPLETED';

interface ProjectData {
  id: number;
  title: string;
  status: ProjectStatus;
  logoUrl?: string;
}

interface ProjectMilestone {
  id: number;
  name: string;
  startDate: string;
  deadline: string;
  progress: number;
}

const dummyProject: ProjectData = {
  id: 1,
  title: 'TEAM-IT 프로젝트',
  status: 'ONGOING',
  logoUrl: 'https://placehold.co/180x180/EFEFEF/333?text=Logo',
};

const dummyMilestones: ProjectMilestone[] = [
  { id: 1, name: '알파 버전 출시', startDate: '2025-09-01', deadline: '2025-09-30', progress: 75 },
  { id: 2, name: '사용자 피드백 반영', startDate: '2025-10-01', deadline: '2025-10-15', progress: 20 },
  { id: 3, name: '베타 버전 출시', startDate: '2025-10-16', deadline: '2025-10-31', progress: 0 },
];

export default function MyprojectMilestone() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();

  const [project, setProject] = useState<ProjectData | null>(null);
  const [milestones, setMilestones] = useState<ProjectMilestone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setProject(dummyProject);
      setMilestones(dummyMilestones);
      setLoading(false);
    }, 50);
  }, [id]);

  const handleGoBack = () => nav(`/myproject/${id}`);
  const handleEdit = () => nav(`/myproject/${id}/milestone/edit`);

  if (loading) return <div>Loading...</div>;
  if (!project) return <div>Project not found.</div>;

  return (
    <div className="myproject-layout">
      <ProjectSidebar
        project={{
          id: project.id,
          title: project.title,
          status: project.status,
          logoUrl: project.logoUrl,
        }}
      />

      <main className="project-main-content">
        <div className="content-card">
          <div className="content-header">
            <button className="back-button" onClick={handleGoBack}>← 돌아가기</button>
            <button className="edit-button" onClick={handleEdit}>수정하기</button>
          </div>

          <table className="milestone-table">
            <thead>
              <tr>
                <th>마일스톤 이름</th>
                <th>진행률</th>
                <th>시작일</th>
                <th>종료일</th>
              </tr>
            </thead>
            <tbody>
              {milestones.map((milestone) => (
                <tr key={milestone.id}>
                  <td>{milestone.name}</td>
                  <td>
                    <div className="milestone-progress">
                      <ProgressBar progress={milestone.progress} />
                    </div>
                  </td>
                  <td>{milestone.startDate}</td>
                  <td>{milestone.deadline}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}