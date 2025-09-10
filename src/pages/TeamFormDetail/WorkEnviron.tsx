import LocationSelector from "../../components/LocationSelector";
import React, { useState, useEffect, useCallback } from "react";
import "../../App.css";
import "./WorkEnviron.css";
import "../../TeamPageDetail.css";

interface WorkEnvironProps {
  data: any;
  setData: (data: any) => void;
  onCompleteChange: (complete: boolean) => void;
}

const WorkEnviron: React.FC<WorkEnvironProps> = ({ data, setData, onCompleteChange }) => {
  const [meetingType, setMeetingType] = useState(data.meetingType || "");
  const [locationComplete, setLocationComplete] = useState(!!data.locationComplete);
  const [selectedLocations, setSelectedLocations] = useState<string[]>(data.selectedLocations || []);
  const [selectedRegion, setSelectedRegion] = useState(data.selectedRegion || "서울특별시");
  const [showSelector, setShowSelector] = useState(false);

  // data 변경 시 상태 동기화
  useEffect(() => {
    setMeetingType(data.meetingType || "");
    setLocationComplete(!!data.locationComplete);
    setSelectedLocations(data.selectedLocations || []);
    setSelectedRegion(data.selectedRegion || "서울특별시");
  }, [data]);

  const memoizedSetData = useCallback(
    (newData: any) => setData(newData),
    [setData]
  );

  const handleMeetingTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMeetingType(e.target.value);
  };

  const handleLocationSelect = useCallback((locations: string[]) => {
    setSelectedLocations(locations);
  }, []);

  const handleRegionSelect = useCallback((region: string) => {
    setSelectedRegion(region);
  }, []);

  // 상태 변경 시 상위 데이터 업데이트 (디바운싱 적용)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      memoizedSetData({
        meetingType,
        locationComplete,
        selectedLocations,
        selectedRegion,
      });
    }, 100); // 100ms 디바운싱

    return () => clearTimeout(timeoutId);
  }, [meetingType, locationComplete, selectedLocations, selectedRegion, memoizedSetData]);

  // 완료 여부 체크
  useEffect(() => {
    onCompleteChange(meetingType !== "" && locationComplete);
  }, [meetingType, locationComplete, onCompleteChange]);

  const toggleSelector = () => setShowSelector((prev) => !prev);

  return (
    <div className="formContainer">
      <div className="formGroup">
        <label>회의 방식</label>
        <select value={meetingType} onChange={handleMeetingTypeChange}>
          <option value="">선택</option>
          <option value="온라인">온라인</option>
          <option value="오프라인">오프라인</option>
          <option value="온.오프라인">온.오프라인</option>
        </select>
      </div>

      <div className="formGroup locationWrapper">
        <label>위치</label>
        <button className="button_1" onClick={toggleSelector}>
          {showSelector ? "숨기기" : "선택하기"}
        </button>

        {showSelector && (
          <div className="locationPopup">
            <LocationSelector
              selectedRegion={selectedRegion}
              selectedLocations={selectedLocations}
              onRegionSelect={handleRegionSelect}
              onLocationSelect={handleLocationSelect}
              onCompleteChange={setLocationComplete}
            />
          </div>
        )}

        {/* 선택된 위치 박스 */}
        <div className="selectedLocations">
          <div className="locationDisplay">
            {selectedLocations.length > 0 ? (
              selectedLocations.map((location, index) => (
                <span key={index} className="locationTag">{location}</span>
              ))
            ) : (
              <span className="locationPlaceholder">선택된 위치가 없습니다.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkEnviron;
