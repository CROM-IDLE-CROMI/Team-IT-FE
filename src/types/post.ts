export interface Post {
  id: number;
  title: string;
  author: string;
  content: string;
  date: string;
  views: number;
}

export type Category = "시사&정보" | "질문" | "홍보";

// API 응답 타입
export interface BoardDetailApiResponse {
  code: number;
  message: string;
  data: {
    postId: number;
    title: string;
    content: string;
    category: string;
    viewCount: number;
    likeCount: number;
    scrapCount: number;
    createdAt: string;
    updatedAt: string;
    authorId: string;
    authorNickname: string;
    authorProfileImageUrl: string;
  };
}

export interface CommentApiResponse {
  commentId: number;
  postId: number;
  writerId: string;
  writerNickname: string;
  writerProfileImageUrl: string;
  content: string;
  parentCommentId: number | null;
  createdAt: string;
  likeCount: number;
  replies: CommentApiResponse[];
}

export interface CommentListApiResponse extends Array<CommentApiResponse> {}

export interface CommentCreateApiResponse {
  code: number;
  message: string;
  data: CommentApiResponse;
}

export interface CommentUpdateApiResponse {
  code: number;
  message: string;
  data: CommentApiResponse;
}