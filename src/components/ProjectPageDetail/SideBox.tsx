import React, { useState, useCallback } from "react";
import "./SideBox.css";
import { techStacksInit } from "../../styles/TechStack";
import LocationSelector from "../LocationSelector";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Box } from "@mui/material";

interface FilterState {
  selectedActivity: string[];
  selectedPositions: string[];
  selectedTechStacks: string[];
  selectedLocations: string[];
  selectedRegion: string;
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
  onFiltersChange: (filters: FilterState | ((prev: FilterState) => FilterState)) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

const SideBox: React.FC<SideBoxProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onApplyFilters,
  onResetFilters
}) => {
  const [techStackSearch, setTechStackSearch] = useState<string>("");
  const [recruitEndDate, setRecruitEndDate] = useState<Date | null>(
    filters.recruitEndDate ? new Date(filters.recruitEndDate) : null
  );
  const [projectStartDate, setProjectStartDate] = useState<Date | null>(
    filters.projectStartDate ? new Date(filters.projectStartDate) : null
  );
  const [projectEndDate, setProjectEndDate] = useState<Date | null>(
    filters.projectEndDate ? new Date(filters.projectEndDate) : null
  );

  const activityOptions = ["앱", "웹", "게임", "기타"];
  const positionOptions = ["프론트", "백", "PM", "디자인", "기획","기타"];
  const progressOptions = ["아이디어 구상 중", "아이디어 기획 중", "개발 진행 중"];
  const methodOptions = ["온라인", "오프라인", "온/오프라인"];

  /* 필터 업데이트 함수 */
  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    onFiltersChange((prevFilters: FilterState) => ({ ...prevFilters, ...newFilters }));
  }, [onFiltersChange]);

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
      selectedRegion: "서울특별시",
      selectedProgress: [],
      selectedMethod: [],
      recruitEndDate: "",
      projectStartDate: "",
      projectEndDate: ""
    });
    setTechStackSearch("");
    setRecruitEndDate(null);
    setProjectStartDate(null);
    setProjectEndDate(null);
  };

  const filteredTechStacks = techStacksInit.filter(tech => 
    tech.label.toLowerCase().includes(techStackSearch.toLowerCase())
  );

  const handleLocationSelect = useCallback((locations: string[]) => {
    updateFilters({ selectedLocations: locations });
  }, [updateFilters]);

  const handleRegionSelect = useCallback((region: string) => {
    updateFilters({ selectedRegion: region });
  }, [updateFilters]);

  const handleCompleteChange = useCallback(() => {
    // LocationSelector의 완료 상태는 필터링에 사용하지 않음
  }, []);

  // 날짜 변경 핸들러
  const handleRecruitEndDateChange = useCallback((date: Date | null) => {
    setRecruitEndDate(date);
    updateFilters({ 
      recruitEndDate: date ? date.toISOString().split('T')[0] : '' 
    });
  }, [updateFilters]);

  const handleProjectStartDateChange = useCallback((date: Date | null) => {
    setProjectStartDate(date);
    updateFilters({ 
      projectStartDate: date ? date.toISOString().split('T')[0] : '' 
    });
  }, [updateFilters]);

  const handleProjectEndDateChange = useCallback((date: Date | null) => {
    setProjectEndDate(date);
    updateFilters({ 
      projectEndDate: date ? date.toISOString().split('T')[0] : '' 
    });
  }, [updateFilters]);

  return (
    <div className={`side-box ${isOpen ? "open" : ""}`}>
      <button className="close-btn" onClick={onClose}>✕</button>

      <div className="side-box-content">
        <div className="filter-container">
          {/* 플랫폼 */}
          <div className="filter-section">
            <div className="filter-header"><h3>플랫폼</h3></div>
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
            <div className="filter-header"><h3>모집 직군</h3></div>
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
            <div className="filter-header"><h3>프로젝트 모집 종료 기한</h3></div>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                value={recruitEndDate}
                onChange={handleRecruitEndDateChange}
                format="yyyy/MM/dd"
                slotProps={{
                  textField: {
                    size: "small",
                    sx: { 
                      width: "100%",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        fontSize: "0.9rem"
                      }
                    }
                  }
                }}
              />
            </LocalizationProvider>
          </div>

          {/* 기술 스택 */}
          <div className="filter-section">
            <div className="filter-header">
              <h3>기술 스택</h3>
            </div>
            <div className="tech-search">
              <input
                type="text"
                placeholder="기술 스택 검색"
                value={techStackSearch}
                onChange={(e) => setTechStackSearch(e.target.value)}
                className="tech-search-input"
              />
            </div>
            <div className="tech-grid">
              {filteredTechStacks.map(tech => (
                <div
                  key={tech.value}
                  className={`tech-item ${filters.selectedTechStacks.includes(tech.value) ? 'selected' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleTechStackToggle(tech.value);
                  }}
                >
                  <img 
                    src={tech.icon} 
                    alt={tech.label}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                  <span style={{ fontSize: '10px', marginTop: '2px' }}>{tech.label}</span>
                </div>
              ))}
            </div>

            {/* 선택된 기술 스택 */}
            {filters.selectedTechStacks.length > 0 && (
              <div className="selected-tech-section">
                <h4>선택된 기술 스택</h4>
                <div className="selected-tech-list">
                  {filters.selectedTechStacks.map(tech => {
                    const techData = techStacksInit.find(t => t.value === tech);
                    return (
                      <div key={tech} className="selected-tech-item">
                        <img src={techData?.icon} alt={techData?.label} />
                        <span>{techData?.label}</span>
                        <button onClick={() => handleTechStackToggle(tech)} className="remove-tech">×</button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 위치 */}
          <div className="filter-section">
            <div className="filter-header">
              <h3>위치</h3>
            </div>
            <LocationSelector
              onCompleteChange={handleCompleteChange}
              onLocationSelect={handleLocationSelect}
              onRegionSelect={handleRegionSelect}
              selectedRegion={filters.selectedRegion || "서울특별시"}
              selectedLocations={filters.selectedLocations}
            />
          </div>

          {/* 진행 방식 */}
          <div className="filter-section">
            <div className="filter-header"><h3>진행 방식</h3></div>
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
            </div>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box
  className="date-range"
  sx={{
    display: "flex",
    alignItems: "center",
    gap: 2,
    width: "100%",
    p: 1,
    border: "1px solid #e5e5e5",
    borderRadius: "10px",
    backgroundColor: "#fff",
  }}
>
  <DatePicker
    label="시작일"
    value={projectStartDate}
    onChange={handleProjectStartDateChange}
    format="yyyy/MM/dd"
    slotProps={{
      textField: {
        size: "small",
        sx: {
          flex: 1,
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            fontSize: "0.9rem",
            backgroundColor: "#fafafa",
            "& fieldset": {
              borderColor: "#ddd",
            },
            "&:hover fieldset": {
              borderColor: "#aaa",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#000",
              borderWidth: "1.5px",
            },
          },
        },
      },
    }}
  />
  <Box sx={{ fontSize: "1.2rem", color: "#888", mx: 1 }}>~</Box>
  <DatePicker
    label="종료일"
    value={projectEndDate}
    onChange={handleProjectEndDateChange}
    format="yyyy/MM/dd"
    minDate={projectStartDate ?? undefined}
    slotProps={{
      textField: {
        size: "small",
        sx: {
          flex: 1,
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            fontSize: "0.9rem",
            backgroundColor: "#fafafa",
            "& fieldset": {
              borderColor: "#ddd",
            },
            "&:hover fieldset": {
              borderColor: "#aaa",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#000",
              borderWidth: "1.5px",
            },
          },
        },
      },
    }}
  />
</Box>

            </LocalizationProvider>
          </div>

        </div>

        {/* 적용하기 및 초기화 버튼 */}
        <div className="button-container">
          <button className="reset-filters-btn" onClick={onResetFilters}>초기화</button>
          <button className="apply-filters-btn" onClick={onApplyFilters}>적용하기</button>
        </div>
      </div>
    </div>
  );
};

export default SideBox;
