/*===================================================================================
=====================TeamPage.tsx====================================================
====================================================================================*/
import { useRef, useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import ApplicantInfo from './TeamFormDetail/ApplicantInfo';
import BasicInfo from './TeamFormDetail/BasicInfo';
import Button from './TeamFormDetail/Button';
import ProjectInfo from './TeamFormDetail/ProjectInfo';
import Situation from './TeamFormDetail/Situation';
import WorkEnviron from './TeamFormDetail/WorkEnviron';
import DraftList from "../components/TemporarySave/DraftList";
import Header from '../layouts/Header';
import AuthGuard from '../components/AuthGuard';
import type { TeamFormData, StepData } from '../types/Draft';
import "./TeamPage.css";

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

  // ✅ Hook 최상위에서 ref 배열 선언
  const sectionRefs: React.RefObject<HTMLDivElement | null>[] = [
  useRef<HTMLDivElement>(null),
  useRef<HTMLDivElement>(null),
  useRef<HTMLDivElement>(null),
  useRef<HTMLDivElement>(null),
  useRef<HTMLDivElement>(null),
];

  // IntersectionObserver로 현재 스크롤 섹션 감지
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        let mostVisibleIndex = currentStep;
        let maxRatio = 0;

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            const index = sectionRefs.findIndex(ref => ref.current === entry.target);
            if (index !== -1) {
              maxRatio = entry.intersectionRatio;
              mostVisibleIndex = index;
            }
          }
        });

        if (mostVisibleIndex !== currentStep) {
          setCurrentStep(mostVisibleIndex);
        }
      },
      { threshold: [0.25, 0.5, 0.75] }
    );

    sectionRefs.forEach(ref => ref.current && observer.observe(ref.current));
    return () => observer.disconnect();
  }, [sectionRefs, currentStep]);

  const handleStepClick = (index: number) => {
    sectionRefs[index].current?.scrollIntoView({ behavior: 'smooth' });
  };

  const allComplete =
    basicInfoComplete &&
    projectInfoComplete &&
    situationComplete &&
    workEnvironComplete &&
    applicantInfoComplete;

  const handleLoadDraft = (data: TeamFormData) => {
    setFormData(data);

    const basicInfo = data.basicInfo || {};
    const projectInfo = data.projectInfo || {};
    const situation = data.situation || {};
    const workEnviron = data.workEnviron || {};
    const applicantInfo = data.applicantInfo || {};

    setBasicInfoComplete(
      basicInfo.peopleCount?.trim() !== '' &&
      basicInfo.startDate !== '' &&
      basicInfo.endDate !== '' &&
      basicInfo.platform?.trim() !== '' &&
      basicInfo.selectedJobs?.length > 0 &&
      basicInfo.selectedTechStacks?.length > 0
    );

    setProjectInfoComplete(
      projectInfo.teamName?.trim() !== '' &&
      projectInfo.playType?.trim() !== '' &&
      projectInfo.startDate !== '' &&
      projectInfo.endDate !== '' &&
      projectInfo.projectStartDate !== '' &&
      projectInfo.selectedJobs?.length > 0
    );

    setSituationComplete(
      situation.title?.trim() !== '' &&
      situation.progress?.trim() !== '' &&
      situation.content?.trim() !== ''
    );

    setWorkEnvironComplete(
      workEnviron.meetingType?.trim() !== '' &&
      workEnviron.locationComplete === true
    );

    setApplicantInfoComplete(
      applicantInfo.minRequirement?.trim() !== '' &&
      applicantInfo.questions?.length > 0
    );
  };

  return (
    <AuthGuard>
      <Header />
      <div className="container">
        {/* 사이드바 */}
        <aside className="sidebar_inner">
          <Sidebar currentStep={currentStep} onClickStep={handleStepClick} />
        </aside>

        {/* 메인 섹션 */}
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

          <button onClick={() => setIsListModalOpen(true)}>임시저장 목록 보기</button>

          {isListModalOpen && (
            <DraftList
              onClose={() => setIsListModalOpen(false)}
              onLoadDraft={handleLoadDraft}
            />
          )}

          <Button
            formData={formData}
            setFormData={setFormData}
            currentStep={currentStep}
            disabled={!allComplete}
          />
        </main>
      </div>
    </AuthGuard>
  );
};

export default TeamPage;
