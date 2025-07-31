import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h2>홈 화면</h2>
      <button onClick={() => navigate('/login')}>로그인</button>
      <button onClick={() => navigate('/signup')}>회원가입</button>
      <button onClick={() => navigate('/myprojectmain')}>마이프로젝트</button>
    </div>
  );
};

export default Home;
