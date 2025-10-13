import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Button.css";
import SavePopup from "../../components/TemporarySave/SavePopup";
import DraftList from "../../components/TemporarySave/DraftList";
import { v4 as uuidv4 } from "uuid";
import { saveDraft, hasDrafts } from "../../utils/localStorageUtils";
import type { Draft } from "../../types/Draft";
import { convertTeamDataToProject, validateTeamData, saveProjectToStorage } from "../../utils/teamToProjectConverter";

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
  const [hasDraftsState, setHasDraftsState] = useState(false);

  // hasDrafts() 결과를 상태로 관리하여 무한렌더링 방지
  useEffect(() => {
    setHasDraftsState(hasDrafts());
  }, []);

  const handleConfirmSave = (title: string) => {
    try {
      // TODO: 백엔드 API로 임시저장 요청
      // 예시: POST /api/drafts
      const draft: Draft = {
        id: uuidv4(),
        title,
        savedAt: new Date().toISOString(),
        data: formData,
      };
      console.log('임시저장 요청:', draft);
      
      // saveDraft(draft); // 백엔드 연동 후 활성화
      // setHasDraftsState(true); // 백엔드 연동 후 활성화
      
      alert(`"${title}" 임시저장 기능은 백엔드 연동 후 사용 가능합니다.`);
      setIsListModalOpen(false);
      setIsModalOpen(false);
    } catch (error) {
      console.error('임시저장 중 오류 발생:', error);
      alert('임시저장 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // 팀원 모집 등록 처리
  const handleTeamRegistration = () => {
    try {
      // 데이터 유효성 검사
      if (!validateTeamData(formData)) {
        alert('모든 필수 정보를 입력해주세요.');
        return;
      }

      // TODO: 백엔드 API로 팀원 모집 등록 요청
      // 예시: POST /api/team-recruit
      const project = convertTeamDataToProject(formData);
      console.log('팀원 모집 등록 데이터:', project);
      
      // saveProjectToStorage(project); // 백엔드 연동 후 활성화
      
      alert('팀원 모집 등록 기능은 백엔드 연동 후 사용 가능합니다.');
      
      // 백엔드 연동 후 활성화
      // navigate('/Projects');
    } catch (error) {
      console.error('팀원 모집 등록 중 오류 발생:', error);
      alert('팀원 모집 등록 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // 임시저장 목록 새로고침 함수
  const refreshDrafts = () => {
    setHasDraftsState(hasDrafts());
  };

  return (
    <div className="formContainer_B">
      <div className="formGroup_B">
        {/* 임시저장 → 모달 열기 */}
        <button onClick={() => setIsModalOpen(true)}>임시저장</button>

        {/* 등록하기 버튼 */}
        <button
          onClick={handleTeamRegistration}
          className={`submitBtn ${disabled ? "disabled" : ""}`}
          disabled={disabled}
        >
          등록하기
        </button>

        {/* 임시저장이 있으면 DraftList 팝업 버튼 */}
        {hasDraftsState && (
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
          onDelete={() => {
            // 삭제 후 hasDraftsState 업데이트
            refreshDrafts();
          }}
        />
      )}
    </div>
  );
};

export default Button;
