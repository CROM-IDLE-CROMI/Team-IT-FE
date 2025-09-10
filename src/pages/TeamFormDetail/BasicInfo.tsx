import { useEffect, useState, useCallback } from 'react';
import Select from 'react-select';
import type { MultiValue } from 'react-select';
import type { TechStackType } from '../../styles/TechStack';
import { techStacksInit } from '../../styles/TechStack';
import './BasicInfo.css'
import '../../App.css';
import TechStackList from '../../components/TechStackList';
import type { StepData } from "../../types/Draft";
import type { Dispatch, SetStateAction } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Box } from "@mui/material";


type OptionType = { value: string; label: string };

type BasicFormProps = {
  data: StepData; 
  setData: (data: StepData) => void;
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

type Props = {
  startDate: Date | null;
  endDate: Date | null;
  setStartDate: Dispatch<SetStateAction<Date | null>>;
  setEndDate: Dispatch<SetStateAction<Date | null>>;
};

const DateRangePicker = ({ startDate, endDate, setStartDate, setEndDate }: Props) => {
  const today = new Date();

  const getMaxEndDate = (start: Date) => {
    const date = new Date(start);
    date.setMonth(date.getMonth() + 2);
    return date;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="formGroup">
        <label>모집 기간</label>
        <Box className="dateRange" sx={{ display: "flex", alignItems: "center", gap: 1, width: '400px', height: '40px', color: '#000' }}>
          {/* 시작일 */}
          <DatePicker
            label="시작일"
            value={startDate}
            minDate={today}
            onChange={(newValue) => {
              setStartDate(newValue);
              setEndDate(null);
            }}
            slotProps={{
    textField: {
      size: "small", // compact
      sx: {
  width: 140, // 가로폭 줄이기
  "& .MuiInputBase-input": {
    padding: "6px 8px", // 내부 여백 줄이기
    fontSize: "0.8rem", // 글자 크기 줄이기
    color: "#000", // 글자색 검정
  },
  "& .MuiInputLabel-root": {
    color: "#000", // placeholder/label 색상
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#000", // 기본 테두리 검정
    },
    "&:hover fieldset": {
      borderColor: "#000", // hover 시 검정
    },
    "&.Mui-focused fieldset": {
      borderColor: "#000", // focus 시 검정
    },
  },
}}}}
          />

          <span> ~ </span>

          {/* 종료일 */}
          <DatePicker
            label="종료일"
            value={endDate}
            minDate={startDate ?? today}
            maxDate={startDate ? getMaxEndDate(startDate) : undefined}
            onChange={(newValue) => setEndDate(newValue)}
            disabled={!startDate}
            slotProps={{
    textField: {
      size: "small", // compact
      sx: {
  width: 140, // 가로폭 줄이기
  "& .MuiInputBase-input": {
    padding: "6px 8px", // 내부 여백 줄이기
    fontSize: "0.8rem", // 글자 크기 줄이기
    color: "#000", // 글자색 검정
  },
  "& .MuiInputLabel-root": {
    color: "#000", // placeholder/label 색상
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#000", // 기본 테두리 검정
    },
    "&:hover fieldset": {
      borderColor: "#000", // hover 시 검정
    },
    "&.Mui-focused fieldset": {
      borderColor: "#000", // focus 시 검정
    },
  },
}}}}
          />
        </Box>
      </div>
    </LocalizationProvider>
  );
};

const BasicForm = ({ data, setData, onCompleteChange }: BasicFormProps) => {
  // 기존 useState 대신 data에 연결
  const [startDate, setStartDate] = useState<Date | null>(
    data.startDate ? (typeof data.startDate === 'string' ? new Date(data.startDate) : data.startDate) : null
  );
  const [endDate, setEndDate] = useState<Date | null>(
    data.endDate ? (typeof data.endDate === 'string' ? new Date(data.endDate) : data.endDate) : null
  );
  const [platform, setPlatform] = useState(data.platform || '');
  const [customPlatform, setCustomPlatform] = useState(data.customPlatform || '');
  const [showCustomPlatformInput, setShowCustomPlatformInput] = useState(false);
  const [selectedJobs, setSelectedJobs] = useState<MultiValue<OptionType>>(data.selectedJobs || []);
  const [customJob, setCustomJob] = useState(data.customJob || '');
  const [peopleCount, setPeopleCount] = useState(data.peopleCount || '');
  const [selectedTechStacks, setSelectedTechStacks] = useState<TechStackType[]>(data.selectedTechStacks || []);
  const [isStackOpen, setIsStackOpen] = useState(false);
  const [recruitNumber, setRecruitNumber] = useState(data.recruitNumber || '');

  // data prop이 변경될 때 state 업데이트 (실제 값이 변경되었을 때만)
  useEffect(() => {
    if (data.startDate !== undefined) {
      setStartDate(data.startDate ? (typeof data.startDate === 'string' ? new Date(data.startDate) : data.startDate) : null);
    }
    if (data.endDate !== undefined) {
      setEndDate(data.endDate ? (typeof data.endDate === 'string' ? new Date(data.endDate) : data.endDate) : null);
    }
    if (data.platform !== undefined) setPlatform(data.platform || '');
    if (data.customPlatform !== undefined) setCustomPlatform(data.customPlatform || '');
    if (data.selectedJobs !== undefined) setSelectedJobs(data.selectedJobs || []);
    if (data.customJob !== undefined) setCustomJob(data.customJob || '');
    if (data.peopleCount !== undefined) setPeopleCount(data.peopleCount || '');
    if (data.selectedTechStacks !== undefined) setSelectedTechStacks(data.selectedTechStacks || []);
    if (data.recruitNumber !== undefined) setRecruitNumber(data.recruitNumber || '');
  }, [data.startDate, data.endDate, data.platform, data.customPlatform, data.selectedJobs, data.customJob, data.peopleCount, data.selectedTechStacks, data.recruitNumber]);

  // setData 함수를 메모이제이션
  const memoizedSetData = useCallback((newData: StepData) => {
    setData(newData);
  }, [setData]);

  // formData 동기화 (디바운싱 적용)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      memoizedSetData({
        startDate: startDate ? startDate.toISOString() : '',
        endDate: endDate ? endDate.toISOString() : '',
        platform,
        customPlatform,
        selectedJobs,
        customJob,
        peopleCount,
        selectedTechStacks,
        recruitNumber,
      });
    }, 300); // 300ms 디바운싱

    return () => clearTimeout(timeoutId);
  }, [startDate, endDate, platform, customPlatform, selectedJobs, customJob, peopleCount, selectedTechStacks, recruitNumber, memoizedSetData]);

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
          menuPortalTarget={document.body}        // 메뉴를 body로 이동
      menuPosition="fixed"                   // fixed로 위치 정확히 잡기
      styles={{
        menuPortal: (base) => ({ ...base, zIndex: 9999 }), // 항상 최상단
      }}
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
