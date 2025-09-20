import { useState, useEffect, useCallback } from 'react';
import Select from 'react-select';
import type { MultiValue } from 'react-select';
import type { StepData } from "../../types/Draft";
// MUI DatePicker 제거 - 기본 HTML input[type="date"] 사용
import './ProjectInfo.css';
import '../../App.css';
import '../../TeamPageDetail.css';

type OptionType = { value: string; label: string };

interface ProjectInfoProps {
  data: StepData;
  setData: (data: StepData) => void;
  onCompleteChange: (isComplete: boolean) => void;
}

const jobOptionsInit: OptionType[] = [
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
  // state
  const [teamName, setTeamName] = useState('');
  const [selectedJobs, setSelectedJobs] = useState<MultiValue<OptionType>>([]);
  const [customJob, setCustomJob] = useState('');
  const [playType, setPlayType] = useState('');
  const [customPlayType, setCustomPlayType] = useState('');
  const [showCustomPlayTypeInput, setShowCustomPlayTypeInput] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [projectStartDate, setProjectStartDate] = useState<Date | null>(null);

  // ---------- data prop이 바뀔 때 state 업데이트 ----------
  useEffect(() => {
    setTeamName(data.teamName || '');

    // 모집자 직군
    const jobs: MultiValue<OptionType> = Array.isArray(data.selectedJobs)
      ? data.selectedJobs.map(j => typeof j === 'string' ? { value: j, label: j } : j)
      : [];
    setSelectedJobs(jobs);
    setCustomJob(
      jobs.some(j => j.value === '기타') && typeof data.customJob === 'string'
        ? data.customJob
        : ''
    );

    // 활동 종류
    if (data.playType && playTypeOptions.some(opt => opt.value === data.playType)) {
      setPlayType(data.playType);
      setShowCustomPlayTypeInput(false);
      setCustomPlayType('');
    } else if (data.playType) {
      setPlayType('');
      setShowCustomPlayTypeInput(true);
      setCustomPlayType(data.playType);
    } else {
      setPlayType('');
      setShowCustomPlayTypeInput(false);
      setCustomPlayType('');
    }

    // 날짜
    const parseDate = (val: unknown): Date | null => {
      if (!val) return null;
      if (val instanceof Date) return isNaN(val.getTime()) ? null : val;
      if (typeof val === 'string' || typeof val === 'number') {
        const d = new Date(val);
        return isNaN(d.getTime()) ? null : d;
      }
      return null;
    };
    setStartDate(parseDate(data.startDate));
    setEndDate(parseDate(data.endDate));
    setProjectStartDate(parseDate(data.projectStartDate));
  }, [
    data.teamName,
    data.selectedJobs,
    data.customJob,
    data.playType,
    data.startDate,
    data.endDate,
    data.projectStartDate
  ]);

  // ---------- setData 디바운싱 ----------
  const memoizedSetData = useCallback((newData: StepData) => setData(newData), [setData]);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      memoizedSetData({
        teamName,
        selectedJobs,
        customJob,
        playType,
        customPlayType,
        startDate: startDate ? startDate.toISOString() : '',
        endDate: endDate ? endDate.toISOString() : '',
        projectStartDate: projectStartDate ? projectStartDate.toISOString() : ''
      });
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [teamName, selectedJobs, customJob, playType, customPlayType, startDate, endDate, projectStartDate, memoizedSetData]);

  // ---------- 완료 체크 ----------
  useEffect(() => {
    const isJobsFilled =
      selectedJobs.length > 0 &&
      !selectedJobs.some(opt => opt.value === '기타' && customJob.trim() === '');
    const isPlayTypeFilled = playType.trim() !== '' || customPlayType.trim() !== '';
    const isDateFilled = startDate !== null && endDate !== null && projectStartDate !== null;
    const isComplete = teamName.trim() !== '' && isPlayTypeFilled && isDateFilled && isJobsFilled;
    onCompleteChange(isComplete);
  }, [teamName, selectedJobs, customJob, playType, customPlayType, startDate, endDate, projectStartDate, onCompleteChange]);

  // ---------- 이벤트 핸들러 ----------
  const handleJobChange = (selected: MultiValue<OptionType>) => {
    setSelectedJobs(selected);
    if (!selected.some(opt => opt.value === '기타')) setCustomJob('');
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

  const handleEnterSubmit = (e: React.KeyboardEvent<HTMLInputElement>, onSubmit: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit();
    }
  };

  // ---------- 렌더 ----------
  return (
    <div className="formContainer">
      <div className="formGroup">
        <label>팀 이름</label>
        <input
          type="text"
          value={teamName}
          onChange={e => setTeamName(e.target.value)}
        />
      </div>

      <div className="formGroup">
        <label>활동 종류</label>
        <select value={playType || (customPlayType ? '기타' : '')} onChange={handlePlayTypeChange}>
          <option value="">선택</option>
          {playTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          {customPlayType && <option value="기타">{customPlayType}</option>}
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

      <div className="formGroup">
        <label>진행 예상 기간</label>
        <div className="dateRange">
          <input
            type="date"
            value={startDate ? startDate.toISOString().split('T')[0] : ''}
            onChange={(e) => {
              const dateValue = e.target.value;
              const date = dateValue ? new Date(dateValue) : null;
              setStartDate(date);
            }}
            className="date-input"
          />
          <span className="date-separator">~</span>
          <input
            type="date"
            value={endDate ? endDate.toISOString().split('T')[0] : ''}
            min={startDate ? startDate.toISOString().split('T')[0] : undefined}
            onChange={(e) => {
              const dateValue = e.target.value;
              const date = dateValue ? new Date(dateValue) : null;
              setEndDate(date);
            }}
            className="date-input"
          />
        </div>
      </div>

      <div className="formGroup">
        <label>프로젝트 시작 예상일</label>
        <input
          type="date"
          value={projectStartDate ? projectStartDate.toISOString().split('T')[0] : ''}
          onChange={(e) => {
            const dateValue = e.target.value;
            const date = dateValue ? new Date(dateValue) : null;
            setProjectStartDate(date);
          }}
          className="date-input"
        />
      </div>

      <div className="formGroup">
        <label>모집자 직군</label>
        <Select
          isMulti
          options={jobOptionsInit}
          value={selectedJobs}
          onChange={handleJobChange}
          placeholder="직군을 선택하세요"
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
