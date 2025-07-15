interface Sidebarprops {
  currentStep: number;
}

const steps = ['기본정보', '프로젝트 정보', '프로젝트 상황', '근무 환경', '지원자 정보'];

const Sidebar = ({ currentStep }: Sidebarprops) => {
  return (
    <div className="sidebar">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`step ${index === currentStep ? 'active' : ''}`}
        >
          <div className="circle"></div>
          <span>{step}</span>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
