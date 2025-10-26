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
      setError('ëª¨ë“  ì¹¸ì„ ì±„ì›Œì£¼ì„¸??');
      return;
    }

    if (!idRegex.test(id)) {
      setError('?„ì´?”ëŠ” 5~15?ì˜ ?ë¬¸ ?ëŠ” ?«ì?¬ì•¼ ?©ë‹ˆ??');
      return;
    }

    if (!passwordRegex.test(password)) {
      setError('ë¹„ë?ë²ˆí˜¸??8~20?ì´ë©? ?ë¬¸ê³??«ì, ?¹ìˆ˜ë¬¸ì(!@#$%^&*)ë¥??¬í•¨?´ì•¼ ?©ë‹ˆ??');
      return;
    }

    if (password !== confirmPassword) {
      setError('ë¹„ë?ë²ˆí˜¸ê°€ ?¼ì¹˜?˜ì? ?ŠìŠµ?ˆë‹¤.');
      return;
    }

    if (!emailRegex.test(email)) {
      setError('?´ë©”???•ì‹???¬ë°”ë¥´ì? ?ŠìŠµ?ˆë‹¤.');
      return;
    }

    if (!isValidBirthdate(birth.year, birth.month, birth.day)) {
      setError('?¬ë°”ë¥??ë…„?”ì¼???…ë ¥?´ì£¼?¸ìš”.');
      return;
    }

    if (localStorage.getItem(id)) {
      setError('?´ë? ì¡´ì¬?˜ëŠ” ?„ì´?”ì…?ˆë‹¤.');
      return;
    }

    const newUser = { id, password, name, email, birth: fullBirth };
    // TODO: ¹é¿£µå API·Î È¸¿ø°¡ÀÔ ¿äÃ»
    alert('?Œì›ê°€?…ì´ ?„ë£Œ?˜ì—ˆ?µë‹ˆ??');
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
