import styles from './Sidebar.module.css';

interface Sidebarprops {
  currentStep: number; // 현재 활성화된 단계 (0부터 시작)
}

const steps = ['기본정보', '프로젝트 정보', '프로젝트 상황', '근무 환경', '지원자 정보'];

const Sidebar = ({ currentStep }: Sidebarprops) => {
  return (
    <div className={styles.sidebar}>
      {steps.map((step, index) => (
        <div
          key={index}
          className={`${styles.step} ${index === currentStep ? styles.active : ''}`}
        >
          <div className={styles.circle}></div>
          <span>{step}</span>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
