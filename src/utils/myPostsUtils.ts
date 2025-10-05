// 내가 쓴 게시글 관리 유틸리티 (백엔드 연동 준비)
import type { Post } from '../pages/BoardPage/DummyPosts';

export interface MyPost extends Post {
  category: string; // 게시글 카테고리
  createdAt: string; // 작성한 날짜
  lastModified?: string; // 마지막 수정 날짜
}

// TODO: 백엔드 연동 시 구현할 함수들
// 게시글 추가 (게시글 작성 시)
export const addMyPost = (post: Omit<MyPost, 'createdAt'>): void => {
  // TODO: 백엔드 API 호출로 게시글 추가
  console.log('게시글 추가:', post);
};

// 게시글 수정
export const updateMyPost = (postId: number, updatedPost: Partial<MyPost>): void => {
  // TODO: 백엔드 API 호출로 게시글 수정
  console.log('게시글 수정:', postId, updatedPost);
};

// 게시글 삭제
export const deleteMyPost = (postId: number): void => {
  // TODO: 백엔드 API 호출로 게시글 삭제
  console.log('게시글 삭제:', postId);
};

// 모든 내가 쓴 게시글 가져오기
export const getAllMyPosts = (): MyPost[] => {
  // TODO: 백엔드 API 호출로 내가 쓴 게시글 목록 가져오기
  return [];
};

// 특정 게시글이 내가 쓴 글인지 확인
export const isMyPost = (postId: number): boolean => {
  // TODO: 백엔드 API 호출로 게시글 소유자 확인
  return false;
};

// 내가 쓴 게시글 개수 가져오기
export const getMyPostsCount = (): number => {
  // TODO: 백엔드 API 호출로 내가 쓴 게시글 개수 가져오기
  return 0;
};
