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
    setError('');

    // 생일 조합
    const fullBirth = Number(`${birth.year}${birth.month.padStart(2, '0')}${birth.day.padStart(2, '0')}`);

    // 유효성 검사
    //const nickRegex = /^[a-zA-z0-9]{8,15}$/;
    const idRegex = /^[a-zA-Z0-9]{8,15}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const isValidBirthdate = (year: string, month: string, day: string): boolean => {
      const y = Number(year);
      const m = Number(month);
      const d = Number(day);

      if (isNaN(y) || isNaN(m) || isNaN(d)) return false;
      if (m < 1 || m > 12 || d < 1 || d > 31) return false;
      if (y < 1900) return false;


      const date = new Date(y, m - 1, d);
      const today = new Date();

      // 날짜 구성 요소 확인
      const isCorrectDate =
        date.getFullYear() === y &&
        date.getMonth() === m - 1 &&
        date.getDate() === d;

      const isNotFuture = date <= today;

      return isCorrectDate && isNotFuture;
    };

    if (!name || !id || !password || !confirmPassword || !email || !birth.year || !birth.month || !birth.day) {
      setError('모든 칸을 채워주세요!');
      return;
    }

    if (!idRegex.test(id)) {
      setError('아이디는 5~15자의 영문 또는 숫자여야 합니다.');
      return;
    }

    if (!passwordRegex.test(password)) {
      setError('비밀번호는 8~20자이며, 영문과 숫자, 특수문자(!@#$%^&*)를 포함해야 합니다.');
      return;
    }

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!emailRegex.test(email)) {
      setError('이메일 형식이 올바르지 않습니다.');
      return;
    }

    // 유효한 생년월일인지 확인
    if (!isValidBirthdate(birth.year, birth.month, birth.day)) {
      setError('올바른 생년월일을 입력해주세요.');
      return;
    }

    if (localStorage.getItem(id)) {
      setError('이미 존재하는 아이디입니다.');
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
    navigate('/login');
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
