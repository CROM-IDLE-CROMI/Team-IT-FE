export interface Post {
  id: number;
  title: string;
  author: string;
  content: string;
  date: string;
  views: number;
}

export type Category = "시사&정보" | "질문" | "홍보";
