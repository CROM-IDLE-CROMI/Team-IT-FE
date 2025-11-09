
import { useState, useEffect } from "react";
import ViewProfile from "../../components/MyPageDetail/ViewProfile";
import EditProfile from "../../components/MyPageDetail/EditProfile";
import PublicProfile from "../../components/MyPageDetail/PublicProfile";
import TechStackPopup from "../../components/MyPageDetail/TechStackPopup";
import MyPageSidebar from "../../components/MyPageSidebar";
import ScrapedPosts from "../../components/ScrapedPosts";
import MyPosts from "../../components/MyPosts";
import Header from "../../layouts/Header";
import { mypageService, type Award as ApiAward, type Stack, type StackDetail } from "../../services/mypageService";
import { getCurrentUser } from "../../utils/authUtils";
import "./Mypage.css";

interface Award {
  id: string;
  competitionName: string;
  details: string;
  awardDate: string;
  websiteUrl?: string;
}

interface TechStack {
  id: string;
  name: string;
  level: '상' | '중' | '하';
}

interface ProfileData {
  profileImage: string | null;
  backgroundImage: string | null;
  nickname: string;
  birthDate: string;
  organization: string;
  email: string;
  position: string;
  introduction: string;
  projects: string[];
  rating: number;
  reviewCount: number;
  awards: Award[];
  techStacks: TechStack[];
}

