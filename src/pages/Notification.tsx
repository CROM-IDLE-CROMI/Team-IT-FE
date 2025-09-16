import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

type NotificationType = 'project' | 'board' | 'shop' | 'invite';

interface Notification {
  id: number;
  text: string;
  type: NotificationType;
  targetId?: string;
}

const Notification: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<NotificationType>('project');
  const [modalNotification, setModalNotification] = useState<Notification | null>(null);

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, text: '김철수님의 "OOO" 프로젝트에 합격하였습니다.', type: 'project', targetId: '1' },
    { id: 2, text: '홍길동님의 "XXX" 프로젝트에 새로운 지원자가 있습니다.', type: 'board', targetId: '11' },
    { id: 3, text: '김일성님의 "ㅁㅁㅁ" 프로젝트에서 제외되셨습니다.', type: 'project', targetId: '2' },
    { id: 4, text: '어나경님이 "ㅆㅆㅆ" 프로젝트의 새로운 팀장이 되셨습니다.', type: 'project', targetId: '3' },
    //{ id: 5, text: '구매하신 상품의 배송이 시작되었습니다.', type: 'shop', targetId: '100' },
  ]);

  const handleGo = (n: Notification) => {
    switch (n.type) {
      case 'project':
        navigate(`/myproject/${n.targetId}`);
        break;
      case 'board':
        navigate(`/recruit/${n.targetId}`);
        break;
      // case 'shop':
      //   navigate(`/shop/${n.targetId}`);
      //   break;
      case 'invite':
        setModalNotification(n); // 모달 열기
        break;
    }
  };

  const handleRemove = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleModalAction = (action: 'accept' | 'reject') => {
    if (modalNotification) {
      console.log(`알림 ${modalNotification.id} → ${action}`);
      setModalNotification(null);
    }
  };

  // 탭별 알림 필터링
  const filteredNotifications = notifications.filter(n => n.type === activeTab);

  return (
    <div className="notification-container">
      <h2 className="notification-title">알림</h2>

      {/* 탭 */}
      <div className="notification-tabs">
        <button
          className={`notification-tab ${activeTab === 'project' ? 'active' : ''}`}
          onClick={() => setActiveTab('project')}
        >
          프로젝트
        </button>
        <button
          className={`notification-tab ${activeTab === 'board' ? 'active' : ''}`}
          onClick={() => setActiveTab('board')}
        >
          좋아요/댓글
        </button>
        {/* <button
          className={`notification-tab ${activeTab === 'shop' ? 'active' : ''}`}
          onClick={() => setActiveTab('shop')}
        >
          상점
        </button> */}
      </div>

      {/* 알림 리스트 */}
      <div className="notification-list">
        {filteredNotifications.length === 0 ? (
          <p className="notification-empty">알림이 없습니다.</p>
        ) : (
          filteredNotifications.map((n) => (
            <div key={n.id} className="notification-item">
              <span className="notification-text">{n.text}</span>
              <div className="notification-actions">
                <button className="notification-link-btn" onClick={() => handleGo(n)}>바로가기</button>
                <button className="notification-close-btn" onClick={() => handleRemove(n.id)}>X</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 모달 */}
      {modalNotification && (
        <div className="notification-modal">
          <div className="notification-modal-content">
            <p>{modalNotification.text}</p>
            <div className="modal-btns">
              <button className="modal-accept-btn" onClick={() => handleModalAction('accept')}>수락</button>
              <button className="modal-reject-btn" onClick={() => handleModalAction('reject')}>거절</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
