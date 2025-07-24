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

  // 각 섹션에 대한 ref 배열 생성
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

  return (
    <>
      <Header />
      <div className="container">
        <aside className="sidebar_inner">
          <Sidebar currentStep={currentStep} onClickStep={handleStepClick} />
        </aside>

        <main className="scrollArea">
          <section ref={sectionRefs[0]} className="section">
            <BasicInfo />
          </section>
          <section ref={sectionRefs[1]} className="section">
            <ProjectInfo />
          </section>
          <section ref={sectionRefs[2]} className="section">
            <Situation />
          </section>
          <section ref={sectionRefs[3]} className="section">
            <WorkEnviron />
          </section>
          <section ref={sectionRefs[4]} className="section">
            <ApplicantInfo />
          </section>
          <div>
            <Button formData={{}} currentStep={currentStep} />
          </div>
        </main>
      </div>
    </>
  );
};

export default TeamPage;
