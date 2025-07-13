import Sidebar from '../components/Sidebar';
import ApplicantInfo from '../components/TeamFormDetail/ApplicantInfo';
import BasicInfo from '../components/TeamFormDetail/BasicInfo';
import ProjectInfo from '../components/TeamFormDetail/ProjectInfo';
import Situation from '../components/TeamFormDetail/Situation';
import WorkEnviron from '../components/TeamFormDetail/WorkEnviron';

import styles from './TeamPage.module.css';

const TeamPage = () => {
  const currentStep = 0; // 나중에 IntersectionObserver로 갱신

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <Sidebar currentStep={currentStep} />
      </aside>

      <main className={styles.scrollArea}>
        <section className={styles.section}>
          <BasicInfo />
        </section>
        <section className={styles.section}>
          <ProjectInfo />
        </section>
        <section className={styles.section}>
          <Situation />
        </section>
        <section className={styles.section}>
          <WorkEnviron />
        </section>
        <section className={styles.section}>
          <ApplicantInfo />
        </section>
      </main>
    </div>
  );
};

export default TeamPage;
