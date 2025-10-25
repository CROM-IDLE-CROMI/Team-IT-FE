import { useRef, useEffect, useState, useCallback } from 'react';
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
import { saveTeamDraft, loadTeamDraft, clearTeamDraft, hasTeamDraft, getTeamDraftInfo } from '../utils/teamDraftUtils';
import "./TeamPage.css";

const TeamPage = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const [basicInfoComplete, setBasicInfoComplete] = useState(false);
  const [projectInfoComplete, setProjectInfoComplete] = useState(false);
  const [situationComplete, setSituationComplete] = useState(false);
  const [workEnvironComplete, setWorkEnvironComplete] = useState(false);
  const [applicantInfoComplete, setApplicantInfoComplete] = useState(false);

  // 임시저장 관련 상태
  const [hasDraft, setHasDraft] = useState(false);
  const [showLoadDraftModal, setShowLoadDraftModal] = useState(false);

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

  // formData 변경 감지 (무한 루프 방지를 위해 제거)
  // useEffect(() => {
  //   console.log('formData 변경됨:', formData);
  // }, [formData]);


  //  Hook 최상위에서 ref 배열 선언
  const sectionRefs: React.RefObject<HTMLDivElement | null>[] = [
  useRef<HTMLDivElement>(null),
  useRef<HTMLDivElement>(null),
  useRef<HTMLDivElement>(null),
  useRef<HTMLDivElement>(null),
  useRef<HTMLDivElement>(null),
];

  // 컴포넌트 마운트 시 임시저장 데이터 확인 및 자동 로드
  useEffect(() => {
    const hasDraftData = hasTeamDraft();
    setHasDraft(hasDraftData);
    
    // 임시저장 데이터가 있으면 자동으로 불러오기 여부를 묻기
    if (hasDraftData) {
      const draftInfo = getTeamDraftInfo();
      if (draftInfo && window.confirm(
        `임시저장된 데이터가 있습니다.\n제목: ${draftInfo.title}\n저장시간: ${new Date(draftInfo.savedAt).toLocaleString()}\n\n불러오시겠습니까?`
      )) {
        const draftData = loadTeamDraft();
        if (draftData) {
          handleLoadDraft(draftData);
        }
      }
    }
  }, []); // handleLoadDraft 의존성 제거하여 무한 루프 방지

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

  // setFormData 함수들을 메모이제이션하여 무한 루프 방지
  const setBasicInfoData = useCallback((data: any) => {
    setFormData(prev => ({ ...prev, basicInfo: data }));
  }, []);

  const setProjectInfoData = useCallback((data: any) => {
    setFormData(prev => ({ ...prev, projectInfo: data }));
  }, []);

  const setSituationData = useCallback((data: any) => {
    setFormData(prev => ({ ...prev, situation: data }));
  }, []);

  const setWorkEnvironData = useCallback((data: any) => {
    setFormData(prev => ({ ...prev, workEnviron: data }));
  }, []);

  const setApplicantInfoData = useCallback((data: any) => {
    setFormData(prev => ({ ...prev, applicantInfo: data }));
  }, []);

  // 임시저장 관련 함수들
  const handleSaveDraft = () => {
    console.log('현재 formData:', formData); // 디버깅용
    console.log('basicInfo:', formData.basicInfo);
    console.log('projectInfo:', formData.projectInfo);
    console.log('situation:', formData.situation);
    console.log('workEnviron:', formData.workEnviron);
    console.log('applicantInfo:', formData.applicantInfo);
    saveTeamDraft(formData);
    setHasDraft(true);
    alert('임시저장이 완료되었습니다.');
  };

  const handleLoadDraftClick = () => {
    setShowLoadDraftModal(true);
  };

  const handleConfirmLoadDraft = () => {
    console.log('불러오기 시작...');
    const draftData = loadTeamDraft();
    console.log('불러온 draftData:', draftData);
    
    if (draftData) {
      console.log('handleLoadDraft 호출 전 formData:', formData);
      handleLoadDraft(draftData);
      console.log('handleLoadDraft 호출 후 formData:', formData);
      setShowLoadDraftModal(false);
      alert('임시저장된 데이터를 불러왔습니다.');
    } else {
      alert('불러올 데이터가 없습니다.');
    }
  };

  const handleCancelLoadDraft = () => {
    setShowLoadDraftModal(false);
  };

  const handleClearDraft = () => {
    if (window.confirm('임시저장된 데이터를 삭제하시겠습니까?')) {
      clearTeamDraft();
      setHasDraft(false);
      alert('임시저장된 데이터가 삭제되었습니다.');
    }
  };

  const allComplete =
    basicInfoComplete &&
    projectInfoComplete &&
    situationComplete &&
    workEnvironComplete &&
    applicantInfoComplete;

  const handleLoadDraft = (data: TeamFormData) => {
    console.log('handleLoadDraft 호출됨, 받은 데이터:', data);
    
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
    
    console.log('병합된 safeData:', safeData);
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
              setData={setBasicInfoData}
              onCompleteChange={setBasicInfoComplete}
            />
          </section>

          <section ref={sectionRefs[1]} className="section">
            <ProjectInfo
              data={formData.projectInfo}
              setData={setProjectInfoData}
              onCompleteChange={setProjectInfoComplete}
            />
          </section>

          <section ref={sectionRefs[2]} className="section">
            <Situation
              data={formData.situation}
              setData={setSituationData}
              onCompleteChange={setSituationComplete}
            />
          </section>

          <section ref={sectionRefs[3]} className="section">
            <WorkEnviron
              data={formData.workEnviron}
              setData={setWorkEnvironData}
              onCompleteChange={setWorkEnvironComplete}
            />
          </section>

          <section ref={sectionRefs[4]} className="section">
            <ApplicantInfo
              data={formData.applicantInfo}
              setData={setApplicantInfoData}
              onCompleteChange={setApplicantInfoComplete}
            />
          </section>

          {/* 임시저장 버튼들 */}
          <div className="draftButtons">
            <button 
              className="draftBtn saveBtn" 
              onClick={handleSaveDraft}
              title="현재 작성 중인 내용을 임시저장합니다"
            >
              💾 임시저장
            </button>
            {hasDraft && (
              <>
                <button 
                  className="draftBtn loadBtn" 
                  onClick={handleLoadDraftClick}
                  title="임시저장된 내용을 불러옵니다"
                >
                  📂 불러오기
                </button>
                <button 
                  className="draftBtn clearBtn" 
                  onClick={handleClearDraft}
                  title="임시저장된 내용을 삭제합니다"
                >
                  🗑️ 삭제
                </button>
              </>
            )}
          </div>

          <Button
            formData={formData}
            setFormData={setFormData}
            currentStep={currentStep}
            disabled={!allComplete}
            onLoadDraft={handleLoadDraft}
          />
        </main>
      </div>

      {/* 불러오기 확인 모달 */}
      {showLoadDraftModal && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h3>임시저장 불러오기</h3>
            <p>현재 작성 중인 내용이 사라집니다. 임시저장된 데이터를 불러오시겠습니까?</p>
            <div className="modalButtons">
              <button className="modalBtn confirmBtn" onClick={handleConfirmLoadDraft}>
                불러오기
              </button>
              <button className="modalBtn cancelBtn" onClick={handleCancelLoadDraft}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthGuard>
  );
};

export default TeamPage;
