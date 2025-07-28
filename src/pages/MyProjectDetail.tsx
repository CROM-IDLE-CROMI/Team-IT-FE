import Header from "../layouts/Header";
import "../App.css"; 

const ProjectDetail = () => {
  return (
    <div className="project-detail-page">
      <Header />

      <div className="project-layout">
        {/* 왼쪽 사이드바 */}
        <aside className="sidebar_real">
          <div className="logo-box">팀 로고</div>
          <div className="project-name">북으로 가자</div>
          <div className="project-status">🟢 진행중</div>

          <nav className="sidebar-menu">
            <ul>
              <li>프로젝트 소개</li>
              <li>멤버</li>
              <li>마일스톤 기능</li>
            </ul>
          </nav>
        </aside>

        {/* 오른쪽 콘텐츠 */}
        <main className="main-content">
          <div className="intro-box-1">사이드프로젝트 매칭 웹 사이트 인 Team-IT 입니다!</div>

          <div className="info-grid">
            <div className="member-box">멤버</div>
            <div className="progress-box">진행률</div>
            <div className="milestone-box">마일스톤</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProjectDetail;
