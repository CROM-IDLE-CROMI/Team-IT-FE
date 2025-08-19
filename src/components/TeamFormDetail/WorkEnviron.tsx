import LocationSelector from "../LocationSelector";
import React, { useState, useEffect } from "react";
import "../../App.css";
import type { StepData } from "../../types/Draft";

interface WorkEnvironProps {
  data: StepData;
  setData: (data: StepData) => void;
  onCompleteChange: (complete: boolean) => void;
}

const WorkEnviron: React.FC<WorkEnvironProps> = ({ data, setData, onCompleteChange }) => {
  const [meetingType, setMeetingType] = useState(data.meetingType || "");
  const [showSelector, setShowSelector] = useState(false);
  const [locationComplete, setLocationComplete] = useState(!!data.locationComplete);

  // 상태가 바뀔 때 formData 동기화
  useEffect(() => {
    setData({
      meetingType,
      locationComplete,
    });
  }, [meetingType, locationComplete]);

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
