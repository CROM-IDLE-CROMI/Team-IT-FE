import React from 'react';
import '../../App.css'; // CSS 파일을 임포트합니다.

export default function MyprojectExplain() {
  return (
    <div className="explain-page-layout">
      {/* 왼쪽 사이드바 */}
      <aside className="project-sidebar">
        <div className="team-logo-placeholder">
          <span>팀 로고</span>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li>
              {/* '프로젝트 소개'를 활성 상태로 표시합니다. */}
              <a href="#" className="active">프로젝트 소개</a>
            </li>
            <li>
              <a href="#">멤버</a>
            </li>
            <li>
              <a href="#">마일스톤 기능</a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* 오른쪽 메인 컨텐츠 */}
      <main className="project-main-content">
        <div className="content-header">
          <button className="back-button">← 돌아가기</button>
          <button className="edit-button">수정하기</button>
        </div>
        <div className="introduction-card">
          <h2>프로젝트 소개</h2>
        </div>
      </main>
    </div>
  );
}