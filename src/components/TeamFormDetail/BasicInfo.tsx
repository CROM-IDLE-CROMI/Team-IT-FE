import { useEffect, useState } from 'react';
import Select from 'react-select';
import type { MultiValue, ActionMeta } from 'react-select';

type OptionType = { value: string; label: string };

type BasicInfoProps = {
  onCompleteChange: (complete: boolean) => void; // 부모로 완료 여부 전달
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

const DateRangePicker = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: {
  startDate: string;
  endDate: string;
  setStartDate: React.Dispatch<React.SetStateAction<string>>;
  setEndDate: React.Dispatch<React.SetStateAction<string>>;
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

const BasicForm = ({ onCompleteChange }: BasicInfoProps) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [platform, setPlatform] = useState('');
  const [showCustomPlatformInput, setShowCustomPlatformInput] = useState(false);
  const [customPlatform, setCustomPlatform] = useState('');

  const [selectedJobs, setSelectedJobs] = useState<MultiValue<OptionType>>([]);
  const [customJob, setCustomJob] = useState('');

  const [peopleCount, setPeopleCount] = useState('');

  const handlePlatformChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
  };

  const handleCustomPlatformSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && customPlatform.trim() !== '') {
      setPlatform(customPlatform.trim());
      setShowCustomPlatformInput(false);
      setCustomPlatform('');
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

  useEffect(() => {
    const isComplete =
      peopleCount.trim() !== '' &&
      startDate !== '' &&
      endDate !== '' &&
      platform.trim() !== '' &&
      selectedJobs.length > 0 &&
      !selectedJobs.some(opt => opt.value === '기타' && customJob.trim() === '');

    onCompleteChange(isComplete);
  }, [peopleCount, startDate, endDate, platform, selectedJobs, customJob, onCompleteChange]);

  return (
    <div className="formContainer">
      <div className="formGroup">
        <label>모집 인원</label>
        <input
          type="text"
          placeholder="___명"
          value={peopleCount}
          onChange={(e) => setPeopleCount(e.target.value)}
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
          onChange={handlePlatformChange}
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
            onKeyDown={handleCustomPlatformSubmit}
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
          onChange={handleJobChange}
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

      <div className="formGroup">
        <label>기술 스택</label>
        <select>
          <option>React</option>
          <option>Spring</option>
          <option>Node.js</option>
        </select>
      </div>
    </div>
  );
};

export default BasicForm;
