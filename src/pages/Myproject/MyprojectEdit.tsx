import React, { useState } from 'react';
import { useNavigate, useBeforeUnload } from 'react-router-dom';
import '../../App.css';
import { usePrompt } from '../../hooks/usePrompt';

export default function MyprojectEdit() {
  const [teamName, setTeamName] = useState('TEAM-IT');
  const [teamLogo, setTeamLogo] = useState<File | null>(null);
  const [progress, setProgress] = useState(25);
  const [isDirty, setIsDirty] = useState(false); // 변경 여부 추적

  const nav = useNavigate();

  // 파일 선택 시
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTeamLogo(e.target.files[0]);
      setIsDirty(true);
    }
  };

  // 저장 버튼
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      teamName,
      teamLogo: teamLogo?.name,
      progress,
    });
    alert('저장되었습니다.');
    setIsDirty(false); // 저장 후 초기화
  };

  // 취소 버튼
  const handleCancel = () => {
    if (isDirty) {
      const confirmLeave = window.confirm(
        '변경 사항이 저장되지 않았습니다. 페이지를 떠나시겠습니까?'
      );
      if (!confirmLeave) return;
    }
    nav(-1);
  };

  // 프로젝트 완료 버튼
  const handleCompleteProject = () => {
    if (window.confirm('프로젝트를 완료 상태로 전환하시겠습니까?')) {
      console.log('프로젝트 완료 처리');
      alert('프로젝트가 완료 처리되었습니다.');
    }
  };

  // 입력 변경 시 isDirty = true
  const handleChangeTeamName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeamName(e.target.value);
    setIsDirty(true);
  };

  const handleChangeProgress = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProgress(Number(e.target.value));
    setIsDirty(true);
  };

  // 브라우저 닫기/새로고침 경고
  useBeforeUnload((e: BeforeUnloadEvent) => {
    if (isDirty) {
      e.preventDefault();
      e.returnValue = '';
    }
  });

  // 라우터 이동 경고
  usePrompt('변경 사항이 저장되지 않았습니다. 페이지를 떠나시겠습니까?', isDirty);

  return (
    <div className="edit-container">
      <div className="completion-button-wrapper">
        <button onClick={handleCompleteProject} className="complete-btn">
          프로젝트 완료로 전환
        </button>
      </div>

      <form className="edit-form" onSubmit={handleSave}>
        <div className="form-group">
          <label htmlFor="teamName">팀 이름</label>
          <input
            type="text"
            id="teamName"
            value={teamName}
            onChange={handleChangeTeamName}
          />
        </div>

        <div className="form-group">
          <label htmlFor="teamLogo">팀 로고</label>
          <div className="file-input-wrapper">
            <input
              type="text"
              readOnly
              value={teamLogo ? teamLogo.name : 'TEAMIT_로고.jpg'}
              placeholder="파일을 선택하세요"
            />
            <input
              type="file"
              id="teamLogo"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <button
              type="button"
              onClick={() => document.getElementById('teamLogo')?.click()}
              className="find-btn"
            >
              찾아보기
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="progress">프로젝트 진행률</label>
          <div className="progress-input-wrapper">
            <input
              type="number"
              id="progress"
              value={progress}
              onChange={handleChangeProgress}
              min="0"
              max="100"
            />
            <span>%</span>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="save-btn">저장</button>
          <button type="button" onClick={handleCancel} className="cancel-btn">취소</button>
        </div>
      </form>
    </div>
  );
}
