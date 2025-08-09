import Select from 'react-select';
import type { MultiValue, ActionMeta } from 'react-select';
import { useState } from 'react';

type OptionType = {
  value: string;
  label: string;
};

const progressOptions: OptionType[] = [
  { value: '아이디어 구상 단계', label: '아이디어 구상 단계' },
  { value: '아이디어 기획 단계', label: '아이디어 기획 단계' },
  { value: '계발 진행 중', label: '계발 진행 중' },
  { value: '기타', label: '기타' },
];



const Situation = () =>{

  const [Progress, setProgress] = useState('');
  const [showCustomProgressInput, setShowCustomProgressInput] = useState(false);
  const [customProgress, setCustomProgress] = useState('');

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

    return (
<div className="formContainer">
      <div className="formGroup">
        <label>제목</label>
        <input type="text" />
      </div>
      
      <div className="formGroup">
        <label>프로젝트 진행 상황</label>
        <select
          value={
            progressOptions.some((opt) => opt.value === Progress)
              ? Progress
              : Progress
              ? Progress
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
          {Progress &&
            !progressOptions.some((opt) => opt.value === Progress) && (
              <option value={Progress}>{Progress}</option>
            )}
        </select>

        {showCustomProgressInput && (
          <input
            type="text"
            placeholder="기타 활동 종류 입력 후 Enter"
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
          placeholder=""
          />
      </div>

</div>
    );

};

export default Situation;