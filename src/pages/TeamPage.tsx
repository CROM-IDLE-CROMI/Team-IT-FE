import { useRef, useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import ApplicantInfo from './TeamFormDetail/ApplicantInfo';
import BasicInfo from './TeamFormDetail/BasicInfo';
import Button from './TeamFormDetail/Button';
import ProjectInfo from './TeamFormDetail/ProjectInfo';
import Situation from './TeamFormDetail/Situation';
import WorkEnviron from './TeamFormDetail/WorkEnviron';
import Header from '../layouts/Header';
import AuthGuard from '../components/AuthGuard';
import type { TeamFormData } from '../types/Draft';
import "./TeamPage.css";

const TeamPage = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const [basicInfoComplete, setBasicInfoComplete] = useState(false);
  const [projectInfoComplete, setProjectInfoComplete] = useState(false);
  const [situationComplete, setSituationComplete] = useState(false);
  const [workEnvironComplete, setWorkEnvironComplete] = useState(false);
  const [applicantInfoComplete, setApplicantInfoComplete] = useState(false);

  const [formData, setFormData] = useState<TeamFormData>({
    basicInfo: {
      startDate: '',
      endDate: '',
      platform: '',
      customPlatform: '',
      selectedJobs: [],
      customJob: '',
      peopleCount: '',
      selectedTechStacks: []
    },
    projectInfo: {
      teamName: '',
      selectedJobs: [],
      customJob: '',
      otherText: '',
      playType: '',
      customPlayType: '',
      startDate: '',
      endDate: '',
      projectStartDate: ''
    },
    situation: {
      title: '',
      progress: '',
      customProgress: '',
      content: '',
      otherText: ''
    },
    workEnviron: {
      meetingType: '',
      locationComplete: false,
      selectedLocations: [],
      selectedRegion: '서울특별시'
    },
    applicantInfo: {
      questions: [],
      minRequirement: ''
    },
  });


  //  Hook 최상위에서 ref 배열 선언
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
    // 안전한 데이터 병합
    const safeData: TeamFormData = {
      basicInfo: {
        startDate: '',
        endDate: '',
        platform: '',
        customPlatform: '',
        selectedJobs: [],
        customJob: '',
        peopleCount: '',
        selectedTechStacks: [],
        ...(data.basicInfo || {})
      },
      projectInfo: {
        teamName: '',
        selectedJobs: [],
        customJob: '',
        otherText: '',
        playType: '',
        customPlayType: '',
        startDate: '',
        endDate: '',
        projectStartDate: '',
        ...(data.projectInfo || {})
      },
      situation: {
        title: '',
        progress: '',
        customProgress: '',
        content: '',
        otherText: '',
        ...(data.situation || {})
      },
      workEnviron: {
        meetingType: '',
        locationComplete: false,
        selectedLocations: [],
        selectedRegion: '서울특별시',
        ...(data.workEnviron || {})
      },
      applicantInfo: {
        questions: [],
        minRequirement: '',
        ...(data.applicantInfo || {})
      },
    };
    
    setFormData(safeData);

    const basicInfo = safeData.basicInfo;
    const projectInfo = safeData.projectInfo;
    const situation = safeData.situation;
    const workEnviron = safeData.workEnviron;
    const applicantInfo = safeData.applicantInfo;

    setBasicInfoComplete(
      basicInfo.peopleCount?.trim() !== '' &&
      (basicInfo.startDate !== '' && basicInfo.startDate !== null) &&
      (basicInfo.endDate !== '' && basicInfo.endDate !== null) &&
      basicInfo.platform?.trim() !== '' &&
      basicInfo.selectedJobs?.length > 0 &&
      basicInfo.selectedTechStacks?.length > 0
    );

    setProjectInfoComplete(
      projectInfo.teamName?.trim() !== '' &&
      projectInfo.playType?.trim() !== '' &&
      (projectInfo.startDate !== '' && projectInfo.startDate !== null) &&
      (projectInfo.endDate !== '' && projectInfo.endDate !== null) &&
      (projectInfo.projectStartDate !== '' && projectInfo.projectStartDate !== null) &&
      projectInfo.selectedJobs?.length > 0
    );

    setSituationComplete(
      situation.title?.trim() !== '' &&
      situation.progress?.trim() !== '' &&
      situation.content?.trim() !== ''
    );

    setWorkEnvironComplete(
      workEnviron.meetingType?.trim() !== '' &&
      workEnviron.locationComplete === true &&
      workEnviron.selectedLocations?.length > 0
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

          <Button
            formData={formData}
            setFormData={setFormData}
            currentStep={currentStep}
            disabled={!allComplete}
            onLoadDraft={handleLoadDraft}
          />
        </main>
      </div>
    </AuthGuard>
  );
};

export default TeamPage;
