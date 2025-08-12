import Header from "../layouts/Header";
import '../App.css';

const ProjectPage = () => {
  return (
    <div style={{ padding: "4rem 0" }}>
      <Header />

      <div className="horizontal-section">
        <section className="half-section">
          <h2><span className="emoji">✨</span>요즘 인기있는 프로젝트</h2>
          <div className="card-container">
            <div className="card">
              <h3>제목</h3>
              <div className="info">작성자<br />작성일자</div>
            </div>
            <div className="card">
              <h3>제목</h3>
              <div className="info">작성자<br />작성일자</div>
            </div>
          </div>
        </section>

        <section className="half-section">
          <h2><span className="emoji">🔥</span>최근 핫한 게시물</h2>
          <div className="card-container">
            <div className="card">
              <h3>제목</h3>
              <div className="info">작성자<br />좋아요 수<br />조회수</div>
            </div>
            <div className="card">
              <h3>제목</h3>
              <div className="info">작성자<br />좋아요 수<br />조회수</div>
            </div>
          </div>
        </section>
      </div>

      <div className="section">
        <div className="Option"><img src ="/Option.png"/></div>
        <div className="search-bar">
          <input type="text" placeholder="제목, 내용을 검색하세요..." />
        </div>

        <div className="card-container">
          <div className="card">
            <h3>제목 <span className="heart">♡</span></h3>
            <div className="info">
              작성자<br />작성일자<br />
              지역<br />
              개발스택<br />
              모집 직군
            </div>
          </div>

          <div className="card">
            <h3>백엔드 구해요 <span className="heart">♡</span></h3>
            <div className="info">
              김한성<br />2025.06.29<br />
              서울<br />
              <span className="tech-icons">🐍 ⚛️</span><br />
              웹, 앱
            </div>
          </div>

          <div className="card">
            <h3>제목 <span className="heart">♡</span></h3>
            <div className="info">...</div>
          </div>
          <div className="card">
            <h3>제목 <span className="heart">♡</span></h3>
            <div className="info">...</div>
          </div>
          <div className="card">
            <h3>제목 <span className="heart">♡</span></h3>
            <div className="info">...</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
