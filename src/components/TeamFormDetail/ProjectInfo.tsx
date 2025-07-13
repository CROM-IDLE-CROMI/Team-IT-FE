import styles from './ProjectInfo.module.css';

const ProjectInfo = () => {
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
</div>
      );
};

export default ProjectInfo;