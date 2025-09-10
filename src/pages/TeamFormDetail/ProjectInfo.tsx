import Select from 'react-select';
import type { MultiValue, ActionMeta } from 'react-select';
import { useState, useEffect, useCallback } from 'react';
import "./ProjectInfo.css";
import type { StepData } from "../../types/Draft";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Box } from "@mui/material";
import "../../App.css";
import "../../TeamPageDetail.css";

type OptionType = {
  value: string;
  label: string;
};

interface ProjectInfoProps {
  data: StepData;
  setData: (data: StepData) => void;
  onCompleteChange: (isComplete: boolean) => void;
}

const Options: OptionType[] = [
  { value: '프론트엔드', label: '프론트엔드' },
  { value: '백엔드', label: '백엔드' },
  { value: '디자이너', label: '디자이너' },
  { value: 'UI/UX', label: 'UI/UX' },
  { value: '기타', label: '기타' },
];

const playTypeOptions: OptionType[] = [
  { value: '공모전', label: '공모전' },
  { value: '사이드 프로젝트', label: '사이드 프로젝트' },
  { value: '대회', label: '대회' },
  { value: '토이 프로젝트', label: '토이 프로젝트' },
  { value: '기타', label: '기타' },
];

const ProjectInfo = ({ data, setData, onCompleteChange }: ProjectInfoProps) => {
  const [teamName, setTeamName] = useState('');
  const [selectedJobs, setSelectedJobs] = useState<MultiValue<OptionType>>([]);
  const [customJob, setCustomJob] = useState('');
  const [otherText, setOtherText] = useState('');
  const [playType, setPlayType] = useState('');
  const [showCustomPlayTypeInput, setShowCustomPlayTypeInput] = useState(false);
  const [customPlayType, setCustomPlayType] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [projectStartDate, setProjectStartDate] = useState<Date | null>(null);

  // ---------- 임시저장 데이터 불러오기 ----------
  useEffect(() => {
    console.log('ProjectInfo useEffect - data:', data); // 디버깅용
    
    // 팀 이름
    setTeamName(data.teamName || '');

    // 모집자 직군 처리
    if (data.selectedJobs && Array.isArray(data.selectedJobs)) {
      const jobs = data.selectedJobs.map((job: any) => {
        if (typeof job === 'string') {
          return { value: job, label: job };
        } else if (job && typeof job === 'object') {
          return { value: job.value || job, label: job.label || job.value || job };
        }
        return { value: job, label: job };
      });
      setSelectedJobs(jobs);
    } else {
      setSelectedJobs([]);
    }

    setCustomJob(data.customJob || '');
    setOtherText(data.otherText || '');

    // 활동 종류 처리
    setPlayType(data.playType || '');
    setCustomPlayType(data.customPlayType || '');
    
    // 커스텀 활동 종류가 있으면 표시
    if (data.customPlayType && data.customPlayType.trim() !== '') {
      setShowCustomPlayTypeInput(true);
    } else {
      setShowCustomPlayTypeInput(false);
    }

    // 날짜 처리
    setStartDate(data.startDate ? (typeof data.startDate === 'string' ? new Date(data.startDate) : data.startDate) : null);
    setEndDate(data.endDate ? (typeof data.endDate === 'string' ? new Date(data.endDate) : data.endDate) : null);
    setProjectStartDate(data.projectStartDate ? (typeof data.projectStartDate === 'string' ? new Date(data.projectStartDate) : data.projectStartDate) : null);
  }, [data.teamName, data.selectedJobs, data.customJob, data.otherText, data.playType, data.customPlayType, data.startDate, data.endDate, data.projectStartDate]);

  // ---------- setData 디바운싱 ----------
  const memoizedSetData = useCallback((newData: StepData) => setData(newData), [setData]);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      memoizedSetData({
        teamName,
        selectedJobs,
        customJob,
        otherText,
        playType,
        customPlayType,
        startDate: startDate ? startDate.toISOString() : '',
        endDate: endDate ? endDate.toISOString() : '',
        projectStartDate: projectStartDate ? projectStartDate.toISOString() : '',
      });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [teamName, selectedJobs, customJob, otherText, playType, customPlayType, startDate, endDate, projectStartDate, memoizedSetData]);

  // ---------- 완료 체크 ----------
  useEffect(() => {
    const isJobsFilled =
      selectedJobs.length > 0 &&
      !selectedJobs.some(opt => opt.value === '기타' && customJob.trim() === '');
    const isPlayTypeFilled = playType.trim() !== '' || customPlayType.trim() !== '';
    const isDateFilled = startDate !== null && endDate !== null && projectStartDate !== null;
    const isComplete = teamName.trim() !== '' && isPlayTypeFilled && isDateFilled && isJobsFilled;
    onCompleteChange(isComplete);
  }, [teamName, playType, customPlayType, startDate, endDate, projectStartDate, selectedJobs, customJob, onCompleteChange]);

  // ---------- 이벤트 핸들러 ----------
  const handleJobChange = (selected: MultiValue<OptionType>, _: ActionMeta<OptionType>) => {
    setSelectedJobs(selected);
    if (!selected.some(opt => opt.value === '기타')) setCustomJob('');
  };

  const handleEnterSubmit = (e: React.KeyboardEvent<HTMLInputElement>, onSubmit: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit();
    }
  };

  const handlePlayTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === '기타') {
      setShowCustomPlayTypeInput(true);
      setCustomPlayType('');
      setPlayType('');
    } else {
      setPlayType(value);
      setShowCustomPlayTypeInput(false);
      setCustomPlayType('');
    }
  };

  const handleCustomPlayTypeSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && customPlayType.trim() !== '') {
      setPlayType(customPlayType.trim());
      setShowCustomPlayTypeInput(false);
      setCustomPlayType('');
    }
  };

  // ---------- 렌더 ----------
  return (
    <div className="formContainer">
      {/* 팀 이름 */}
      <div className="formGroup">
        <label>팀 이름</label>
        <input
          type="text"
          value={teamName}
          onChange={e => { if (e.target.value.length <= 500) setTeamName(e.target.value); }}
        />
      </div>

      {/* 활동 종류 */}
      <div className="formGroup">
        <label>활동 종류</label>
        <select
          value={
            playTypeOptions.some(opt => opt.value === playType)
              ? playType
              : playType ? playType : ''
          }
          onChange={handlePlayTypeChange}
        >
          <option value="">선택</option>
          {playTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          {playType && !playTypeOptions.some(opt => opt.value === playType) && (
            <option value={playType}>{playType}</option>
          )}
        </select>

        {showCustomPlayTypeInput && (
          <input
            type="text"
            placeholder="기타 활동 종류 입력 후 Enter"
            value={customPlayType}
            onChange={e => setCustomPlayType(e.target.value)}
            onKeyDown={handleCustomPlayTypeSubmit}
            autoFocus
          />
        )}
      </div>

      {/* 진행 예상 기간 */}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <div className="formGroup">
          <label>진행 예상 기간</label>
          <Box className="dateRange" sx={{ display: "flex", alignItems: "center", gap: 2, width: '100%', maxWidth: '400px', padding: '0.5rem', borderRadius: '12px' }}>
            <DatePicker
              label="시작일"
              value={startDate}
              onChange={newValue => {
                setStartDate(newValue);
                if (endDate && newValue && endDate < newValue) setEndDate(null);
              }}
              format="yyyy/MM/dd"
              slotProps={{
                textField: {
                  size: "small",
                  sx: { width: 160 }
                }
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '35px', height: '35px', borderRadius: '50%', fontSize: '1.5rem' }}>~</Box>
            <DatePicker
              label="종료일"
              value={endDate}
              minDate={startDate ?? undefined}
              onChange={newValue => setEndDate(newValue)}
              format="yyyy/MM/dd"
              slotProps={{
                textField: { size: "small", sx: { width: 160 } }
              }}
            />
          </Box>
        </div>

        <div className="formGroup">
          <label>프로젝트 시작 예상일</label>
          <Box className="dateRange" sx={{ display: "flex", alignItems: "center", width: '100%', maxWidth: '400px', padding: '0.5rem', borderRadius: '12px' }}>
            <DatePicker
              label="예상 시작일"
              value={projectStartDate}
              onChange={newValue => setProjectStartDate(newValue)}
              format="yyyy/MM/dd"
              slotProps={{
                textField: { size: "small", sx: { width: 200 } }
              }}
            />
          </Box>
        </div>
      </LocalizationProvider>

      {/* 모집자 직군 */}
      <div className="formGroup">
        <label>모집자 직군</label>
        <Select
          isMulti
          options={Options}
          value={selectedJobs}
          onChange={handleJobChange}
          placeholder="직군을 선택하세요"
          menuPlacement="top"
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
            onKeyDown={e => handleEnterSubmit(e, () => {
              setSelectedJobs(prev => prev.map(opt => opt.value === '기타' ? { value: customJob, label: customJob } : opt));
              setCustomJob('');
            })}
            autoFocus
          />
        )}
      </div>
    </div>
  );
};

export default ProjectInfo;
