import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../App.css';
import ProjectSidebar from '../../components/myproject/ProjectSidebar';

import type { ProjectData } from '../../types/project';

export default function MyprojectExplain() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
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
        setProject(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleGoBack = () => navigate(`/myproject/${id}`);
  const handleEdit = () => { 
    navigate(`/myproject/${id}/explain/edit`, { 
      state: { project },
    }); 
  };

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
        <div className="content-header">
          <button className="back-button" onClick={handleGoBack}>← 돌아가기</button>
          <button className="edit-button" onClick={handleEdit}>수정하기</button>
        </div>

        <div className="introduction-card">
          <div className="introduction-content">
            <h2>프로젝트 소개</h2>
            <p>{project.description}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
