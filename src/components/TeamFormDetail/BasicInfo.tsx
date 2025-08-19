import { useEffect, useState } from 'react';
import Select from 'react-select';
import type { MultiValue, ActionMeta } from 'react-select';
import type { TechStackType } from '../../styles/TechStack';
import { techStacksInit } from '../../styles/TechStack';
import '../../App.css';
import TechStackList from '../TechStackList';
import type { StepData } from "../../types/Draft";
import type { Dispatch, SetStateAction } from "react";

type OptionType = { value: string; label: string };

type BasicFormProps = {
  data: StepData; // 추가
  setData: (data: StepData) => void; // 추가
  onCompleteChange: (complete: boolean) => void;
};

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

// DateRangePicker는 그대로 사용
const DateRangePicker = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: {
  startDate: string;
  endDate: string;
  setStartDate: Dispatch<SetStateAction<string>>;
  setEndDate: Dispatch<SetStateAction<string>>;
}) => {
  const today = new Date().toISOString().split('T')[0];
  const getMaxEndDate = (start: string) => {
    const date = new Date(start);
    date.setMonth(date.getMonth() + 2);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="formGroup">
      <label>모집 기간</label>
      <div className="dateRange">
        <input
          type="date"
          min={today}
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value);
            setEndDate('');
          }}
        />
        <span> ~ </span>
        <input
          type="date"
          min={startDate || today}
          max={startDate ? getMaxEndDate(startDate) : undefined}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          disabled={!startDate}
        />
      </div>
    </div>
  );
};

const BasicForm = ({ data, setData, onCompleteChange }: BasicFormProps) => {
  // 기존 useState 대신 data에 연결
  const [startDate, setStartDate] = useState(data.startDate || '');
  const [endDate, setEndDate] = useState(data.endDate || '');
  const [platform, setPlatform] = useState(data.platform || '');
  const [customPlatform, setCustomPlatform] = useState('');
  const [showCustomPlatformInput, setShowCustomPlatformInput] = useState(false);
  const [selectedJobs, setSelectedJobs] = useState<MultiValue<OptionType>>(data.selectedJobs || []);
  const [customJob, setCustomJob] = useState('');
  const [peopleCount, setPeopleCount] = useState(data.peopleCount || '');
  const [selectedTechStacks, setSelectedTechStacks] = useState<TechStackType[]>(data.selectedTechStacks || []);
  const [isStackOpen, setIsStackOpen] = useState(false);
  const [recruitNumber, setRecruitNumber] = useState(data.recruitNumber || '');

  // formData 동기화
  useEffect(() => {
    setData({
      startDate,
      endDate,
      platform,
      selectedJobs,
      customJob,
      peopleCount,
      selectedTechStacks,
      recruitNumber,
    });
  }, [startDate, endDate, platform, selectedJobs, customJob, peopleCount, selectedTechStacks, recruitNumber]);

  useEffect(() => {
    const isComplete =
      peopleCount.trim() !== '' &&
      startDate !== '' &&
      endDate !== '' &&
      platform.trim() !== '' &&
      selectedJobs.length > 0 &&
      !selectedJobs.some(opt => opt.value === '기타' && customJob.trim() === '') &&
      selectedTechStacks.length > 0;

    onCompleteChange(isComplete);
  }, [peopleCount, startDate, endDate, platform, selectedJobs, customJob, selectedTechStacks]);

  // 기존 JSX 그대로 + formData 연결
  return (
    <div className="formContainer">
      <div className="formGroup">
        <label>모집 인원</label>
        <input
          type="text"
          placeholder="최대 20명"
          value={peopleCount}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value) && (value === '' || Number(value) <= 20 && Number(value) > 0)) {
              setPeopleCount(value);
            }
          }}
        />
      </div>

      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />

      <div className="formGroup">
        <label>플랫폼</label>
        <select
          value={
            platformOptionsInit.some(opt => opt.value === platform)
              ? platform
              : platform
              ? platform
              : ''
          }
          onChange={(e) => {
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
          {platformOptionsInit.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
          {platform && !platformOptionsInit.some((opt) => opt.value === platform) && (
            <option value={platform}>{platform}</option>
          )}
        </select>

        {showCustomPlatformInput && (
          <input
            type="text"
            placeholder="기타 플랫폼 입력 후 Enter"
            value={customPlatform}
            onChange={(e) => setCustomPlatform(e.target.value)}
            onKeyDown={(e) => {
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

      <div className="formGroup">
        <label>지원자 직군</label>
        <Select
          isMulti
          options={jobOptionsInit}
          value={selectedJobs}
          onChange={(selected) => {
            setSelectedJobs(selected);
            if (!selected.some((opt) => opt.value === '기타')) setCustomJob('');
          }}
          placeholder="직군을 선택하세요"
          classNamePrefix="select"
          className="customSelect"
        />
        {selectedJobs.some((opt) => opt.value === '기타') && (
          <input
            type="text"
            placeholder="기타 직군 입력 후 Enter"
            value={customJob}
            onChange={(e) => setCustomJob(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setSelectedJobs((prev) =>
                  prev.map((opt) =>
                    opt.value === '기타'
                      ? { value: customJob, label: customJob }
                      : opt
                  )
                );
                setCustomJob('');
              }
            }}
            autoFocus
          />
        )}
      </div>

      <div className="formGroup">
        <label>기술 스택</label>
        <button
          type="button"
          className="selectStackBtn"
          onClick={() => setIsStackOpen(prev => !prev)}
        >
          {isStackOpen ? "닫기" : "보기"}
        </button>
        {isStackOpen && (
          <TechStackList
            techStacksInit={techStacksInit}
            selectedTechStacks={selectedTechStacks}
            toggleTechStack={(stack) => {
              setSelectedTechStacks((prev) => {
                if (prev.some((item) => item.value === stack.value)) {
                  return prev.filter((item) => item.value !== stack.value);
                }
                return [...prev, stack];
              });
            }}
          />
        )}
      </div>
    </div>
  );
};

export default BasicForm;
