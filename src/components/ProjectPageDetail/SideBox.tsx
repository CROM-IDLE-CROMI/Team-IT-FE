import React, { useState } from "react";
import "./SideBox.css";
import { techStacksInit } from "../../styles/TechStack";

interface FilterState {
  selectedActivity: string[];
  selectedPositions: string[];
  selectedTechStacks: string[];
  selectedLocations: string[];
  selectedProgress: string[];
  selectedMethod: string[];
  recruitEndDate: string;
  projectStartDate: string;
  projectEndDate: string;
}

interface SideBoxProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const SideBox: React.FC<SideBoxProps> = ({ isOpen, onClose, filters, onFiltersChange }) => {
  const [techStackSearch, setTechStackSearch] = useState("");

  const activityOptions = ["앱", "웹", "게임", "기타"];
  const positionOptions = ["프론트", "백", "PM", "디자인", "기획","기타"];
  const progressOptions = ["아이디어 구상 중", "아이디어 기획 중", "개발 진행 중"];
  const methodOptions = ["온라인", "오프라인", "온/오프라인"];
  const locationOptions = [
    "서울 특별시", "부산 광역시", "대구 광역시", "인천 광역시", 
    "광주 광역시", "대전 광역시", "울산 광역시", "세종 특별자치시",
    "경기도", "강원도", "충청북도", "충청남도", "전라북도", "전라남도", "경상북도", "경상남도", "제주도"
  ];

  const updateFilters = (newFilters: Partial<FilterState>) => {
    onFiltersChange({ ...filters, ...newFilters });
  };

  const handleOptionToggle = (option: string, current: string[], field: keyof FilterState) => {
    if (current.includes(option)) {
      updateFilters({ [field]: current.filter(item => item !== option) });
    } else {
      updateFilters({ [field]: [...current, option] });
    }
  };

  const handleTechStackToggle = (tech: string) => {
    if (filters.selectedTechStacks.includes(tech)) {
      updateFilters({ selectedTechStacks: filters.selectedTechStacks.filter(item => item !== tech) });
    } else {
      updateFilters({ selectedTechStacks: [...filters.selectedTechStacks, tech] });
    }
  };

  const handleLocationToggle = (location: string) => {
    if (filters.selectedLocations.includes(location)) {
      updateFilters({ selectedLocations: filters.selectedLocations.filter(item => item !== location) });
    } else {
      updateFilters({ selectedLocations: [...filters.selectedLocations, location] });
    }
  };

  const resetAll = () => {
    updateFilters({
      selectedActivity: [],
      selectedPositions: [],
      selectedTechStacks: [],
      selectedLocations: [],
      selectedProgress: [],
      selectedMethod: [],
      recruitEndDate: "",
      projectStartDate: "",
      projectEndDate: ""
    });
    setTechStackSearch("");
  };

  const filteredTechStacks = techStacksInit.filter(tech => 
    tech.label.toLowerCase().includes(techStackSearch.toLowerCase())
  );

