import React from "react";
import "./SavePopup.css";

interface SavePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (title: string) => void;
}

const SavePopup: React.FC<SavePopupProps> = ({ isOpen, onClose, onConfirm }) => {
  const [title, setTitle] = React.useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요!");
      return;
    }
    onConfirm(title);
    setTitle("");
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>임시 저장</h3>
        <input className='titleInput'
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="modal-actions">
          <button className="SaveButton" onClick={handleConfirm}>확인</button>
          <button className="SaveButton" onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default SavePopup;
