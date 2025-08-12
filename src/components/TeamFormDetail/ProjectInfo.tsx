import Select from 'react-select';
import type { MultiValue, ActionMeta } from 'react-select';
import { useState, useEffect } from 'react';
import '../../App.css';

type OptionType = {
  value: string;
  label: string;
};

interface ProjectInfoProps {
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

const ProjectInfo = ({ onCompleteChange }: ProjectInfoProps) => {
  const [teamName, setTeamName] = useState('');
  const [selectedJobs, setSelectedJobs] = useState<MultiValue<OptionType>>([]);
  const [customJob, setCustomJob] = useState('');
  const [otherText, setOtherText] = useState('');


  const handleOtherTextChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 500) {
      setOtherText(value);
    }
  };


  const handleJobChange = (
    selected: MultiValue<OptionType>,
    _: ActionMeta<OptionType>
  ) => {
    setSelectedJobs(selected);
    if (!selected.some((opt) => opt.value === '기타')) {
      setCustomJob('');
    }
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

  const [playType, setPlayType] = useState('');
  const [showCustomPlayTypeInput, setShowCustomPlayTypeInput] = useState(false);
  const [customPlayType, setCustomPlayType] = useState('');

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

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [projectStartDate, setProjectStartDate] = useState('');

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

  return (
    <div className="formContainer">
  <div className="formGroup">
    <label>팀 이름</label>
    <input
      type="text"
      value={teamName}
      onChange={(e) => {
        const value = e.target.value;
        if (value.length <= 500) {
          setTeamName(value);
        }
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
        <div className="dateRange">
          <input
            type="date"
            value={projectStartDate}
            onChange={(e) => setProjectStartDate(e.target.value)}
          />
        </div>
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
