import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

// 전역 변수로 alert 중복 방지
let hasShownAuthAlert = false;

const AuthGuard: React.FC<AuthGuardProps> = ({ children, fallback }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const stored = localStorage.getItem('isLoggedIn');
      const isAuth = stored === 'true';
      setIsLoggedIn(isAuth);
      
      if (!isAuth && !hasShownAuthAlert) {
        hasShownAuthAlert = true;
        alert('로그인이 필요한 서비스입니다. 로그인해주세요.');
        navigate('/Login', { replace: true });
      }
    };

    checkAuth();
  }, [navigate]);

  // 로그인 상태가 변경될 때마다 다시 체크
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem('isLoggedIn');
      const isAuth = stored === 'true';
      setIsLoggedIn(isAuth);
      
      // 로그인 성공 시 alert 플래그 리셋
      if (isAuth) {
        hasShownAuthAlert = false;
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (isLoggedIn === null) {
    return <div>로딩 중...</div>;
  }

  if (!isLoggedIn) {
    return fallback || null;
  }

  return <>{children}</>;
};

export default AuthGuard;
