import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="logo" onClick={() => window.location.href = '/'}>
        Team-IT
      </div>
      <nav className="nav-links">
        <a href="/teams" target="_blank">팀원 모집</a>
        <Link to="/Projects">프로젝트 찾기</Link>
        <a href="/content">게시판</a>
        <a href="/about">상점</a>
      </nav>

      <div className="auth-buttons">
        <button onClick={() => window.location.href = '/login'}>로그인</button>
        <button onClick={() => window.location.href = '/signup'}>회원가입</button>
      </div>
    </header>
  );
};

export default Header;