import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const KakaoCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    if (!code) return;

    // code�??�프�??�버�??�달
    fetch("http://localhost:8080/auth/kakao/callback?code=" + code, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("백엔???�답:", data);
        // TODO: �鿣�忡�� ���� ��ū�� �����ϰų� ���� ����

        alert(`${data.nickname}???�영?�니??`);
        navigate("/");
      })
      .catch((err) => console.error("카카??로그???�패:", err));
  }, [navigate]);

  return <p>카카??로그??처리�?..</p>;
};

export default KakaoCallback;
