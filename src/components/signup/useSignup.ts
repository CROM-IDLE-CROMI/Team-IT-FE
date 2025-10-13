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
      setError('모든 칸을 채워주세??');
      return;
    }

    if (!idRegex.test(id)) {
      setError('?�이?�는 5~15?�의 ?�문 ?�는 ?�자?�야 ?�니??');
      return;
    }

    if (!passwordRegex.test(password)) {
      setError('비�?번호??8~20?�이�? ?�문�??�자, ?�수문자(!@#$%^&*)�??�함?�야 ?�니??');
      return;
    }

    if (password !== confirmPassword) {
      setError('비�?번호가 ?�치?��? ?�습?�다.');
      return;
    }

    if (!emailRegex.test(email)) {
      setError('?�메???�식???�바르�? ?�습?�다.');
      return;
    }

    if (!isValidBirthdate(birth.year, birth.month, birth.day)) {
      setError('?�바�??�년?�일???�력?�주?�요.');
      return;
    }

    if (localStorage.getItem(id)) {
      setError('?��? 존재?�는 ?�이?�입?�다.');
      return;
    }

    const newUser = { id, password, name, email, birth: fullBirth };
    // TODO: �鿣�� API�� ȸ������ ��û
    alert('?�원가?�이 ?�료?�었?�니??');
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
