import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import "./Header.css";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const stored = localStorage.getItem('isLoggedIn');
      setIsLoggedIn(stored === 'true');
    };

    checkLoginStatus();

    // 로그인 상태 변경 감지
    const handleStorageChange = () => {
      checkLoginStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  return (
    <header className="header">
      <div className="logo" onClick={() => window.location.href = '/'}>
        <img src="./Team-IT-2.png" alt="Team-IT로고" className='logo'/>
      </div>

      <nav className="nav-links">
        <Link to="/teams">팀원 모집</Link>
        <Link to="/Projects">프로젝트 찾기</Link>
        <a href="/Boarder">게시판</a>
        <a href="/Stor">상점</a>
        <a href="/">소개</a>
        {isLoggedIn && <Link to="/MyProject">마이 프로젝트</Link>}
      </nav>

      <div className="auth-buttons">
        {isLoggedIn ? (
          <>
            <Link to="/Mypage"><button className="profile"><img src ="./Profile.png" className='Profile'/></button></Link>
            <Link to="/Notific"><button className="notification"><img src ="./Notific.png" className='notic'/> </button></Link>
            <button onClick={handleLogout}>로그아웃</button>
          </>
        ) : (
          <>
            <button onClick={() => {
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
