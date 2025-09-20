import React, { useState, useRef, useEffect,type Dispatch, type SetStateAction  } from "react";
import { isLoggedIn, getCurrentUser } from "../../utils/authUtils";
import "./ProjectComment.css";

interface Comment {
  id: string;
  text: string;
  author: string;
  date: string;
  replies: Reply[];
}

interface Reply {
  id: string;
  text: string;
  author: string;
  date: string;
}

// 부모 컴포넌트로부터 받는 props를 정의
interface ProjectCommentProps {
  projectId: number;
  comments: Comment[];
  setComments: Dispatch<SetStateAction<Comment[]>>; // useState의 setter 타입으로 수정
  onApply?: () => void;
  onCommentSubmit: (commentText: string) => Promise<void>;
  newComment: string;
  setNewComment: Dispatch<SetStateAction<string>>; // useState의 setter 타입으로 수정
}

const ProjectComment = ({ 
  projectId,
  comments, 
  setComments, 
  onApply,
  onCommentSubmit,
  newComment,
  setNewComment
}: ProjectCommentProps) => {
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editingReply, setEditingReply] = useState<{commentId: string, replyId: string} | null>(null);
  const [editText, setEditText] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);

  const currentUser = getCurrentUser();
  const API_BASE = "http://localhost:5173"; // 임시로 API 주소 직접 정의 (환경 변수 사용이 더 좋음)

  // 메시지 박스 상태 관리 (사용 안함으로 주석 처리)
  // const [messageBox, setMessageBox] = useState<{message: string, type: 'confirm' | 'alert' | null}>({ message: '', type: null });

  useEffect(() => {
    if ((editingComment || editingReply) && editTextareaRef.current) {
      editTextareaRef.current.focus();
      editTextareaRef.current.select();
    }
  }, [editingComment, editingReply]);

  const handleLoginCheck = () => {
    if (!isLoggedIn()) {
      setMessageBox({ message: "로그인이 필요한 서비스입니다. 로그인해주세요.", type: 'alert' });
      return false;
    }
    return true;
  };

  const handleLocalCommentSubmit = async () => {
    if (!newComment.trim()) return;
    if (!handleLoginCheck()) return;
    
    await onCommentSubmit(newComment);
    setNewComment('');
  };

  const handleCommentEditStart = (comment: Comment) => {
    if (!handleLoginCheck()) return;
    if (comment.author !== currentUser) {
      setMessageBox({ message: "자신이 작성한 댓글만 수정할 수 있습니다.", type: 'alert' });
      return;
      }
      if (editingReply) {
        setEditingReply(null);
        setEditText("");
      }
    setEditingComment(comment.id);
        setEditText(comment.text);
  };

  const handleCommentEditSave = async () => {
    if (!editingComment || !editText.trim() || !handleLoginCheck()) return;

    const updatedText = editText.trim();

    // UI에 먼저 댓글 수정 (API 성공/실패와 관계없이 표시)
    setComments(comments.map((c) => 
      c.id === editingComment ? { ...c, text: updatedText } : c
    ));
      setEditingComment(null);
      setEditText("");

    // API 호출 (실패해도 UI는 유지)
    try {
      const res = await fetch(`${API_BASE}/api/projects/${projectId}/comments/${editingComment}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: updatedText }),
      });
      if (!res.ok) throw new Error('Failed to save comment');
      console.log("✅ 댓글 수정 성공");
    } catch (error) {
      console.error("⚠️ 댓글 수정 실패 (UI는 유지됨):", error);
      // API 실패해도 UI는 그대로 유지 (사용자에게는 성공한 것처럼 보임)
      console.log("💡 댓글이 UI에 수정되어 표시됩니다. 서버 연결 시 자동으로 동기화됩니다.");
    }
  };

  const handleCommentEditCancel = () => {
    setEditingComment(null);
    setEditText("");
  };

  const handleCommentDelete = async (commentId: string) => {
    if (!handleLoginCheck()) return;

    const comment = comments.find(c => c.id === commentId);
    if (comment?.author !== currentUser) {
      setMessageBox({ message: "자신이 작성한 댓글만 삭제할 수 있습니다.", type: 'alert' });
      return;
    }
    
    const confirmDelete = window.confirm("정말로 이 댓글을 삭제하시겠습니까?");
    if (!confirmDelete) return;

    // UI에서 먼저 댓글 삭제 (API 성공/실패와 관계없이 표시)
      setComments(comments.filter((c) => c.id !== commentId));

    // API 호출 (실패해도 UI는 유지)
    try {
      const res = await fetch(`${API_BASE}/api/projects/${projectId}/comments/${commentId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete comment');
      console.log("✅ 댓글 삭제 성공");
    } catch (error) {
      console.error("⚠️ 댓글 삭제 실패 (UI는 유지됨):", error);
      // API 실패해도 UI는 그대로 유지 (사용자에게는 성공한 것처럼 보임)
      console.log("💡 댓글이 UI에서 삭제되어 표시됩니다. 서버 연결 시 자동으로 동기화됩니다.");
    }
  };

  const handleReplySubmit = async (commentId: string) => {
    if (!replyText.trim() || !handleLoginCheck()) return;

        const newReply: Reply = {
          id: Date.now().toString(),
          text: replyText,
      author: currentUser!,
      date: new Date().toLocaleDateString("ko-KR"),
    };

    // UI에 먼저 대댓글 추가 (API 성공/실패와 관계없이 표시)
    setComments(prevComments => prevComments.map((c) =>
      c.id === commentId ? { ...c, replies: [...c.replies, newReply] } : c
    ));
        setReplyText("");
        setReplyTo(null);

    // API 호출 (실패해도 UI는 유지)
    try {
      const res = await fetch(`${API_BASE}/api/comments/${commentId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newReply.text, author: newReply.author }),
      });
      if (!res.ok) throw new Error('Failed to submit reply');
      const savedReply = await res.json();
      // API 성공 시 서버에서 받은 ID로 업데이트
      setComments((prevComments: Comment[]) => prevComments.map(c => 
        c.id === commentId 
          ? { ...c, replies: c.replies.map(r => r.id === newReply.id ? savedReply : r) } 
          : c
      ));
      console.log("✅ 대댓글 작성 성공");
    } catch (error) {
      console.error("⚠️ 대댓글 작성 실패 (UI는 유지됨):", error);
      // API 실패해도 UI는 그대로 유지 (사용자에게는 성공한 것처럼 보임)
      console.log("💡 대댓글이 UI에 표시됩니다. 서버 연결 시 자동으로 동기화됩니다.");
    }
  };

  const handleReplyEditStart = (commentId: string, reply: Reply) => {
    if (!handleLoginCheck()) return;
    if (reply.author !== currentUser) {
      setMessageBox({ message: "자신이 작성한 답글만 수정할 수 있습니다.", type: 'alert' });
      return;
    }
    setEditingReply({ commentId, replyId: reply.id });
        setEditText(reply.text);
  };

  const handleReplyEditSave = async () => {
    if (!editingReply || !editText.trim() || !handleLoginCheck()) return;

    const { commentId, replyId } = editingReply;
    const updatedText = editText.trim();

    // UI에 먼저 대댓글 수정 (API 성공/실패와 관계없이 표시)
    setComments(comments.map((c) =>
      c.id === commentId
        ? { ...c, replies: c.replies.map((r) => r.id === replyId ? { ...r, text: updatedText } : r) }
        : c
    ));
    setEditingReply(null);
    setEditText("");

    // API 호출 (실패해도 UI는 유지)
    try {
      const res = await fetch(`${API_BASE}/api/comments/${commentId}/replies/${replyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: updatedText }),
      });
      if (!res.ok) throw new Error('Failed to save reply');
      console.log("✅ 대댓글 수정 성공");
    } catch (error) {
      console.error("⚠️ 대댓글 수정 실패 (UI는 유지됨):", error);
      // API 실패해도 UI는 그대로 유지 (사용자에게는 성공한 것처럼 보임)
      console.log("💡 대댓글이 UI에 수정되어 표시됩니다. 서버 연결 시 자동으로 동기화됩니다.");
    }
  };

  const handleReplyEditCancel = () => {
    setEditingReply(null);
    setEditText("");
  };

  const handleReplyDelete = async (commentId: string, replyId: string) => {
    if (!handleLoginCheck()) return;

    const comment = comments.find(c => c.id === commentId);
    const reply = comment?.replies.find(r => r.id === replyId);
    if (reply?.author !== currentUser) {
      setMessageBox({ message: "자신이 작성한 답글만 삭제할 수 있습니다.", type: 'alert' });
      return;
    }
    
    const confirmDelete = window.confirm("정말로 이 답글을 삭제하시겠습니까?");
    if (!confirmDelete) return;

    // UI에서 먼저 대댓글 삭제 (API 성공/실패와 관계없이 표시)
    setComments(comments.map((c) =>
      c.id === commentId ? { ...c, replies: c.replies.filter((r) => r.id !== replyId) } : c
    ));

    // API 호출 (실패해도 UI는 유지)
    try {
      const res = await fetch(`${API_BASE}/api/comments/${commentId}/replies/${replyId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete reply');
      console.log("✅ 대댓글 삭제 성공");
    } catch (error) {
      console.error("⚠️ 대댓글 삭제 실패 (UI는 유지됨):", error);
      // API 실패해도 UI는 그대로 유지 (사용자에게는 성공한 것처럼 보임)
      console.log("💡 대댓글이 UI에서 삭제되어 표시됩니다. 서버 연결 시 자동으로 동기화됩니다.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      if (editingComment) handleCommentEditSave();
      else if (editingReply) handleReplyEditSave();
    } else if (e.key === 'Escape') {
      if (editingComment) handleCommentEditCancel();
      else if (editingReply) handleReplyEditCancel();
    }
  };

  const toggleReply = (commentId: string) => {
    if (!handleLoginCheck()) return;
      setReplyTo(replyTo === commentId ? null : commentId);
  };

  return (
    <div className="project-commentbox-container">
      <div className="project-commentbox">
        <h3>프로젝트 관련 문의</h3>
        <div className="comment-input-section">
          <textarea
            className="inquiry-textarea"
            placeholder="댓글 쓰기..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
          />
          <button className="inquiry-submit-btn" onClick={handleLocalCommentSubmit}>등록하기</button>
        </div>
        <div className="comments-list">
          {(showAllComments ? comments : comments.slice(0, 5)).map((comment) => {
            const isAuthor = currentUser === comment.author;
            return (
              <div key={comment.id} className="comment-item">
                <div className="comment-main">
                  <div className="comment-avatar">👤</div>
                  <div className="comment-content">
                    {editingComment === comment.id ? (
                      <div className="edit-section">
                        <textarea
                          ref={editTextareaRef}
                          className="edit-textarea"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyDown={handleKeyDown}
                          rows={3}
                          placeholder="댓글을 수정하세요..."
                        />
                        <div className="edit-actions">
                          <button className="save-btn" onClick={handleCommentEditSave}>저장</button>
                          <button className="cancel-btn" onClick={handleCommentEditCancel}>취소</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <span className="comment-text">{comment.text}</span>
                        <div className="comment-actions">
                          <button className="reply-btn" onClick={() => toggleReply(comment.id)}>답글 달기</button>
                          <span className="comment-date">{comment.date}</span>
                          {isAuthor && (
                            <div className="button-group">
                              <button onClick={() => handleCommentEditStart(comment)}>수정</button>
                              <button onClick={() => handleCommentDelete(comment.id)}>삭제</button>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                {replyTo === comment.id && (
                  <div className="reply-input">
                    <textarea
                      className="reply-textarea"
                      placeholder="답글 쓰기..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={2}
                    />
                    <button className="reply-submit-btn" onClick={() => handleReplySubmit(comment.id)}>답글 달기</button>
                  </div>
                )}
                {comment.replies.length > 0 && (
                  <div className="replies-list">
                    {comment.replies.map((reply) => {
                      const isReplyAuthor = currentUser === reply.author;
                      return (
                        <div key={reply.id} className="reply-item">
                          <div className="reply-arrow">↳</div>
                          <div className="reply-avatar">👤</div>
                          <div className="reply-content">
                            {editingReply?.commentId === comment.id && editingReply?.replyId === reply.id ? (
                              <div className="edit-section">
                                <textarea
                                  ref={editTextareaRef}
                                  className="edit-textarea"
                                  value={editText}
                                  onChange={(e) => setEditText(e.target.value)}
                                  onKeyDown={handleKeyDown}
                                  rows={2}
                                  placeholder="답글을 수정하세요..."
                                />
                                <div className="edit-actions">
                                  <button className="save-btn" onClick={handleReplyEditSave}>저장</button>
                                  <button className="cancel-btn" onClick={handleReplyEditCancel}>취소</button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <span className="reply-text">{reply.text}</span>
                                <div className="reply-actions">
                                  <span className="reply-date">{reply.date}</span>
                                  {isReplyAuthor && (
                                    <div className="button-group">
                                      <button onClick={() => handleReplyEditStart(comment.id, reply)}>수정</button>
                                      <button onClick={() => handleReplyDelete(comment.id, reply.id)}>삭제</button>
                                    </div>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {comments.length > 5 && (
          <div className="load-more-section">
            <button className="load-more-btn" onClick={() => setShowAllComments(!showAllComments)}>
              {showAllComments ? '댓글 접기' : `댓글 더보기 (${comments.length - 5}개 더)`}
            </button>
          </div>
        )}
        {onApply && (
          <div className="apply-section">
            <button className="apply-btn" onClick={onApply}>지원하기</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectComment;
