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

export const popularPosts: Post[] = [
  {
    id: 1,
    title: "2025년 IT 트렌드 분석 및 전망",
    author: "김개발",
    content: "2025년 주요 IT 트렌드로는 AI, 메타버스, 양자컴퓨팅 등이 주목받고 있습니다. 특히 생성형 AI의 발전과 함께 개발자들의 역할도 크게 변화할 것으로 예상됩니다.",
    date: "2025.01.15",
    views: 1250,
    category: "시사&정보"
  },
  {
    id: 2,
    title: "React와 Vue.js 중 어떤 것을 선택해야 할까요?",
    author: "초보개발자",
    content: "프론트엔드 개발을 시작하려고 하는데 React와 Vue.js 중에서 고민이 됩니다. 각각의 장단점과 학습 난이도, 취업 시장에서의 수요 등을 고려해서 선택하고 싶습니다.",
    date: "2025.01.15",
    views: 980,
    category: "질문"
  },
  {
    id: 3,
    title: "개발자 채용 시장 동향 리포트",
    author: "이코딩",
    content: "최근 개발자 채용 시장이 급격히 변화하고 있습니다. 특히 프론트엔드 개발자 수요가 증가하고 있으며, React, Vue.js 등의 프레임워크 경험을 요구하는 기업이 늘어나고 있습니다.",
    date: "2025.01.14",
    views: 850,
    category: "시사&정보"
  },
  {
    id: 4,
    title: "🔥 무료 개발자 부트캠프 모집 중!",
    author: "코딩학원",
    content: "6개월 과정의 무료 개발자 부트캠프를 모집합니다. React, Node.js, MongoDB를 활용한 풀스택 개발 과정으로, 수료 후 취업 연계까지 지원해드립니다.",
    date: "2025.01.15",
    views: 720,
    category: "홍보"
  },
  {
    id: 5,
    title: "포트폴리오 프로젝트 아이디어 추천 부탁드립니다",
    author: "취준생",
    content: "취업을 위해 포트폴리오를 만들려고 하는데 좋은 프로젝트 아이디어가 없어서 고민입니다. 웹 개발 분야에서 인상적인 포트폴리오가 될 만한 프로젝트를 추천해주시면 감사하겠습니다.",
    date: "2025.01.13",
    views: 680,
    category: "질문"
  },
  {
    id: 6,
    title: "오픈소스 프로젝트 기여하기 가이드",
    author: "박오픈",
    content: "오픈소스 프로젝트에 기여하는 것은 개발자로서 성장하는 좋은 방법입니다. 이번 가이드에서는 GitHub에서 오픈소스 프로젝트를 찾는 방법부터 Pull Request를 보내는 과정까지 단계별로 설명드리겠습니다.",
    date: "2025.01.13",
    views: 620,
    category: "시사&정보"
  },
  {
    id: 7,
    title: "개발자 면접에서 자주 나오는 질문들은 무엇인가요?",
    author: "면접준비생",
    content: "곧 개발자 면접을 앞두고 있는데 어떤 질문들이 자주 나오는지 궁금합니다. 기술적인 질문뿐만 아니라 인성 면접에서도 준비해야 할 내용이 있다면 알려주세요.",
    date: "2025.01.11",
    views: 580,
    category: "질문"
  },
  {
    id: 8,
    title: "💻 개발자 컨퍼런스 'DevFest 2025' 개최 안내",
    author: "GDG서울",
    content: "올해 3월에 개최되는 DevFest 2025에 여러분을 초대합니다. Google의 최신 기술과 개발 트렌드를 소개하는 컨퍼런스로, 네트워킹과 학습의 기회를 제공합니다.",
    date: "2025.01.14",
    views: 520,
    category: "홍보"
  }
];

export const getPopularPosts = (limit: number = 4): Post[] => {
  return popularPosts
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
};
