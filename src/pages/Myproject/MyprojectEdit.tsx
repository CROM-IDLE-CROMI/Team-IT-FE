import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../App.css';

export default function MyprojectEdit() {
  // 각 입력 필드의 상태를 관리합니다.
  const [teamName, setTeamName] = useState('TEAM-IT'); // 기존 데이터로 초기화
  const [teamLogo, setTeamLogo] = useState<File | null>(null);
  const [progress, setProgress] = useState(25); // 기존 데이터로 초기화
  const nav = useNavigate();
  const { id } = useParams<{ id: string }>();

  // 파일 선택 시 호출될 함수
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTeamLogo(e.target.files[0]);
    }
  };

  // '저장' 버튼 클릭 시 호출될 함수
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault(); // 폼의 기본 제출 동작 방지
    // 여기에 수정된 내용을 서버로 전송하는 로직을 추가합니다.
    console.log({
      teamName,
      teamLogo: teamLogo?.name, // 실제로는 파일 객체를 전송해야 합니다.
      progress,
    });
    alert('저장되었습니다.');
  };

  // '취소' 버튼 클릭 시 호출될 함수
  const handleCancel = () => {
    // 이전 페이지로 이동하거나, 수정 전 상태로 되돌립니다.
    console.log('수정이 취소되었습니다.');
    nav(-1);
  };

  // '프로젝트 완료로 전환' 버튼 클릭 시 호출될 함수
  const handleCompleteProject = () => {
    // 프로젝트 상태를 '완료'로 변경하는 로직을 추가합니다.
    if (window.confirm('프로젝트를 완료 상태로 전환하시겠습니까?')) {
      console.log('프로젝트 완료 처리');
      alert('프로젝트가 완료 처리되었습니다.');
        nav('/MyprojectDetailfake');
      }
    }

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
            onChange={(e) => setTeamName(e.target.value)}
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
              style={{ display: 'none' }} // 실제 파일 input은 숨김
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
              onChange={(e) => setProgress(Number(e.target.value))}
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