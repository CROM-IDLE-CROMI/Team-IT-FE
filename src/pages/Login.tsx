import { Link } from 'react-router-dom'
import '../App.css'

export default function Login() {
  return (
    <div className="login-container">
      <h1 className="login-title">로그인</h1>

      <div className="input-group">
        <label htmlFor="id">ID</label>
        <input type="text" id="id" placeholder="아이디 입력" />
      </div>

      <div className="input-group">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" placeholder="비밀번호 입력" />
      </div>

      <button className="login-button">Sign In</button>

      <div className="link-text">
        아이디나 비밀번호를 잊었다면, <Link to="/reset">여기를</Link> 눌러주세요.
      </div>
      <div className="link-text">
        회원가입은 <Link to="/signup">여기에서</Link> 할 수 있습니다.
      </div>

      <hr className="divider" />

      <div className="social-login-label">소셜 로그인하기</div>

      <button className="kakao-button">
        <img
          src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png"
          alt="kakao icon"
        />
        <span>카카오로 로그인 하기</span>
      </button>
    </div>
  )
}
