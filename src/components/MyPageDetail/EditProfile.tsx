// EditProfile.tsx
type Props = {
  onClose: () => void;
};

export default function EditProfile({ onClose }: Props) {
  return (
    <div className="edit-profile">
      <div className="background">
        배경 사진 + 버튼 / 수정 기능
        <button className="edit-btn">배경 수정</button>
      </div>
      <div className="profile-info">
        <div className="profile-avatar">+</div>
        <p className="user-id">사용자 ID</p>
        <button className="edit-btn">프로필 사진 수정</button>
      </div>
      <button onClick={onClose}>수정 완료</button>
    </div>
  );
}
