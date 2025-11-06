import { useSignup } from "./useSignup";
import "../../App.css";
import Header from "../../layouts/Header";

const SignupForm = () => {
  const {
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
  } = useSignup();

  return (
    <>
      <div className="content-header">
        <Header />
      </div>
      <div className="signup-container">
        <h2>회원가입</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>사용자 이름(닉네임)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>아이디</label>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>비밀번호 확인</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="birthdate-input">
            <label>생년월일</label>
            <div className="date-group">
              <input
                type="number"
                placeholder="YYYY"
                maxLength={4}
                value={birth.year}
                onChange={(e) => setBirth({ ...birth, year: e.target.value })}
              />
              <input
                type="number"
                placeholder="MM"
                maxLength={2}
                value={birth.month}
                onChange={(e) => setBirth({ ...birth, month: e.target.value })}
              />
              <input
                type="number"
                placeholder="DD"
                maxLength={2}
                value={birth.day}
                onChange={(e) => setBirth({ ...birth, day: e.target.value })}
              />
            </div>
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="btn btn-signup">
            회원가입
          </button>
        </form>
      </div>
    </>
  );
};

export default SignupForm;
