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
}

const ProjectComment = ({ comments, setComments }: ProjectCommentProps) => {
  const [comment, setComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      const newComment: Comment = {
        id: Date.now().toString(),
        text: comment,
        author: "사용자",
        date: new Date().toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }),
        replies: []
      };
      setComments([...comments, newComment]);
      setComment("");
    }
  };

  const handleReplySubmit = (commentId: string) => {
    if (replyText.trim()) {
      const newReply: Reply = {
        id: Date.now().toString(),
        text: replyText,
        author: "사용자",
        date: new Date().toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        })
      };
      
      setComments(comments.map(comment => 
        comment.id === commentId 
          ? { ...comment, replies: [...comment.replies, newReply] }
          : comment
      ));
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
    {/* 댓글 작성 + 댓글 목록 통합 */}
    <div className="commentbox-section">
      <h3>프로젝트 관련 문의</h3>
      
      {/* 댓글 작성 */}
      <textarea
        className="inquiry-textarea"
        placeholder="댓글 쓰기..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={4}
      />
      <button 
        className="inquiry-submit-btn"
        onClick={handleCommentSubmit}
      >
        등록하기
      </button>

      {/* 댓글 목록 */}
      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment-item">
            <div className="comment-main">
              <div className="comment-avatar">👤</div>
              <div className="comment-content">
                <span className="comment-text">{comment.text}</span>
                <div className="comment-actions">
                  <button 
                    className="reply-btn"
                    onClick={() => toggleReply(comment.id)}
                  >
                    답글 달기
                  </button>
                  <span className="comment-date">{comment.date}</span>
                </div>
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
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="reply-item">
                    <div className="reply-arrow">↳</div>
                    <div className="reply-avatar">👤</div>
                    <div className="reply-content">
                      <span className="reply-text">{reply.text}</span>
                      <div className="reply-actions">
                        {/* 대댓글에는 답글 버튼 제거 */}
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