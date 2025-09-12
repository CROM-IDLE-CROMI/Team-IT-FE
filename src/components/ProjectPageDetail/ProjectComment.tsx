import { useState, useRef, useEffect } from "react";
import { requireAuth, getCurrentUser } from "../../utils/authUtils";
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

interface ProjectCommentProps {
  comments: Comment[];
  setComments: (comments: Comment[]) => void;
  onApply?: () => void;
}

const ProjectComment = ({ comments, setComments, onApply }: ProjectCommentProps) => {
  const [comment, setComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editingReply, setEditingReply] = useState<{commentId: string, replyId: string} | null>(null);
  const [editText, setEditText] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);

  const currentUser = getCurrentUser(); // 로그인된 유저 ID

  // 편집 모드 진입 시 자동 포커스
  useEffect(() => {
    if ((editingComment || editingReply) && editTextareaRef.current) {
      editTextareaRef.current.focus();
      editTextareaRef.current.select();
    }
  }, [editingComment, editingReply]);

  /* 댓글 작성 */
  const handleCommentSubmit = () => {
    requireAuth(() => {
      if (comment.trim() && currentUser) {
        const newComment: Comment = {
          id: Date.now().toString(),
          text: comment,
          author: currentUser,
          date: new Date().toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }),
          replies: [],
        };
        setComments([...comments, newComment]);
        setComment("");
      }
    });
  };

  /* 댓글 수정 시작 */
  const handleCommentEditStart = (commentId: string) => {
    requireAuth(() => {
      // 다른 댓글이나 대댓글을 편집 중이면 취소
      if (editingComment && editingComment !== commentId) {
        setEditingComment(null);
        setEditText("");
      }
      if (editingReply) {
        setEditingReply(null);
        setEditText("");
      }
      
      const comment = comments.find(c => c.id === commentId);
      if (comment) {
        setEditingComment(commentId);
        setEditText(comment.text);
      }
    });
  };

  /* 댓글 수정 완료 */
  const handleCommentEditSave = () => {
    if (editingComment && editText.trim()) {
      setComments(
        comments.map((c) => 
          c.id === editingComment ? { ...c, text: editText.trim() } : c
        )
      );
      setEditingComment(null);
      setEditText("");
    }
  };

  /* 댓글 수정 취소 */
  const handleCommentEditCancel = () => {
    setEditingComment(null);
    setEditText("");
  };

  const handleCommentDelete = (commentId: string) => {
    requireAuth(() => {
      setComments(comments.filter((c) => c.id !== commentId));
    });
  };

  /* 대댓글 작성 */
  const handleReplySubmit = (commentId: string) => {
    requireAuth(() => {
      if (replyText.trim() && currentUser) {
        const newReply: Reply = {
          id: Date.now().toString(),
          text: replyText,
          author: currentUser,
          date: new Date().toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }),
        };

        setComments(
          comments.map((c) =>
            c.id === commentId
              ? { ...c, replies: [...c.replies, newReply] }
              : c
          )
        );
        setReplyText("");
        setReplyTo(null);
      }
    });
  };

  /* 대댓글 수정 시작 */
  const handleReplyEditStart = (commentId: string, replyId: string) => {
    requireAuth(() => {
      // 다른 댓글이나 대댓글을 편집 중이면 취소
      if (editingComment) {
        setEditingComment(null);
        setEditText("");
      }
      if (editingReply && (editingReply.commentId !== commentId || editingReply.replyId !== replyId)) {
        setEditingReply(null);
        setEditText("");
      }
      
      const comment = comments.find(c => c.id === commentId);
      const reply = comment?.replies.find(r => r.id === replyId);
      if (reply) {
        setEditingReply({ commentId, replyId });
        setEditText(reply.text);
      }
    });
  };

  /* 대댓글 수정 완료 */
  const handleReplyEditSave = () => {
    if (editingReply && editText.trim()) {
      setComments(
        comments.map((c) =>
          c.id === editingReply.commentId
            ? {
                ...c,
                replies: c.replies.map((r) =>
                  r.id === editingReply.replyId ? { ...r, text: editText.trim() } : r
                ),
              }
            : c
        )
      );
      setEditingReply(null);
      setEditText("");
    }
  };

  /* 대댓글 수정 취소 */
  const handleReplyEditCancel = () => {
    setEditingReply(null);
    setEditText("");
  };

  /* 키보드 이벤트 핸들러 */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      if (editingComment) {
        handleCommentEditSave();
      } else if (editingReply) {
        handleReplyEditSave();
      }
    } else if (e.key === 'Escape') {
      if (editingComment) {
        handleCommentEditCancel();
      } else if (editingReply) {
        handleReplyEditCancel();
      }
    }
  };

  const handleReplyDelete = (commentId: string, replyId: string) => {
    requireAuth(() => {
      setComments(
        comments.map((c) =>
          c.id === commentId
            ? { ...c, replies: c.replies.filter((r) => r.id !== replyId) }
            : c
        )
      );
    });
  };

  /* 답글 입력 토글 */
  const toggleReply = (commentId: string) => {
    requireAuth(() => {
      setReplyTo(replyTo === commentId ? null : commentId);
    });
  };

  return (
    <div className="project-commentbox-container">
      <div className="project-commentbox">
        <h3>프로젝트 관련 문의</h3>

        {/* 댓글 작성 */}
        <div className="comment-input-section">
          <textarea
            className="inquiry-textarea"
            placeholder="댓글 쓰기..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
          />
          <button className="inquiry-submit-btn" onClick={handleCommentSubmit}>
            등록하기
          </button>
        </div>

        {/* 댓글 목록 */}
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
                          <button 
                            className="save-btn" 
                            onClick={handleCommentEditSave}
                          >
                            저장
                          </button>
                          <button 
                            className="cancel-btn" 
                            onClick={handleCommentEditCancel}
                          >
                            취소
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <span className="comment-text">{comment.text}</span>
                        <div className="comment-actions">
                          <button
                            className="reply-btn"
                            onClick={() => toggleReply(comment.id)}
                          >
                            답글 달기
                          </button>
                          <span className="comment-date">{comment.date}</span>

                          {/* 자기 댓글만 수정/삭제 버튼 */}
                          {isAuthor && (
                            <div className="button-group">
                              <button onClick={() => handleCommentEditStart(comment.id)}>
                                수정
                              </button>
                              <button onClick={() => handleCommentDelete(comment.id)}>
                                삭제
                              </button>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* 대댓글 입력 */}
                {replyTo === comment.id && (
                  <div className="reply-input">
                    <textarea
                      className="reply-textarea"
                      placeholder="답글 쓰기..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={2}
                    />
                    <button
                      className="reply-submit-btn"
                      onClick={() => handleReplySubmit(comment.id)}
                    >
                      답글 달기
                    </button>
                  </div>
                )}

                {/* 대댓글 목록 */}
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
                                  <button 
                                    className="save-btn" 
                                    onClick={handleReplyEditSave}
                                  >
                                    저장
                                  </button>
                                  <button 
                                    className="cancel-btn" 
                                    onClick={handleReplyEditCancel}
                                  >
                                    취소
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <span className="reply-text">{reply.text}</span>
                                <div className="reply-actions">
                                  <span className="reply-date">{reply.date}</span>
                                  {isReplyAuthor && (
                                    <div className="button-group">
                                      <button
                                        onClick={() =>
                                          handleReplyEditStart(comment.id, reply.id)
                                        }
                                      >
                                        수정
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleReplyDelete(comment.id, reply.id)
                                        }
                                      >
                                        삭제
                                      </button>
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

        {/* 더보기 버튼 */}
        {comments.length > 5 && (
          <div className="load-more-section">
            <button 
              className="load-more-btn" 
              onClick={() => setShowAllComments(!showAllComments)}
            >
              {showAllComments ? '댓글 접기' : `댓글 더보기 (${comments.length - 5}개 더)`}
            </button>
          </div>
        )}

        {/* 지원하기 버튼 */}
        {onApply && (
          <div className="apply-section">
            <button className="apply-btn" onClick={onApply}>
              지원하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectComment;
