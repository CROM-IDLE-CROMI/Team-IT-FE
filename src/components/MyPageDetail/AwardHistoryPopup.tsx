import React, { useState } from 'react';
import './AwardHistoryPopup.css';

interface Award {
  id: string;
  competitionName: string;
  details: string;
  awardDate: string;
  websiteUrl?: string;
}

interface AwardHistoryPopupProps {
  isOpen: boolean;
  onClose: () => void;
  awards: Award[];
  onSave: (awards: Award[]) => void;
}

export default function AwardHistoryPopup({ isOpen, onClose, awards, onSave }: AwardHistoryPopupProps) {
  const [currentAwards, setCurrentAwards] = useState<Award[]>(awards);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAward, setNewAward] = useState<Partial<Award>>({
    competitionName: '',
    details: '',
    awardDate: '',
    websiteUrl: ''
  });

  const handleAddAward = () => {
    if (newAward.competitionName && newAward.details && newAward.awardDate) {
      const award: Award = {
        id: Date.now().toString(),
        competitionName: newAward.competitionName,
        details: newAward.details,
        awardDate: newAward.awardDate,
        websiteUrl: newAward.websiteUrl || ''
      };
      
      setCurrentAwards([...currentAwards, award]);
      setNewAward({
        competitionName: '',
        details: '',
        awardDate: '',
        websiteUrl: ''
      });
      setShowAddForm(false);
    } else {
      alert('필수 항목을 모두 입력해주세요.');
    }
  };

  const handleDeleteAward = (id: string) => {
    setCurrentAwards(currentAwards.filter(award => award.id !== id));
  };

  const handleSave = () => {
    onSave(currentAwards);
    onClose();
  };

  const handleCancel = () => {
    setCurrentAwards(awards);
    setShowAddForm(false);
    setNewAward({
      competitionName: '',
      details: '',
      awardDate: '',
      websiteUrl: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  return (
    <div className="award-popup-overlay" onClick={handleOverlayClick}>
      <div className="award-popup-container">
        {!showAddForm ? (
          // 기존 수상이력 목록
          <div className="award-list-panel">
            <div className="award-panel-header">
              <h2>나의 수상 이력</h2>
              <button className="close-btn" onClick={handleCancel}>×</button>
            </div>
            
            <div className="award-list">
              {currentAwards.length > 0 ? (
                currentAwards.map((award) => (
                  <div key={award.id} className="award-item">
                    <div className="award-info">
                      <div className="award-name">{award.competitionName}</div>
                      <div className="award-details">: {award.details}</div>
                    </div>
                    <div className="award-actions">
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteAward(award.id)}
                      >
                        🗑️
                      </button>
                      <div className="award-date">{award.awardDate}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-awards">
                  등록된 수상 이력이 없습니다.
                </div>
              )}
            </div>
            
            <button 
              className="add-award-btn"
              onClick={() => setShowAddForm(true)}
            >
              +
            </button>
          </div>
        ) : (
          // 새로운 수상이력 추가 폼
          <div className="award-form-panel">
            <div className="award-panel-header">
              <h2>나의 새로운 수상 이력</h2>
              <button className="close-btn" onClick={() => setShowAddForm(false)}>×</button>
            </div>
            
            <div className="award-form">
              <div className="form-group">
                <label>대회 이름 (필수)</label>
                <input
                  type="text"
                  value={newAward.competitionName || ''}
                  onChange={(e) => setNewAward({...newAward, competitionName: e.target.value})}
                  placeholder="대회 이름을 입력하세요"
                />
              </div>
              
              <div className="form-group">
                <label>상세 이력 및 수상 내역 (필수)</label>
                <input
                  type="text"
                  value={newAward.details || ''}
                  onChange={(e) => setNewAward({...newAward, details: e.target.value})}
                  placeholder="상세 이력 및 수상 내역을 입력하세요"
                />
              </div>
              
              <div className="form-group">
                <label>수상 날짜 (필수)</label>
                <div className="date-input-container">
                  <input
                    type="date"
                    value={newAward.awardDate || ''}
                    onChange={(e) => {
                      const date = e.target.value;
                      // YYYY-MM-DD 형식을 YYYY. MM. DD 형식으로 변환
                      const formattedDate = date ? date.split('-').join('. ') : '';
                      setNewAward({...newAward, awardDate: formattedDate});
                    }}
                    placeholder="YYYY. MM. DD"
                  />
                  <span className="calendar-icon">📅</span>
                </div>
              </div>
              
              <div className="form-group">
                <label>관련 사이트 URL (선택)</label>
                <input
                  type="url"
                  value={newAward.websiteUrl || ''}
                  onChange={(e) => setNewAward({...newAward, websiteUrl: e.target.value})}
                  placeholder="관련 사이트 URL을 입력하세요"
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button className="register-btn" onClick={handleAddAward}>
                등록하기
              </button>
            </div>
          </div>
        )}
        
        {!showAddForm && (
          <div className="popup-actions">
            <button className="save-btn" onClick={handleSave}>
              저장하기
            </button>
            <button className="cancel-btn" onClick={handleCancel}>
              취소
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
