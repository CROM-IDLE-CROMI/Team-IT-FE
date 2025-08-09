import LocationSelector from "../LocationSelector";
import React, { useState, useEffect } from "react";
import "../../App.css";

interface WorkEnvironProps {
  onCompleteChange: (complete: boolean) => void;
}

const WorkEnviron: React.FC<WorkEnvironProps> = ({ onCompleteChange }) => {
  const [meetingType, setMeetingType] = useState("");
  const [showSelector, setShowSelector] = useState(false);
  const [locationComplete, setLocationComplete] = useState(false);

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
        <button onClick={() => setShowSelector((prev) => !prev)}>
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
