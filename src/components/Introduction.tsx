import "../App.css";
import Sidebar from "./Sidebar";
import React, { useRef, useEffect, useState } from 'react';

const Introduction = () => {
  const [activeTab, setActiveTab] = useState("배경");
  const [produceTab, setProduceTab] = useState("기본");
  const [boardTab, setBoardTab] = useState("공지");

  const tabs = ["배경", "테두리", "이펙트"];
  const produceTabs = ["기본정보", "프로젝트 정보","프로젝트 상황","근무 환경","지원자 정보"];
  const boardTabs = ["시사,정보", "질문", "홍보"];

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

      {/* 2️⃣ 팀원 모집 탭 */}
      <div className="produce">
        <h1 className="Introduction-title">TEAM-IT 팀원모집 미리보기!</h1>
        <p className="subtitle">
          프로젝트 모집을 보다 쉽게 하기 위한<br />
          Team-IT의 기본 템플릿!
        </p>

        <div className="tab-buttons">
          {produceTabs.map((tab) => (
            <button
              key={tab}
              className={`tab ${produceTab === tab ? "active" : ""}`}
              onClick={() => setProduceTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="preview-box">
          <div className="preview-text">
            <p>
              {produceTab === "기본" &&
                `기본 양식을 통해 빠르게 팀원 모집을 시작할 수 있어요!`}
              {produceTab === "커스터마이징" &&
                `템플릿을 자유롭게 수정해서 내 프로젝트에 맞는 양식을 만들 수 있어요!`}
            </p>
          </div>
        </div>
      </div>

      {/* 3️⃣ 게시판 탭 */}
      <div className="DashboardIntroduce">
        <h1 className="Introduction-title">TEAM-IT 게시판 미리보기!</h1>
        <p className="subtitle">
          Team-IT 사이트를 더 재밌게 즐기기 위한<br />
          Team-IT의 여러 게시판!
        </p>

        <div className="tab-buttons">
          {boardTabs.map((tab) => (
            <button
              key={tab}
              className={`tab ${boardTab === tab ? "active" : ""}`}
              onClick={() => setBoardTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="preview-box">
          <div className="preview-text">
            <p>
              {boardTab === "공지" &&
                `공지사항에서 주요 업데이트 및 일정 등을 확인할 수 있어요!`}
              {boardTab === "자유" &&
                `자유게시판에서 사용자들과 자유롭게 소통해보세요.`}
              {boardTab === "QnA" &&
                `QnA 게시판을 통해 궁금한 점을 질문하고 답변을 받아보세요.`}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Introduction;
