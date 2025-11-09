import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import "./Header.css";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = () => {
      const flag = localStorage.getItem('isLoggedIn') === 'true';
      const hasToken = !!localStorage.getItem('accessToken');
      setIsLoggedIn(flag || hasToken);
    };

    checkLoginStatus();

    const handleStorageChange = () => checkLoginStatus();
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
    // (AuthContext 쓰는 구조면 useAuth().logout() 호출하는 게 더 깔끔)
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('currentUserId');
    setIsLoggedIn(false);
    navigate('/'); // ← 풀 리로드 대신 라우터 이동
  };

  return (
    <header className="header">
      <Link to="/" className="logo">
        <img
          src="/Team-IT-2.png"
          alt="Team-IT로고"
          className="logo"
          onError={(e) => {
            console.error('Failed to load logo:', e.currentTarget.src);
            e.currentTarget.style.display = 'none';
          }}
        />
      </Link>

      <nav className="nav-links">
        <Link to="/Teams">팀원 모집</Link>
        <Link to="/Projects">프로젝트 찾기</Link>
        {/* ❌ <a href="/Boarder"> → ✅ Link 사용 */}
        <Link to="/Boarder">게시판</Link>
        <Link to="/myprojectmain">마이 프로젝트</Link>
      </nav>

      <div className="auth-buttons">
        {isLoggedIn ? (
          <>
            <Link to="/Mypage">
              <button className="profile">
                <img
                  src="/Profile.png"
                  className="Profile"
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
                  className="notic"
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
            <button onClick={() => navigate('/Login')}>로그인</button>
            <button onClick={() => navigate('/Signup')}>회원가입</button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
