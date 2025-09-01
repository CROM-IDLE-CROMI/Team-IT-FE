import React, { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "./BoardWrite.css";

const BoardWrite: React.FC = () => {
  const [category, setCategory] = useState<string>("");
  const [title, setTitle] = useState<string>("");

  // Tiptap Editor 초기화
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>내용을 입력하세요...</p>",
  });

  const handleSubmit = () => {
    const content = editor?.getHTML(); // 작성된 내용 가져오기
    console.log("제출 데이터:", { category, title, content });
    alert("글이 저장되었습니다!");
  };

  return (
    <div className="board-write-wrapper">
      {/* 카테고리 선택 */}
      <select
        className="board-category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
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
        <button className="cancel-btn">취소</button>
        <button className="submit-btn" onClick={handleSubmit}>
          작성 완료
        </button>
      </div>
    </div>
  );
};

export default BoardWrite;
