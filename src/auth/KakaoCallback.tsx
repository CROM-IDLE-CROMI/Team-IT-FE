import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const KakaoCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    if (!code) return;

    // codeë¥??¤í”„ë§??œë²„ë¡??„ë‹¬
    fetch("http://localhost:8080/auth/kakao/callback?code=" + code, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("ë°±ì—”???‘ë‹µ:", data);
        // TODO: ¹é¿£µå¿¡¼­ ¹ÞÀº ÅäÅ«À» ÀúÀåÇÏ°Å³ª ¼¼¼Ç °ü¸®

        alert(`${data.nickname}???˜ì˜?©ë‹ˆ??`);
        navigate("/");
      })
      .catch((err) => console.error("ì¹´ì¹´??ë¡œê·¸???¤íŒ¨:", err));
  }, [navigate]);

  return <p>ì¹´ì¹´??ë¡œê·¸??ì²˜ë¦¬ì¤?..</p>;
};

export default KakaoCallback;
