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
}

const DraftList = ({ onClose, onLoadDraft }: DraftProps) => {
  const [drafts, setDrafts] = useState<Draft[]>([]);

  useEffect(() => {
    setDrafts(getDrafts());
  }, []);

  const handleDelete = (id: string) => {
    const updatedDrafts = deleteDraft(id);
    setDrafts(updatedDrafts);
  };

  const handleLoad = (data: any) => {
    onLoadDraft(data);
    onClose();
  };

  return (
    <div className="draftPopupOverlay" onClick={onClose}>
      <div className="draftPopupContent" onClick={e => e.stopPropagation()}>
        <h3>임시저장 목록</h3>
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
