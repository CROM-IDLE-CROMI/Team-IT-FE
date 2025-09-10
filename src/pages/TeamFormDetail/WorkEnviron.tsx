import LocationSelector from "../../components/LocationSelector";
import React, { useState, useEffect, useCallback } from "react";
import "../../App.css";
import type { StepData } from "../../types/Draft";
import "./WorkEnviron.css";

interface WorkEnvironProps {
  data: StepData;
  setData: (data: StepData) => void;
  onCompleteChange: (complete: boolean) => void;
}

const WorkEnviron: React.FC<WorkEnvironProps> = ({ data, setData, onCompleteChange }) => {
  const [meetingType, setMeetingType] = useState(data.meetingType || "");
  const [showSelector, setShowSelector] = useState(false);
  const [locationComplete, setLocationComplete] = useState(!!data.locationComplete);

  // data prop이 변경될 때 state 업데이트 (실제 값이 변경되었을 때만)
  useEffect(() => {
    if (data.meetingType !== undefined) setMeetingType(data.meetingType || "");
    if (data.locationComplete !== undefined) setLocationComplete(!!data.locationComplete);
  }, [data.meetingType, data.locationComplete]);

  // setData 함수를 메모이제이션
  const memoizedSetData = useCallback((newData: StepData) => {
    setData(newData);
  }, [setData]);

  // 상태가 바뀔 때 formData 동기화 (디바운싱 적용)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      memoizedSetData({
        meetingType,
        locationComplete,
      });
    }, 300); // 300ms 디바운싱

    return () => clearTimeout(timeoutId);
  }, [meetingType, locationComplete, memoizedSetData]);

  // 완료 체크
  useEffect(() => {
    onCompleteChange(meetingType !== "" && locationComplete);
  }, [meetingType, locationComplete, onCompleteChange]);

  return (
    <div className="formContainer">
      <div className="formGroup">
        <label>회의 방식</label>
        <select
          value={meetingType}
          onChange={(e) => setMeetingType(e.target.value)}
        >
          <option value="">선택</option>
          <option value="온라인">온라인</option>
          <option value="오프라인">오프라인</option>
          <option value="온.오프라인">온.오프라인</option>
        </select>
      </div>

      <div className="formGroup locationWrapper">
        <label>위치</label>
        <button
          className="button_1"
          onClick={() => setShowSelector((prev) => !prev)}
        >
          {showSelector ? "숨기기" : "선택하기"}
        </button>

        {showSelector && (
          <div className="locationPopup">
            <LocationSelector onCompleteChange={setLocationComplete} />
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkEnviron;
