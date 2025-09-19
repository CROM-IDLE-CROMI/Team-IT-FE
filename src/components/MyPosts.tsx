import React, { useState, useEffect } from 'react';
import type { MyPost } from '../utils/myPostsUtils';
import { getAllMyPosts, deleteMyPost } from '../utils/myPostsUtils';
import { useNavigate } from 'react-router-dom';
import './MyPosts.css';

const MyPosts: React.FC = () => {
  const [myPosts, setMyPosts] = useState<MyPost[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadMyPosts();
  }, []);

  const loadMyPosts = () => {
    try {
      const posts = getAllMyPosts();
      setMyPosts(posts);
    } catch (error) {
      console.error('내가 쓴 게시글 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = (postId: number) => {
    const confirmDelete = window.confirm('이 게시글을 삭제하시겠습니까?');
    if (confirmDelete) {
      deleteMyPost(postId);
      loadMyPosts(); // 목록 새로고침
      alert('게시글이 삭제되었습니다.');
    }
  };

  const handlePostClick = (postId: number) => {
    navigate(`/board/${postId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  if (loading) {
    return (
      <div className="my-posts-container">
        <div className="loading">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="my-posts-container">
      <div className="my-posts-header">
        <h2>📝 내가 쓴 게시물</h2>
        <div className="header-actions">
          <span className="posts-count">총 {myPosts.length}개</span>
        </div>
      </div>

      {myPosts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>작성한 게시물이 없습니다</h3>
          <p>첫 번째 게시물을 작성해보세요!</p>
          <button 
            className="write-post-btn"
            onClick={() => navigate('/BoardWrite')}
          >
            게시글 작성하기
          </button>
        </div>
      ) : (
        <div className="my-posts-list">
          {myPosts.map((post) => (
            <div key={post.id} className="my-post-card">
              <div className="post-content" onClick={() => handlePostClick(post.id)}>
                <div className="post-header">
                  <span className="post-category">{post.category || '기타'}</span>
                  <span className="post-date">{formatDate(post.date)}</span>
                </div>
                <h3 className="post-title">{post.title}</h3>
                <p className="post-preview">{post.content.substring(0, 100)}...</p>
                <div className="post-footer">
                  <span className="post-views">👁 {post.views || 0}</span>
                  <span className="post-created">
                    작성: {formatDate(post.createdAt)}
                  </span>
                  {post.lastModified && (
                    <span className="post-modified">
                      수정: {formatDate(post.lastModified)}
                    </span>
                  )}
                </div>
              </div>
              <div className="post-actions">
                <button 
                  className="edit-post-btn"
                  onClick={() => navigate(`/BoardWrite?edit=${post.id}`)}
                  title="게시글 수정"
                >
                  ✏️
                </button>
                <button 
                  className="delete-post-btn"
                  onClick={() => handleDeletePost(post.id)}
                  title="게시글 삭제"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPosts;
