import React from "react";

type Props = {
  onClose: () => void;
};

export default function EditProfile({ onClose }: Props) {
  return (
    <div className="view-profile">
      {/* 기존 프로필 섹션 */}
      <div className="profile-top-section">
        {/* 배경 사진 영역 */}
        <div className="background-photo">
          <div className="background-placeholder">
            배경 사진
          </div>
          <div className="edit-overlay always-visible">
            <div className="edit-icon">+</div>
            <button className="edit-btn">배경 수정</button>
          </div>
        </div>

        {/* 프로필 정보 영역 */}
        <div className="profile-section">
          {/* 프로필 사진 */}
          <div className="profile-picture-container">
            <div className="profile-avatar">
              <div className="add-photo-overlay always-visible">
                <div className="add-icon">+</div>
                <span className="add-text">프로필 사진 추가</span>
              </div>
            </div>
            <div className="border-edit-label always-visible">테두리 수정</div>
          </div>

          {/* 사용자 ID와 뱃지 */}
          <div className="user-info">
            <span className="user-id">사용자 ID</span>
            <div className="user-badge">
              <div className="badge-edit-overlay always-visible">
                <div className="badge-icon">+</div>
                <button className="badge-edit-btn">뱃지 수정</button>
              </div>
            </div>
          </div>

          {/* 수정 완료 버튼 */}
          <button className="profile-edit-btn" onClick={onClose}>
            수정 완료
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
                <input type="text" className="info-input" defaultValue="홍길동" />
              </div>
              <div className="info-item">
                <span className="info-label">생년월일</span>
                <input type="date" className="info-input" defaultValue="1995-03-15" />
              </div>
              <div className="info-item">
                <span className="info-label">소속기관</span>
                <input type="text" className="info-input" defaultValue="서울대학교" />
              </div>
              <div className="info-item">
                <span className="info-label">이메일</span>
                <input type="email" className="info-input" defaultValue="hong@example.com" />
              </div>
              <div className="info-item">
                <span className="info-label">직군</span>
                <input type="text" className="info-input" defaultValue="프론트엔드 개발자" />
              </div>
              <div className="info-item">
                <span className="info-label">한 줄 소개</span>
                <input type="text" className="info-input" defaultValue="열정적인 개발자입니다" />
              </div>
            </div>
            <button className="edit-btn" onClick={onClose}>
              수정 완료
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
