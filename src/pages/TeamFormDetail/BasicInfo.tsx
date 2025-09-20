import { useEffect, useState, useCallback } from 'react';
import Select from 'react-select';
import type { MultiValue } from 'react-select';
import type { TechStackType } from '../../styles/TechStack';
import { techStacksInit } from '../../styles/TechStack';
import './BasicInfo.css';
import '../../App.css';
import '../../TeamPageDetail.css';
import TechStackList from '../../components/TechStackList';
import type { StepData } from "../../types/Draft";
import type { Dispatch, SetStateAction } from "react";
// MUI DatePicker 제거 - 기본 HTML input[type="date"] 사용

type OptionType = { value: string; label: string };

type BasicFormProps = {
  data: StepData; 
  setData: (data: StepData) => void;
  onCompleteChange: (complete: boolean) => void;
};

// 직군/플랫폼 초기 옵션
const jobOptionsInit: OptionType[] = [
  { value: '프론트엔드', label: '프론트엔드' },
  { value: '백엔드', label: '백엔드' },
  { value: '디자이너', label: '디자이너' },
  { value: '기획자', label: '기획자' },
  { value: 'PM', label: 'PM' },
  { value: '기타', label: '기타' },
];
const platformOptionsInit: OptionType[] = [
  { value: '웹', label: '웹' },
  { value: '앱', label: '앱' },
  { value: '게임', label: '게임' },
  { value: '기타', label: '기타' },
];

// 날짜 선택 컴포넌트
type DateProps = {
  startDate: Date | null;
  endDate: Date | null;
  setStartDate: Dispatch<SetStateAction<Date | null>>;
  setEndDate: Dispatch<SetStateAction<Date | null>>;
};

const DateRangePicker = ({ startDate, endDate, setStartDate, setEndDate }: DateProps) => {
  const today = new Date().toISOString().split('T')[0];

  const getMaxEndDate = (start: Date) => {
    const date = new Date(start);
    date.setMonth(date.getMonth() + 2);
    return date.toISOString().split('T')[0];
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    const date = dateValue ? new Date(dateValue) : null;
    setStartDate(date);
    setEndDate(null); // 시작일이 변경되면 종료일 초기화
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    const date = dateValue ? new Date(dateValue) : null;
    setEndDate(date);
  };

  return (
    <div className="formGroup">
      <label>모집 기간</label>
      <div className="dateRange">
        <input
          type="date"
          value={startDate ? startDate.toISOString().split('T')[0] : ''}
          min={today}
          onChange={handleStartDateChange}
          className="date-input"
        />
        <span className="date-separator">~</span>
        <input
          type="date"
          value={endDate ? endDate.toISOString().split('T')[0] : ''}
          min={startDate ? startDate.toISOString().split('T')[0] : today}
          max={startDate ? getMaxEndDate(startDate) : undefined}
          onChange={handleEndDateChange}
          disabled={!startDate}
          className="date-input"
        />
      </div>
    </div>
  );
};

