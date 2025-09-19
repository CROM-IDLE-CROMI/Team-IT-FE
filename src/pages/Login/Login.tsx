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
    const userData = localStorage.getItem(id);

    if (id === '') {
      setError('아이디를 입력해주세요.');
      return;
    }
    if (password === '') {
      setError('비밀번호를 입력해주세요.');
      return;
    }
    if (!userData) {
      setError('존재하지 않는 아이디입니다.');
      return;
    }

    const parsed = JSON.parse(userData);
    if (parsed.password !== password) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    alert(`${parsed.name}님 환영합니다!`);
    localStorage.setItem('isLoggedIn', 'true');
    setError('');
    navigate('/');
  };

  const handleKakaoLogin = () => {
    const REST_API_KEY = "ca45ca0c35448e18526a3b03836d8a85";
    const REDIRECT_URI = "http://localhost:5173/oauth/callback/kakao";

    window.location.href =
      `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;
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
