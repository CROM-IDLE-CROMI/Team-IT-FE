import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Birth = { year: string; month: string; day: string };

export const useSignup = () => {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [birth, setBirth] = useState<Birth>({ year: '', month: '', day: '' });
  const [error, setError] = useState('');

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const idRegex = /^[a-zA-Z0-9]{8,15}$/; // 영문/숫자 8~15자
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/; // 영문, 숫자, 특수문자 포함 8~20자
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // 모든 입력 채움 확인
    if (
      !name ||
      !id ||
      !password ||
      !confirmPassword ||
      !email ||
      !birth.year ||
      !birth.month ||
      !birth.day
    ) {
      setError('모든 칸을 채워주세요.');
      return;
    }

    if (!idRegex.test(id)) {
      setError('아이디는 영문자와 숫자로 구성된 8~15자여야 합니다.');
      return;
    }

    if (!passwordRegex.test(password)) {
      setError('비밀번호는 8~20자이며 영문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해야 합니다.');
      return;
    }

    if (password !== confirmPassword) {
      setError('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    if (!emailRegex.test(email)) {
      setError('이메일 형식이 올바르지 않습니다.');
      return;
    }

    if (!isValidBirthdate(birth.year, birth.month, birth.day)) {
      setError('유효한 생년월일을 입력해 주세요.');
      return;
    }

    if (localStorage.getItem(id)) {
      setError('이미 존재하는 아이디입니다.');
      return;
    }

    // 제출 시점에만 생년월일을 숫자로 조합
    // const fullBirth = Number(
    //   `${birth.year}${birth.month.padStart(2, '0')}${birth.day.padStart(2, '0')}`
    // );

    // const newUser = { id, password, name, email, birth: fullBirth };
    // TODO: 실제 API로 회원가입 요청 전송
    // 예: await api.signup(newUser)

    alert('회원가입이 완료되었습니다.');
    navigate('/login');
  };

  return {
    id,
    setId,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    name,
    setName,
    email,
    setEmail,
    birth,
    setBirth,
    error,
    handleSubmit,
  };
};
