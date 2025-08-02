import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

const originalSlides = [
  {
    id: 1,
    title: "TEAM-IT에서 IT프로젝트를 같이 할 팀원을 구해보세요!",
    description: "TEAM-IT은 여러분의 성공적인 IT프로젝트를 위해 만들어진 팀 매칭 사이트입니다",
  },
  {
    id: 2,
    title: "팀을 만들고 팀원에게 프로젝트를 소개해보세요!",
    description: "매칭 후에도 원활한 협업을 위한 다양한 기능이 준비되어 있어요.",
  },
];

const slides = [...originalSlides, originalSlides[0]];

const DashBoard = () => {
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const trackRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | null>(null);

  const startAutoSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, 4000);
  };

  useEffect(() => {
    startAutoSlide();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (index === originalSlides.length) {
      const track = trackRef.current;
      if (!track) return;

      const handleTransitionEnd = () => {
        setIsAnimating(false);
        setIndex(0);
        track.removeEventListener("transitionend", handleTransitionEnd);
      };

      track.addEventListener("transitionend", handleTransitionEnd);
    }
  }, [index]);

  useEffect(() => {
    if (index === 0 && !isAnimating) {
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    }
  }, [index, isAnimating]);

  const currentDotIndex = index === originalSlides.length ? 0 : index;

  return (
    <div className="intro-slider" style={{ position: "relative" }}>
      <div
        ref={trackRef}
        className="intro-track"
        style={{
          display: "flex",
          transition: isAnimating ? "transform 0.8s ease-in-out" : "none",
          transform: `translateX(-${index * 100}%)`,
        }}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            className="intro-box"
            style={{ minWidth: "100%", boxSizing: "border-box" }}
          >
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

      {/* 도트 인디케이터 */}
      <div className="intro-dots">
        {originalSlides.map((_, i) => (
          <div
            key={i}
            className={`dot ${i === currentDotIndex ? "active" : ""}`}
            onClick={() => {
              setIndex(i);
              startAutoSlide();
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default DashBoard;
