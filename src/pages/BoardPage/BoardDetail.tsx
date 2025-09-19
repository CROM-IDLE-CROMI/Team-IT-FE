import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Post, Category } from "./DummyPosts";
import BoardComment from "../../components/BoardComment";
import { getCurrentUser } from "../../utils/authUtils";
import "./BoardDetail.css";
import Header from "../../layouts/Header";

type BoardDetailProps = {
  postsByCategory: Record<Category, Post[]>;
  onDeletePost: (postId: number) => void;
};

interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
  replies?: Comment[];
}

const BoardDetail: React.FC<BoardDetailProps> = ({ postsByCategory, onDeletePost }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const postId = Number(id);

  const post = Object.values(postsByCategory)
    .flat()
    .find((p) => p.id === postId);

  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  // 현재 로그인 사용자 확인
  const currentUser = getCurrentUser();
  const isAuthor = currentUser === post.author;

  // 게시글 수정 상태
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editContent, setEditContent] = useState(post.content);

  // 댓글 상태
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  // -------------------- 게시글 수정/삭제 --------------------
  const handleEdit = () => setIsEditing(true);

  const handleSave = () => {
    if (!editTitle.trim() || !editContent.trim()) return;

    post.title = editTitle.trim();
    post.content = editContent.trim();

    setIsEditing(false);
    alert("게시글이 수정되었습니다.");
  };

  const handleCancel = () => {
    setEditTitle(post.title);
    setEditContent(post.content);
    setIsEditing(false);
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmDelete) return;

    // 실제 삭제 로직
    onDeletePost(postId);
    alert("게시글이 삭제되었습니다.");
    navigate("/Boarder"); // 목록으로 이동
  };

  // -------------------- 댓글 기능 --------------------
  const handleAddComment = async (content: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      author: currentUser || "guest",
      text: content,
      createdAt: new Date().toISOString(),
    };
    setComments((prev) => [...prev, newComment]);
  };

  const handleAddReply = (commentId: string, content: string) => {
    const newReply: Comment = {
      id: Date.now().toString(),
      author: currentUser || "guest",
      text: content,
      createdAt: new Date().toISOString(),
    };
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? { ...comment, replies: [...(comment.replies || []), newReply] }
          : comment
      )
    );
  };

  // -------------------- JSX --------------------
  return (

    <div className="post-detail-wrapper">
          <Header />
      {isEditing ? (
        <>
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="post-edit-title"
          />
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="post-edit-content"
          />
          <div className="post-detail-actions">
            <button onClick={handleSave}>저장</button>
            <button onClick={handleCancel}>취소</button>
          </div>
        </>
      ) : (
        <>
          <h2 className="post-detail-title">{post.title}</h2>
          <div className="post-detail-meta">
            <span className="post-detail-author">{post.author}</span>
            <span className="post-detail-date">{post.date}</span>
          </div>
          <div className="post-detail-content">{post.content}</div>
          {isAuthor && (
            <div className="post-detail-actions">
              <button onClick={handleEdit}>수정</button>
              <button onClick={handleDelete}>삭제</button>
            </div>
          )}
        </>
      )}

      {/* 댓글 섹션 */}
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
