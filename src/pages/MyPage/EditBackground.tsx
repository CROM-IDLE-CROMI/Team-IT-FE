import React, { useState } from "react";

interface EditBackgroundProps {
  currentImage: string | null;
  onSave: (newImage: string | null) => void;
  onCancel: () => void;
}

const EditBackground: React.FC<EditBackgroundProps> = ({ currentImage, onSave, onCancel }) => {
  const [preview, setPreview] = useState<string | null>(currentImage);

  // 파일 선택 시 미리보기 생성
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave(preview);
  };

  return (
    <div className="edit-background">
      <h3>배경 이미지 수정</h3>

      <label htmlFor="fileInput" className="upload-button">
        +
      </label>
      <input
        type="file"
        id="fileInput"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {preview && <img src={preview} alt="미리보기" className="preview-image" />}

      <div className="edit-actions">
        <button onClick={handleSave}>저장</button>
        <button onClick={onCancel}>취소</button>
      </div>
    </div>
  );
};

export default EditBackground;
