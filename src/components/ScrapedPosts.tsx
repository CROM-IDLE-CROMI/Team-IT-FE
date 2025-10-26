import React, { useState, useEffect } from 'react';
import type { ScrapedPost } from '../types/scrap';
import { getAllScraps, removeScrap, clearAllScraps } from '../utils/scrapUtils';
import { useNavigate } from 'react-router-dom';
import './ScrapedPosts.css';

const ScrapedPosts: React.FC = () => {
  const [scrapedPosts, setScrapedPosts] = useState<ScrapedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadScrapedPosts();
  }, []);

  const loadScrapedPosts = async () => {
    try {
      // TODO: 백엔드 API 호출로 스크랩 목록 가져오기
      const scraps = getAllScraps(); // 현재는 빈 배열 반환
      setScrapedPosts(scraps);
    } catch (error) {
      console.error('스크랩 데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveScrap = (postId: number) => {
    const confirmRemove = window.confirm('이 게시글의 스크랩을 해제하시겠습니까?');
    if (confirmRemove) {
      removeScrap(postId);
      loadScrapedPosts(); // 목록 새로고침
    }
  };

  const handleClearAll = () => {
    clearAllScraps();
    loadScrapedPosts(); // 목록 새로고침
  };

  const handlePostClick = (postId: number) => {
    navigate(`/board/${postId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  if (loading) {
    return (
      <div className="scraped-posts-container">
        <div className="loading">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="scraped-posts-container">
      <div className="scraped-posts-header">
        <h2> 내가 스크랩한 게시물</h2>
        <div className="header-actions">
          <span className="scrap-count">총 {scrapedPosts.length}개</span>
          {scrapedPosts.length > 0 && (
            <button className="clear-all-btn" onClick={handleClearAll}>
              전체 삭제
            </button>
          )}
        </div>
      </div>

      {scrapedPosts.length === 0 ? (
        <div className="empty-state">
          <h3>스크랩한 게시물이 없습니다</h3>
          <p>관심 있는 게시물을 스크랩해보세요!</p>
        </div>
      ) : (
        <div className="scraped-posts-list">
          {scrapedPosts.map((scrap) => (
            <div key={scrap.id} className="scraped-post-card">
              <div className="post-content" onClick={() => handlePostClick(scrap.postId)}>
                <div className="post-header">
                  <span className="post-category">{scrap.category}</span>
                  <span className="post-date">{formatDate(scrap.date)}</span>
                </div>
                <h3 className="post-title">{scrap.title}</h3>
                <p className="post-preview">{scrap.content.substring(0, 100)}...</p>
                <div className="post-footer">
                  <span className="post-author">👤 {scrap.author}</span>
                  <span className="post-views">👁 {scrap.views}</span>
                </div>
              </div>
              <div className="post-actions">
                <span className="scraped-date">
                  스크랩: {formatDate(scrap.scrapedAt)}
                </span>
                <button 
                  className="remove-scrap-btn"
                  onClick={() => handleRemoveScrap(scrap.postId)}
                  title="스크랩 해제"
                >
                  ❌
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScrapedPosts;
