import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { BoardDetailApiResponse, CommentApiResponse, CommentListApiResponse, CommentCreateApiResponse, CommentUpdateApiResponse } from "../../types/post";
import BoardComment from "../../components/BoardComment";
import { getCurrentUser } from "../../utils/authUtils";
import { apiGet, apiPatch, apiPost, apiDelete } from "../../utils/api";
import "./BoardDetail.css";
import Header from "../../layouts/Header";

type BoardDetailProps = {
  postsByCategory?: any; // 하위 호환성을 위해 유지하되 사용하지 않음
  onDeletePost?: (postId: number) => void; // 하위 호환성을 위해 유지하되 사용하지 않음
};

const BoardDetail: React.FC<BoardDetailProps> = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const postId = Number(id);

  // 게시글 상태
  const [post, setPost] = useState<BoardDetailApiResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 현재 로그인 사용자 확인
  const currentUserId = getCurrentUser();

  // 게시글 수정 상태
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  // 댓글 상태
  const [comments, setComments] = useState<CommentApiResponse[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);

  // 게시글 카테고리를 프론트엔드 형식으로 변환
  const apiCategoryToCategory = (apiCategory: string): string => {
    const categoryMap: Record<string, string> = {
      'INFO': '시사&정보',
      'QUESTION': '질문',
      'PROMOTION': '홍보'
    };
    return categoryMap[apiCategory] || apiCategory;
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // 게시글 상세 정보 가져오기
  useEffect(() => {
    const fetchPost = async () => {
      if (!postId || isNaN(postId)) {
        setError('유효하지 않은 게시글 ID입니다.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await apiGet<BoardDetailApiResponse>(
          `/v1/board/${postId}`,
          false // 게시글 조회는 인증 불필요
        );

        if (response.code === 0 && response.data) {
          setPost(response.data);
          setEditTitle(response.data.title);
          setEditContent(response.data.content);
        } else {
          setError(response.message || '게시글을 불러올 수 없습니다.');
        }
      } catch (err: any) {
        console.error('게시글 조회 실패:', err);
        setError(err.message || '게시글을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  // 댓글 목록 가져오기
  useEffect(() => {
    const fetchComments = async () => {
      if (!postId || isNaN(postId)) return;

      setLoadingComments(true);
      try {
        const response = await apiGet<CommentListApiResponse>(
          `/v1/board/${postId}/comments`,
          false // 댓글 조회는 인증 불필요
        );

        // API 응답이 배열이므로 그대로 사용
        if (Array.isArray(response)) {
          setComments(response);
        } else {
          setComments([]);
        }
      } catch (err: any) {
        console.error('댓글 조회 실패:', err);
        setComments([]);
      } finally {
        setLoadingComments(false);
      }
    };

    if (post) {
      fetchComments();
    }
  }, [postId, post]);

  // 작성자 여부 확인
  const isAuthor = post && currentUserId ? currentUserId === post.authorId : false;

  // -------------------- 게시글 수정/삭제 --------------------
  const handleEdit = () => {
    if (!post) return;
    setIsEditing(true);
    setEditTitle(post.title);
    setEditContent(post.content);
  };

  const handleSave = async () => {
    if (!post || !editTitle.trim() || !editContent.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    try {
      const requestData = {
        title: editTitle.trim(),
        content: editContent.trim(),
        category: post.category
      };

      const response = await apiPatch<BoardDetailApiResponse>(
        `/v1/board/${postId}`,
        requestData,
        true // 인증 필요
      );

      if (response.code === 0 && response.data) {
        setPost(response.data);
        setIsEditing(false);
        alert('게시글이 수정되었습니다.');
      } else {
        alert(response.message || '게시글 수정에 실패했습니다.');
      }
    } catch (err: any) {
      console.error('게시글 수정 실패:', err);
      alert(err.message || '게시글 수정 중 오류가 발생했습니다.');
    }
  };

  const handleCancel = () => {
    if (!post) return;
    setEditTitle(post.title);
    setEditContent(post.content);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('정말 삭제하시겠습니까?');
    if (!confirmDelete || !postId) return;

    try {
      await apiDelete(`/v1/board/${postId}`, true);
      alert('게시글이 삭제되었습니다.');
      navigate('/Boarder');
    } catch (err: any) {
      console.error('게시글 삭제 실패:', err);
      alert(err.message || '게시글 삭제 중 오류가 발생했습니다.');
    }
  };

  // -------------------- 댓글 기능 --------------------
  const handleAddComment = async (content: string, parentCommentId?: number) => {
    if (!postId || !content.trim()) return;

    try {
      const requestData: any = {
        content: content.trim()
      };

      if (parentCommentId) {
        requestData.parentCommentId = parentCommentId;
      }

      const response = await apiPost<CommentCreateApiResponse>(
        `/v1/board/${postId}/comments`,
        requestData,
        true // 인증 필요
      );

      if (response.code === 0 && response.data) {
        // 댓글 목록 다시 불러오기
        const commentsResponse = await apiGet<CommentListApiResponse>(
          `/v1/board/${postId}/comments`,
          false
        );

        if (Array.isArray(commentsResponse)) {
          setComments(commentsResponse);
        }
      } else {
        alert(response.message || '댓글 작성에 실패했습니다.');
      }
    } catch (err: any) {
      console.error('댓글 작성 실패:', err);
      alert(err.message || '댓글 작성 중 오류가 발생했습니다.');
    }
  };

  const handleAddReply = async (commentId: number, content: string) => {
    await handleAddComment(content, commentId);
  };

  const handleUpdateComment = async (commentId: number, content: string) => {
    if (!postId || !content.trim()) return;

    try {
      const response = await apiPatch<CommentUpdateApiResponse>(
        `/v1/board/${postId}/comments/${commentId}`,
        { content: content.trim() },
        true // 인증 필요
      );

      if (response.code === 0 && response.data) {
        // 댓글 목록 다시 불러오기
        const commentsResponse = await apiGet<CommentListApiResponse>(
          `/v1/board/${postId}/comments`,
          false
        );

        if (Array.isArray(commentsResponse)) {
          setComments(commentsResponse);
        }
      } else {
        alert(response.message || '댓글 수정에 실패했습니다.');
      }
    } catch (err: any) {
      console.error('댓글 수정 실패:', err);
      alert(err.message || '댓글 수정 중 오류가 발생했습니다.');
    }
  };

  // -------------------- 로딩 및 에러 처리 --------------------
  if (loading) {
    return (
      <div className="post-detail-wrapper">
        <Header />
        <div>게시글을 불러오는 중...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="post-detail-wrapper">
        <Header />
        <div>{error || '게시글을 찾을 수 없습니다.'}</div>
      </div>
    );
  }

  // -------------------- JSX --------------------
  return (
    <div className="post-detail-wrapper">
      <Header />
      {isEditing ? (
        <>
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="post-edit-title"
          />
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="post-edit-content"
          />
          <div className="post-detail-actions">
            <button onClick={handleSave}>저장</button>
            <button onClick={handleCancel}>취소</button>
          </div>
        </>
      ) : (
        <>
          <h2 className="post-detail-title">{post.title}</h2>
          <div className="post-detail-meta">
            <span className="post-detail-author">{post.authorNickname}</span>
            <span className="post-detail-date">{formatDate(post.createdAt)}</span>
            <span className="post-detail-views">조회 {post.viewCount}</span>
          </div>
          <div className="post-detail-content">{post.content}</div>
          {isAuthor && (
            <div className="post-detail-actions">
              <button onClick={handleEdit}>수정</button>
              <button onClick={handleDelete}>삭제</button>
            </div>
          )}
        </>
      )}

      {/* 댓글 섹션 */}
      <BoardComment
        postId={postId}
        comments={comments}
        loading={loadingComments}
        onAddComment={handleAddComment}
        onAddReply={handleAddReply}
        onUpdateComment={handleUpdateComment}
        currentUserId={currentUserId || undefined}
      />
    </div>
  );
};

export default BoardDetail;
