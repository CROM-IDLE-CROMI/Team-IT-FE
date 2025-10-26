
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getPopularPosts } from '../data/popularPosts';
import './BoardCard.css';

const BoardCard = () => {
  const navigate = useNavigate();
  const popularPosts = getPopularPosts(4);

  const handleCardClick = (postId: number) => {
    navigate(`/board/${postId}`);
  };

  const formatDate = (dateString: string) => {
    return dateString;
  };

  return (
    <section className="popular-posts-section">
      <h2 className="popular-posts-title">🔥 인기 많은 게시글</h2>
      <div className="popular-posts-cards">
        {popularPosts.length > 0 ? (
          popularPosts.map((post) => (
            <div 
              key={post.id} 
              className="popular-post-card"
              onClick={() => handleCardClick(post.id)}
            >
              <div className="popular-post-header">
                <span className="popular-post-category">{post.category}</span>
                <span className="popular-post-date">{formatDate(post.date)}</span>
              </div>
              <h3 className="popular-post-title">{post.title}</h3>
              <p className="popular-post-content">{post.content}</p>
              <div className="popular-post-footer">
                <span className="popular-post-author">👤 {post.author}</span>
                <span className="popular-post-views">👁 {post.views}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>인기 게시물이 없습니다.</p>
            <p>첫 번째 게시물을 작성해보세요!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BoardCard;