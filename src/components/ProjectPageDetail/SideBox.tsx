import React, { useState, useCallback } from "react";
import "./SideBox.css";
import { techStacksInit } from "../../styles/TechStack";
import LocationSelector from "../LocationSelector";
// MUI LocalizationProvider 제거 - 기본 HTML input[type="date"] 사용
// MUI DatePicker 제거 - 기본 HTML input[type="date"] 사용

interface FilterState {
  selectedActivity: string[];
  selectedPositions: string[];
  selectedTechStacks: string[];
  selectedLocations:{
    region: string;
    districts: string[];
  };
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
  const positionOptions = ["프론트", "백", "PM", "디자인", "기획", "기타"];
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



  const filteredTechStacks = techStacksInit.filter(tech => 
    tech.label.toLowerCase().includes(techStackSearch.toLowerCase())
  );

  const handleLocationSelect = useCallback((locations: string[]) => {
    // LocationSelector에서 받은 string[]을 객체로 변환
    const region = filters.selectedLocations.region || "서울특별시";
    
    // "전체" 선택인지 확인
    const isAllSelected = locations.includes(`${region} 전체`);
    
    let districts: string[] = [];
    if (isAllSelected) {
      // "전체" 선택 시 해당 지역의 모든 구를 districts에 포함
      const regionData: { [key: string]: string[] } = {
        서울특별시: ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'],
        부산광역시: ['중구', '서구', '동구', '영도구', '부산진구', '동래구', '남구', '북구', '해운대구', '사하구', '금정구', '강서구', '연제구', '수영구', '사상구', '기장군'],
        대구광역시: ['중구', '동구', '서구', '남구', '북구', '수성구', '달서구', '달성군'],
        인천광역시: ['중구', '동구', '미추홀구', '연수구', '남동구', '부평구', '계양구', '서구', '강화군', '옹진군'],
        광주광역시: ['동구', '서구', '남구', '북구', '광산구'],
        대전광역시: ['동구', '중구', '서구', '유성구', '대덕구'],
        울산광역시: ['중구', '남구', '동구', '북구', '울주군'],
        세종특별자치시: ['세종시'],
        경기도: ['수원시', '성남시', '고양시', '용인시', '화성시', '부천시', '안산시', '안양시', '남양주시', '평택시', '파주시', '김포시', '광명시', '오산시', '의정부시', '이천시', '안성시', '구리시', '군포시', '하남시', '양주시', '포천시'],
        강원도: ['춘천시', '원주시', '강릉시', '동해시', '태백시', '속초시', '삼척시', '홍천군', '횡성군', '영월군', '평창군', '정선군', '철원군', '화천군', '양구군', '인제군'],
        충청북도: ['청주시', '충주시', '제천시', '보은군', '옥천군', '영동군', '진천군', '괴산군', '음성군', '단양군'],
        충청남도: ['천안시', '공주시', '보령시', '아산시', '서산시', '논산시', '계룡시', '당진시', '금산군', '부여군', '서천군', '청양군', '홍성군', '예산군', '태안군'],
        전라북도: ['전주시', '군산시', '익산시', '정읍시', '남원시', '김제시', '완주군', '진안군', '무주군', '장수군', '임실군', '순창군', '고창군', '부안군'],
        전라남도: ['목포시', '여수시', '순천시', '나주시', '광양시', '담양군', '곡성군', '구례군', '고흥군', '보성군', '화순군', '장흥군', '강진군', '해남군', '영암군', '무안군', '신안군'],
        경상북도: ['포항시', '경주시', '김천시', '안동시', '구미시', '영주시', '영천시', '상주시', '문경시', '경산시', '군위군', '의성군', '청송군', '영양군', '영덕군', '청도군', '고령군', '성주군', '칠곡군'],
        경상남도: ['창원시', '진주시', '통영시', '사천시', '김해시', '양산시', '거제시', '밀양시', '함안군', '창녕군', '고성군', '남해군', '하동군', '산청군', '의령군', '함양군', '거창군', '합천군'],
        제주특별자치도: ['제주시', '서귀포시']
      };
      districts = regionData[region] || [];
    } else {
      // 개별 구 선택 시
      districts = locations.map(loc => {
        // "서울특별시 강남구" -> "강남구"로 변환
        return loc.replace(`${region} `, '');
      });
    }
    
    updateFilters({ 
      selectedLocations: {
        region: region,
        districts: districts
      }
    });
  }, [updateFilters, filters.selectedLocations.region]);

  const handleRegionSelect = useCallback((region: string) => {
    updateFilters({ 
      selectedLocations: {
        ...filters.selectedLocations,
        region: region,
        districts: [] // 지역이 바뀌면 구 선택 초기화
      }
    });
  }, [updateFilters, filters.selectedLocations]);

  const handleCompleteChange = useCallback(() => {
    // LocationSelector의 완료 상태는 필터링에 사용하지 않음
  }, []);

  // 날짜 변경 핸들러 (HTML input[type="date"]용)
  const handleRecruitEndDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    const date = dateValue ? new Date(dateValue) : null;
    setRecruitEndDate(date);
    updateFilters({ 
      recruitEndDate: dateValue 
    });
  }, [updateFilters]);

  const handleProjectStartDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    const date = dateValue ? new Date(dateValue) : null;
    setProjectStartDate(date);
    updateFilters({ 
      projectStartDate: dateValue 
    });
  }, [updateFilters]);

  const handleProjectEndDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    const date = dateValue ? new Date(dateValue) : null;
    setProjectEndDate(date);
    updateFilters({ 
      projectEndDate: dateValue 
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
            <input 
              type="date" 
              value={recruitEndDate ? recruitEndDate.toISOString().split('T')[0] : ''}
              onChange={handleRecruitEndDateChange}
              className="date-input"
            />
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
              selectedRegion={filters.selectedLocations.region || "서울특별시"}
              selectedLocations={filters.selectedLocations.districts.map(district => 
                `${filters.selectedLocations.region} ${district}`
              )}
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
            <div className="date-range">
              <input 
                type="date" 
                value={projectStartDate ? projectStartDate.toISOString().split('T')[0] : ''}
                onChange={handleProjectStartDateChange}
                className="date-input"
                placeholder="시작일"
              />
              <span className="date-separator">~</span>
              <input 
                type="date" 
                value={projectEndDate ? projectEndDate.toISOString().split('T')[0] : ''}
                onChange={handleProjectEndDateChange}
                className="date-input"
                placeholder="종료일"
                min={projectStartDate ? projectStartDate.toISOString().split('T')[0] : undefined}
              />
            </div>
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
