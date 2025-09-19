import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";
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
      const draft: Draft = {
        id: uuidv4(),
        title,
        savedAt: new Date().toISOString(),
        data: formData,
      };
      saveDraft(draft);
      setHasDraftsState(true); // 임시저장 후 상태 업데이트
      alert(`"${title}" 임시저장이 완료되었습니다!`);
      setIsListModalOpen(false);
      setIsModalOpen(false);
      // 페이지 이동 제거 - 현재 페이지에 머물도록 수정
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

      // 팀원 모집 데이터를 프로젝트 형식으로 변환
      const project = convertTeamDataToProject(formData);
      
      // 프로젝트를 localStorage에 저장
      saveProjectToStorage(project);
      
      alert('팀원 모집이 성공적으로 등록되었습니다! 프로젝트 찾기에서 확인할 수 있습니다.');
      
      // 프로젝트 찾기 페이지로 이동
      navigate('/Projects');
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
