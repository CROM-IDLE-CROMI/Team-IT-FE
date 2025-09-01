import React from "react";

type Props = {
  onEdit: () => void;
};

export default function ViewProfile({ onEdit }: Props) {
  return (
    <div className="view-profile">
      <div className="background">배경 사진</div>
      <div className="profile-info">
        <div className="profile-avatar">👤</div>
        <p className="user-id">사용자 ID</p>
      </div>
      <button onClick={onEdit}>프로필 편집</button>
    </div>
  );
}
