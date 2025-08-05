import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Login = () => {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // localStorage에서 유저 정보 가져오기
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

    // 로그인 성공
    alert(`${parsed.name}님 환영합니다!`);
    setError('');
    navigate('/'); // 홈으로 이동
  };

  return (
    <div className="login-container">
      <h2>로그인</h2>
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label>ID</label>
          <input type="text" value={id} onChange={(e) => setId(e.target.value)} />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="btn btn-login">Sign In</button>
      </form>
      <p>회원가입은 <a href="/signup">여기에서</a> 할 수 있습니다.</p>
    </div>
  );
};

export default Login;