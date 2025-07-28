import { useState } from "react";
import "../App.css";

const Introduction = () => {
  const [activeTab, setActiveTab] = useState("배경");

  const tabs = ["배경", "테두리", "이펙트"];

  return (
    <section className="preview-section">
      <h1 className="Introduction-title">TEAM-IT 상점 미리보기!</h1>
      <p className="subtitle">
        TEAM-IT의 흥미를 추가하기 위한<br />
        프로필 꾸미기 기능!
      </p>

      <div className="tab-buttons">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="preview-box">
        <div className="preview-text">
          <p>
            {activeTab === "배경" &&
              `상점에서 배경 탬플릿을 구매하면\n마이 페이지에 있는 배경을\n원하는대로 꾸밀 수 있습니다!`}
            {activeTab === "테두리" &&
              `상점에서 테두리 템플릿을 구매하면\n프로필 사진 테두리를 꾸밀 수 있어요!`}
            {activeTab === "이펙트" &&
              `상점에서 이펙트 아이템을 구매하면\n프로필에 멋진 효과가 추가됩니다!`}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Introduction;
