import "./ViewProfile.css";
import { useNavigate } from "react-router-dom";
import { techStacksInit } from "../../styles/TechStack";
import AwardHistoryPopup from "./AwardHistoryPopup";
import { getCurrentUser, getCurrentUserNickname } from "../../utils/authUtils";
import { useState } from "react";

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

type Props = {
  onEdit: () => void;
  profileData: ProfileData;
  onUpdateAwards?: (awards: Award[]) => void;
  onEditTechStack?: () => void;
};


export default function ViewProfile({ onEdit, profileData, onUpdateAwards, onEditTechStack }: Props) {
  const navigate = useNavigate();
  const [showAwardPopup, setShowAwardPopup] = useState(false);
  return (
    <div className="view-profile">
      {/* 기존 프로필 섹션 */}
      <div className="profile-top-section">
        {/* 배경 사진 영역 */}
        <div className="background-photo">
          {profileData.backgroundImage ? (
            <img src={profileData.backgroundImage} alt="배경 사진" className="background-image" />
          ) : (
            <div className="background-placeholder">
              배경 사진
            </div>
          )}
        </div>

        {/* 프로필 정보 영역 */}
        <div className="profile-section">
          {/* 프로필 사진 */}
          <div className="profile-picture-container">
            <div className="profile-avatar">
              {profileData.profileImage ? (
                <img src={profileData.profileImage} alt="프로필 사진" className="profile-image" />
              ) : (
                <div className="user-icon">👤</div>
              )}
            </div>
          </div>

          {/* 사용자 ID와 뱃지 */}
          <div className="user-info">
            <span className="user-id">{getCurrentUser() || "yooze_0x4c888"}</span>
          </div>

          {/* 프로필 편집 버튼 */}
          <button className="profile-edit-btn" onClick={onEdit}>
            프로필 편집
          </button>
        </div>
      </div>

      {/* 새로운 정보 섹션들 */}
      <div className="mypage-layout">
        {/* 왼쪽 컬럼 - 사용자 정보 */}
        <div className="left-column">
          <div className="user-info-section">
            <h3>사용자 정보</h3>
            <div className="info-list">
              <div className="info-item">
                <span className="info-label">닉네임</span>
                <span className="info-value">{getCurrentUserNickname() || profileData.nickname}</span>
              </div>
              <div className="info-item">
                <span className="info-label">생년월일</span>
                <span className="info-value">{profileData.birthDate}</span>
              </div>
              <div className="info-item">
                <span className="info-label">소속기관</span>
                <span className="info-value">{profileData.organization}</span>
              </div>
              <div className="info-item">
                <span className="info-label">이메일</span>
                <span className="info-value">{profileData.email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">직군</span>
                <span className="info-value">{profileData.position}</span>
              </div>
              <div className="info-item">
                <span className="info-label">한 줄 소개</span>
                <span className="info-value">{profileData.introduction}</span>
              </div>
            </div>
            <button className="edit-btn" onClick={onEdit}>
              수정하기
            </button>
          </div>
        </div>

        {/* 오른쪽 컬럼 - 개발 스택 & 수상 이력 */}
        <div className="right-column">
          {/* 개발 스택 섹션 */}
          <div className="skills-section">
            <div className="section-header">
              <h3>개발 스택</h3>
              <button className="edit-btn" onClick={onEditTechStack}>수정하기</button>
            </div>
            <div className="stack-cards">
              {profileData.techStacks && profileData.techStacks.length > 0 ? (
                profileData.techStacks.map((techStack) => {
                  const stackInfo = techStacksInit.find(s => s.value === techStack.id);
                  return (
                    <div key={techStack.id} className="stack-card">
                      {stackInfo && (
                        <div className="stack-item">
                          <img src={stackInfo.icon} alt={techStack.name} className="stack-icon" />
                          <span>{techStack.name}</span>
                        </div>
                      )}
                      <div className="proficiency-levels">
                        <span className={`level ${techStack.level === '상' ? 'high' : techStack.level === '중' ? 'medium' : 'low'}`}>
                          {techStack.level}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="no-stacks">
                  등록된 개발 스택이 없습니다.
                </div>
              )}
            </div>
          </div>

          {/* 수상 이력 섹션 */}
          <div className="awards-section">
            <div className="section-header">
              <h3>수상 이력</h3>
              <button 
                className="edit-btn"
                onClick={() => setShowAwardPopup(true)}
              >
                수정하기
              </button>
            </div>
            <p className="awards-description">
              참가 대회 이름과 수상 내역 (최신순)
            </p>
            <div className="awards-list">
              {profileData.awards && profileData.awards.length > 0 ? (
                profileData.awards.map((award) => (
                  <div key={award.id} className="award-item">
                    <div className="award-info">
                      <div className="award-name">{award.competitionName}</div>
                      <div className="award-details">{award.details}</div>
                    </div>
                    <div className="award-date">{award.awardDate}</div>
                  </div>
                ))
              ) : (
                <div className="award-item no-awards">
                  등록된 수상 이력이 없습니다.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 새로운 섹션들 */}
      <div className="additional-sections">
        {/* 프로젝트 이력 섹션 */}
        <div className="project-history-section">
          <div className="section-header">
            <h3>프로젝트 이력</h3>
            <button className="view-all-btn" onClick={() => navigate("/myprojectmain")}>전체 목록</button>
          </div>
          <div className="project-list">
            {profileData.projects && profileData.projects.length > 0 ? (
              profileData.projects.map((project, index) => (
                <div key={index} className="project-item">
                  {project}
                </div>
              ))
            ) : (
              <div className="project-item">
                등록된 프로젝트가 없습니다.
              </div>
            )}
          </div>
        </div>

        {/* 평점 및 후기 섹션 */}
        <div className="rating-reviews-section">
          <div className="section-header">
            <h3>평점 및 후기</h3>
            <div className="rating-display">
              {profileData.rating ? profileData.rating.toFixed(1) : '0.0'} / 5.0
            </div>
            <button className="view-all-btn">전체 목록</button>
          </div>
          <div className="review-summary">
            <p>총 {profileData.reviewCount || 0}개의 후기가 있습니다.</p>
          </div>
        </div>
      </div>
      
      {/* 수상이력 팝업 */}
      <AwardHistoryPopup
        isOpen={showAwardPopup}
        onClose={() => setShowAwardPopup(false)}
        awards={profileData.awards || []}
        onSave={(awards) => {
          if (onUpdateAwards) {
            onUpdateAwards(awards);
          }
        }}
      />
    </div>
  );
}
