// popularPosts.ts
export interface Post {
  id: number;
  title: string;
  author: string;
  content: string;
  date: string;
  views: number;
  category: "시사&정보" | "질문" | "홍보";
}

// 인기 게시물 데이터 (실제 API에서 가져올 예정)
export const popularPosts: Post[] = [];

export const getPopularPosts = (limit: number = 4): Post[] => {
  return popularPosts
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
};
