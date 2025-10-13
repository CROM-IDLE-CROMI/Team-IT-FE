import { useState, useEffect } from "react";
import { getDrafts, deleteDraft } from "../../utils/localStorageUtils";
import "./DraftList.css";

export interface Draft {
  id: string;
  title: string;
  savedAt: string;
  data: any;
}

interface DraftProps {
  onClose: () => void;
  onLoadDraft: (data: any) => void;
  onDelete?: () => void; // 삭제 후 콜백 추가
}

const DraftList = ({ onClose, onLoadDraft, onDelete }: DraftProps) => {
  const [drafts, setDrafts] = useState<Draft[]>([]);

  useEffect(() => {
    setDrafts(getDrafts());
  }, []);

  const handleDelete = (id: string) => {
    // TODO: 백엔드 API로 임시저장 삭제 요청
    // 예시: DELETE /api/drafts/:id
    console.log('임시저장 삭제 요청:', id);
    
    // const updatedDrafts = deleteDraft(id); // 백엔드 연동 후 활성화
    // setDrafts(updatedDrafts);
    
    // 삭제 후 콜백 호출
    if (onDelete) {
      onDelete();
    }
    
    alert('임시저장 삭제 기능은 백엔드 연동 후 사용 가능합니다.');
  };

  const handleLoad = (data: any) => {
    onLoadDraft(data);
    onClose();
  };

  return (
    <div className="draftPopupOverlay" onClick={onClose}>
      <div className="draftPopupContent" onClick={e => e.stopPropagation()}>
        <div className="draft-header">
          <h3>임시저장 목록</h3>
        </div>
        {drafts.length === 0 ? (
          <p>저장된 목록이 없습니다.</p>
        ) : (
          <ul>
            {drafts.map(draft => (
              <li key={draft.id} className="draft-item">
                <div className="draft-info">
                  <strong>{draft.title}</strong>
                  <span className="draft-date"> - {new Date(draft.savedAt).toLocaleString()}</span>
                </div>
                <div className="buttonGroup">
                  <button className="loadBtn" onClick={() => handleLoad(draft.data)}>불러오기</button>
                  <button className="deleteBtn" onClick={() => handleDelete(draft.id)}>삭제</button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="CloseButton">
          <button onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
};

export default DraftList;
