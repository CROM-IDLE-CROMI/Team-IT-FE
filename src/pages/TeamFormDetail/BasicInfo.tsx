import { useEffect, useState, useCallback } from 'react';
import Select from 'react-select';
import type { MultiValue } from 'react-select';
import type { TechStackType } from '../../styles/TechStack';
import { techStacksInit } from '../../styles/TechStack';
import './BasicInfo.css'
import '../../App.css';
import '../../TeamPageDetail.css';
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
        <Box className="dateRange" sx={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 2, 
          width: '100%', 
          maxWidth: '400px',
          padding: '0.5rem',
          borderRadius: '12px',
          transition: 'all 0.3s ease'
        }}>
          {/* 시작일 */}
          <DatePicker
            label="시작일"
            value={startDate}
            minDate={today}
            onChange={(newValue) => {
              setStartDate(newValue);
              setEndDate(null);
            }}
            format="yyyy/MM/dd"
            slotProps={{
    textField: {
                size: "small",
      sx: {
                  width: 180,
        "& .MuiInputBase-input": {
                    padding: "8px 12px",
                    fontSize: "0.9rem",
                    color: "#333",
                    background: 'transparent'
                  },
                  "& .MuiInputLabel-root": {
                    color: "#666",
                    fontSize: "0.85rem",
                    "&.Mui-focused": {
                      color: "#1E63EC"
                    }
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#ddd",
                      borderWidth: "1px"
                    },
                    "&:hover fieldset": {
                      borderColor: "#1E63EC"
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#1E63EC"
                    }
                  }
                }
              }
            }}
          />

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: '35px',
            height: '35px',
            borderRadius: '50%',
            color: 'black',
            fontWeight: 'bold',
            fontSize: '1.5rem',
          }}>
            ~
          </Box>

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
                size: "small",
      sx: {
                  width: 180,
                  "& .MuiInputBase-input": {
                    padding: "8px 12px",
                    fontSize: "0.9rem",
                    color: "#333",
                    background: 'transparent',
                    "&:disabled": {
                      background: 'transparent',
                      color: '#999'
                    }
                  },
                  "& .MuiInputLabel-root": {
                    color: "#666",
                    fontSize: "0.85rem",
                    "&.Mui-focused": {
                      color: "#1E63EC"
                    }
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#ddd",
                      borderWidth: "1px"
                    },
                    "&:hover fieldset": {
                      borderColor: startDate ? "#1E63EC" : "#ddd"
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#1E63EC"
                    }
                  }
                }
              }
            }}
          />
        </Box>
      </div>
    </LocalizationProvider>
  );
};

const BasicForm = ({ data, setData, onCompleteChange }: BasicFormProps) => {
  // 기존 useState 대신 data에 연결
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [platform, setPlatform] = useState('');
  const [customPlatform, setCustomPlatform] = useState('');
  const [showCustomPlatformInput, setShowCustomPlatformInput] = useState(false);
  const [selectedJobs, setSelectedJobs] = useState<MultiValue<OptionType>>([]);
  const [customJob, setCustomJob] = useState('');
  const [peopleCount, setPeopleCount] = useState('');
  const [selectedTechStacks, setSelectedTechStacks] = useState<TechStackType[]>([]);
  const [isStackOpen, setIsStackOpen] = useState(false);


  // data prop이 변경될 때 state 업데이트
  useEffect(() => {
    setStartDate(data.startDate ? (typeof data.startDate === 'string' ? new Date(data.startDate) : data.startDate) : null);
    setEndDate(data.endDate ? (typeof data.endDate === 'string' ? new Date(data.endDate) : data.endDate) : null);
    setPlatform(data.platform || '');
    setCustomPlatform(data.customPlatform || '');
    setSelectedJobs(data.selectedJobs || []);
    setCustomJob(data.customJob || '');
    setPeopleCount(data.peopleCount || '');
    setSelectedTechStacks(data.selectedTechStacks || []);
  }, [data]);

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
      });
    }, 300); // 300ms 디바운싱

    return () => clearTimeout(timeoutId);
  }, [startDate, endDate, platform, customPlatform, selectedJobs, customJob, peopleCount, selectedTechStacks, memoizedSetData]);

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

      <div className="formGroup_3">
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
