import styles from './BasicInfo.module.css';

const BasicForm = () => {
  return (
    <div className={styles.formContainer}>
      <div className={styles.formGroup}>
        <label>모집 인원:</label>
        <input type="text" placeholder="___명" />
      </div>

      <div className={styles.formGroup}>
        <label>모집 기간:</label>
        <div className={styles.dateRange}>
          <input type="date" />
          <span> ~ </span>
          <input type="date" />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label>플랫폼:</label>
        <select>
          <option>선택</option>
          <option>웹</option>
          <option>앱</option>
          <option>게임</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label>모집 직군:</label>
        <select>
          <option>선택</option>
          <option>프론트엔드</option>
          <option>백엔드</option>
          <option>디자이너</option>
          <option>UI/UX</option>
        </select>
      </div>

      <div className={styles.formGroup}>
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
