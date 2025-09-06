import React from "react";

type Props = {
  onClose: () => void;
};

export default function EditProfile({ onClose }: Props) {
  return (
    <div className="view-profile">
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
          <div className="user-id-section">
            <span className="user-id">사용자 ID</span>
            <div className="user-badge">
              <div className="badge-edit-overlay always-visible">
                <div className="badge-icon">+</div>
                <button className="badge-edit-btn">뱃지 수정</button>
              </div>
            </div>
          </div>
        </div>

        {/* 수정 완료 버튼 */}
        <button className="profile-edit-btn" onClick={onClose}>
          수정 완료
        </button>
      </div>
    </div>
  );
}
