import "./PublicProfile.css";
import { useNavigate } from "react-router-dom";
import { techStacksInit } from "../../styles/TechStack";
import { getCurrentUser, getCurrentUserNickname } from "../../utils/authUtils";

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

type Props = {
  profileData: ProfileData;
};

const reactStack = techStacksInit.find((s) => s.value === "React");
const nodeStack = techStacksInit.find((s) => s.value === "Nodejs");
const tsStack = techStacksInit.find((s) => s.value === "TypeScript");

export default function PublicProfile({ profileData }: Props) {
  const navigate = useNavigate();

  return (
    <div className="public-profile">
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
            <span className="user-id">{getCurrentUser() || "사용자 ID"}</span>
            <div className="user-badge">
              <div className="badge-placeholder"></div>
            </div>
          </div>

          {/* 자세히 보기 버튼 */}
          <button className="profile-edit-btn" onClick={() => navigate("/profile/detail")}>
            자세히 보기
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
            <button className="edit-btn" onClick={() => navigate("/profile/detail")}>
              자세히 보기
            </button>
          </div>
        </div>

        {/* 오른쪽 컬럼 - 개발 스택 & 수상 이력 */}
        <div className="right-column">
          {/* 개발 스택 섹션 */}
          <div className="skills-section">
            <div className="section-header">
              <h3>개발 스택</h3>
              <button className="edit-btn" onClick={() => navigate("/profile/detail")}>
                자세히 보기
              </button>
            </div>
            <div className="stack-cards">
              <div className="stack-card">
               {reactStack && (
        <div className="stack-item">
          <img src={reactStack.icon} className="stack-icon" />
          <span>{reactStack.label}</span>
        </div>
      )}
                <div className="proficiency-levels">
                  <span className="level high">상</span>
                </div>
              </div>
              <div className="stack-card">
                 {nodeStack && (
        <div className="stack-item">
          <img src={nodeStack.icon} alt={nodeStack.label} className="stack-icon" />
          <span>{nodeStack.label}</span>
        </div>
      )}
                <div className="proficiency-levels">
                  <span className="level medium">중</span>
                </div>
              </div>
              <div className="stack-card">
                {tsStack && (
        <div className="stack-item">
          <img src={tsStack.icon} alt={tsStack.label} className="stack-icon" />
          <span>{tsStack.label}</span>
        </div>
      )}
                <div className="proficiency-levels">
                  <span className="level low">하</span>
                </div>
              </div>
            </div>
          </div>

          {/* 수상 이력 섹션 */}
          <div className="awards-section">
            <div className="section-header">
              <h3>수상 이력</h3>
              <button 
                className="edit-btn"
                onClick={() => navigate("/profile/detail")}
              >
                자세히 보기
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
            <button className="view-all-btn" onClick={() => navigate("/Myproject")}>전체 목록</button>
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
    </div>
  );
}
