import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import SavePopup from "../../components/TemporarySave/SavePopup";
import DraftList from "../../components/TemporarySave/DraftList";
import { v4 as uuidv4 } from "uuid";
import { saveDraft, hasDrafts } from "../../utils/localStorageUtils";
import type { Draft } from "../../types/Draft";

interface StepData {
  [key: string]: any;
}

type ButtonProps = {
  formData: {
    basicInfo: StepData;
    projectInfo: StepData;
    situation: StepData;
    workEnviron: StepData;
    applicantInfo: StepData;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      basicInfo: StepData;
      projectInfo: StepData;
      situation: StepData;
      workEnviron: StepData;
      applicantInfo: StepData;
    }>
  >;
  currentStep: number;
  disabled: boolean;
  onLoadDraft: (data: any) => void;
};

const Button = ({ formData, currentStep, disabled, setFormData, onLoadDraft }: ButtonProps) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);

  const handleConfirmSave = (title: string) => {
    const draft: Draft = {
      id: uuidv4(),
      title,
      savedAt: new Date().toISOString(),
      data: formData,
    };
    saveDraft(draft);
    alert("임시저장 완료!");
    setIsListModalOpen(false);
    setIsModalOpen(false);
    navigate("/Teams");
  };

  return (
    <div className="formContainer_B">
      <div className="formGroup_B">
        {/* 임시저장 → 모달 열기 */}
        <button onClick={() => setIsModalOpen(true)}>임시저장</button>

        {/* 등록하기 버튼 */}
        <button
          onClick={() => navigate("/Regist")}
          className={`submitBtn ${disabled ? "disabled" : ""}`}
          disabled={disabled}
        >
          등록하기
        </button>

        {/* 임시저장이 있으면 DraftList 팝업 버튼 */}
        {hasDrafts() && (
          <button onClick={() => setIsListModalOpen(true)}>
            임시저장목록보기
          </button>
        )}
      </div>

      {/* 임시저장 모달 */}
      <SavePopup
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmSave}
      />

      {/* DraftList 팝업 */}
      {isListModalOpen && (
        <DraftList
          onClose={() => setIsListModalOpen(false)}
          onLoadDraft={(data) => {
            onLoadDraft(data); // TeamPage의 handleLoadDraft 함수 사용
            setIsListModalOpen(false); // 불러온 후 팝업 닫기
          }}
        />
      )}
    </div>
  );
};

export default Button;
