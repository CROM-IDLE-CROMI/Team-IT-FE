import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Signup = () => {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [birth, setBirth] = useState({ year : '', month : '', day : ''});
  const [error, setError] = useState('');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // 입력받은 생일 하나로 합치기
    const fullBirth = Number(`${birth.year}${birth.month.padStart(2, '0')}${birth.day.padStart(2, '0')}`);

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (localStorage.getItem(id)) {
      setError('이미 존재하는 아이디입니다.');
      return;
    }

    if (id == '' || password == '' || confirmPassword == '' || name == '' || 
       email == '' || birth.year == '' || birth.month == '' || birth.day == '' ||
       error == '') {
      setError('모든 칸을 채워주세요!');
      return;
    }

    const newUser = {
      id,
      password,
      name,
      email,
      birth: fullBirth,
    };

    localStorage.setItem(id, JSON.stringify(newUser));
    alert('회원가입이 완료되었습니다!');
    navigate('/');
  };

  return (
    <div className="signup-container">
      <h2>회원가입</h2>
      <form onSubmit={handleSignup}>
        <div className="input-group">
          <label>사용자 이름(닉네임)</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="input-group">
          <label>아이디</label>
          <input type="text" value={id} onChange={(e) => setId(e.target.value)} required />
        </div>
        <div className="input-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="input-group">
          <label>비밀번호</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="input-group">
          <label>비밀번호 확인</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>
        <div className="birthdate-input">
          <label>생년월일</label>
          <div className="date-group">
            <input
              type="text"
              placeholder="YYYY"
              maxLength={4}
              value={birth.year}
              onChange={(e) => setBirth({ ...birth, year: e.target.value })}
            />
            <input
              type="text"
              placeholder="MM"
              maxLength={2}
              value={birth.month}
              onChange={(e) => setBirth({ ...birth, month: e.target.value })}
            />
            <input
              type="text"
              placeholder="DD"
              maxLength={2}
              value={birth.day}
              onChange={(e) => setBirth({ ...birth, day: e.target.value })}
            />
          </div>
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="btn btn-signup">회원가입</button>
      </form>
    </div>
  );
};

export default Signup;
