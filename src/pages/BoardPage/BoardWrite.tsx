import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Post, Category } from "../../types/post";
import AuthGuard from "../../components/AuthGuard";
import { getCurrentUser } from "../../utils/authUtils";
import { apiPost } from "../../utils/api";
import "./BoardWrite.css";

// API 응답 타입 정의
interface BoardCreateResponse {
  code: number;
  message: string;
  data: {
    postId: number;
    title: string;
    content: string;
    category: string;
    viewCount: number;
    likeCount: number;
    scrapCount: number;
    createdAt: string;
    updatedAt: string;
    authorId: string;
    authorNickname: string;
    authorProfileImageUrl: string;
  };
}

// 카테고리 매핑 함수 (한글 → API 형식)
const categoryToApi = (category: Category): string => {
  const map: Record<Category, string> = {
    "시사&정보": "INFO",
    "질문": "QUESTION",
    "홍보": "PROMOTION",
  };
  return map[category];
};

type BoardWriteProps = {
  onAddPost: (category: Category, newPost: Post) => void;
};

const BoardWrite: React.FC<BoardWriteProps> = ({ onAddPost }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(""); // 본문 상태
  const [category, setCategory] = useState<Category>("시사&정보");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!title || !content) return alert("제목과 본문을 입력해주세요");

    const currentUser = getCurrentUser();
    if (!currentUser) {
      alert("로그인이 필요합니다.");
      return;
    }

    setIsSubmitting(true);

    try {
      // API 요청 데이터 준비
      const requestData = {
        title: title.trim(),
        content: content.trim(),
        category: categoryToApi(category),
      };

      // API 호출
      const response = await apiPost<BoardCreateResponse>(
        "/v1/board",
        requestData,
        true // 인증 필요
      );

      if (response.code === 0 && response.data) {
        // API 응답을 Post 타입으로 변환
        const date = new Date(response.data.createdAt);
        const formattedDate = date.toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });

        const newPost: Post = {
          id: response.data.postId,
          title: response.data.title,
          author: response.data.authorNickname,
          content: response.data.content,
          date: formattedDate,
          views: response.data.viewCount,
        };

        // App 상태 갱신
        onAddPost(category, newPost);

        alert("게시글이 작성되었습니다.");
        navigate("/Boarder"); // 게시판으로 돌아가기
      } else {
        alert(response.message || "게시글 작성에 실패했습니다.");
      }
    } catch (error) {
      console.error("게시글 작성 실패:", error);
      alert(
        error instanceof Error
          ? error.message
          : "게시글 작성 중 오류가 발생했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
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
        <button 
          className="board-write-submit-btn" 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "작성 중..." : "작성 완료"}
        </button>
      </div>
    </AuthGuard>
  );
};

export default BoardWrite;
