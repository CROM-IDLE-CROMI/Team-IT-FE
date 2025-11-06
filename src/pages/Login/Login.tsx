import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../App.css";
import Header from "../../layouts/Header";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [uid, setUid] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /** 일반 로그인 */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!uid.trim()) {
      setError("아이디를 입력해주세요.");
      return;
    }
    if (!password) {
      setError("비밀번호를 입력해주세요.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      await login({ uid, password });     // ✅ 실제 로그인 호출 (토큰 저장/유저 세팅)
      navigate("/myproject", { replace: true }); // 원하는 경로로 이동
    } catch (err: any) {
      setError(err?.message || "로그인에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleKakaoLogin = () => {
    const REST_API_KEY = "ca45ca0c35448e18526a3b03836d8a85";
    const REDIRECT_URI = "http://localhost:5173/oauth/callback/kakao";

    window.location.href =
      `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
  };

  return (
    <>
      <div className="content-header">
        <Header />
      </div>
      <div className="login-container">
        <h2 className="login-title">로그인</h2>

        {/* 일반 로그인 폼 */}
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="login-id">ID</label>
            <input
              type="text"
              id="login-id"
              value={uid}
              onChange={(e) => setUid(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div className="input-group">
            <label htmlFor="login-password">Password</label>
            <input
              type="password"
              id="login-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="btn btn-login" disabled={submitting}>
            {submitting ? "로그인 중..." : "Sign In"}
          </button>
        </form>

        <hr className="divider" />

        {/* 카카오 로그인 버튼 */}
        <button onClick={handleKakaoLogin} className="btn btn-kakao">
          카카오로 로그인
        </button>

        <p className="link-text">
          회원가입은 <Link to="/signup">여기에서</Link> 할 수 있습니다.
        </p>
      </div>
    </>
  );
};

export default Login;
