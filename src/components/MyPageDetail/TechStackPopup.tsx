import React, { useState, useEffect } from 'react';
import { techStacksInit } from '../../styles/TechStack';
import './TechStackPopup.css';

interface TechStack {
  id: string;
  name: string;
  level: '상' | '중' | '하';
}

interface TechStackPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (techStacks: TechStack[]) => void;
  currentTechStacks: TechStack[];
}

const TechStackPopup: React.FC<TechStackPopupProps> = ({
  isOpen,
  onClose,
  onSave,
  currentTechStacks
}) => {
  const [selectedStacks, setSelectedStacks] = useState<TechStack[]>(currentTechStacks || []);
  const [isSelecting, setIsSelecting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedStacks(currentTechStacks || []);
    }
  }, [isOpen, currentTechStacks]);

  const handleStackSelect = (stackValue: string, stackLabel: string) => {
    if (selectedStacks.length >= 3) {
      alert('최대 3개까지만 선택할 수 있습니다. 기존 스택을 삭제한 후 다시 시도해주세요.');
      return;
    }

    if (selectedStacks.some(stack => stack.id === stackValue)) {
      alert('이미 선택된 스택입니다.');
      return;
    }

    const newStack: TechStack = {
      id: stackValue,
      name: stackLabel,
      level: '중' // 기본값
    };

    setSelectedStacks(prev => [...prev, newStack]);
    setIsSelecting(false);
  };

  const handleLevelChange = (stackId: string, level: '상' | '중' | '하') => {
    setSelectedStacks(prev =>
      prev.map(stack =>
        stack.id === stackId ? { ...stack, level } : stack
      )
    );
  };

  const handleStackRemove = (stackId: string) => {
    setSelectedStacks(prev => prev.filter(stack => stack.id !== stackId));
  };

  const handleSave = () => {
    onSave(selectedStacks);
    onClose();
  };

  const handleCancel = () => {
    setSelectedStacks(currentTechStacks);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="tech-stack-popup-overlay">
      <div className="tech-stack-popup">
        <div className="popup-header">
          <h2>개발 스택 수정</h2>
          <button className="close-btn" onClick={handleCancel}>×</button>
        </div>

        <div className="popup-content">
          {/* 현재 선택된 스택들 */}
          <div className="selected-stacks-section">
            <h3>선택된 스택 ({selectedStacks.length}/3)</h3>
            <div className="selected-stacks">
              {selectedStacks.length === 0 ? (
                <p className="no-stacks">선택된 스택이 없습니다.</p>
              ) : (
                selectedStacks.map(stack => {
                  const techStack = techStacksInit.find(ts => ts.value === stack.id);
                  return (
                    <div key={stack.id} className="selected-stack-item">
                      <div className="stack-info">
                        {techStack && (
                          <img src={techStack.icon} alt={stack.name} className="stack-icon" />
                        )}
                        <span className="stack-name">{stack.name}</span>
                      </div>
                      <div className="stack-controls">
                        <select
                          value={stack.level}
                          onChange={(e) => handleLevelChange(stack.id, e.target.value as '상' | '중' | '하')}
                          className="level-select"
                        >
                          <option value="상">상</option>
                          <option value="중">중</option>
                          <option value="하">하</option>
                        </select>
                        <button
                          className="remove-btn"
                          onClick={() => handleStackRemove(stack.id)}
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* 스택 선택 버튼 */}
          <div className="add-stack-section">
            <button
              className="add-stack-btn"
              onClick={() => setIsSelecting(true)}
              disabled={selectedStacks.length >= 3}
            >
              + 스택 추가하기
            </button>
          </div>

          {/* 스택 선택 모달 */}
          {isSelecting && (
            <div className="stack-selection-modal">
              <div className="modal-header">
                <h3>스택 선택</h3>
                <button className="close-modal-btn" onClick={() => setIsSelecting(false)}>×</button>
              </div>
              <div className="stack-grid">
                {techStacksInit.map(stack => (
                  <button
                    key={stack.value}
                    className={`stack-option ${selectedStacks.some(s => s.id === stack.value) ? 'selected' : ''}`}
                    onClick={() => handleStackSelect(stack.value, stack.label)}
                    disabled={selectedStacks.some(s => s.id === stack.value)}
                  >
                    <img src={stack.icon} alt={stack.label} className="option-icon" />
                    <span>{stack.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="popup-footer">
          <button className="cancel-btn" onClick={handleCancel}>취소</button>
          <button className="save-btn" onClick={handleSave}>저장</button>
        </div>
      </div>
    </div>
  );
};

export default TechStackPopup;