// Main BasicForm
const BasicForm = ({ data, setData, onCompleteChange }: BasicFormProps) => {
  // state
  const [peopleCount, setPeopleCount] = useState(data.peopleCount || '');
  const [startDate, setStartDate] = useState<Date | null>(data.startDate ? new Date(data.startDate) : null);
  const [endDate, setEndDate] = useState<Date | null>(data.endDate ? new Date(data.endDate) : null);
  const [platform, setPlatform] = useState(data.platform || '');
  const [customPlatform, setCustomPlatform] = useState(data.customPlatform || '');
  const [showCustomPlatformInput, setShowCustomPlatformInput] = useState(false);
  const [selectedJobs, setSelectedJobs] = useState<MultiValue<OptionType>>(data.selectedJobs || []);
  const [customJob, setCustomJob] = useState(data.customJob || '');
  const [selectedTechStacks, setSelectedTechStacks] = useState<TechStackType[]>(data.selectedTechStacks || []);
  const [isStackOpen, setIsStackOpen] = useState(false);

  // setData 디바운스
  const memoizedSetData = useCallback((newData: StepData) => setData(newData), [setData]);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      memoizedSetData({
        ...data,
        startDate: startDate?.toISOString() || '',
        endDate: endDate?.toISOString() || '',
        peopleCount,
        platform,
        customPlatform,
        selectedJobs,
        customJob,
        selectedTechStacks,
      });
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [startDate, endDate, peopleCount, platform, customPlatform, selectedJobs, customJob, selectedTechStacks, memoizedSetData, data]);

  // 완료 체크
  useEffect(() => {
    const isComplete =
      peopleCount.trim() !== '' &&
      startDate !== null &&
      endDate !== null &&
      platform.trim() !== '' &&
      selectedJobs.length > 0 &&
      !selectedJobs.some(opt => opt.value === '기타' && customJob.trim() === '') &&
      selectedTechStacks.length > 0;

    onCompleteChange(isComplete);
  }, [peopleCount, startDate, endDate, platform, selectedJobs, customJob, selectedTechStacks, onCompleteChange]);

  return (
    <div className="formContainer">
      <div className="formGroup">
        <label>모집 인원</label>
        <input
          type="text"
          placeholder="최대 20명"
          value={peopleCount}
          onChange={e => {
            const value = e.target.value;
            if (/^\d*$/.test(value) && (value === '' || (Number(value) <= 20 && Number(value) > 0))) {
              setPeopleCount(value);
            }
          }}
        />
      </div>

      {/* 날짜 선택 */}
      <DateRangePicker startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} />

      {/* 플랫폼 선택 */}
      <div className="formGroup">
        <label>플랫폼</label>
        <select
          value={platformOptionsInit.some(opt => opt.value === platform) ? platform : platform ? platform : ''}
          onChange={e => {
            const value = e.target.value;
            if (value === '기타') {
              setShowCustomPlatformInput(true);
              setCustomPlatform('');
              setPlatform('');
            } else {
              setPlatform(value);
              setShowCustomPlatformInput(false);
              setCustomPlatform('');
            }
          }}
        >
          <option value="">선택</option>
          {platformOptionsInit.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          {platform && !platformOptionsInit.some(opt => opt.value === platform) && <option value={platform}>{platform}</option>}
        </select>
        {showCustomPlatformInput && (
          <input
            type="text"
            placeholder="기타 플랫폼 입력 후 Enter"
            value={customPlatform}
            onChange={e => setCustomPlatform(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && customPlatform.trim() !== '') {
                setPlatform(customPlatform.trim());
                setShowCustomPlatformInput(false);
                setCustomPlatform('');
              }
            }}
            autoFocus
          />
        )}
      </div>

      {/* 모집자 직군 */}
      <div className="formGroup">
        <label>지원자 직군</label>
        <Select
          isMulti
          options={jobOptionsInit}
          value={selectedJobs}
          onChange={selected => {
            setSelectedJobs(selected);
            if (!selected.some(opt => opt.value === '기타')) setCustomJob('');
          }}
          placeholder="직군을 선택하세요"
          classNamePrefix="select"
          menuPortalTarget={document.body}
          menuPosition="fixed"
          styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
        />
        {selectedJobs.some(opt => opt.value === '기타') && (
          <input
            type="text"
            placeholder="기타 직군 입력 후 Enter"
            value={customJob}
            onChange={e => setCustomJob(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                setSelectedJobs(prev =>
                  prev.map(opt => opt.value === '기타' ? { value: customJob, label: customJob } : opt)
                );
                setCustomJob('');
              }
            }}
            autoFocus
          />
        )}
      </div>

      {/* 기술 스택 */}
      <div className="formGroup_3">
        <label>기술 스택</label>
        <button type="button" className="selectStackBtn" onClick={() => setIsStackOpen(prev => !prev)}>
          {isStackOpen ? "닫기" : "보기"}
        </button>
        {isStackOpen && (
          <TechStackList
            techStacksInit={techStacksInit}
            selectedTechStacks={selectedTechStacks}
            toggleTechStack={stack => {
              setSelectedTechStacks(prev => prev.some(item => item.value === stack.value)
                ? prev.filter(item => item.value !== stack.value)
                : [...prev, stack]);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default BasicForm;