export default function Mypage() {
  const [activeTab, setActiveTab] = useState<'view' | 'public' | 'edit' | 'interest' | 'posts' | 'scrapped' | 'inbox'>('view');
  const [showTechStackPopup, setShowTechStackPopup] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    profileImage: null,
    backgroundImage: null,
    nickname: "홍길동",
    birthDate: "1995-03-15",
    organization: "서울대학교",
    email: "hong@example.com",
    position: "프론트엔드 개발자",
    introduction: "열정적인 개발자입니다",
    projects: [
      "TEAM-IT 내에서 이루어진 대표 프로젝트 (최신순)",
      "웹 개발 프로젝트 - React 기반 쇼핑몰",
      "모바일 앱 개발 - Flutter 기반 일정 관리 앱"
    ],
    rating: 4.5,
    reviewCount: 12,
    awards: [
      {
        id: "1",
        competitionName: "2023 해커톤 대회",
        details: "우수상 - 웹 개발 부문",
        awardDate: "2023. 12. 15"
      },
      {
        id: "2", 
        competitionName: "2022 코딩 테스트",
        details: "1등 - 알고리즘 문제 해결",
        awardDate: "2022. 08. 20"
      }
    ],
    techStacks: [
      { id: "React", name: "React", level: "상" },
      { id: "Nodejs", name: "Node.js", level: "중" },
      { id: "TypeScript", name: "TypeScript", level: "하" }
    ]
  });

  // API 응답을 컴포넌트 데이터 구조로 변환
  const convertApiAwardToAward = (apiAward: ApiAward, index: number): Award => {
    // 날짜 형식 변환: YYYY-MM-DD -> YYYY. MM. DD
    let formattedDate = apiAward.awardDate || '';
    if (formattedDate && formattedDate.includes('-')) {
      formattedDate = formattedDate.replace(/-/g, '. ');
    }
    
    return {
      id: `award-${index}`,
      competitionName: apiAward.awardName || '',
      details: apiAward.description || '',
      awardDate: formattedDate,
    };
  };

  const convertStackToTechStack = (stack: StackDetail): TechStack => {
    const levelMap: Record<string, '상' | '중' | '하'> = {
      'high': '상',
      'medium': '중',
      'low': '하',
    };
    
    return {
      id: stack.stackName,
      name: stack.stackName,
      level: levelMap[stack.level] || '중',
    };
  };

  // 백엔드 API에서 프로필 데이터 로드
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const uid = getCurrentUser();
        if (!uid) {
          console.warn('사용자 ID가 없습니다.');
          return;
        }

        // 프로필 정보 조회
        const profile = await mypageService.getProfile(uid);
        
        // 수상 내역 조회
        const awards = await mypageService.getAwards(uid);
        
        // 평가 조회 (후기 개수 계산용)
        const ratings = await mypageService.getRatings(uid);

        // API 응답을 컴포넌트 데이터 구조로 변환
        const convertedProfileData: ProfileData = {
          profileImage: profile.profileImg || null,
          backgroundImage: profile.backgroundImg || null,
          nickname: profile.nickName || '',
          birthDate: profile.birthDay ? profile.birthDay.split('T')[0] : '',
          organization: profile.organization || '',
          email: profile.email || '',
          position: profile.position || '',
          introduction: profile.description || '',
          projects: profile.projects || [],
          rating: profile.stars || 0,
          reviewCount: ratings.length || 0,
          awards: awards.map((award, index) => convertApiAwardToAward(award, index)),
          techStacks: (profile.stacks || []).map(convertStackToTechStack),
        };

        setProfileData(convertedProfileData);
      } catch (error) {
        console.error('프로필 데이터 로드 실패:', error);
        // 에러 발생 시 기본값 유지 또는 에러 처리
      }
    };

    loadProfileData();
  }, []);

  // 백엔드 API로 프로필 데이터 업데이트
  const updateProfileData = async (newData: Partial<ProfileData>) => {
    try {
      const uid = getCurrentUser();
      if (!uid) {
        console.warn('사용자 ID가 없습니다.');
        return;
      }

      // 로컬 상태 업데이트 (즉시 UI 반영)
      const updatedData = { ...profileData, ...newData };
      setProfileData(updatedData);

      // 수상 내역이 변경된 경우 API 호출
      if (newData.awards) {
        const apiAwards: ApiAward[] = newData.awards.map((award) => {
          // 날짜 형식 변환: YYYY. MM. DD -> YYYY-MM-DD
          let formattedDate = award.awardDate;
          if (formattedDate && formattedDate.includes('.')) {
            formattedDate = formattedDate.replace(/\.\s*/g, '-').replace(/\s/g, '');
          }
          
          return {
            awardName: award.competitionName,
            organization: '', // 컴포넌트 구조에 없으므로 빈 문자열
            awardDate: formattedDate,
            description: award.details,
          };
        });
        await mypageService.updateAwards(uid, apiAwards);
      }

      // TODO: 프로필 정보 수정 API가 있으면 여기에 추가
      // await mypageService.updateProfile(uid, { ... });

      console.log('프로필 데이터 업데이트 완료');
    } catch (error) {
      console.error('프로필 데이터 업데이트 실패:', error);
      // 에러 발생 시 이전 상태로 복원하거나 에러 메시지 표시
    }
  };

  const handleEditComplete = async (updatedData: Partial<ProfileData>) => {
    await updateProfileData(updatedData);
    setActiveTab('view');
  };

  const handleTechStackUpdate = async (techStacks: TechStack[]) => {
    try {
      const uid = getCurrentUser();
      if (!uid) {
        console.warn('사용자 ID가 없습니다.');
        return;
      }

      // 컴포넌트의 TechStack을 API의 Stack 형식으로 변환
      const stacks = await mypageService.getStacks();
      
      // 기존 스택 정보와 새로 선택된 스택을 매핑
      const updatedStacks: Stack[] = techStacks.map((techStack) => {
        // 기존 스택 정보에서 찾거나 새로 생성
        const existingStack = stacks.find(s => s.iconUrl?.includes(techStack.name.toLowerCase()));
        
        const levelMap: Record<'상' | '중' | '하', 'high' | 'medium' | 'low'> = {
          '상': 'high',
          '중': 'medium',
          '하': 'low',
        };

        return {
          stackId: existingStack?.stackId || 0, // 실제로는 스택 ID를 매핑해야 함
          level: levelMap[techStack.level] || 'medium',
          isRepresentative: false, // 대표 스택 설정 로직 필요
          iconUrl: existingStack?.iconUrl || '',
        };
      });

      // API 호출
      await mypageService.updateStacks(updatedStacks);
      
      // 로컬 상태 업데이트
      updateProfileData({ techStacks });
    } catch (error) {
      console.error('스택 업데이트 실패:', error);
    }
  };

  const handleTabChange = (tab: 'view' | 'public' | 'edit' | 'interest' | 'posts' | 'scrapped' | 'inbox') => {
    setActiveTab(tab);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'view':
        return (
          <ViewProfile 
            onEdit={() => setActiveTab('edit')}
            profileData={profileData}
            onUpdateAwards={(awards) => updateProfileData({ awards })}
            onEditTechStack={() => setShowTechStackPopup(true)}
          />
        );
      case 'public':
        return (
          <PublicProfile 
            profileData={profileData}
          />
        );
      case 'edit':
        return (
          <EditProfile 
            profileData={profileData}
            onSave={handleEditComplete}
          />
        );
      case 'interest':
        return (
          <div className="content-placeholder">
            <h2>나의 관심 프로젝트</h2>
            <p>관심 프로젝트 목록이 여기에 표시됩니다.</p>
          </div>
        );
      case 'posts':
        return <MyPosts />;
      case 'scrapped':
        return <ScrapedPosts />;
      case 'inbox':
      default:
        return null;
    }
  };

  return (
    <div className="mypage-container">
      <Header />

      {/* 옵션 버튼 */}
      <button className="option-toggle-btn" onClick={toggleSidebar}>
        <img src="/Option.png" alt="옵션" className="option-icon" />
      </button>

      {/* 탭 콘텐츠 */}
      <div className="tab-content">
        {renderContent()}
      </div>

      {/* 사이드바 */}
      <MyPageSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* 개발스택 수정 팝업 */}
      <TechStackPopup
        isOpen={showTechStackPopup}
        onClose={() => setShowTechStackPopup(false)}
        onSave={handleTechStackUpdate}
        currentTechStacks={profileData.techStacks || []}
      />
    </div>
  );
}
