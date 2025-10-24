# 백엔드 API 연동 가이드

이 문서는 팀원 모집 프로젝트에서 백엔드 API를 어떻게 사용하는지 설명합니다.

## 📂 서비스 구조

```
src/
├── utils/
│   └── api.ts                    # 공통 API 유틸리티
└── services/
    ├── teamRecruitService.ts     # 팀원 모집 서비스
    └── applicationService.ts     # 지원 서비스
```

## 🔧 설정

### 1. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 백엔드 API 주소를 입력하세요:

```env
VITE_API_URL=http://localhost:4000
```

### 2. 인증 토큰

- 로그인 시 서버에서 받은 토큰을 `localStorage`에 `accessToken` 키로 저장합니다.
- API 요청 시 자동으로 `Authorization: Bearer {token}` 헤더가 추가됩니다.

---

## 📋 팀원 모집 API (TeamRecruitService)

### 1️⃣ 팀원 모집 등록 (POST)

```typescript
import { teamRecruitService } from '../services/teamRecruitService';

// 사용 예시: Button.tsx
const handleRegister = async () => {
  try {
    const projectData = {
      title: "웹 개발 프로젝트",
      description: "React와 Node.js를 사용한 프로젝트입니다.",
      location: {
        region: "서울특별시",
        districts: ["강남구"]
      },
      techStack: ["React", "Node.js"],
      positions: ["프론트엔드", "백엔드"],
      teamSize: "5명",
      recruitEndDate: "2025-02-01",
      startDate: "2025-02-15",
      endDate: "2025-05-15",
      activityType: "웹",
      progress: "아이디어 구상 중",
      method: "온/오프라인"
    };

    const response = await teamRecruitService.create(projectData);
    console.log('등록 성공:', response);
    // 응답: { success: true, id: 123, message: "등록 완료", data: {...} }
    
  } catch (error) {
    console.error('등록 실패:', error);
  }
};
```

**API 요청:**
- **Method:** `POST`
- **URL:** `/api/team-recruit`
- **Headers:** `Authorization: Bearer {token}`
- **인증:** 필요 

---

### 2️⃣ 팀원 모집 목록 조회 (GET)

```typescript
import { teamRecruitService } from '../services/teamRecruitService';

// 사용 예시: ProjectPage.tsx
const loadProjects = async () => {
  try {
    // 필터 옵션 (선택사항)
    const filters = {
      page: 1,
      pageSize: 10,
      search: "React",              // 검색어
      activityType: ["웹", "앱"],   // 활동 유형
      positions: ["프론트엔드"],     // 직군
      techStack: ["React"],          // 기술 스택
      region: "서울특별시",          // 지역
      progress: ["아이디어 구상 중"] // 진행 상황
    };

    const response = await teamRecruitService.getList(filters);
    console.log('목록 조회 성공:', response);
    // 응답: { data: [...], total: 50, page: 1, pageSize: 10 }
    
  } catch (error) {
    console.error('목록 조회 실패:', error);
  }
};

// 필터 없이 전체 조회
const loadAllProjects = async () => {
  const response = await teamRecruitService.getList();
  console.log('전체 목록:', response.data);
};
```

**API 요청:**
- **Method:** `GET`
- **URL:** `/api/team-recruit?page=1&pageSize=10&q=React&activityType=웹...`
- **Headers:** 없음 (공개 조회)
- **인증:** 불필요 ❌

---

### 3️⃣ 팀원 모집 상세 조회 (GET)

```typescript
import { teamRecruitService } from '../services/teamRecruitService';

// 사용 예시: ProjectDetail.tsx
const loadProjectDetail = async (projectId: number) => {
  try {
    const project = await teamRecruitService.getDetail(projectId);
    console.log('상세 조회 성공:', project);
    // 응답: { id: 1, title: "...", description: "...", ... }
    
  } catch (error) {
    console.error('상세 조회 실패:', error);
  }
};

// 실제 사용
loadProjectDetail(123);
```

