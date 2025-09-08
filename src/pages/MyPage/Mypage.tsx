
import { useState, useEffect } from "react";
import ViewProfile from "../../components/MyPageDetail/ViewProfile";
import EditProfile from "../../components/MyPageDetail/EditProfile";
import Header from "../../layouts/Header";
import "./Mypage.css";

interface Award {
  id: string;
  competitionName: string;
  details: string;
  awardDate: string;
  websiteUrl?: string;
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
}

export default function Mypage() {
  const [isEditing, setIsEditing] = useState(false);
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
    ]
  });

  // 컴포넌트 마운트 시 localStorage에서 프로필 데이터 로드
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
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
    setIsEditing(false);
  };

  return (
    <div className="mypage-container">
      <Header />
      {isEditing ? (
        <EditProfile 
          profileData={profileData}
          onSave={handleEditComplete}
        />
      ) : (
        <ViewProfile 
          onEdit={() => setIsEditing(true)}
          profileData={profileData}
          onUpdateAwards={(awards) => updateProfileData({ awards })}
        />
      )}
    </div>
  );
}
