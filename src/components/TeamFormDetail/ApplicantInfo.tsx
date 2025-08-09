import React, { useState } from "react";

const ApplicantInfo = () => {
  const [questions, setQuestions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const addQuestion = () => {
    if (!inputValue.trim()) return;
    setQuestions([...questions, inputValue.trim()]);
    setInputValue("");
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  return (
    <div className="formContainer">
      <div className="formGroup formGroup_1">
        <label>지원자 최소 요건:</label>
        <textarea className="recruitTextarea" rows={5} placeholder="" />
      </div>

      <div className="formGroup">
        <label className="questionLabel">지원자에게 질문할 내용:</label>
        <div className="questionInputContainer">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="questionInput"
          />
          <button type="button" className="addButton" onClick={addQuestion}>
            +
          </button>
        </div>
      </div>

      <div className="questionList">
        {questions.map((question, index) => (
          <div key={index} className="questionItem">
            <span>{index + 1}. {question}</span>
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
