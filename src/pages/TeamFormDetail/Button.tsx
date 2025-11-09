import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Button.css";
import SavePopup from "../../components/TemporarySave/SavePopup";
import DraftList from "../../components/TemporarySave/DraftList";
import { v4 as uuidv4 } from "uuid";
import { saveDraft, hasDrafts } from "../../utils/localStorageUtils";
import type { Draft } from "../../types/Draft";
import { convertTeamDataToProject, validateTeamData } from "../../utils/teamToProjectConverter";
import { teamRecruitService } from "../../services/teamRecruitService";

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
      console.log('임시저장 요청:', draft);
      
      // 로컬스토리지에 저장
      saveDraft(draft);
      setHasDraftsState(true);
      
      alert(`"${title}" 임시저장이 완료되었습니다! ✅`);
      setIsListModalOpen(false);
      setIsModalOpen(false);
    } catch (error) {
      console.error('임시저장 중 오류 발생:', error);
      alert('임시저장 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // 팀원 모집 등록 처리
  const handleTeamRegistration = async () => {
    try {
      // 1️⃣ 데이터 유효성 검사
      if (!validateTeamData(formData)) {
        alert('모든 필수 정보를 입력해주세요.');
        return;
      }

      // 2️⃣ 프론트엔드 데이터를 백엔드 형식으로 변환
      const requestData = convertTeamDataToProject(formData);
      
      // 3️⃣ 팀원 모집 서비스를 통해 등록 (서비스가 모든 API 처리)
      const response = await teamRecruitService.create(requestData);
      
      // 4️⃣ 응답 확인 및 성공 처리
      if (response.code === 0 && response.data) {
        alert(response.message || '팀원 모집이 성공적으로 등록되었습니다! 🎉');
        
        // 5️⃣ 프로젝트 목록 페이지로 이동
        navigate('/Projects');
      } else {
        // 응답 코드가 0이 아닌 경우
        alert(response.message || '팀원 모집 등록 중 오류가 발생했습니다.');
      }
      
    } catch (error: any) {
      // 6️⃣ 에러 처리
      console.error('팀원 모집 등록 오류:', error);
      const errorMessage = error.message || '팀원 모집 등록 중 오류가 발생했습니다.';
      alert(errorMessage);
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
