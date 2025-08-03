import { useState } from 'react';
import Select from 'react-select';
import type  { MultiValue } from 'react-select';

// 타입 정의
type OptionType = {
  value: string;
  label: string;
};

// 직군 옵션
const jobOptions: OptionType[] = [
  { value: '프론트엔드', label: '프론트엔드' },
  { value: '백엔드', label: '백엔드' },
  { value: '디자이너', label: '디자이너' },
  { value: '기획자', label: '기획자' },
  { value: 'PM', label: 'PM' },
  { value: '기타', label: '기타' },
];

// 날짜 선택 컴포넌트
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
  const getToday = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxEndDate = (start: string) => {
    const date = new Date(start);
    date.setMonth(date.getMonth() + 2);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="formGroup">
      <label>모집 기간:</label>
      <div className="dateRange">
        <input
          type="date"
          min={getToday()}
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value);
            setEndDate('');
          }}
        />
        <span> ~ </span>
        <input
          type="date"
          min={startDate || getToday()}
          max={startDate ? getMaxEndDate(startDate) : undefined}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          disabled={!startDate}
        />
      </div>
    </div>
  );
};

const BasicForm = () => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedJobs, setSelectedJobs] = useState<MultiValue<OptionType>>([]);

  const handleJobChange = (selectedOptions: MultiValue<OptionType>) => {
    setSelectedJobs(selectedOptions);
  };

  return (
    <div className="formContainer">

      <div className="formGroup">
        <label>모집 인원:</label>
        <input type="text" placeholder="___명" />
      </div>

      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />

      <div className="formGroup">
        <label>플랫폼:</label>
        <select>
          <option>선택</option>
          <option>웹</option>
          <option>앱</option>
          <option>게임</option>
          <option>기타</option>
        </select>
      </div>

      <div className="formGroup">
        <label>지원자 직군:</label>
        <Select
          isMulti
          options={jobOptions}
          value={selectedJobs}
          onChange={handleJobChange}
          placeholder="직군을 선택하세요"
        />
      </div>

      <div className="formGroup">
        <label>기술 스택:</label>
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
