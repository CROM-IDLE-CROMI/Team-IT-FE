import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { Post, Category } from "../../types/post";
import { requireAuth, getCurrentUser } from "../../utils/authUtils";
import { addScrap, updateScrapedCache, isScraped } from "../../utils/scrapUtils";
import { apiGet } from "../../utils/api";
import "./Boarder.css";
import Header from "../../layouts/Header";

// API 응답 타입 정의
interface BoardApiResponse {
  code: number;
  message: string;
  data: {
    page: number;
    size: number;
    content: BoardPostItem[];
    totalElements: number;
    totalPages: number;
  };
}

interface BoardPostItem {
  postId: number;
  title: string;
  category: string;
  viewCount: number;
  likeCount: number;
  createdAt: string;
  authorNickname: string;
  authorProfileImageUrl: string;
}

// 카테고리 매핑 함수
const categoryToApi = (category: Category): string => {
  const map: Record<Category, string> = {
    "시사&정보": "INFO",
    "질문": "QUESTION",
    "홍보": "PROMOTION",
  };
  return map[category];
};

// API 응답을 Post 타입으로 변환
const convertApiPostToPost = (apiPost: BoardPostItem): Post => {
  const date = new Date(apiPost.createdAt);
  const formattedDate = date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  return {
    id: apiPost.postId,
    title: apiPost.title,
    author: apiPost.authorNickname,
    content: '', // 목록에는 내용이 없음
    date: formattedDate,
    views: apiPost.viewCount,
  };
};

const BoardPage: React.FC = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category>("시사&정보");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // 현재 로그인한 사용자 확인
  const currentUser = getCurrentUser();

  const postsPerPage = 5;

  // API 호출 함수
  const fetchBoardPosts = useCallback(async (page: number, cat: Category, keyword: string = '') => {
    setLoading(true);
    try {
      const apiCategory = categoryToApi(cat);
      
      // pageable 객체 생성
      const pageable = {
        page: page - 1, // API는 0부터 시작
        size: postsPerPage,
        sort: ["createdAt,desc"]
      };

      // Query string 생성
      const params = new URLSearchParams({
        category: apiCategory,
        pageable: JSON.stringify(pageable)
      });

      if (keyword) {
        params.append('keyword', keyword);
      }

      const endpoint = `/v1/board?${params.toString()}`;
      const response = await apiGet<BoardApiResponse>(endpoint, false);

      if (response.code === 0 && response.data) {
        const convertedPosts = response.data.content.map(convertApiPostToPost);
        setPosts(convertedPosts);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
      } else {
        console.error('API 응답 오류:', response.message);
        setPosts([]);
      }
    } catch (error) {
      console.error('게시글 목록 조회 실패:', error);
      setPosts([]);
      // 에러 발생 시 빈 배열로 설정
    } finally {
      setLoading(false);
    }
  }, [postsPerPage]);

  // 데이터 로드 (카테고리, 페이지 변경 시 즉시 실행)
  useEffect(() => {
    fetchBoardPosts(currentPage, category, searchTerm);
  }, [category, currentPage, fetchBoardPosts]);

  // 검색어 변경 시 debounce 처리 (500ms 지연)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1); // 검색 시 첫 페이지로
      } else {
        fetchBoardPosts(1, category, searchTerm);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, category, fetchBoardPosts]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBoardPosts(1, category, searchTerm);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // 검색어 변경은 useEffect의 debounce로 처리
  };

  const handleCategoryChange = (newCategory: Category) => {
    setCategory(newCategory);
    setCurrentPage(1); // 카테고리 변경 시 첫 페이지로
    setSearchTerm(""); // 검색어 초기화
  };

  // 게시물별 스크랩 상태 저장
  const [scrappedPosts, setScrappedPosts] = useState<Set<number>>(new Set());

  // 스크랩 상태 로드
  useEffect(() => {
    const loadScrapStatus = async () => {
      try {
        // 백엔드 API 호출로 스크랩 상태 확인
        await updateScrapedCache();
        
        // 현재 페이지의 게시글들 중 스크랩된 것들을 Set에 추가
        const scrapedIds = new Set<number>();
        posts.forEach(post => {
          if (isScraped(post.id)) {
            scrapedIds.add(post.id);
          }
        });
        
        setScrappedPosts(scrapedIds);
      } catch (error) {
        console.error('스크랩 상태 로드 실패:', error);
      }
    };
    
    if (posts.length > 0) {
      loadScrapStatus();
    }
  }, [posts]);

  const toggleScrap = async (e: React.MouseEvent, postId: number) => {
    e.stopPropagation(); // 게시물 클릭 이벤트 막기
    
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    if (scrappedPosts.has(postId)) {
      // 이미 스크랩된 경우 - 스크랩 해제는 ScrapedPosts 컴포넌트에서 처리
      alert('스크랩 해제는 마이페이지 > 스크랩한 게시물에서 가능합니다.');
    } else {
      try {
        // 백엔드 API 호출로 스크랩 추가
        await addScrap({
          postId: post.id,
          title: post.title,
          author: post.author,
          content: post.content,
          category: category,
          date: post.date,
          views: post.views || 0,
          originalPost: {
            id: post.id,
            title: post.title,
            author: post.author,
            content: post.content,
            category: category,
            date: post.date,
            views: post.views || 0
          }
        });
        
        // 캐시 업데이트
        await updateScrapedCache();
        
        // 로컬 상태 업데이트
        setScrappedPosts(prev => new Set(prev).add(postId));
        
        alert('스크랩이 추가되었습니다.');
      } catch (error) {
        console.error('스크랩 추가 실패:', error);
        alert('스크랩 추가에 실패했습니다.');
      }
    }
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
              onClick={() => handleCategoryChange(cat)}
            >
              {cat} 게시판
            </button>
          ))}
        </div>

        {/* 검색 기능 */}
        <div className="board-search">
          <form onSubmit={handleSearch} className="board_search-form">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="제목, 내용, 작성자로 검색..."
              className="board_search-input"
            />
            <button type="submit" className="board_search-btn">
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
          {loading ? (
            <div className="loading">로딩 중...</div>
          ) : (
            <ul>
              <div className="board_header">
                <div className="title-column">제목</div>
                <div className="author-column">글쓴이</div>
                <div className="date-column">작성일</div>
                <div className="views-column">조회</div>
              </div>
              {posts.length > 0 ? (
                posts.map(post => (
                <li
                  key={post.id}
                  onClick={() => navigate(`/Board/${post.id}`)}
                  style={{ cursor: "pointer" }}
                  className="board-item"
                >
                  <div className="title-column">
                    {currentUser !== post.author && (
                      <button className="scrap_btn" onClick={(e) => toggleScrap(e, post.id)}>
                        <img className="scrap"
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
                    <span className="post-title">{post.title}</span>
                  </div>
                  <div className="author-column">{post.author}</div>
                  <div className="date-column">{post.date}</div>
                  <div className="views-column">{post.views || 0}</div>
                </li>
              ))
            ) : (
              <li className="empty-state">
                <div className="empty-message">
                  <p>게시물이 없습니다.</p>
                  <p>첫 번째 게시물을 작성해보세요!</p>
                </div>
              </li>
            )}
          </ul>
        )}
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
