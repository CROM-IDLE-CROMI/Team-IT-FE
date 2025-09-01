import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Post, Category } from "./DummyPosts";
import "./BoardDetail.css";

type BoardDetailProps = {
  postsByCategory: Record<Category, Post[]>;
};

const BoardDetail: React.FC<BoardDetailProps> = ({ postsByCategory }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const postId = Number(id);

  const post = Object.values(postsByCategory)
    .flat()
    .find(p => p.id === postId);

  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  return (
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


  );
};

export default BoardDetail;
