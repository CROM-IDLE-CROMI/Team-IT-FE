import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Post, Category } from "./DummyPosts";
import BoardComment from "../../components/BoardComment";
import "./BoardDetail.css";

type BoardDetailProps = {
  postsByCategory: Record<Category, Post[]>;
};

interface Comment {
  id: number;
  author: string;
  content: string;
  createdAt: string;
  replies?: Comment[];
}

const BoardDetail: React.FC<BoardDetailProps> = ({ postsByCategory }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const postId = Number(id);

  const post = Object.values(postsByCategory)
    .flat()
    .find(p => p.id === postId);

  // 댓글 상태 관리
  const [comments, setComments] = useState<Comment[]>([
]);

  const handleAddComment = (content: string) => {
    const newComment: Comment = {
      id: Date.now(),
      author: "현재사용자", // 실제로는 로그인한 사용자 정보
      content,
      createdAt: new Date().toISOString()
    };
    setComments(prev => [...prev, newComment]);
  };

  const handleAddReply = (commentId: number, content: string) => {
    const newReply: Comment = {
      id: Date.now(),
      author: "현재사용자", // 실제로는 로그인한 사용자 정보
      content,
      createdAt: new Date().toISOString()
    };
    
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, replies: [...(comment.replies || []), newReply] }
        : comment
    ));
  };

  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  return (
    <div>
      {/* 게시글 본문 */}
      <div className="post-detail-wrapper">
        <div className="post-detail-header">
          <h2 className="post-detail-title">{post.title}</h2>
          <div className="post-detail-meta">
            <span className="post-detail-author">{post.author}</span>
            <span className="post-detail-date">{post.date}</span>
          </div>
        </div>
        <div className="post-detail-content">{post.content}</div>
      </div>
      
      {/* 댓글 섹션 - 별도 컨테이너 */}
      <BoardComment
        postId={postId}
        comments={comments}
        onAddComment={handleAddComment}
        onAddReply={handleAddReply}
      />
    </div>
  );
};

export default BoardDetail;