**API 요청:**
- **Method:** `GET`
- **URL:** `/api/team-recruit/123`
- **Headers:** 없음 (공개 조회)
- **인증:** 불필요 ❌

---

### 4️⃣ 팀원 모집 수정 (PUT)

```typescript
import { teamRecruitService } from '../services/teamRecruitService';

// 사용 예시: ProjectEdit.tsx
const updateProject = async (projectId: number) => {
  try {
    // 수정할 데이터만 전달 (전체 데이터 불필요)
    const updateData = {
      title: "수정된 제목",
      description: "수정된 설명",
      recruitEndDate: "2025-03-01"
    };

    const response = await teamRecruitService.update(projectId, updateData);
    console.log('수정 성공:', response);
    
  } catch (error) {
    console.error('수정 실패:', error);
  }
};

updateProject(123);
```

**API 요청:**
- **Method:** `PUT`
- **URL:** `/api/team-recruit/123`
- **Headers:** `Authorization: Bearer {token}`
- **인증:** 필요 ✅

---

### 5️⃣ 팀원 모집 삭제 (DELETE)

```typescript
import { teamRecruitService } from '../services/teamRecruitService';

// 사용 예시: ProjectDetail.tsx (삭제 버튼)
const deleteProject = async (projectId: number) => {
  try {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    
    const response = await teamRecruitService.delete(projectId);
    console.log('삭제 성공:', response);
    // 응답: { success: true, message: "삭제 완료" }
    
    alert('삭제되었습니다.');
    navigate('/Projects');
    
  } catch (error) {
    console.error('삭제 실패:', error);
  }
};

deleteProject(123);
```

**API 요청:**
- **Method:** `DELETE`
- **URL:** `/api/team-recruit/123`
- **Headers:** `Authorization: Bearer {token}`
- **인증:** 필요 ✅

---

## 📝 지원 API (ApplicationService)

### 1️⃣ 팀원 모집 지원하기 (POST)

```typescript
import { applicationService } from '../services/applicationService';

// 사용 예시: ProjectApply.tsx
const handleApply = async () => {
  try {
    const applicationData = {
      teamRecruitId: 123,           // 지원할 팀원 모집 ID
      position: "프론트엔드",        // 지원 직군
      message: "열심히 하겠습니다!", // 지원 메시지
      portfolio: "https://portfolio.com", // 포트폴리오
      answers: [                     // 질문 답변
        { questionId: 1, answer: "React와 TypeScript를 잘 다룹니다." },
        { questionId: 2, answer: "쇼핑몰 프로젝트를 만들었습니다." }
      ]
    };

    const response = await applicationService.submit(applicationData);
    console.log('지원 성공:', response);
    // 응답: { success: true, id: 456, message: "지원 완료", data: {...} }
    
    alert('지원서가 제출되었습니다!');
    
  } catch (error) {
    console.error('지원 실패:', error);
  }
};
```

**API 요청:**
- **Method:** `POST`
- **URL:** `/api/applications`
- **Headers:** `Authorization: Bearer {token}`
- **인증:** 필요 ✅

---

### 2️⃣ 내 지원 목록 조회 (GET)

```typescript
import { applicationService } from '../services/applicationService';

// 사용 예시: MyApplications.tsx
const loadMyApplications = async () => {
  try {
    const response = await applicationService.getMyApplications();
    console.log('내 지원 목록:', response.data);
    // 응답: { data: [...], total: 5 }
    
  } catch (error) {
    console.error('조회 실패:', error);
  }
};
```

**API 요청:**
- **Method:** `GET`
- **URL:** `/api/applications/my`
- **Headers:** `Authorization: Bearer {token}`
- **인증:** 필요 ✅

---

### 3️⃣ 특정 팀원 모집의 지원자 목록 조회 (GET)

