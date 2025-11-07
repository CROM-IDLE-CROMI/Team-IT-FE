import React, { useState, useRef, useEffect,type Dispatch, type SetStateAction  } from "react";
import { isLoggedIn, getCurrentUser } from "../../utils/authUtils";
import "./ProjectComment.css";
import { projectService } from "../../services/projectService";
import type { ProjectCommentApiResponse } from "../../types/project";

// 부모 컴포넌트로부터 받는 props를 정의
interface ProjectCommentProps {
  projectId: number;
  comments: ProjectCommentApiResponse[];
  setComments: Dispatch<SetStateAction<ProjectCommentApiResponse[]>>;
  onApply?: () => void;
  onCommentSubmit: (commentText: string, parentCommentId?: number | null) => Promise<void>;
  newComment: string;
  setNewComment: Dispatch<SetStateAction<string>>;
  commentsLoading?: boolean;
}

const ProjectComment = ({ 
  projectId,
  comments, 
  setComments, 
  onApply,
  onCommentSubmit,
  newComment,
  setNewComment,
  commentsLoading = false
}: ProjectCommentProps) => {
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [editingReply, setEditingReply] = useState<{commentId: number, replyId: number} | null>(null);
  const [editText, setEditText] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);

  const currentUser = getCurrentUser();

  // 메시지 박스 상태 관리
  const [messageBox, setMessageBox] = useState<{message: string, type: 'confirm' | 'alert' | null}>({ message: '', type: null });

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

  const handleCommentEditStart = (comment: ProjectCommentApiResponse) => {
    if (!handleLoginCheck()) return;
    if (comment.writerId !== currentUser) {
      setMessageBox({ message: "자신이 작성한 댓글만 수정할 수 있습니다.", type: 'alert' });
      return;
    }
    if (editingReply) {
      setEditingReply(null);
      setEditText("");
    }
    setEditingComment(comment.id);
    setEditText(comment.content);
  };

  const handleCommentEditSave = async () => {
    if (!editingComment || !editText.trim() || !handleLoginCheck()) return;

    const updatedText = editText.trim();

      try {
      // API 호출 (업데이트 API가 반환값이 없을 수 있으므로 반환값을 사용하지 않습니다)
      await projectService.updateProjectComment(
        projectId,
        editingComment,
        { content: updatedText }
      );
      
      // UI 업데이트: 로컬에서 내용만 업데이트
      setComments(prev => prev.map((c) => 
        c.id === editingComment ? { ...c, content: updatedText, updatedAt: new Date().toISOString() } : c
      ));
      
      setEditingComment(null);
      setEditText("");
      console.log("✅ 댓글 수정 성공");
    } catch (error: any) {
      console.error("⚠️ 댓글 수정 실패:", error);
      alert(error.message || "댓글 수정에 실패했습니다.");
    }
  };

  const handleCommentEditCancel = () => {
    setEditingComment(null);
    setEditText("");
  };

  const handleCommentDelete = async (commentId: number) => {
    if (!handleLoginCheck()) return;

    const comment = comments.find(c => c.id === commentId);
    if (comment?.writerId !== currentUser) {
      setMessageBox({ message: "자신이 작성한 댓글만 삭제할 수 있습니다.", type: 'alert' });
      return;
    }
    
    const confirmDelete = window.confirm("정말로 이 댓글을 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      // API 호출
      await projectService.deleteProjectComment(projectId, commentId);
      
      // UI에서 댓글 삭제
      setComments(comments.filter((c) => c.id !== commentId));
      console.log("✅ 댓글 삭제 성공");
    } catch (error: any) {
      console.error("⚠️ 댓글 삭제 실패:", error);
      alert(error.message || "댓글 삭제에 실패했습니다.");
    }
  };

  const handleReplySubmit = async (commentId: number) => {
    if (!replyText.trim() || !handleLoginCheck()) return;

    try {
      // API 호출 (부모 댓글 ID를 parentCommentId로 전달)
      await onCommentSubmit(replyText.trim(), commentId);
      
      setReplyText("");
      setReplyTo(null);
      console.log("✅ 대댓글 작성 성공");
    } catch (error: any) {
      console.error("⚠️ 대댓글 작성 실패:", error);
      alert(error.message || "대댓글 작성에 실패했습니다.");
    }
  };

  const handleReplyEditStart = (commentId: number, reply: ProjectCommentApiResponse) => {
    if (!handleLoginCheck()) return;
    if (reply.writerId !== currentUser) {
      setMessageBox({ message: "자신이 작성한 답글만 수정할 수 있습니다.", type: 'alert' });
      return;
    }
    setEditingReply({ commentId, replyId: reply.id });
    setEditText(reply.content);
  };

  const handleReplyEditSave = async () => {
    if (!editingReply || !editText.trim() || !handleLoginCheck()) return;

    const { commentId, replyId } = editingReply;
    const updatedText = editText.trim();

    try {
      // API 호출
      await projectService.updateProjectComment(
        projectId,
        replyId,
        { content: updatedText }
      );
      
      // UI 업데이트: API가 반환값이 없을 경우 로컬에서 내용만 업데이트
      setComments(prev => prev.map((c) =>
        c.id === commentId
          ? { ...c, replies: c.replies.map((r) => r.id === replyId ? { ...r, content: updatedText } : r) }
          : c
      ));
      
      setEditingReply(null);
      setEditText("");
      console.log("✅ 대댓글 수정 성공");
    } catch (error: any) {
      console.error("⚠️ 대댓글 수정 실패:", error);
      alert(error.message || "대댓글 수정에 실패했습니다.");
    }
  };

  const handleReplyEditCancel = () => {
    setEditingReply(null);
    setEditText("");
  };

  const handleReplyDelete = async (commentId: number, replyId: number) => {
    if (!handleLoginCheck()) return;

    const comment = comments.find(c => c.id === commentId);
    const reply = comment?.replies.find(r => r.id === replyId);
    if (reply?.writerId !== currentUser) {
      setMessageBox({ message: "자신이 작성한 답글만 삭제할 수 있습니다.", type: 'alert' });
      return;
    }
    
    const confirmDelete = window.confirm("정말로 이 답글을 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      // API 호출
      await projectService.deleteProjectComment(projectId, replyId);
      
      // UI에서 대댓글 삭제
      setComments(prev => prev.map((c) =>
        c.id === commentId ? { ...c, replies: c.replies.filter((r) => r.id !== replyId) } : c
      ));
      
      console.log("✅ 대댓글 삭제 성공");
    } catch (error: any) {
      console.error("⚠️ 대댓글 삭제 실패:", error);
      alert(error.message || "대댓글 삭제에 실패했습니다.");
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

  const toggleReply = (commentId: number) => {
    if (!handleLoginCheck()) return;
    setReplyTo(replyTo === commentId ? null : commentId);
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
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
        {/* 로딩 상태 */}
        {commentsLoading && (
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            댓글을 불러오는 중...
          </div>
        )}

        {/* 댓글 목록 */}
        {!commentsLoading && (
          <div className="comments-list">
            {comments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1rem', color: '#999' }}>
                아직 댓글이 없습니다.
              </div>
            ) : (
              (showAllComments ? comments : comments.slice(0, 5)).map((comment) => {
                const isAuthor = currentUser === comment.writerId;
                return (
                  <div key={comment.id} className="comment-item">
                    <div className="comment-main">
                      <div className="comment-avatar">
                        {comment.writerProfileImageUrl ? (
                          <img src={comment.writerProfileImageUrl} alt={comment.writerNickname} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                        ) : (
                          '👤'
                        )}
                      </div>
                      <div className="comment-content">
                        <div className="comment-header">
                          <span className="comment-author">{comment.writerNickname}</span>
                          <span className="comment-date">{formatDate(comment.createdAt)}</span>
                        </div>
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
                            <span className="comment-text">{comment.content}</span>
                            <div className="comment-actions">
                              <button className="reply-btn" onClick={() => toggleReply(comment.id)}>답글 달기</button>
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
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="replies-list">
                        {comment.replies.map((reply) => {
                          const isReplyAuthor = currentUser === reply.writerId;
                          return (
                            <div key={reply.id} className="reply-item">
                              <div className="reply-arrow">↳</div>
                              <div className="reply-avatar">
                                {reply.writerProfileImageUrl ? (
                                  <img src={reply.writerProfileImageUrl} alt={reply.writerNickname} style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
                                ) : (
                                  '👤'
                                )}
                              </div>
                              <div className="reply-content">
                                <div className="reply-header">
                                  <span className="reply-author">{reply.writerNickname}</span>
                                  <span className="reply-date">{formatDate(reply.createdAt)}</span>
                                </div>
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
                                    <span className="reply-text">{reply.content}</span>
                                    {isReplyAuthor && (
                                      <div className="reply-actions">
                                        <div className="button-group">
                                          <button onClick={() => handleReplyEditStart(comment.id, reply)}>수정</button>
                                          <button onClick={() => handleReplyDelete(comment.id, reply.id)}>삭제</button>
                                        </div>
                                      </div>
                                    )}
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
              })
            )}
          </div>
        )}
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
