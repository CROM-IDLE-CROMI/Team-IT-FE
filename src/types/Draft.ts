export interface TeamFormData {
    basicInfo: StepData;
    projectInfo: StepData;
    situation: StepData;
    workEnviron: StepData;
    applicantInfo: StepData;
}

export interface StepData {
    [key: string]: any; // 각 단계의 데이터
}

export interface Draft {
  id: string;
  title: string;
  data: { [step: string]: StepData }; // 각 단계의 데이터    
  savedAt: string;
}
