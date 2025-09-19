// 내가 쓴 게시글 관리 유틸리티
import { getCurrentUser } from './authUtils';
import type { Post } from '../pages/BoardPage/DummyPosts';

export interface MyPost extends Post {
  createdAt: string; // 작성한 날짜
  lastModified?: string; // 마지막 수정 날짜
}

export interface MyPostsData {
  userId: string;
  posts: MyPost[];
  lastUpdated: string;
}

const MY_POSTS_STORAGE_KEY = 'userMyPosts';

// 현재 사용자의 내가 쓴 게시글 데이터 가져오기
const getMyPostsData = (): MyPostsData => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return { userId: '', posts: [], lastUpdated: new Date().toISOString() };
  }

  const stored = localStorage.getItem(`${MY_POSTS_STORAGE_KEY}_${currentUser}`);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('내가 쓴 게시글 데이터 파싱 실패:', error);
    }
  }

  return {
    userId: currentUser,
    posts: [],
    lastUpdated: new Date().toISOString()
  };
};

// 내가 쓴 게시글 데이터 저장하기
const saveMyPostsData = (data: MyPostsData): void => {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  localStorage.setItem(`${MY_POSTS_STORAGE_KEY}_${currentUser}`, JSON.stringify(data));
};

// 게시글 추가 (게시글 작성 시)
export const addMyPost = (post: Omit<MyPost, 'createdAt'>): void => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    console.error('로그인이 필요합니다.');
    return;
  }

  const myPostsData = getMyPostsData();
  
  const newPost: MyPost = {
    ...post,
    createdAt: new Date().toISOString()
  };

  myPostsData.posts.unshift(newPost); // 최신 게시글을 맨 앞에 추가
  myPostsData.lastUpdated = new Date().toISOString();
  
  saveMyPostsData(myPostsData);
};

// 게시글 수정
export const updateMyPost = (postId: number, updatedPost: Partial<MyPost>): void => {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const myPostsData = getMyPostsData();
  const postIndex = myPostsData.posts.findIndex(post => post.id === postId);
  
  if (postIndex !== -1) {
    myPostsData.posts[postIndex] = {
      ...myPostsData.posts[postIndex],
      ...updatedPost,
      lastModified: new Date().toISOString()
    };
    myPostsData.lastUpdated = new Date().toISOString();
    saveMyPostsData(myPostsData);
  }
};

// 게시글 삭제
export const deleteMyPost = (postId: number): void => {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const myPostsData = getMyPostsData();
  myPostsData.posts = myPostsData.posts.filter(post => post.id !== postId);
  myPostsData.lastUpdated = new Date().toISOString();
  
  saveMyPostsData(myPostsData);
};

// 모든 내가 쓴 게시글 가져오기
export const getAllMyPosts = (): MyPost[] => {
  const myPostsData = getMyPostsData();
  return myPostsData.posts;
};

// 특정 게시글이 내가 쓴 글인지 확인
export const isMyPost = (postId: number): boolean => {
  const myPostsData = getMyPostsData();
  return myPostsData.posts.some(post => post.id === postId);
};

// 내가 쓴 게시글 개수 가져오기
export const getMyPostsCount = (): number => {
  const myPostsData = getMyPostsData();
  return myPostsData.posts.length;
};
