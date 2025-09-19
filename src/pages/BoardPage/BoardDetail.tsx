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
    .find((p) => p.id === postId);

  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  // 현재 로그인 사용자 (실제 프로젝트에서는 Context, Redux 등에서 가져오기)
  const currentUser = "로그인한 작성자 이름";
  const isAuthor = true

  // 게시글 수정 상태
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editContent, setEditContent] = useState(post.content);

  // 댓글 상태
  const [comments, setComments] = useState<Comment[]>([]);

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

    // 실제 삭제 로직 (예: 부모 컴포넌트에 함수 전달)
    alert("게시글이 삭제되었습니다.");
    navigate("/board"); // 목록으로 이동
  };

  // -------------------- 댓글 기능 --------------------
  const handleAddComment = (content: string) => {
    const newComment: Comment = {
      id: Date.now(),
      author: currentUser,
      content,
      createdAt: new Date().toISOString(),
    };
    setComments((prev) => [...prev, newComment]);
  };

  const handleAddReply = (commentId: number, content: string) => {
    const newReply: Comment = {
      id: Date.now(),
      author: currentUser,
      content,
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
