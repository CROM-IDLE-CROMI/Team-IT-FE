import Sidebar from '../components/Sidebar';
import ApplicantInfo from '../components/TeamFormDetail/ApplicantInfo';
import BasicInfo from '../components/TeamFormDetail/BasicInfo';
import ProjectInfo from '../components/TeamFormDetail/ProjectInfo';
import Situation from '../components/TeamFormDetail/Situation';
import WorkEnviron from '../components/TeamFormDetail/WorkEnviron';
import Header from '../layouts/Header';


 const TeamPage = () => {
  const currentStep = 0;

  return (
    <>
      <Header />
      <div className="container">
        <aside className="sidebar">
          <Sidebar currentStep={currentStep} />
        </aside>

        <main className="scrollArea">
          <section className="section">
            <BasicInfo />
          </section>

          <section className="section">
            <ProjectInfo />
          </section>

          <section className="section">
            <Situation />
          </section>

          <section className="section">
            <WorkEnviron />
          </section>

          <section className="section">
            <ApplicantInfo />
          </section>
        </main>
      </div>
    </>
  );
};

export default TeamPage;