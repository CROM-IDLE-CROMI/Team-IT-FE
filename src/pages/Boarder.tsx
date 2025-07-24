import Header from "../layouts/Header";
import "../App.css"

const Boarder = () => {
  return (
    <div style={{ padding: "4rem 0" }}>
      <Header />

      <div style={{ maxWidth: "900px", margin: "2rem auto", fontFamily: "sans-serif" }}>
        {/* 탭 메뉴 */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
          <button style={tabStyle}>시사정보게시판</button>
          <button style={{ ...tabStyle, ...activeTabStyle }}>질문게시판</button>
          <button style={tabStyle}>홍보게시판</button>
        </div>

        {/* 검색창 + 글쓰기 버튼 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              style={{ width: "100%", padding: "0.5rem 2rem 0.5rem 1rem", borderRadius: "2rem", border: "1px solid #ccc" }}
            />
            <span
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#999",
              }}
            >
              ✕
            </span>
          </div>
          <button
            style={{
              marginLeft: "1rem",
              fontSize: "1.5rem",
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            ✎
          </button>
        </div>

        {/* 게시판 제목 */}
        <h3 style={{ fontSize: "1.25rem", margin: "1rem 0", fontWeight: "bold" }}>질문게시판</h3>

        {/* 게시물 리스트 */}
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 0 4px rgba(0,0,0,0.1)",
            backgroundColor: "white",
          }}
        >
          {postList.map((post, index) => (
            <li
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "1rem",
                borderTop: index === 0 ? "none" : "1px solid #eee",
              }}
            >
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <span style={{ fontSize: "1.2rem", cursor: "pointer" }}>☆</span>
                <div>
                  <div style={{ fontWeight: 500 }}>{post.title}</div>
                  <div style={{ fontSize: "0.875rem", color: "#666" }}>{post.author}</div>
                </div>
              </div>
              <div style={{ alignSelf: "center", fontSize: "1rem" }}>⇧A</div>
            </li>
          ))}
        </ul>

        {/* 페이지네이션 */}
        <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", marginTop: "1.5rem" }}>
          <span>{"< Previous"}</span>
          {[1, 2, 3, "...", 10, 11].map((page, i) => (
            <span
              key={i}
              style={{
                padding: "0.5rem 0.75rem",
                borderRadius: "4px",
                cursor: "pointer",
                backgroundColor: page === 1 ? "black" : "transparent",
                color: page === 1 ? "white" : "inherit",
              }}
            >
              {page}
            </span>
          ))}
          <span>{"Next >"}</span>
        </div>
      </div>
    </div>
  );
};

// 스타일
const tabStyle = {
  border: "none",
  padding: "0.5rem 1rem",
  backgroundColor: "#ddd",
  borderRadius: "0.5rem",
  cursor: "pointer",
};

const activeTabStyle = {
  backgroundColor: "#5b5eff",
  color: "white",
};

// 게시물 리스트 (예시 데이터)
const postList = [
  { title: "이거 왜 안돼요?", author: "핑프212" },
  { title: "React TS로 해도 되나요?", author: "미친과학자123" },
  { title: "OS 다음회장 김1성 몇나요?", author: "김1성23" },
  { title: "Menu Label", author: "Menu description." },
];

export default Boarder;
