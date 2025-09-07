import React, { useState } from "react";
import "../../pages/MyPage/Mypage.css";

type Props = {
  onEdit: () => void;
};

export default function ViewProfile({ onEdit }: Props) {
  return (
    <div className="view-profile">
      {/* 기존 프로필 섹션 */}
      <div className="profile-top-section">
        {/* 배경 사진 영역 */}
        <div className="background-photo">
          <div className="background-placeholder">
            배경 사진
          </div>
        </div>

        {/* 프로필 정보 영역 */}
        <div className="profile-section">
          {/* 프로필 사진 */}
          <div className="profile-picture-container">
            <div className="profile-avatar">
              <div className="user-icon">👤</div>
            </div>
          </div>

          {/* 사용자 ID와 뱃지 */}
          <div className="user-info">
            <span className="user-id">사용자 ID</span>
            <div className="user-badge">
              <div className="badge-placeholder"></div>
            </div>
          </div>

          {/* 프로필 편집 버튼 */}
          <button className="profile-edit-btn" onClick={onEdit}>
            프로필 편집
          </button>
        </div>
      </div>

      {/* 새로운 정보 섹션들 */}
      <div className="mypage-layout">
        {/* 왼쪽 컬럼 - 사용자 정보 */}
        <div className="left-column">
          <div className="user-info-section">
            <h3>사용자 정보</h3>
            <div className="info-list">
              <div className="info-item">
                <span className="info-label">닉네임</span>
                <span className="info-value">홍길동</span>
              </div>
              <div className="info-item">
                <span className="info-label">생년월일</span>
                <span className="info-value">1995.03.15</span>
              </div>
              <div className="info-item">
                <span className="info-label">소속기관</span>
                <span className="info-value">서울대학교</span>
              </div>
              <div className="info-item">
                <span className="info-label">이메일</span>
                <span className="info-value">hong@example.com</span>
              </div>
              <div className="info-item">
                <span className="info-label">직군</span>
                <span className="info-value">프론트엔드 개발자</span>
              </div>
              <div className="info-item">
                <span className="info-label">한 줄 소개</span>
                <span className="info-value">열정적인 개발자입니다</span>
              </div>
            </div>
            <button className="edit-btn" onClick={onEdit}>
              수정하기
            </button>
          </div>
        </div>

        {/* 오른쪽 컬럼 - 개발 스택 & 수상 이력 */}
        <div className="right-column">
          {/* 개발 스택 섹션 */}
          <div className="skills-section">
            <div className="section-header">
              <h3>개발 스택</h3>
              <button className="edit-btn">수정하기</button>
            </div>
            <div className="stack-cards">
              <div className="stack-card">
                <div className="stack-icon">📱</div>
                <div className="proficiency-levels">
                  <span className="level high">상</span>
                  <span className="level medium">중</span>
                  <span className="level low">하</span>
                </div>
              </div>
              <div className="stack-card">
                <div className="stack-icon">💻</div>
                <div className="proficiency-levels">
                  <span className="level high">상</span>
                  <span className="level medium">중</span>
                  <span className="level low">하</span>
                </div>
              </div>
              <div className="stack-card">
                <div className="stack-icon">⚡</div>
                <div className="proficiency-levels">
                  <span className="level high">상</span>
                  <span className="level medium">중</span>
                  <span className="level low">하</span>
                </div>
              </div>
            </div>
          </div>

          {/* 수상 이력 섹션 */}
          <div className="awards-section">
            <div className="section-header">
              <h3>수상 이력</h3>
              <button className="edit-btn">수정하기</button>
            </div>
            <p className="awards-description">
              참가 대회 이름과 수상 내역 (최신순)
            </p>
            <div className="awards-list">
              <div className="award-item">
                <input type="text" placeholder="대회명 및 수상내역을 입력하세요" />
              </div>
              <div className="award-item">
                <input type="text" placeholder="대회명 및 수상내역을 입력하세요" />
              </div>
              <div className="award-item">
                <input type="text" placeholder="대회명 및 수상내역을 입력하세요" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
