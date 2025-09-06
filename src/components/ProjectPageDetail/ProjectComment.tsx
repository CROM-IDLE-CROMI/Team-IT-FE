import { useState } from "react";
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
  disabled?: boolean;        // 로그인 여부
  currentUser?: string;      // 현재 로그인된 사용자 이름
}

const ProjectComment = ({ comments, setComments, disabled, currentUser }: ProjectCommentProps) => {
  const [comment, setComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const handleCommentSubmit = () => {
    if (!currentUser) return alert("로그인 후 이용 가능합니다.");
    if (comment.trim()) {
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
  };

  const handleReplySubmit = (commentId: string) => {
    if (!currentUser) return alert("로그인 후 이용 가능합니다.");
    if (replyText.trim()) {
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
          c.id === commentId ? { ...c, replies: [...c.replies, newReply] } : c
        )
      );
      setReplyText("");
      setReplyTo(null);
    }
  };

  const toggleReply = (commentId: string) => {
    setReplyTo(replyTo === commentId ? null : commentId);
  };

  return (
    <div className="project-commentbox-container">
      <div className="project-commentbox">
        <div className="commentbox-section">
          <h3>프로젝트 관련 문의</h3>

          {/* 댓글 작성 */}
          <textarea
            className="inquiry-textarea"
            placeholder={disabled ? "로그인 후 댓글을 작성할 수 있습니다." : "댓글 쓰기..."}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            disabled={disabled}
          />
          <button
            className="inquiry-submit-btn"
            onClick={handleCommentSubmit}
            disabled={disabled}
            title={disabled ? "로그인 후 이용 가능합니다." : ""}
          >
            등록하기
          </button>

          {/* 댓글 목록 */}
          <div className="comments-list">
            {comments.map((c) => (
              <div key={c.id} className="comment-item">
                <div className="comment-main">
                  <div className="comment-avatar">👤</div>
                  <div className="comment-content">
                    <span className="comment-text">{c.text}</span>
                    <div className="comment-actions">
                      <button
                        className="reply-btn"
                        onClick={() => toggleReply(c.id)}
                        disabled={disabled}
                        title={disabled ? "로그인 후 이용 가능합니다." : ""}
                      >
                        답글 달기
                      </button>
                      <span className="comment-date">{c.date}</span>
                    </div>
                  </div>
                </div>

                {/* 대댓글 입력 */}
                {replyTo === c.id && (
                  <div className="reply-input">
                    <textarea
                      className="reply-textarea"
                      placeholder={disabled ? "로그인 후 답글을 작성할 수 있습니다." : "답글 쓰기..."}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={2}
                      disabled={disabled}
                    />
                    <button
                      className="reply-submit-btn"
                      onClick={() => handleReplySubmit(c.id)}
                      disabled={disabled}
                      title={disabled ? "로그인 후 이용 가능합니다." : ""}
                    >
                      답글 달기
                    </button>
                  </div>
                )}

                {/* 대댓글 목록 */}
                {c.replies.length > 0 && (
                  <div className="replies-list">
                    {c.replies.map((reply) => (
                      <div key={reply.id} className="reply-item">
                        <div className="reply-arrow">↳</div>
                        <div className="reply-avatar">👤</div>
                        <div className="reply-content">
                          <span className="reply-text">{reply.text}</span>
                          <div className="reply-actions">
                            <span className="reply-date">{reply.date}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <hr className="comment-divider" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectComment;
