import { Link } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import BoardCard from '../components/BoardCard';
import Header from '../layouts/Header';
import "../App.css"

const Dashboard = () => {
  return (
    <div className="Main-wrapper">
      <Header />

      <div className="intro-box">
        <div className="intro-text">
          <div className="box-title">
            TEAM-IT에서 IT프로젝트를 같이 할 팀원을 구해보세요!
          </div>
          <div className="box-description">
            TEAM-IT은 여러분의 성공적인 IT프로젝트를 위해 만들어진 팀 매칭 사이트입니다
          </div>
        </div>
        <div className="box-links">
          <Link to="/teams">팀원 모집 바로가기</Link>
          <Link to="/projects">프로젝트 찾기 바로가기</Link>
        </div>
      </div>

      <ProjectCard />
      <BoardCard />
    </div>
  );
};

export default Dashboard;
