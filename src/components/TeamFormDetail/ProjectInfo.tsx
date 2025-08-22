import Select from 'react-select';
import type { MultiValue, ActionMeta } from 'react-select';
import { useState, useEffect, useCallback } from 'react';
import '../../App.css';
import type { StepData } from "../../types/Draft";

type OptionType = {
  value: string;
  label: string;
};

interface ProjectInfoProps {
  data: StepData;                // 추가
  setData: (data: StepData) => void; // 추가
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
  const [teamName, setTeamName] = useState(data.teamName || '');
  const [selectedJobs, setSelectedJobs] = useState<MultiValue<OptionType>>(data.selectedJobs || []);
  const [customJob, setCustomJob] = useState(data.customJob || '');
  const [otherText, setOtherText] = useState(data.otherText || '');

  const [playType, setPlayType] = useState(data.playType || '');
  const [showCustomPlayTypeInput, setShowCustomPlayTypeInput] = useState(false);
  const [customPlayType, setCustomPlayType] = useState(data.customPlayType || '');

  const [startDate, setStartDate] = useState(data.startDate || '');
  const [endDate, setEndDate] = useState(data.endDate || '');
  const [projectStartDate, setProjectStartDate] = useState(data.projectStartDate || '');

  // data prop이 변경될 때 state 업데이트 (실제 값이 변경되었을 때만)
  useEffect(() => {
    if (data.teamName !== undefined) setTeamName(data.teamName || '');
    if (data.selectedJobs !== undefined) setSelectedJobs(data.selectedJobs || []);
    if (data.customJob !== undefined) setCustomJob(data.customJob || '');
    if (data.otherText !== undefined) setOtherText(data.otherText || '');
    if (data.playType !== undefined) setPlayType(data.playType || '');
    if (data.customPlayType !== undefined) setCustomPlayType(data.customPlayType || '');
    if (data.startDate !== undefined) setStartDate(data.startDate || '');
    if (data.endDate !== undefined) setEndDate(data.endDate || '');
    if (data.projectStartDate !== undefined) setProjectStartDate(data.projectStartDate || '');
  }, [data.teamName, data.selectedJobs, data.customJob, data.otherText, data.playType, data.customPlayType, data.startDate, data.endDate, data.projectStartDate]);

  // setData 함수를 메모이제이션
  const memoizedSetData = useCallback((newData: StepData) => {
    setData(newData);
  }, [setData]);

  // formData 동기화 (디바운싱 적용)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      memoizedSetData({
        teamName,
        selectedJobs,
        customJob,
        otherText,
        playType,
        customPlayType,
        startDate,
        endDate,
        projectStartDate,
      });
    }, 300); // 300ms 디바운싱

    return () => clearTimeout(timeoutId);
  }, [teamName, selectedJobs, customJob, otherText, playType, customPlayType, startDate, endDate, projectStartDate, memoizedSetData]);

  // 완료 체크
  useEffect(() => {
    const isJobsFilled =
      selectedJobs.length > 0 &&
      !selectedJobs.some((opt) => opt.value === '기타' && customJob.trim() === '');

    const isPlayTypeFilled = playType.trim() !== '';
    const isDateFilled = startDate !== '' && endDate !== '' && projectStartDate !== '';

    const isComplete =
      teamName.trim() !== '' && isPlayTypeFilled && isDateFilled && isJobsFilled;

    onCompleteChange(isComplete);
  }, [teamName, playType, startDate, endDate, projectStartDate, selectedJobs, customJob, onCompleteChange]);

  const handleJobChange = (
    selected: MultiValue<OptionType>,
    _: ActionMeta<OptionType>
  ) => {
    setSelectedJobs(selected);
    if (!selected.some((opt) => opt.value === '기타')) setCustomJob('');
  };

  const handleEnterSubmit = (
    e: React.KeyboardEvent<HTMLInputElement>,
    onSubmit: () => void
  ) => {
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

  const handleCustomPlayTypeSubmit = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Enter' && customPlayType.trim() !== '') {
      setPlayType(customPlayType.trim());
      setShowCustomPlayTypeInput(false);
      setCustomPlayType('');
    }
  };

  return (
    <div className="formContainer">
      <div className="formGroup">
        <label>팀 이름</label>
        <input
          type="text"
          value={teamName}
          onChange={(e) => {
            const value = e.target.value;
            if (value.length <= 500) setTeamName(value);
          }}
        />
      </div>

      <div className="formGroup">
        <label>활동 종류</label>
        <select
          value={
            playTypeOptions.some((opt) => opt.value === playType)
              ? playType
              : playType
              ? playType
              : ''
          }
          onChange={handlePlayTypeChange}
        >
          <option value="">선택</option>
          {playTypeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
          {playType &&
            !playTypeOptions.some((opt) => opt.value === playType) && (
              <option value={playType}>{playType}</option>
            )}
        </select>

        {showCustomPlayTypeInput && (
          <input
            type="text"
            placeholder="기타 활동 종류 입력 후 Enter"
            value={customPlayType}
            onChange={(e) => setCustomPlayType(e.target.value)}
            onKeyDown={handleCustomPlayTypeSubmit}
            autoFocus
          />
        )}
      </div>

      <div className="formGroup">
        <label>진행 예상 기간</label>
        <div className="dateRange">
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <span> ~ </span>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
      </div>

      <div className="formGroup">
        <label>프로젝트 시작 예상일</label>
        <input
          type="date"
          value={projectStartDate}
          onChange={(e) => setProjectStartDate(e.target.value)}
        />
      </div>

      <div className="formGroup">
        <label>모집자 직군</label>
        <Select
          isMulti
          options={Options}
          value={selectedJobs}
          onChange={handleJobChange}
          placeholder="직군을 선택하세요"
          menuPlacement="top"
        />
        {selectedJobs.some((opt) => opt.value === '기타') && (
          <input
            type="text"
            placeholder="기타 직군 입력 후 Enter"
            value={customJob}
            onChange={(e) => setCustomJob(e.target.value)}
            onKeyDown={(e) =>
              handleEnterSubmit(e, () => {
                setSelectedJobs((prev) =>
                  prev.map((opt) =>
                    opt.value === '기타'
                      ? { value: customJob, label: customJob }
                      : opt
                  )
                );
                setCustomJob('');
              })
            }
            autoFocus
          />
        )}
      </div>
    </div>
  );
};

export default ProjectInfo;
