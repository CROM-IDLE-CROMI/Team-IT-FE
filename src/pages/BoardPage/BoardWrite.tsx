import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Post, Category } from "./DummyPosts";
import AuthGuard from "../../components/AuthGuard";
import { getCurrentUser } from "../../utils/authUtils";
import { addMyPost } from "../../utils/myPostsUtils";
import "./BoardWrite.css";

type BoardWriteProps = {
  onAddPost: (category: Category, newPost: Post) => void;
};

const BoardWrite: React.FC<BoardWriteProps> = ({ onAddPost }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(""); // 본문 상태
  const [category, setCategory] = useState<Category>("시사&정보");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!title || !content) return alert("제목과 본문을 입력해주세요");

    const currentUser = getCurrentUser();
    if (!currentUser) {
      alert("로그인이 필요합니다.");
      return;
    }

    const newPost: Post = {
      id: Date.now(),
      title,
      author: currentUser, // 실제 로그인한 사용자
      content, // 본문 추가
      date: new Date().toLocaleDateString(),
      views: 0, // 조회수 추가
    };

    onAddPost(category, newPost); // App 상태 갱신
    
    // 내가 쓴 게시글에도 추가
    addMyPost({
      ...newPost,
      category: category
    });
    
    navigate("/Boarder"); // 게시판으로 돌아가기
  };

  return (
    <AuthGuard>
      <div className="board-write-wrapper">
        <h2 className="board-write-title">글 작성하기</h2>

        {/* 카테고리 선택 */}
        <select
          className="board-write-category"
          value={category}
          onChange={e => setCategory(e.target.value as Category)}
        >
          <option value="시사&정보">시사&정보</option>
          <option value="질문">질문</option>
          <option value="홍보">홍보</option>
        </select>

        {/* 제목 입력 */}
        <input
          type="text"
          className="board-write-input"
          placeholder="제목"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        {/* 본문 입력 */}
        <textarea
          className="board-write-textarea"
          placeholder="본문을 입력하세요"
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={8}
        />

        {/* 작성 완료 버튼 */}
        <button className="board-write-submit-btn" onClick={handleSubmit}>
          작성 완료
        </button>
      </div>
    </AuthGuard>
  );
};

export default BoardWrite;
