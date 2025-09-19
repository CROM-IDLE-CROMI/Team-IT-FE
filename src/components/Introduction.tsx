import "../App.css";
import { useState } from 'react';

const Introduction = () => {
  const [activeTab, setActiveTab] = useState("배경");
  const [produceTab, setProduceTab] = useState("기본정보");
  const [boardTab, setBoardTab] = useState("시사,정보");

  const tabs = ["배경", "테두리", "이펙트"];
  const produceTabs = ["기본정보", "프로젝트 정보","프로젝트 상황","근무 환경","지원자 정보"];
  const boardTabs = ["시사,정보", "질문", "홍보"];

  return (
    <section className="preview-section">
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
              {produceTab === "기본정보" &&
                `기본 양식을 통해 빠르게 팀원 모집을 시작할 수 있어요!`}
              {produceTab === "프로젝트 정보" &&
                `템플릿을 자유롭게 수정해서 내 프로젝트에 맞는 양식을 만들 수 있어요!`}
              {produceTab === "프로젝트 상황" &&
                `템플릿을 자유롭게 수정해서 내 프로젝트에 맞는 양식을 만들 수 있어요!`}
              {produceTab === "근무 환경" &&
                `템플릿을 자유롭게 수정해서 내 프로젝트에 맞는 양식을 만들 수 있어요!`}
              {produceTab === "지원자 정보" &&
                `템플릿을 자유롭게 수정해서 내 프로젝트에 맞는 양식을 만들 수 있어요!`}
            </p>
          </div>
        </div>
      </div>

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
              {boardTab === "시사,정보" &&
                `공지사항에서 주요 업데이트 및 일정 등을 확인할 수 있어요!`}
              {boardTab === "질문" &&
                `자유게시판에서 사용자들과 자유롭게 소통해보세요.`}
              {boardTab === "홍보" &&
                `QnA 게시판을 통해 궁금한 점을 질문하고 답변을 받아보세요.`}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Introduction;
