import React, { useState, useEffect, useCallback } from "react";
import type { StepData } from "../../types/Draft";
import "./ApplicantInfo.css";
import "../../TeamPageDetail.css";

interface ApplicantInfoProps {
  data: StepData;
  setData: (data: StepData) => void;
  onCompleteChange: (isComplete: boolean) => void;
}

const ApplicantInfo: React.FC<ApplicantInfoProps> = ({ data, setData, onCompleteChange }) => {
  const [questions, setQuestions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [minRequirement, setMinRequirement] = useState("");

  // data prop이 변경될 때 state 업데이트
  useEffect(() => {
    console.log('ApplicantInfo useEffect - data:', data); // 디버깅용
    
    setQuestions(data.questions || []);
    setMinRequirement(data.minRequirement || "");
  }, [data.questions, data.minRequirement]);

  // setData 함수를 메모이제이션
  const memoizedSetData = useCallback((newData: StepData) => {
    setData(newData);
  }, [setData]);

  // 상태가 바뀔 때 formData 동기화 (디바운싱 적용)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      memoizedSetData({
        questions,
        minRequirement,
      });
    }, 300); // 300ms 디바운싱

    return () => clearTimeout(timeoutId);
  }, [questions, minRequirement, memoizedSetData]);

  // 완료 체크
  useEffect(() => {
    const isComplete = minRequirement.trim() !== "" && questions.length > 0;
    onCompleteChange(isComplete);
  }, [minRequirement, questions, onCompleteChange]);

  const addQuestion = () => {
    if (questions.length >= 5 || inputValue.trim() === "") return;
    setQuestions([...questions, inputValue.trim()]);
    setInputValue("");
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  return (
    <div className="formContainer">
      <div className="formGroup formGroup_2">
        <label>지원자 최소 요건</label>
        <textarea
          className="recruitTextarea_1"
          rows={5}
          value={minRequirement}
          placeholder="(최대 500자)"
          onChange={(e) => {
            const value = e.target.value;
            if (value.length <= 500) setMinRequirement(value);
          }}
        />
      </div>

      <div className="formGroup">
        <label className="questionLabel">지원자에게 질문할 내용</label>
        <div className="questionInputContainer">
          <input
            type="text"
            value={inputValue}
            placeholder="질문을 입력하세요 (최대 5개)"
            onChange={(e) => setInputValue(e.target.value)}
            className="questionInput"
          />
          <button
            type="button"
            className="addButton"
            onClick={addQuestion}
            disabled={questions.length >= 5}
          >
            +
          </button>
        </div>
      </div>

      <div className="questionList">
        {questions.map((question, index) => (
          <div key={index} className="questionItem">
            <span>
              {index + 1}. {question}
            </span>
            <button
              type="button"
              className="removeButton"
              onClick={() => removeQuestion(index)}
            >
              -
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicantInfo;
