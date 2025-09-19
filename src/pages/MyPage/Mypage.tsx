
import { useState, useEffect } from "react";
import ViewProfile from "../../components/MyPageDetail/ViewProfile";
import EditProfile from "../../components/MyPageDetail/EditProfile";
import PublicProfile from "../../components/MyPageDetail/PublicProfile";
import TechStackPopup from "../../components/MyPageDetail/TechStackPopup";
import Header from "../../layouts/Header";
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
  const [activeTab, setActiveTab] = useState<'view' | 'public' | 'edit'>('view');
  const [showTechStackPopup, setShowTechStackPopup] = useState(false);
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

  // 컴포넌트 마운트 시 localStorage에서 프로필 데이터 로드
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        // techStacks가 없는 경우 빈 배열로 초기화
        if (!parsedProfile.techStacks) {
          parsedProfile.techStacks = [];
        }
        setProfileData(parsedProfile);
      } catch (error) {
        console.error('프로필 데이터 로드 실패:', error);
      }
    }
  }, []);

  // 프로필 데이터 변경 시 localStorage에 저장
  const updateProfileData = (newData: Partial<ProfileData>) => {
    const updatedData = { ...profileData, ...newData };
    setProfileData(updatedData);
    localStorage.setItem('userProfile', JSON.stringify(updatedData));
  };

  const handleEditComplete = (updatedData: Partial<ProfileData>) => {
    updateProfileData(updatedData);
    setActiveTab('view');
  };

  const handleTechStackUpdate = (techStacks: TechStack[]) => {
    updateProfileData({ techStacks });
  };

  return (
    <div className="mypage-container">
      <Header />
      
      {/* 탭 네비게이션 */}
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'view' ? 'active' : ''}`}
          onClick={() => setActiveTab('view')}
        >
          내 프로필
        </button>
        <button 
          className={`tab-button ${activeTab === 'public' ? 'active' : ''}`}
          onClick={() => setActiveTab('public')}
        >
          공개 프로필
        </button>
        <button 
          className={`tab-button ${activeTab === 'edit' ? 'active' : ''}`}
          onClick={() => setActiveTab('edit')}
        >
          편집
        </button>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="tab-content">
        {activeTab === 'view' && (
          <ViewProfile 
            onEdit={() => setActiveTab('edit')}
            profileData={profileData}
            onUpdateAwards={(awards) => updateProfileData({ awards })}
            onEditTechStack={() => setShowTechStackPopup(true)}
          />
        )}
        {activeTab === 'public' && (
          <PublicProfile 
            profileData={profileData}
          />
        )}
        {activeTab === 'edit' && (
          <EditProfile 
            profileData={profileData}
            onSave={handleEditComplete}
          />
        )}
      </div>

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
