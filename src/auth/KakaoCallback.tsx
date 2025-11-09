import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/api";

const KakaoCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    if (!code) return;

    // code를 스프링 서버로 전달
    fetch(`${API_BASE_URL}/auth/kakao/callback?code=${code}`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("백엔드 응답:", data);
        
        // 토큰 저장 처리
        if (data.accessToken) {
          localStorage.setItem('accessToken', data.accessToken);
        }
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }
        if (data.userId) {
          localStorage.setItem('currentUserId', data.userId);
        }
        if (data.nickname) {
          localStorage.setItem('isLoggedIn', 'true');
        }
        
        alert(`${data.nickname || '사용자'}님 환영합니다!`);
        navigate("/");
      })
      .catch((err) => {
        console.error("카카오 로그인 실패:", err);
        alert("로그인에 실패했습니다. 다시 시도해주세요.");
        navigate("/login");
      });
  }, [navigate]);

  return <p>카카오 로그인 처리중...</p>;
};

export default KakaoCallback;
