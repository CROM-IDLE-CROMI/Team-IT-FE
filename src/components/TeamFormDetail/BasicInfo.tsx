import Select from 'react-select';
import  type { MultiValue } from 'react-select'
import { useState } from 'react';

type OptionType = {
    value : string;
    label : string;
};

const Options: OptionType[] = [
  { value: '프론트엔드', label: '프론트엔드' },
  { value: '백엔드', label: '백엔드' },
  { value: '디자이너', label: '디자이너' },
  { value: 'UI/UX', label: 'UI/UX' },
];

const BasicForm = () => {
  const [selectedJobs, setSelectedJobs] = useState<MultiValue<OptionType>>([]);
  
    const handleJobChange = (selectedOptions: any) => {
      setSelectedJobs(selectedOptions);
    };
  return (
    <div className="formContainer">
      <div className="formGroup">
        <label>모집 인원:</label>
        <input type="text" placeholder="___명" />
      </div>

      <div className="formGroup">
        <label>모집 기간:</label>
        <div className="dateRange">
          <input type="date" />
          <span> ~ </span>
          <input type="date" />
        </div>
      </div>

      <div className="formGroup">
        <label>플랫폼:</label>
        <select>
          <option>선택</option>
          <option>웹</option>
          <option>앱</option>
          <option>게임</option>
        </select>
      </div>

      <div className="formGroup">
      <label>지원자 직군</label>
      <Select
          isMulti
          options={Options}
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
