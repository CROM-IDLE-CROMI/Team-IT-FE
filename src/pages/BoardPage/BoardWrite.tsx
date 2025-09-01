import React, { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useNavigate } from "react-router-dom";
import type { Post, Category } from "./DummyPosts"; // 타입 import
import "./BoardWrite.css";

type BoardWriteProps = {
  onAddPost: (category: Category, newPost: Post) => void;
};

const BoardWrite: React.FC<BoardWriteProps> = ({ onAddPost }) => {
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category>("" as Category);
  const [title, setTitle] = useState("");

  // Tiptap Editor 초기화
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>내용을 입력하세요...</p>",
  });

  const handleSubmit = () => {
    if (!category || !title) {
      alert("카테고리와 제목을 입력해주세요.");
      return;
    }

    const content = editor?.getHTML() || "";
    const newPost: Post = {
      id: Date.now(), // 임시 ID
      title,
      author: "테스트유저", // 필요하면 로그인 유저 이름 사용
    };

    // ✅ App 상태에 글 추가
    onAddPost(category, newPost);

    // 작성 완료 후 게시판으로 이동
    navigate("/Boarder");
  };

  return (
    <div className="board-write-wrapper">
      {/* 카테고리 선택 */}
      <select
        className="board-category"
        value={category}
        onChange={(e) => setCategory(e.target.value as Category)}
      >
        <option value="">카테고리 선택</option>
        <option value="시사&정보">시사&정보</option>
        <option value="질문">질문</option>
        <option value="홍보">홍보</option>
      </select>

      {/* 제목 입력 */}
      <input
        type="text"
        placeholder="제목을 입력해주세요"
        className="board-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Tiptap Editor */}
      <div className="editor-container">
        <EditorContent editor={editor} />
      </div>

      {/* 버튼 */}
      <div className="board-actions">
        <button className="cancel-btn" onClick={() => navigate("/Boarder")}>
          취소
        </button>
        <button className="submit-btn" onClick={handleSubmit}>
          작성 완료
        </button>
      </div>
    </div>
  );
};

export default BoardWrite;
