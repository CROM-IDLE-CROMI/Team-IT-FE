import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

const slides = [
  {
    id: 1,
    title: "TEAM-IT에서 IT프로젝트를 같이 할 팀원을 구해보세요!",
    description: "TEAM-IT은 여러분의 성공적인 IT프로젝트를 위해 만들어진 팀 매칭 사이트입니다",
    styleClass: "slide-style-1",
  },
  {
    id: 2,
    title: "팀을 만들고 팀원에게 프로젝트를 소개해보세요!",
    description: "매칭 후에도 원활한 협업을 위한 다양한 기능이 준비되어 있어요.",
  },

];

const DashBoard = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // 4초마다 슬라이드 전환
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="intro-slider">
      <div
        className="intro-track"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div className="intro-box" key={slide.id}>
            <div className="intro-text">
              <div className="box-title">{slide.title}</div>
              <div className="box-description">{slide.description}</div>
            </div>
            {slide.id === 1 && (
            <div className="box-links">
              <Link to="/teams">팀원 모집 바로가기</Link>
              <Link to="/projects">프로젝트 찾기 바로가기</Link>
            </div>
            )}
          </div>
        ))}
      </div>

      <div className="intro-dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${currentSlide === index ? "active" : ""}`}
            onClick={() => setCurrentSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default DashBoard;
