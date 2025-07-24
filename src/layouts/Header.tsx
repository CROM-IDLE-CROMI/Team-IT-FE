import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('isLoggedIn');
    setIsLoggedIn(stored === 'true');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  return (
    <header className="header">
      <div className="logo" onClick={() => window.location.href = '/'}>
        Team-IT
      </div>

      <nav className="nav-links">
        <Link to="/teams">팀원 모집</Link>
        <Link to="/Projects">프로젝트 찾기</Link>
        <a href="/Boarder">게시판</a>
        <a href="/Stor">상점</a>
        {isLoggedIn && <Link to="/MyProject">마이 프로젝트</Link>}
      </nav>

      <div className="auth-buttons">
        {isLoggedIn ? (
          <>
            <button className="notification">알람</button>
            <div className="profile">프로필</div>
            <button onClick={handleLogout}>로그아웃</button>
          </>
        ) : (
          <>
            <button onClick={() => {
              localStorage.setItem('isLoggedIn', 'true'); 
              window.location.href = '/Login';
            }}>로그인</button>
            <button onClick={() => window.location.href = '/Signup'}>회원가입</button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
