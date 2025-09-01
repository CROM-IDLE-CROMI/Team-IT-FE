// DummyPosts.ts
export type Post = {
  id: number;
  title: string;
  author: string;
  content: string;
  date: string;
};

export type Category = "시사&정보" | "질문" | "홍보";

export const dummyPosts: Record<Category, Post[]> = {
  "시사&정보": Array.from({ length: 22 }, (_, i) => ({
    id: i + 1,
    title: `시사&정보 글 제목 ${i + 1}`,
    author: `작성자${i + 1}`,
    content: `시사&정보 더미 본문 ${i + 1}`,
    date: new Date().toLocaleDateString(),
  })),
  "질문": Array.from({ length: 14 }, (_, i) => ({
    id: i + 1,
    title: `질문 글 제목 ${i + 1}`,
    author: `유저${i + 1}`,
    content: `질문 더미 본문 ${i + 1}`,
    date: new Date().toLocaleDateString(),
  })),
  "홍보": Array.from({ length: 9 }, (_, i) => ({
    id: i + 1,
    title: `홍보 글 제목 ${i + 1}`,
    author: `관리자${i + 1}`,
    content: `홍보 더미 본문 ${i + 1}`,
    date: new Date().toLocaleDateString(),
  })),
};
