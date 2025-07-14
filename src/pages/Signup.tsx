import React from 'react';
import '../App.css';

const Signup = () => {
  return (
    <div className="signup-container">
      <h2 className="signup-title">회원가입</h2>

      <div className="input-group">
        <label>사용자 이름(닉네임)</label>
        <input type="text" placeholder="닉네임 입력" />
      </div>

      <div className="input-group row-group">
        <div>
          <label>아이디</label>
          <input type="text" placeholder="아이디 입력" />
        </div>
        <button className="btn btn-check">중복확인</button>
      </div>

      <div className="input-group row-group">
        <div>
          <label>Email</label>
          <input type="email" placeholder="이메일 입력" />
        </div>
        <button className="btn btn-check">중복확인</button>
      </div>

      <div className="input-group">
        <label>비밀번호</label>
        <input type="password" placeholder="비밀번호 입력" />
      </div>

      <div className="input-group">
        <label>비밀번호 확인</label>
        <input type="password" placeholder="비밀번호 확인" />
      </div>

      <div className="input-group">
        <label>생년월일</label>
        <div className="birth-selects">
          <select><option>Year</option></select>
          <select><option>Month</option></select>
          <select><option>Day</option></select>
        </div>
      </div>

      <div className="input-group agree-group">
        <label>약관동의</label>
        <div className="agreement">
          다음의 약관에 동의합니다. <a href="#">약관보기</a>
          <button className="btn btn-agree">동의</button>
        </div>
      </div>

      <button className="btn btn-signup">회원가입</button>
    </div>
  );
};

export default Signup;
