import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

// HEAD 기능
import Main from './pages/Main';
import ProjectPage from './pages/ProjectPage';
import ProjectDetail from './pages/ProjectDetail';
import TeamPage from './pages/TeamPage';
import BoardPage from './pages/BoardPage/Boarder';
import BoardWrite from './pages/BoardPage/BoardWrite';
import BoardDetail from './pages/BoardPage/BoardDetail';
import type { Post, Category } from './pages/BoardPage/DummyPosts';
import { dummyPosts } from './pages/BoardPage/DummyPosts';
import Mypage from './pages/MyPage/Mypage';
import ProjectApply from './components/ProjectPageDetail/ProjectApply';

// develop 기능
import Login from './pages/Login/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import KakaoCallback from './auth/KakaoCallback';
import MyprojectMain from './pages/Myproject/MyprojectMain';
import MyProjectDetail from './pages/Myproject/MyprojectDetail';
import MyprojectEdit from './pages/Myproject/MyprojectEdit';
import MyprojectExplain from './pages/Myproject/MyprojectExplain';
import MyprojectMilestone from './pages/Myproject/MyprojectMilestone';
import MyprojectMember from './pages/Myproject/MyprojectMember';
import MyprojectExplainEdit from './pages/Myproject/MyprojectExplainEdit';
import MyprojectMilestoneEdit from './pages/Myproject/MyprojectMilestoneEdit';
import MyprojectMemberEdit from './pages/Myproject/MyprojectMemberEdit';
import MemberChangeLeader from './pages/Myproject/MemberChangeLeader';
import Notification from './pages/Notification';

function App() {
  const [postsByCategory, setPostsByCategory] = useState<Record<Category, Post[]>>(dummyPosts);

  const handleAddPost = (category: Category, newPost: Post) => {
    setPostsByCategory(prev => ({
      ...prev,
      [category]: [newPost, ...prev[category]],
    }));
  };

  return (
    <Router>
      <Routes>
        {/* HEAD 기능 */}
        <Route path="/" element={<Main />} />
        <Route path="/projects" element={<ProjectPage />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="/apply" element={<ProjectApply />} />
        <Route path="/Teams" element={<TeamPage />} />
        <Route path="/Boarder" element={<BoardPage postsByCategory={postsByCategory} />} />
        <Route path="/BoardWrite" element={<BoardWrite onAddPost={handleAddPost} />} />
        <Route path="/Board/:id" element={<BoardDetail postsByCategory={postsByCategory} />} />
        <Route path="/Mypage" element={<Mypage />} />

        {/* develop 기능 */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/oauth/callback/kakao" element={<KakaoCallback />} />
        <Route path="/myprojectmain" element={<MyprojectMain />} />
        <Route path="/myproject/:id" element={<MyProjectDetail />} />
        <Route path="/myproject/:id/edit" element={<MyprojectEdit />} />
        <Route path="/myproject/:id/explain" element={<MyprojectExplain />} />
        <Route path="/myproject/:id/milestone" element={<MyprojectMilestone />} />
        <Route path="/myproject/:id/member" element={<MyprojectMember />} />
        <Route path="/myproject/:id/explain/edit" element={<MyprojectExplainEdit />} />
        <Route path="/myproject/:id/milestone/edit" element={<MyprojectMilestoneEdit />} />
        <Route path="/myproject/:id/member/edit" element={<MyprojectMemberEdit />} />
        <Route path="/myproject/:id/member/edit/change-leader" element={<MemberChangeLeader />} />
        <Route path="/notification" element={<Notification />} />
      </Routes>
    </Router>
  );
}

export default App;
