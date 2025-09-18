import React, { useState } from 'react';
import './BoardComment.css';

interface Comment {
  id: number;
  author: string;
  content: string;
  createdAt: string;
  replies?: Comment[];
}

interface BoardCommentProps {
  postId: number;
  comments: Comment[];
  onAddComment: (content: string) => void;
  onAddReply: (commentId: number, content: string) => void;
}

const BoardComment: React.FC<BoardCommentProps> = ({
  postId,
  comments,
  onAddComment,
  onAddReply
}) => {
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  const handleSubmitReply = (e: React.FormEvent, commentId: number) => {
    e.preventDefault();
    if (replyContent.trim()) {
      onAddReply(commentId, replyContent.trim());
      setReplyContent('');
      setReplyTo(null);
    }
  };

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
    <div className="board-comment-container">
      <div className="board-comment-box">
        <h3 className="comment-title">댓글 ({comments.length})</h3>
        
        {/* 댓글 작성 섹션 */}
        <div className="comment-input-section">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 작성해주세요..."
            className="comment-input"
            rows={2}
          />
          <button 
            type="button"
            onClick={handleSubmitComment} 
            className="comment-submit-btn"
          >
            댓글 작성
          </button>
        </div>

      {/* 댓글 목록 */}
      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment-item">
            <div className="comment-header">
              <span className="comment-author">{comment.author}</span>
              <span className="comment-date">{formatDate(comment.createdAt)}</span>
            </div>
            <div className="comment-content">{comment.content}</div>
            <div className="comment-actions">
              <button
                onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                className="reply-btn"
              >
                답글
              </button>
            </div>

            {/* 답글 작성 폼 */}
            {replyTo === comment.id && (
              <div className="reply-form">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="답글을 작성해주세요..."
                  className="reply-input"
                  rows={2}
                />
                <div className="reply-form-actions">
                  <button 
                    type="button"
                    onClick={(e) => handleSubmitReply(e, comment.id)} 
                    className="reply-submit-btn"
                  >
                    답글 작성
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setReplyTo(null);
                      setReplyContent('');
                    }}
                    className="reply-cancel-btn"
                  >
                    취소
                  </button>
                </div>
              </div>
            )}

            {/* 답글 목록 */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="replies-list">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="reply-item">
                    <div className="reply-header">
                      <span className="reply-author">{reply.author}</span>
                      <span className="reply-date">{formatDate(reply.createdAt)}</span>
                    </div>
                    <div className="reply-content">{reply.content}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

        {comments.length === 0 && (
          <div className="no-comments">
            <p>아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardComment;
