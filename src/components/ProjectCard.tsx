
import React from 'react';
import { Link } from 'react-router-dom';
import { getPopularProjects, type Project } from '../data/popularProjects';
import { techStacksInit } from '../styles/TechStack';
import './ProjectCard.css';

const ProjectCard = () => {
  const popularProjects = getPopularProjects(4);

  const handleCardClick = (projectId: number) => {
    // 프로젝트 상세 페이지로 이동
    window.location.href = `/project/${projectId}`;
  };

  return (
    <section className="project-section">
      <h2 className="section-title">🔥 요즘 인기있는 프로젝트</h2>
      <div className="project-cards">
        {popularProjects.map((project: Project) => (
          <div 
            key={project.id} 
            className="project-card"
            onClick={() => handleCardClick(project.id)}
            style={{ cursor: 'pointer' }}
          >
            <div className="card-header">
              <h3 className="card-title">{project.title}</h3>
            </div>
            <div className="card-content">
              <div className="card-author">작성자: {project.author}</div>
              <div className="card-date">작성일: {project.date}</div>
              <div className="card-location">
                📍 {project.location.region} {project.location.districts.join(' ')}
              </div>
              <div className="card-tech">
                <div className="tech-tags">
                  {project.techStack.map((tech, index) => {
                    const stack = techStacksInit.find(item => item.value === tech);
                    return stack ? (
                      <img 
                        key={index} 
                        src={stack.icon} 
                        alt={stack.label} 
                        title={stack.label} 
                        className="tech-icon-img" 
                      />
                    ) : (
                      <span key={index} className="tech-tag">{tech}</span>
                    );
                  })}
                </div>
              </div>
              <div className="card-positions">
                <span className="positions-label">모집 포지션:</span>
                <span className="positions-text">{project.positions.join(', ')}</span>
              </div>
              <div className="card-stats">
                <span className="views">👁️ {project.views}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectCard;