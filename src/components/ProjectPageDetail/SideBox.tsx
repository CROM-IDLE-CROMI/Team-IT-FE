import React from "react";
import "./SideBox.css";

interface SideBoxProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideBox: React.FC<SideBoxProps> = ({ isOpen, onClose }) => {
  return (
    <div className={`side-box ${isOpen ? "open" : ""}`}>
      <button className="close-btn" onClick={onClose}>✕</button>

      <h3>플랫폼</h3>
      <div className="buttons_1">
        <button>앱</button>
        <button>웹</button>
        <button>게임</button>
        <button>기타</button>
      </div>

      <h3>모집 직군</h3>
      <div className="buttons_1">
        <button>프론트</button>
        <button>백</button>
        <button>UI/UX</button>
        <button>디자인</button>
        <button>기타</button>
      </div>

      <h3>프로젝트 모집 종료 기간</h3>
      <input type="date" />

      <h3>기술 스택</h3>
      <input type="text" placeholder="검색할 기술 스택 입력" />

      <h3>위치</h3>
      <input type="text" placeholder="지역 입력" />

      <button className="apply-btn">조회하기</button>
    </div>
  );
};

export default SideBox;
