import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import "./Header.css";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const flag = localStorage.getItem('isLoggedIn') === 'true';
      const hasToken = !!localStorage.getItem('accessToken');
      setIsLoggedIn(flag || hasToken);
    };

    checkLoginStatus();

    // 다른 탭/윈도우에서의 변경 감지
    const handleStorageChange = () => {
      checkLoginStatus();
    };

    // 현재 탭에서 토큰이 바뀐 뒤 화면 전환 없이도 갱신되도록
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') checkLoginStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('currentUserId');
    setIsLoggedIn(false);
  };

  return (
    <header className="header">
      <div className="logo" onClick={() => window.location.href = '/'}>
        <img 
          src="/Team-IT-2.png" 
          alt="Team-IT로고" 
          className='logo'
          onError={(e) => {
            console.error('Failed to load logo:', e.currentTarget.src);
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>

      <nav className="nav-links">
        <Link to="/Teams">팀원 모집</Link>
        <Link to="/Projects">프로젝트 찾기</Link>
        <a href="/Boarder">게시판</a>
        {<Link to="/myprojectmain">마이 프로젝트</Link>}
      </nav>

      <div className="auth-buttons">
        {isLoggedIn ? (
          <>
            <Link to="/Mypage">
              <button className="profile">
                <img 
                  src="/Profile.png" 
                  className='Profile'
                  alt="프로필"
                  onError={(e) => {
                    console.error('Failed to load profile icon:', e.currentTarget.src);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </button>
            </Link>
            <Link to="/notification">
              <button className="notification">
                <img 
                  src="/Notific.png" 
                  className='notic'
                  alt="알림"
                  onError={(e) => {
                    console.error('Failed to load notification icon:', e.currentTarget.src);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </button>
            </Link>
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
