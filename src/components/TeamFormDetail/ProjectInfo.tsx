import styles from './ProjectInfo.module.css';
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

const ProjectInfo = () => {
    const [selectedJobs, setSelectedJobs] = useState<MultiValue<OptionType>>([]);

  const handleJobChange = (selectedOptions: any) => {
    setSelectedJobs(selectedOptions);
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formGroup}>
        <label>팀 이름:</label>
        <input type="text" placeholder="___" />
      </div>
    <div className={styles.formGroup}>
    <label>활동 종류:</label>
    <select>
        <option>선택</option>
        <option>공모전</option>
        <option>사이드 프로젝트</option>
        <option>직접입력</option>
    </select>
    </div>
<div className={styles.formGroup}>
        <label>진행 예상 기간:</label>
        <div className={styles.dateRange}>
          <input type="date" />
          <span> ~ </span>
          <input type="date" />
        </div>
      </div>
      <div className={styles.formGroup}>
        <label>프로젝트 시작 예상일:</label>
        <div className={styles.dateRange}>
          <input type="date" />
        </div>
        </div>
         <div className={styles.formGroup}>
      <label>모집자 직군</label>
      <Select
          isMulti
          options={Options}
          value={selectedJobs}
          onChange={handleJobChange}
          placeholder="직군을 선택하세요"
        />
    </div>
</div>
      );
};

export default ProjectInfo;