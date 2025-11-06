import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiAuth } from '../../services/auth.api';
import type { SignupPayload } from '../../services/auth.types';

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
  const [submitting, setSubmitting] = useState(false);

  const isValidBirthdate = (y: string | number, m: string | number, d: string | number) => {
    const Y = Number(y), M = Number(m), D = Number(d);
    if (isNaN(Y) || isNaN(M) || isNaN(D)) return false;
    if (M < 1 || M > 12 || D < 1 || D > 31 || Y < 1900) return false;
    const date = new Date(Y, M - 1, D);
    const today = new Date();
    return date.getFullYear() === Y && date.getMonth() === M - 1 && date.getDate() === D && date <= today;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const idRegex = /^[a-zA-Z0-9]{8,15}$/;
    const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !id || !password || !confirmPassword || !email || !birth.year || !birth.month || !birth.day) {
      setError('모든 칸을 채워주세요.');
      return;
    }
    if (!idRegex.test(id)) { setError('아이디는 영문자/숫자 8~15자입니다.'); return; }
    if (!pwRegex.test(password)) { setError('비밀번호는 8~20자, 영문/숫자/특수문자 포함입니다.'); return; }
    if (password !== confirmPassword) { setError('비밀번호 확인이 일치하지 않습니다.'); return; }
    if (!emailRegex.test(email)) { setError('이메일 형식이 올바르지 않습니다.'); return; }
    if (!isValidBirthdate(birth.year, birth.month, birth.day)) { setError('유효한 생년월일을 입력해 주세요.'); return; }

    // YYYYMMDD 정수로 조립
    const y = String(birth.year).padStart(4, '0');
    const m = String(birth.month).padStart(2, '0');
    const d = String(birth.day).padStart(2, '0');
    const birthDay = Number(`${y}${m}${d}`);

    const payload: SignupPayload = {
      uid: id,
      nickName: name,
      password,
      email,
      emailVerified: false,
      birthDay,
    };

    try {
      setSubmitting(true);
      await apiAuth.signup(payload);
      navigate('/', { replace: true });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message :
        typeof err === 'string' ? err :
        '회원가입에 실패했습니다.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    id, setId,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    name, setName,
    email, setEmail,
    birth, setBirth,
    error,
    submitting,
    handleSubmit,
  };
};
