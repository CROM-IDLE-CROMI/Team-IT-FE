import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../layouts/Header";
import type {Post, Category } from "./DummyPosts";
import { dummyPosts } from "./DummyPosts";
import "./Boarder.css";

const BoardPage: React.FC = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category>("시사&정보");

  // ✅ 상태 기반 게시글 관리 (초기값: 더미 데이터)
  const [postsByCategory, setPostsByCategory] = useState<Record<Category, Post[]>>(dummyPosts);

  // 카테고리별 페이지 상태
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

  // ✅ 글 작성 시 상태에 추가하는 함수
  const handleAddPost = (newPost: Post) => {
    setPostsByCategory((prev) => ({
      ...prev,
      [category]: [newPost, ...prev[category]], // 최신 글 위로
    }));
    setPageByCategory((prev) => ({ ...prev, [category]: 1 })); // 작성 후 첫 페이지로 이동
  };

  return (
    <div className="board-page-wrapper">
      <Header />

      {/* 탭 버튼 */}
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

      {/* 글 작성 버튼 (임시) */}
      <div className="board-actions">
        <button className="write-btn" onClick={() => navigate("/BoardWrite")}>
          ✍️ 글 작성하기
        </button>

        {/* 테스트용 버튼: 바로 글 추가 */}
        <button
          className="write-btn"
          onClick={() =>
            handleAddPost({
              id: Date.now(), // 임시 id
              title: `새 글 ${Date.now()}`,
              author: "테스트유저",
            })
          }
        >
          📝 테스트 글 추가
        </button>
      </div>

      {/* 게시판 내용 */}
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

      {/* 페이지네이션 */}
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
