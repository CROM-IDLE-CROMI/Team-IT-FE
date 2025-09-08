import React, { useState, useRef } from "react";
import "./EditProfile.css";
import AwardHistoryPopup from "./AwardHistoryPopup";

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
  onSave: (data: Partial<ProfileData>) => void;
};

export default function EditProfile({ profileData, onSave }: Props) {
  const [profileImage, setProfileImage] = useState<string | null>(profileData.profileImage);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(profileData.backgroundImage);
  const [showAwardPopup, setShowAwardPopup] = useState(false);
  const [formData, setFormData] = useState({
    nickname: profileData.nickname,
    birthDate: profileData.birthDate,
    organization: profileData.organization,
    email: profileData.email,
    position: profileData.position,
    introduction: profileData.introduction,
    projects: profileData.projects,
    rating: profileData.rating,
    reviewCount: profileData.reviewCount,
    awards: profileData.awards || []
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'background') => {
    const file = event.target.files?.[0];
    if (file) {
      // 파일 형식 검증
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
      }

      // 파일 크기 검증 (5MB 제한)
      if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB 이하여야 합니다.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (type === 'profile') {
          setProfileImage(result);
        } else {
          setBackgroundImage(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleBackgroundImageClick = () => {
    backgroundInputRef.current?.click();
  };

  const handleSave = () => {
    const updatedData = {
      profileImage,
      backgroundImage,
      ...formData
    };
    onSave(updatedData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProjectChange = (index: number, value: string) => {
    const newProjects = [...formData.projects];
    newProjects[index] = value;
    setFormData(prev => ({
      ...prev,
      projects: newProjects
    }));
  };

  const addProject = () => {
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, ""]
    }));
  };

  const removeProject = (index: number) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };
  return (
    <div className="view-profile">
      {/* 기존 프로필 섹션 */}
      <div className="profile-top-section">
        {/* 배경 사진 영역 */}
        <div className="background-photo">
          {backgroundImage ? (
            <img src={backgroundImage} alt="배경 사진" className="background-image" />
          ) : (
            <div className="background-placeholder">
              배경 사진
            </div>
          )}
          <div className="edit-overlay always-visible" onClick={handleBackgroundImageClick}>
            <div className="edit-icon">+</div>
            <button className="edit-btn" type="button">배경 수정</button>
          </div>
          <input
            type="file"
            ref={backgroundInputRef}
            onChange={(e) => handleImageUpload(e, 'background')}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </div>

        {/* 프로필 정보 영역 */}
        <div className="profile-section">
          {/* 프로필 사진 */}
          <div className="profile-picture-container">
            <div className="profile-avatar" onClick={handleProfileImageClick}>
              {profileImage ? (
                <img src={profileImage} alt="프로필 사진" className="profile-image" />
              ) : (
                <div className="profile-placeholder">
                  프로필 사진
                </div>
              )}
              <div className="add-photo-overlay always-visible">
                <div className="add-icon">+</div>
                <span className="add-text">프로필 사진 추가</span>
              </div>
            </div>
            <div className="border-edit-label always-visible">테두리 수정</div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleImageUpload(e, 'profile')}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>

          {/* 사용자 ID와 뱃지 */}
          <div className="user-info">
            <span className="user-id">사용자 ID</span>
            <div className="user-badge">
              <div className="badge-edit-overlay always-visible">
                <div className="badge-icon">+</div>
                <button className="badge-edit-btn">뱃지 수정</button>
              </div>
            </div>
          </div>

          {/* 수정 완료 버튼 */}
          <button className="profile-edit-btn" onClick={handleSave}>
            수정 완료
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
                <input 
                  type="text" 
                  className="info-input" 
                  value={formData.nickname}
                  onChange={(e) => handleInputChange('nickname', e.target.value)}
                />
              </div>
              <div className="info-item">
                <span className="info-label">생년월일</span>
                <input 
                  type="date" 
                  className="info-input" 
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                />
              </div>
              <div className="info-item">
                <span className="info-label">소속기관</span>
                <input 
                  type="text" 
                  className="info-input" 
                  value={formData.organization}
                  onChange={(e) => handleInputChange('organization', e.target.value)}
                />
              </div>
              <div className="info-item">
                <span className="info-label">이메일</span>
                <input 
                  type="email" 
                  className="info-input" 
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
              <div className="info-item">
                <span className="info-label">직군</span>
                <input 
                  type="text" 
                  className="info-input" 
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                />
              </div>
              <div className="info-item">
                <span className="info-label">한 줄 소개</span>
                <input 
                  type="text" 
                  className="info-input" 
                  value={formData.introduction}
                  onChange={(e) => handleInputChange('introduction', e.target.value)}
                />
              </div>
            </div>
            <button className="edit-btn" onClick={handleSave}>
              수정 완료
            </button>
          </div>
        </div>

        {/* 오른쪽 컬럼 - 개발 스택 & 수상 이력 */}
        <div className="right-column">
          {/* 개발 스택 섹션 */}
          <div className="skills-section">
            <div className="section-header">
              <h3>개발 스택</h3>
              <button className="edit-btn">수정하기</button>
            </div>
            <div className="stack-cards">
              <div className="stack-card">
                <div className="stack-icon">📱</div>
                <div className="proficiency-levels">
                  <span className="level high">상</span>
                  <span className="level medium">중</span>
                  <span className="level low">하</span>
                </div>
              </div>
              <div className="stack-card">
                <div className="stack-icon">💻</div>
                <div className="proficiency-levels">
                  <span className="level high">상</span>
                  <span className="level medium">중</span>
                  <span className="level low">하</span>
                </div>
              </div>
              <div className="stack-card">
                <div className="stack-icon">⚡</div>
                <div className="proficiency-levels">
                  <span className="level high">상</span>
                  <span className="level medium">중</span>
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
                onClick={() => setShowAwardPopup(true)}
              >
                수정하기
              </button>
            </div>
            <p className="awards-description">
              참가 대회 이름과 수상 내역 (최신순)
            </p>
            <div className="awards-list">
              {formData.awards && formData.awards.length > 0 ? (
                formData.awards.map((award) => (
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
            <button className="edit-btn" onClick={addProject}>프로젝트 추가</button>
          </div>
          <div className="project-list">
            {formData.projects && formData.projects.length > 0 ? (
              formData.projects.map((project, index) => (
                <div key={index} className="project-item">
                  <input 
                    type="text" 
                    value={project}
                    onChange={(e) => handleProjectChange(index, e.target.value)}
                    placeholder="프로젝트명을 입력하세요"
                    className="project-input"
                  />
                  <button 
                    className="remove-btn"
                    onClick={() => removeProject(index)}
                  >
                    ×
                  </button>
                </div>
              ))
            ) : (
              <div className="project-item">
                <input 
                  type="text" 
                  placeholder="프로젝트명을 입력하세요"
                  className="project-input"
                  disabled
                />
                <span style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                  프로젝트를 추가해보세요
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 평점 및 후기 섹션 */}
        <div className="rating-reviews-section">
          <div className="section-header">
            <h3>평점 및 후기</h3>
            <div className="rating-display">
              {formData.rating ? formData.rating.toFixed(1) : '0.0'} / 5.0
            </div>
            <button className="view-all-btn">전체 목록</button>
          </div>
          <div className="review-summary">
            <p>총 {formData.reviewCount || 0}개의 후기가 있습니다.</p>
          </div>
        </div>
      </div>
      
      {/* 수상이력 팝업 */}
      <AwardHistoryPopup
        isOpen={showAwardPopup}
        onClose={() => setShowAwardPopup(false)}
        awards={formData.awards}
        onSave={(awards) => {
          setFormData({...formData, awards});
        }}
      />
    </div>
  );
}
