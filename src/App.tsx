import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Main from './pages/Main';
import ProjectPage from "./pages/ProjectPage";
import ProjectDetail from "./pages/ProjectDetail";
import TeamPage from './pages/TeamPage';
import Signup from './pages/Signup';
import Login from './pages/Login';
import BoardPage from './pages/BoardPage/Boarder';
import BoardWrite from './pages/BoardPage/BoardWrite';
import BoardDetail from './pages/BoardPage/BoardDetail';
import type { Post, Category } from './pages/BoardPage/DummyPosts';
import { dummyPosts } from './pages/BoardPage/DummyPosts';
import Mypage from './pages/MyPage/Mypage';

function App() {
  const [postsByCategory, setPostsByCategory] = useState<Record<Category, Post[]>>(dummyPosts);

  const handleAddPost = (category: Category, newPost: Post) => {
    setPostsByCategory(prev => ({
      ...prev,
      [category]: [newPost, ...prev[category]],
    }));
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/projects" element={<ProjectPage />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="/Teams" element={<TeamPage />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Login" element={<Login />} />
        <Route
          path="/Boarder"
          element={<BoardPage postsByCategory={postsByCategory} />}
        />
        <Route
          path="/BoardWrite"
          element={<BoardWrite onAddPost={handleAddPost} />}
        />
        <Route
          path="/Board/:id"
          element={<BoardDetail postsByCategory={postsByCategory} />}
        />
        <Route path="MyPage" element={<Mypage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
