// import Select from 'react-select';
// import type { MultiValue, ActionMeta } from 'react-select';
import { useState, useEffect, useCallback } from 'react';
import '../../App.css';
import type { StepData } from "../../types/Draft";
import "./Situation.css";
import "../../TeamPageDetail.css";

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
  const [title, setTitle] = useState(data.title || '');
  const [progress, setProgress] = useState(data.progress || '');
  const [showCustomProgressInput, setShowCustomProgressInput] = useState(false);
  const [customProgress, setCustomProgress] = useState(data.customProgress || '');
  const [content, setContent] = useState(data.content || '');
  const [otherText, setOtherText] = useState(data.otherText || '');

  // data prop이 변경될 때 state 업데이트 (실제 값이 변경되었을 때만)
  useEffect(() => {
    if (data.title !== undefined) setTitle(data.title || '');
    if (data.progress !== undefined) setProgress(data.progress || '');
    if (data.customProgress !== undefined) setCustomProgress(data.customProgress || '');
    if (data.content !== undefined) setContent(data.content || '');
    if (data.otherText !== undefined) setOtherText(data.otherText || '');
  }, [data.title, data.progress, data.customProgress, data.content, data.otherText]);

  // const handleOtherTextChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
  //   const value = e.target.value;
  //   if (value.length <= 500) {
  //     setOtherText(value);
  //   }
  // };

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

  // setData 함수를 메모이제이션
  const memoizedSetData = useCallback((newData: StepData) => {
    setData(newData);
  }, [setData]);

  // formData 동기화 (디바운싱 적용)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      memoizedSetData({
        title,
        progress,
        customProgress,
        content,
        otherText,
      });
    }, 300); // 300ms 디바운싱

    return () => clearTimeout(timeoutId);
  }, [title, progress, customProgress, content, otherText, memoizedSetData]);

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
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="formGroup">
        <label>프로젝트 진행 상황</label>
        <select
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