  return (
    <div className={`side-box ${isOpen ? "open" : ""}`}>
      <button className="close-btn" onClick={onClose}>✕</button>

      <div className="filter-container">
        {/* 플랫폼 */}
        <div className="filter-section">
          <div className="filter-header">
      <h3>플랫폼</h3>
          </div>
          <div className="option-buttons">
            {activityOptions.map(option => (
              <button
                key={option}
                className={`option-btn ${filters.selectedActivity.includes(option) ? 'selected' : ''}`}
                onClick={() => handleOptionToggle(option, filters.selectedActivity, 'selectedActivity')}
              >
                {option}
              </button>
            ))}
          </div>
      </div>

        {/* 모집 직군 */}
        <div className="filter-section">
          <div className="filter-header">
      <h3>모집 직군</h3>
          </div>
          <div className="option-buttons">
            {positionOptions.map(option => (
              <button
                key={option}
                className={`option-btn ${filters.selectedPositions.includes(option) ? 'selected' : ''}`}
                onClick={() => handleOptionToggle(option, filters.selectedPositions, 'selectedPositions')}
              >
                {option}
              </button>
            ))}
          </div>
      </div>

        {/* 프로젝트 모집 종료 기한 */}
        <div className="filter-section">
          <div className="filter-header">
            <h3>프로젝트 모집 종료 기한</h3>
          </div>
          <input 
            type="date" 
            value={filters.recruitEndDate}
            onChange={(e) => updateFilters({ recruitEndDate: e.target.value })}
            className="date-input"
          />
        </div>

        {/* 기술 스택 */}
        <div className="filter-section">
          <div className="filter-header">
      <h3>기술 스택</h3>
            <button className="reset-btn" onClick={resetAll}>초기화</button>
          </div>
          <div className="tech-stack-container">
            <div className="tech-stack-left">
              <div className="tech-search">
                <input
                  type="text"
                  placeholder="기술 스택 검색"
                  value={techStackSearch}
                  onChange={(e) => setTechStackSearch(e.target.value)}
                  className="tech-search-input"
                />
                <span className="search-icon">🔍</span>
              </div>
              <div className="tech-grid">
                {filteredTechStacks.map(tech => (
                  <div
                    key={tech.value}
                    className={`tech-item ${filters.selectedTechStacks.includes(tech.value) ? 'selected' : ''}`}
                    onClick={() => handleTechStackToggle(tech.value)}
                  >
                    <img src={tech.icon} alt={tech.label} />
                  </div>
                ))}
              </div>
            </div>
            <div className="tech-stack-right">
              <div className="selected-tech">
                {filters.selectedTechStacks.map(tech => {
                  const techData = techStacksInit.find(t => t.value === tech);
                  return (
                    <div key={tech} className="selected-tech-item">
                      <img src={techData?.icon} alt={techData?.label} />
                      <button 
                        onClick={() => handleTechStackToggle(tech)}
                        className="remove-tech"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 위치 */}
        <div className="filter-section">
          <div className="filter-header">
      <h3>위치</h3>
            <button className="reset-btn" onClick={resetAll}>초기화</button>
          </div>
          <div className="location-container">
            <div className="location-list">
              {locationOptions.map(location => (
                <div key={location} className="location-item">
                  <label className="location-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.selectedLocations.includes(location)}
                      onChange={() => handleLocationToggle(location)}
                    />
                    <span className="location-name">{location}</span>
                  </label>
                  <span className="location-count">□ {Math.floor(Math.random() * 5) + 1}개</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 진행 방식 */}
        <div className="filter-section">
          <div className="filter-header">
            <h3>진행 방식</h3>
          </div>
          <div className="option-buttons">
            {methodOptions.map(option => (
              <button
                key={option}
                className={`option-btn ${filters.selectedMethod.includes(option) ? 'selected' : ''}`}
                onClick={() => handleOptionToggle(option, filters.selectedMethod, 'selectedMethod')}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* 프로젝트 진행 상황 */}
        <div className="filter-section">
          <div className="filter-header">
            <h3>프로젝트 진행 상황</h3>
            <button className="reset-btn" onClick={resetAll}>초기화</button>
          </div>
          <div className="option-buttons">
            {progressOptions.map(option => (
              <button
                key={option}
                className={`option-btn ${filters.selectedProgress.includes(option) ? 'selected' : ''}`}
                onClick={() => handleOptionToggle(option, filters.selectedProgress, 'selectedProgress')}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* 프로젝트 기간 */}
        <div className="filter-section">
          <div className="filter-header">
            <h3>프로젝트 기간</h3>
            <button className="reset-btn" onClick={resetAll}>초기화</button>
          </div>
          <div className="date-range">
            <input 
              type="date" 
              value={filters.projectStartDate}
              onChange={(e) => updateFilters({ projectStartDate: e.target.value })}
              className="date-input"
            />
            <span>~</span>
            <input 
              type="date" 
              value={filters.projectEndDate}
              onChange={(e) => updateFilters({ projectEndDate: e.target.value })}
              className="date-input"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBox;