```typescript
import { applicationService } from '../services/applicationService';

// 사용 예시: ProjectDetail.tsx (작성자가 지원자 확인)
const loadApplicants = async (teamRecruitId: number) => {
  try {
    const response = await applicationService.getApplicationsByTeamRecruit(teamRecruitId);
    console.log('지원자 목록:', response.data);
    
  } catch (error) {
    console.error('조회 실패:', error);
  }
};

loadApplicants(123);
```

**API 요청:**
- **Method:** `GET`
- **URL:** `/api/applications?teamRecruitId=123`
- **Headers:** `Authorization: Bearer {token}`
- **인증:** 필요 ✅

---

## 🎯 실전 예제: 완전한 플로우

### 시나리오: 팀원 모집 등록 → 지원하기

```typescript
// 1단계: 팀원 모집 등록 (Button.tsx)
const registerTeamRecruit = async () => {
  const response = await teamRecruitService.create({
    title: "웹 개발 프로젝트",
    // ... 기타 정보
  });
  
  const newProjectId = response.id; // 123
  console.log('등록된 프로젝트 ID:', newProjectId);
};

// 2단계: 다른 사용자가 목록에서 확인 (ProjectPage.tsx)
const loadProjects = async () => {
  const response = await teamRecruitService.getList();
  console.log('프로젝트 목록:', response.data);
  // [{ id: 123, title: "웹 개발 프로젝트", ... }]
};

// 3단계: 상세 페이지에서 확인 (ProjectDetail.tsx)
const loadDetail = async () => {
  const project = await teamRecruitService.getDetail(123);
  console.log('프로젝트 상세:', project);
};

// 4단계: 지원하기 (ProjectApply.tsx)
const applyToProject = async () => {
  const response = await applicationService.submit({
    teamRecruitId: 123,
    position: "프론트엔드",
    message: "지원합니다!",
    // ... 기타 정보
  });
  console.log('지원 완료:', response);
};

// 5단계: 작성자가 지원자 확인 (ProjectDetail.tsx)
const checkApplicants = async () => {
  const applicants = await applicationService.getApplicationsByTeamRecruit(123);
  console.log('지원자 목록:', applicants.data);
};
```

---

## 🐛 에러 처리

모든 서비스 함수는 에러 발생 시 `throw`합니다. `try-catch`로 처리하세요:

```typescript
try {
  const response = await teamRecruitService.create(data);
  // 성공 처리
} catch (error: any) {
  // 에러 타입별 처리
  if (error.message.includes('401')) {
    alert('로그인이 필요합니다.');
  } else if (error.message.includes('404')) {
    alert('프로젝트를 찾을 수 없습니다.');
  } else {
    alert(error.message || '오류가 발생했습니다.');
  }
}
```

---

## 📊 개발자 도구에서 확인하기

### Console 탭
```
🚀 API 요청: POST http://localhost:4000/api/team-recruit
📤 팀원 모집 등록 요청: { title: "...", ... }
✅ 팀원 모집 등록 성공: { success: true, id: 123 }
```

### Network 탭
1. F12 → Network 탭
2. API 요청 클릭 (예: `team-recruit`)
3. 확인 항목:
   - **Headers:** 요청 헤더 (Authorization 토큰)
   - **Payload:** 전송한 데이터
   - **Response:** 서버 응답

---

## ✅ 체크리스트

백엔드 연동 전 확인사항:

- [ ] `.env` 파일에 `VITE_API_URL` 설정
- [ ] 백엔드 서버 실행 중
- [ ] 로그인 후 `localStorage`에 `accessToken` 저장 확인
- [ ] 백엔드 개발자에게 API 명세 문서 받기
- [ ] CORS 설정 완료 확인

---

## 🚀 다음 단계

1. 백엔드 개발자에게 실제 API 엔드포인트 확인
2. `.env` 파일에 서버 주소 입력
3. 개발 서버 재시작 (`yarn dev`)
4. 기능 테스트
5. 에러 발생 시 개발자 도구 확인

질문이 있으면 언제든 물어보세요! 😊


