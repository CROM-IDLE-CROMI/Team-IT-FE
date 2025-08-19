// pages/TeamPage.tsx
import React, { useRef, useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import ApplicantInfo from '../components/TeamFormDetail/ApplicantInfo';
import BasicInfo from '../components/TeamFormDetail/BasicInfo';
import Button from '../components/TeamFormDetail/Button';
import ProjectInfo from '../components/TeamFormDetail/ProjectInfo';
import Situation from '../components/TeamFormDetail/Situation';
import WorkEnviron from '../components/TeamFormDetail/WorkEnviron';
import DraftList from "../components/TemporarySave/DraftList";
import Header from '../layouts/Header';
import type { TeamFormData, StepData } from '../types/Draft';

const TeamPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isListModalOpen, setIsListModalOpen] = useState(false);

  const [basicInfoComplete, setBasicInfoComplete] = useState(false);
  const [projectInfoComplete, setProjectInfoComplete] = useState(false);
  const [situationComplete, setSituationComplete] = useState(false);
  const [workEnvironComplete, setWorkEnvironComplete] = useState(false);
  const [applicantInfoComplete, setApplicantInfoComplete] = useState(false);

  const [formData, setFormData] = useState<TeamFormData>({
    basicInfo: {} as StepData,
    projectInfo: {} as StepData,
    situation: {} as StepData,
    workEnviron: {} as StepData,
    applicantInfo: {} as StepData,
  });

  const sectionRefs = Array.from({ length: 5 }, () => useRef<HTMLDivElement | null>(null));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry) {
          const index = sectionRefs.findIndex(ref => ref.current === visibleEntry.target);
          if (index !== -1) setCurrentStep(index);
        }
      },
      { threshold: 0.5 }
    );

    sectionRefs.forEach(ref => ref.current && observer.observe(ref.current));
    return () => sectionRefs.forEach(ref => ref.current && observer.unobserve(ref.current));
  }, []);

  const handleStepClick = (index: number) => sectionRefs[index].current?.scrollIntoView({ behavior: 'smooth' });

  const allComplete = basicInfoComplete && projectInfoComplete && situationComplete && workEnvironComplete && applicantInfoComplete;

  const handleLoadDraft = (data: TeamFormData) => setFormData(data);

  return (
    <>
      <Header />
      <div className="container">
        <aside className="sidebar_inner">
          <Sidebar currentStep={currentStep} onClickStep={handleStepClick} />
        </aside>

        <main className="scrollArea">
          <section ref={sectionRefs[0]} className="section">
            <BasicInfo
              data={formData.basicInfo}
              setData={(data) => setFormData(prev => ({ ...prev, basicInfo: data }))}
              onCompleteChange={setBasicInfoComplete}
            />
          </section>
          <section ref={sectionRefs[1]} className="section">
            <ProjectInfo
              data={formData.projectInfo}
              setData={(data) => setFormData(prev => ({ ...prev, projectInfo: data }))}
              onCompleteChange={setProjectInfoComplete}
            />
          </section>
          <section ref={sectionRefs[2]} className="section">
            <Situation
              data={formData.situation}
              setData={(data) => setFormData(prev => ({ ...prev, situation: data }))}
              onCompleteChange={setSituationComplete}
            />
          </section>
          <section ref={sectionRefs[3]} className="section">
            <WorkEnviron
              data={formData.workEnviron}
              setData={(data) => setFormData(prev => ({ ...prev, workEnviron: data }))}
              onCompleteChange={setWorkEnvironComplete}
            />
          </section>
          <section ref={sectionRefs[4]} className="section">
            <ApplicantInfo
              data={formData.applicantInfo}
              setData={(data) => setFormData(prev => ({ ...prev, applicantInfo: data }))}
              onCompleteChange={setApplicantInfoComplete}
            />
          </section>

          <Button
            formData={formData}
            setFormData={setFormData}
            currentStep={currentStep}
            disabled={!allComplete}
          />

          <button onClick={() => setIsListModalOpen(true)}>임시저장 목록 보기</button>

          {isListModalOpen && (
            <DraftList
              onClose={() => setIsListModalOpen(false)}
              onLoadDraft={handleLoadDraft}
            />
          )}
        </main>
      </div>
    </>
  );
};

export default TeamPage;
