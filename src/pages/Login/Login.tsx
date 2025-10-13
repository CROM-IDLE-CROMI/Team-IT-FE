import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css';

const Login = () => {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  /** 일반 로그인 */
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (id === '') {
      setError('아이디를 입력해주세요.');
      return;
    }
    if (password === '') {
      setError('비밀번호를 입력해주세요.');
      return;
    }

    // TODO: 백엔드 API로 로그인 요청
    console.log('로그인 요청:', { id, password });
    
    // 임시: 로그인 성공으로 처리
    alert('로그인이 완료되었습니다!');
    setError('');
    navigate('/');
  };

  const handleKakaoLogin = () => {
    const REST_API_KEY = "ca45ca0c35448e18526a3b03836d8a85";
    const REDIRECT_URI = "http://localhost:5173/oauth/callback/kakao";

    window.location.href =
      window.location.href =
        `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
  };

  return (
    <div className="login-container">
      <h2 className="login-title">로그인</h2>

      {/* 일반 로그인 폼 */}
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label>ID</label>
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="btn btn-login">
          Sign In
        </button>
      </form>

      <hr className="divider" />

      {/* 카카오 로그인 버튼 */}
      <button onClick={handleKakaoLogin} className="btn btn-kakao">
        카카오로 로그인
      </button>

      <p className="link-text">
        회원가입은 <a href="/signup">여기에서</a> 할 수 있습니다.
      </p>
    </div>
  );
};

export default Login;
