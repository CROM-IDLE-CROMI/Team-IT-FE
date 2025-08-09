import React, { useRef, useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import ApplicantInfo from '../components/TeamFormDetail/ApplicantInfo';
import BasicInfo from '../components/TeamFormDetail/BasicInfo';
import Button from '../components/TeamFormDetail/Button';
import ProjectInfo from '../components/TeamFormDetail/ProjectInfo';
import Situation from '../components/TeamFormDetail/Situation';
import WorkEnviron from '../components/TeamFormDetail/WorkEnviron';
import Header from '../layouts/Header';

const TeamPage = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const [basicInfoComplete, setBasicInfoComplete] = useState(false);
  const [projectInfoComplete, setProjectInfoComplete] = useState(false);
  const [situationComplete, setSituationComplete] = useState(false);
  const [workEnvironComplete, setWorkEnvironComplete] = useState(false);
  const [applicantInfoComplete, setApplicantInfoComplete] = useState(false);

  const sectionRefs = [
    useRef<HTMLDivElement | null>(null),
    useRef<HTMLDivElement | null>(null),
    useRef<HTMLDivElement | null>(null),
    useRef<HTMLDivElement | null>(null),
    useRef<HTMLDivElement | null>(null),
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry) {
          const index = sectionRefs.findIndex((ref) => ref.current === visibleEntry.target);
          if (index !== -1) {
            setCurrentStep(index);
          }
        }
      },
      {
        threshold: 0.5,
      }
    );

    sectionRefs.forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => {
      sectionRefs.forEach((ref) => {
        if (ref.current) observer.unobserve(ref.current);
      });
    };
  }, []);

  const handleStepClick = (index: number) => {
    sectionRefs[index].current?.scrollIntoView({ behavior: 'smooth' });
  };

  const allComplete =
    basicInfoComplete &&
    projectInfoComplete &&
    situationComplete &&
    workEnvironComplete &&
    applicantInfoComplete;

  return (
    <>
      <Header />
      <div className="container">
        <aside className="sidebar_inner">
          <Sidebar currentStep={currentStep} onClickStep={handleStepClick} />
        </aside>

        <main className="scrollArea">
          <section ref={sectionRefs[0]} className="section">
            <BasicInfo onCompleteChange={setBasicInfoComplete} />
          </section>
          <section ref={sectionRefs[1]} className="section">
            <ProjectInfo onCompleteChange={setProjectInfoComplete} />
          </section>
          <section ref={sectionRefs[2]} className="section">
            <Situation onCompleteChange={setSituationComplete} />
          </section>
          <section ref={sectionRefs[3]} className="section">
            <WorkEnviron onCompleteChange={setWorkEnvironComplete} />
          </section>
          <section ref={sectionRefs[4]} className="section">
            <ApplicantInfo onCompleteChange={setApplicantInfoComplete} />
          </section>
          <div>
            <Button formData={{}} currentStep={currentStep} disabled={!allComplete} />
          </div>
        </main>
      </div>
    </>
  );
};

export default TeamPage;
