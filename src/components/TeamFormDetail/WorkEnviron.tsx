import LocationSelector from "../LocationSelector";
import React, { useState } from "react";
import "../../App.css";

const WorkEnviron = () => {
  const [showSelector, setShowSelector] = useState(false);

  const toggleSelector = () => {
    setShowSelector(prev => !prev);
  };

  return (
    <div className="formContainer">
      <div className="formGroup">
        <label>회의 방식:</label>
        <select>
          <option>선택</option>
          <option>온라인</option>
          <option>오프라인</option>
          <option>온.오프라인</option>
        </select>
      </div>

      <div className="formGroup locationWrapper"> {/* 상대 위치 기준 */}
        <label>위치:</label>
        <button onClick={toggleSelector}>
          {showSelector ? "숨기기" : "선택하기"}
        </button>

        {showSelector && (
          <div className="locationPopup">
            <LocationSelector />
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkEnviron;
