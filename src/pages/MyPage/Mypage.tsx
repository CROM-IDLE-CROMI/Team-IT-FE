import React, { useState } from "react";
import Header from "../../layouts/Header";
import EditBackground from "./EditBackground";
import "./Mypage.css";

const Mypage = () => {
  const [bgImage, setBgImage] = useState<string | null>(null); // 현재 배경
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (newImage: string | null) => {
    setBgImage(newImage);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="Mypage-wrapper">
      <Header />

      {!isEditing ? (
        <div className="backprofile-section">
          <div
            className="background"
            style={{ backgroundImage: bgImage ? `url(${bgImage})` : undefined }}>
          </div>
          <button onClick={() => setIsEditing(true)} className="edit-button">
            수정하기
          </button>
        </div>
      ) : (
        <EditBackground
          currentImage={bgImage}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
      <div className="Roundprofile">
        </div>



    </div>
  );
};

export default Mypage;
