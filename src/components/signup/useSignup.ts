import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useSignup = () => {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [birth, setBirth] = useState({ year: '', month: '', day: '' });
  const [error, setError] = useState('');

  const fullBirth = Number(`${birth.year}${birth.month.padStart(2, '0')}${birth.day.padStart(2, '0')}`);

  const isValidBirthdate = (year: string, month: string, day: string): boolean => {
    const y = Number(year);
    const m = Number(month);
    const d = Number(day);
    if (isNaN(y) || isNaN(m) || isNaN(d)) return false;
    if (m < 1 || m > 12 || d < 1 || d > 31 || y < 1900) return false;

    const date = new Date(y, m - 1, d);
    const today = new Date();
    return (
      date.getFullYear() === y &&
      date.getMonth() === m - 1 &&
      date.getDate() === d &&
      date <= today
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const idRegex = /^[a-zA-Z0-9]{8,15}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    if (!isValidBirthdate(birth.year, birth.month, birth.day)) {
      setError('올바른 생년월일을 입력해주세요.');
      return;
    }

    if (localStorage.getItem(id)) {
      setError('이미 존재하는 아이디입니다.');
      return;
    }

    const newUser = { id, password, name, email, birth: fullBirth };
    localStorage.setItem(id, JSON.stringify(newUser));
    alert('회원가입이 완료되었습니다!');
    navigate('/login');
  };

  return {
    id, setId,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    name, setName,
    email, setEmail,
    birth, setBirth,
    error,
    handleSubmit,
  };
};
