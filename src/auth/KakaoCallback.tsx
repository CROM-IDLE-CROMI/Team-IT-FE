import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const KakaoCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    if (!code) return;

    // code를 스프링 서버로 전달
    fetch("http://localhost:8080/auth/kakao/callback?code=" + code, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("백엔드 응답:", data);
        alert(`${data.nickname}님 환영합니다!`);
        navigate("/");
      })
      .catch((err) => console.error("카카오 로그인 실패:", err));
  }, [navigate]);

  return <p>카카오 로그인 처리중...</p>;
};

export default KakaoCallback;
