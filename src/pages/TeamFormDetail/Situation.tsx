import { useState, useEffect, useCallback } from 'react';
import type { StepData } from "../../types/Draft";
import "./Situation.css";

type OptionType = {
  value: string;
  label: string;
};

interface SituationProps {
  data: StepData;                 // 추가
  setData: (data: StepData) => void; // 추가
  onCompleteChange: (isComplete: boolean) => void;
}

const progressOptions: OptionType[] = [
  { value: '아이디어 구상 단계', label: '아이디어 구상 단계' },
  { value: '아이디어 기획 단계', label: '아이디어 기획 단계' },
  { value: '개발 진행 중', label: '개발 진행 중' },
  { value: '기타', label: '기타' },
];

const Situation = ({ data, setData, onCompleteChange }: SituationProps) => {
  const [title, setTitle] = useState('');
  const [progress, setProgress] = useState('');
  const [showCustomProgressInput, setShowCustomProgressInput] = useState(false);
  const [customProgress, setCustomProgress] = useState('');
  const [content, setContent] = useState('');
  const [otherText, setOtherText] = useState('');

  // data prop이 변경될 때 state 업데이트
  useEffect(() => {
    setTitle(data.title || '');
    setProgress(data.progress || '');
    setCustomProgress(data.customProgress || '');
    setContent(data.content || '');
    setOtherText(data.otherText || '');
    
    // progress가 '기타'이고 customProgress가 있으면 커스텀 입력 표시
    if (data.progress === '기타' && data.customProgress) {
      setShowCustomProgressInput(true);
    } else {
      setShowCustomProgressInput(false);
    }
  }, [data.title, data.progress, data.customProgress, data.content, data.otherText]);


  const handleProgressChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === '기타') {
      setShowCustomProgressInput(true);
      setCustomProgress('');
      setProgress('');
    } else {
      setProgress(value);
      setShowCustomProgressInput(false);
      setCustomProgress('');
    }
  };

  const handleCustomProgressSubmit = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Enter' && customProgress.trim() !== '') {
      setProgress(customProgress.trim());
      setShowCustomProgressInput(false);
      setCustomProgress('');
    }
  };

  // formData 동기화 (디바운싱 적용)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setData({
        title,
        progress,
        customProgress,
        content,
        otherText,
      });
    }, 300); // 300ms 디바운싱

    return () => clearTimeout(timeoutId);
  }, [title, progress, customProgress, content, otherText, setData]);

  // 완료 체크
  useEffect(() => {
    const isComplete =
      title.trim() !== '' &&
      progress.trim() !== '' &&
      content.trim() !== '';
    onCompleteChange(isComplete);
  }, [title, progress, content, onCompleteChange]);

  return (
    <div className="formContainer">
      <div className="formGroup">
        <label>제목</label>
        <input
          className='titleInput'
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="formGroup">
        <label>프로젝트 진행 상황</label>
        <select
          className='SituationInput'
          value={
            progressOptions.some((opt) => opt.value === progress)
              ? progress
              : progress
              ? progress
              : ''
          }
          onChange={handleProgressChange}
        >
          <option value="">선택</option>
          {progressOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
          {progress &&
            !progressOptions.some((opt) => opt.value === progress) && (
              <option value={progress}>{progress}</option>
            )}
        </select>

        {showCustomProgressInput && (
          <input
            type="text"
            placeholder="기타 진행 상황 입력 후 Enter"
            value={customProgress}
            onChange={(e) => setCustomProgress(e.target.value)}
            onKeyDown={handleCustomProgressSubmit}
            autoFocus
          />
        )}
      </div>

      <div className="formGroup formGroup_1">
        <label>모집글 본문</label>
        <textarea
          className="recruitTextarea"
          rows={5}
          placeholder="최대 500자"
          value={content}
          onChange={(e) => {
            if (e.target.value.length <= 500) {
              setContent(e.target.value);
            }
          }}
        />
      </div>
    </div>
  );
};

export default Situation;
