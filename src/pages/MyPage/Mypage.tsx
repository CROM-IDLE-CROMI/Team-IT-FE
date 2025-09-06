
import { useState } from "react";
import ViewProfile from "../../components/MyPageDetail/ViewProfile";
import EditProfile from "../../components/MyPageDetail/EditProfile";
import Header from "../../layouts/Header";
import "./Mypage.css";

export default function Mypage() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="mypage-container">
        <Header />
      {isEditing ? (
        <EditProfile onClose={() => setIsEditing(false)} />
      ) : (
        <ViewProfile onEdit={() => setIsEditing(true)} />
      )}
    </div>
  );
}
