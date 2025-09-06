import React, { useState } from "react";
import "../../pages/MyPage/Mypage.css";

type Props = {
  onEdit: () => void;
};

export default function ViewProfile({ onEdit }: Props) {
  return (
    <div className="view-profile">
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
          <div className="user-id-section">
            <span className="user-id">사용자 ID</span>
            <div className="user-badge">
              <div className="badge-placeholder"></div>
            </div>
          </div>
        </div>

        {/* 프로필 편집 버튼 */}
        <button className="profile-edit-btn" onClick={onEdit}>
          프로필 편집
        </button>
      </div>
    </div>
  );
}
