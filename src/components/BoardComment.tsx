import React, { useState } from 'react';
import type { CommentApiResponse } from '../types/post';
import './BoardComment.css';

interface BoardCommentProps {
  postId: number;
  comments: CommentApiResponse[];
  loading?: boolean;
  onAddComment: (content: string, parentCommentId?: number) => void;
  onAddReply: (commentId: number, content: string) => void;
  onUpdateComment?: (commentId: number, content: string) => void;
  currentUserId?: string;
}

const BoardComment: React.FC<BoardCommentProps> = ({
  postId,
  comments,
  loading = false,
  onAddComment,
  onAddReply,
  onUpdateComment,
  currentUserId
}) => {
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

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

  const handleStartEdit = (comment: CommentApiResponse) => {
    setEditingCommentId(comment.commentId);
    setEditContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditContent('');
  };

  const handleSaveEdit = (commentId: number) => {
    if (editContent.trim() && onUpdateComment) {
      onUpdateComment(commentId, editContent.trim());
      setEditingCommentId(null);
      setEditContent('');
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

  // 댓글과 답글을 구분하여 렌더링 (parentCommentId가 null인 것만 댓글)
  const rootComments = comments.filter(comment => comment.parentCommentId === null);
  
  // 답글을 부모 댓글 ID로 그룹화
  const repliesByParentId: Record<number, CommentApiResponse[]> = {};
  comments.forEach(comment => {
    if (comment.parentCommentId !== null) {
      if (!repliesByParentId[comment.parentCommentId]) {
        repliesByParentId[comment.parentCommentId] = [];
      }
      repliesByParentId[comment.parentCommentId].push(comment);
    }
  });

  return (
    <div className="board-comment-container">
      <div className="board-comment-box">
        <h3 className="comment-title">댓글 {rootComments.length}</h3>
        
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

        {/* 로딩 상태 */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            댓글을 불러오는 중...
          </div>
        )}

        {/* 댓글 목록 */}
        {!loading && (
          <div className="comments-list">
            {rootComments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1rem', color: '#999' }}>
                아직 댓글이 없습니다.
              </div>
            ) : (
              rootComments.map((comment) => (
                <div key={comment.commentId} className="comment-item">
                  <div className="comment-header">
                    <span className="comment-author">{comment.writerNickname}</span>
                    <span className="comment-date">{formatDate(comment.createdAt)}</span>
                  </div>
                  
                  {editingCommentId === comment.commentId ? (
                    <div className="comment-edit-form">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="comment-edit-input"
                        rows={3}
                      />
                      <div className="comment-edit-actions">
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(comment.commentId)}
                          className="comment-save-btn"
                        >
                          저장
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="comment-cancel-btn"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="comment-content">{comment.content}</div>
                      <div className="comment-actions">
                        <button
                          onClick={() => setReplyTo(replyTo === comment.commentId ? null : comment.commentId)}
                          className="reply-btn"
                        >
                          답글
                        </button>
                        {currentUserId && currentUserId === comment.writerId && onUpdateComment && (
                          <button
                            onClick={() => handleStartEdit(comment)}
                            className="comment-edit-btn"
                          >
                            수정
                          </button>
                        )}
                      </div>
                    </>
                  )}

                  {/* 답글 작성 폼 */}
                  {replyTo === comment.commentId && (
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
                          onClick={(e) => handleSubmitReply(e, comment.commentId)} 
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
                  {repliesByParentId[comment.commentId] && repliesByParentId[comment.commentId].length > 0 && (
                    <div className="replies-list">
                      {repliesByParentId[comment.commentId].map((reply) => (
                        <div key={reply.commentId} className="reply-item">
                          <div className="reply-header">
                            <span className="reply-author">{reply.writerNickname}</span>
                            <span className="reply-date">{formatDate(reply.createdAt)}</span>
                          </div>
                          {editingCommentId === reply.commentId ? (
                            <div className="reply-edit-form">
                              <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="reply-edit-input"
                                rows={2}
                              />
                              <div className="reply-edit-actions">
                                <button
                                  type="button"
                                  onClick={() => handleSaveEdit(reply.commentId)}
                                  className="reply-save-btn"
                                >
                                  저장
                                </button>
                                <button
                                  type="button"
                                  onClick={handleCancelEdit}
                                  className="reply-cancel-btn"
                                >
                                  취소
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="reply-content">{reply.content}</div>
                              {currentUserId && currentUserId === reply.writerId && onUpdateComment && (
                                <div className="reply-actions">
                                  <button
                                    onClick={() => handleStartEdit(reply)}
                                    className="reply-edit-btn"
                                  >
                                    수정
                                  </button>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardComment;
