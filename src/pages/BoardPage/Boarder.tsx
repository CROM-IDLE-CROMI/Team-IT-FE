import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../layouts/Header";
import type { Post, Category } from "./DummyPosts";
import "./Boarder.css";

type BoarderProps = {
  postsByCategory: Record<Category, Post[]>;
};

const BoardPage: React.FC<BoarderProps> = ({ postsByCategory }) => {
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category>("시사&정보");
  const [pageByCategory, setPageByCategory] = useState<Record<Category, number>>({
    "시사&정보": 1,
    "질문": 1,
    "홍보": 1,
  });

  const postsPerPage = 5;
  const currentPage = pageByCategory[category];
  const posts = postsByCategory[category];
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = posts.slice(startIndex, startIndex + postsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPageByCategory((prev) => ({ ...prev, [category]: newPage }));
  };

  return (
    <div className="board-page-wrapper">
      <Header />
      <div className="board-tabs">
        {(["시사&정보", "질문", "홍보"] as Category[]).map((cat) => (
          <button
            key={cat}
            className={category === cat ? "active" : ""}
            onClick={() => setCategory(cat)}
          >
            {cat} 게시판
          </button>
        ))}
      </div>

      <div className="board-actions">
        <button className="write-btn" onClick={() => navigate("/BoardWrite")}>
          ✍️ 글 작성하기
        </button>
      </div>

      <div className={`board-content ${category.replace("&", "")}`}>
        <h2>{category} 게시판</h2>
        <ul>
          {currentPosts.map((post) => (
            <li key={post.id} className="post-item">
              <strong className="post-title">{post.title}</strong> —{" "}
              <span className="post-author">{post.author}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pagination">
        <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
          ◀ 이전
        </button>
        {[...Array(totalPages)].map((_, idx) => {
          const pageNum = idx + 1;
          return (
            <button
              key={pageNum}
              className={pageNum === currentPage ? "active" : ""}
              onClick={() => handlePageChange(pageNum)}
            >
              {pageNum}
            </button>
          );
        })}
        <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
          다음 ▶
        </button>
      </div>
    </div>
  );
};

export default BoardPage;
