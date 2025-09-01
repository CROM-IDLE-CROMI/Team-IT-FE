import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Main from './pages/Main';
import ProjectPage from "./pages/ProjectPage";
import ProjectDetail from "./pages/ProjectDetail";
import TeamPage from './pages/TeamPage';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Boarder from './pages/BoardPage/Boarder';
import BoardWrite from './pages/BoardPage/BoardWrite';
import Stor from './pages/Stor';
import MyProject from './pages/MyProject';
import MYProjectDetail from "./pages/MyProjectDetail";
import ProjectApply from './components/ProjectPageDetail/ProjectApply';
import Mypage from './pages/MyPage/Mypage';

import type { Post, Category } from './pages/BoardPage/DummyPosts';
import { dummyPosts } from './pages/BoardPage/DummyPosts';

function App() {
  // ✅ 상태 기반 게시글 관리
  const [postsByCategory, setPostsByCategory] = useState<Record<Category, Post[]>>(dummyPosts);

  // BoardWrite에서 글 추가 시 호출
  const handleAddPost = (category: Category, newPost: Post) => {
    setPostsByCategory(prev => ({
      ...prev,
      [category]: [newPost, ...prev[category]], // 최신 글 위로
    }));
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/projects" element={<ProjectPage />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="/apply" element={<ProjectApply />} />
        <Route path="/Teams" element={<TeamPage/>} />
        <Route path="/Signup" element={<Signup/>}/>
        <Route path="/Login" element={<Login/>}/>
        {/* BoardPage에 상태 전달 */}
        <Route path="/Boarder" element={<Boarder postsByCategory={postsByCategory} />} />
        {/* BoardWrite에 글 추가 함수 전달 */}
        <Route path="/BoardWrite" element={<BoardWrite onAddPost={handleAddPost} />} />
        <Route path='/Stor' element={<Stor/>}/>
        <Route path='/MyProject' element={<MyProject/>}/>
        <Route path="/projects/:id" element={<MYProjectDetail />} />
        <Route path="/Mypage" element={<Mypage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
