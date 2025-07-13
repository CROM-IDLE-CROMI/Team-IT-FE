import styles from './ApplicantInfo.module.css';

const ApplicantInfo = () =>{
    return (
<div className={styles.formContainer}>
  <div className={styles.formGroup}>
<label>지원자 최소 요건:</label>
<input type='text' placeholder=''/>
</div>
<div className={styles.formGroup}>
<label>지원자에게 질문할 내용</label>
<input type='text' placeholder=''/>
</div>
</div>

    );
};

export default ApplicantInfo;