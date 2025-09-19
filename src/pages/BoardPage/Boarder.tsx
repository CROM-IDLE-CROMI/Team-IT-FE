import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Post, Category } from "./DummyPosts";
import { requireAuth, getCurrentUser } from "../../utils/authUtils";
import "./Boarder.css";
import Header from "../../layouts/Header";

type BoardPageProps = {
  postsByCategory: Record<Category, Post[]>;
};

const BoardPage: React.FC<BoardPageProps> = ({ postsByCategory }) => {
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category>("시사&정보");
  const [searchTerm, setSearchTerm] = useState("");
  const [pageByCategory, setPageByCategory] = useState<Record<Category, number>>({
    "시사&정보": 1,
    "질문": 1,
    "홍보": 1,
  });

  // 현재 로그인한 사용자 확인
  const currentUser = getCurrentUser();

  const postsPerPage = 5;
  const currentPage = pageByCategory[category];

  // 검색 기능을 포함한 게시글 필터링
  const allPosts = postsByCategory[category];
  const filteredPosts = allPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPageByCategory(prev => ({ ...prev, [category]: newPage }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPageByCategory(prev => ({ ...prev, [category]: 1 }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPageByCategory(prev => ({ ...prev, [category]: 1 }));
  };

  // ✅ 게시물별 스크랩 상태 저장
  const [scrappedPosts, setScrappedPosts] = useState<Set<number>>(new Set());

  const toggleScrap = (e: React.MouseEvent, postId: number) => {
    e.stopPropagation(); // 게시물 클릭 이벤트 막기
    setScrappedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId); // 이미 스크랩된 경우 해제
      } else {
        newSet.add(postId); // 스크랩 추가
      }
      return newSet;
    });
  };

  return (
    <div className="board-page-wrapper">
      <Header />
      <h2>{category} 게시판</h2>

      {/* 카테고리 탭과 검색 */}
      <div className="board-button">
        <div className="board-tabs">
          {(["시사&정보", "질문", "홍보"] as Category[]).map(cat => (
            <button
              key={cat}
              className={category === cat ? "active" : ""}
              onClick={() => setCategory(cat)}
            >
              {cat} 게시판
            </button>
          ))}
        </div>

        {/* 검색 기능 */}
        <div className="board-search">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="제목, 내용, 작성자로 검색..."
              className="search-input"
            />
            <button type="submit" className="search-btn">
              🔍
            </button>
          </form>
        </div>

        {/* 글 작성 버튼 */}
        <div className="board-actions">
          <button onClick={() => requireAuth(() => navigate("/BoardWrite"))}>
            ✍️ 글 작성하기
          </button>
        </div>
      </div>

      {/* 게시글 리스트 */}
      <div className="board-section">
        <div className="board-list">
          <ul>
            {currentPosts.map(post => (
              <li
                key={post.id}
                onClick={() => navigate(`/Board/${post.id}`)}
                style={{ cursor: "pointer" }}
                className="board-item"
              >
                <span className="post-title">{post.title}</span>
                <span className="post-meta">
                  {/* 본인이 작성한 글이 아닐 때만 스크랩 버튼 표시 */}
                  {currentUser !== post.author && (
                    <button onClick={(e) => toggleScrap(e, post.id)}>
                      <img
                        src={
                          scrappedPosts.has(post.id)
                            ? "/스크랩 이후.png"
                            : "/스크랩 이전.png"
                        }
                        alt="스크랩"
                        width="20"
                      />
                    </button>
                  )}
                  <span className="post-author">{post.author}</span>
                  <span className="post-date">{post.date}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 페이지네이션 */}
      <div className="pagination">
        <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>◀ 이전</button>
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx + 1}
            className={currentPage === idx + 1 ? "active" : ""}
            onClick={() => handlePageChange(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}
        <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>다음 ▶</button>
      </div>
    </div>
  );
};

export default BoardPage;
