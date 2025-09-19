import React from 'react';
import './MyPageSidebar.css';

interface MyPageSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'view' | 'public' | 'edit' | 'interest' | 'posts' | 'scrapped' | 'inbox';
  onTabChange: (tab: 'view' | 'public' | 'edit' | 'interest' | 'posts' | 'scrapped' | 'inbox') => void;
}

const MyPageSidebar: React.FC<MyPageSidebarProps> = ({ isOpen, onClose, activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'view', label: '내 프로필', icon: '👤' },
    { id: 'posts', label: '내가 쓴 게시물', icon: '📝' },
    { id: 'scrapped', label: '내가 스크랩한 게시물', icon: '📌' },
  ];

  const handleItemClick = (itemId: string) => {
    onTabChange(itemId as any);
    onClose(); // 사이드바 닫기
  };

  return (
    <>
      {/* 오버레이 */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      
      {/* 사이드바 */}
      <div className={`mypage-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>마이페이지</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => handleItemClick(item.id)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};

export default MyPageSidebar;
