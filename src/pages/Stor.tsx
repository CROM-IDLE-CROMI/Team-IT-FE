import Header from "../layouts/Header";
import "../App.css";

const Stor = () => {
  return (
    <div>
      <Header />

      <div className="store-container">
        {/* 왼쪽 사이드 필터 */}
        <aside className="store-sidebar">
          <div className="filter-section">
            <h3>키워드</h3>
            <div className="tag-container">
              <span className="tag">엄청남 ✕</span>
              <span className="tag">테두리 ✕</span>
              <span className="tag">루피짱 ✕</span>
            </div>
          </div>

          <div className="filter-section">
            <h3>카테고리</h3>
            <label><input type="checkbox" defaultChecked /> 테두리</label>
            <label><input type="checkbox" defaultChecked /> 배경</label>
            <label><input type="checkbox" defaultChecked /> 이벤트</label>
          </div>

          <div className="filter-section">
            <h3>가격</h3>
            <div className="price-labels">
              <span>0</span>
              <span>100</span>
            </div>
            <input type="range" min="0" max="100" />
          </div>
        </aside>

        {/* 오른쪽 메인 콘텐츠 */}
        <main className="store-main">
          <div className="top-controls">
            <input type="text" placeholder="검색어를 입력하세요" className="search-input" />
            <div className="sort-options">
              <button className="active">최신순</button>
              <button>인기순</button>
              <button>할인중</button>
              <button>오래된순</button>
            </div>
          </div>

          <div className="product-grid">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="product-card">
                <div className="product-image">이미지</div>
                <div className="product-name">상품 이름 {i + 1}</div>
                <div className="product-price">₩0</div>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button disabled>← 이전</button>
            <button className="active">1</button>
            <button>2</button>
            <button>3</button>
            <button>...</button>
            <button>10</button>
            <button>다음 →</button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Stor;
