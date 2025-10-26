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
import type { Post, Category } from './types/post';
import Mypage from './pages/MyPage/Mypage';
import ProjectApply from './components/ProjectPageDetail/ProjectApply';

// develop 기능
import Login from './pages/Login/Login';
import KakaoCallback from "./auth/KakaoCallback";
import Signup from './pages/Signup/Signup';
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
import MyprojectApplication from './pages/Myproject/MyprojectApplication';
import Notification from './pages/Notification';
import MyProjectDetailfake from './pages/Myproject/MyprojectDetailfake';

import './App.css';

function App() {
  const [postsByCategory, setPostsByCategory] = useState<Record<Category, Post[]>>({
    "시사&정보": [],
    "질문": [],
    "홍보": []
  });

  const handleAddPost = (category: Category, newPost: Post) => {
    setPostsByCategory(prev => ({
      ...prev,
      [category]: [newPost, ...prev[category]],
    }));
  };

  const handleDeletePost = (postId: number) => {
    setPostsByCategory(prev => {
      const newPostsByCategory = { ...prev };
      Object.keys(newPostsByCategory).forEach(category => {
        newPostsByCategory[category as Category] = newPostsByCategory[category as Category].filter(
          post => post.id !== postId
        );
      });
      return newPostsByCategory;
    });
  };

  return (
    <Router>
      <Routes>
        {/* HEAD 기능 */}
        <Route path="/" element={<Main />} />
        <Route path="/projects" element={<ProjectPage />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="/project/:id/apply" element={<ProjectApply />} />
        <Route path="/Teams" element={<TeamPage />} />
        <Route path="/Boarder" element={<BoardPage postsByCategory={postsByCategory} />} />
        <Route path="/BoardWrite" element={<BoardWrite onAddPost={handleAddPost} />} />
        <Route path="/Board/:id" element={<BoardDetail postsByCategory={postsByCategory} onDeletePost={handleDeletePost} />} />
        <Route path="/myprojectmain" element={<MyprojectMain />} />
        <Route path="/Mypage" element={<Mypage />} />

        {/* develop 기능 */}s
        <Route path="/login" element={<Login />} />
        <Route path="/oauth/callback/kakao" element={<KakaoCallback />} />
        <Route path="/signup" element={<Signup />} />
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
        <Route path="/myproject/:id/applications" element={<MyprojectApplication />} />
        <Route path="/notification" element={<Notification />} />

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
        <Route path="/MyprojectDetailfake" element={<MyProjectDetailfake />} />
        <Route path="/notification" element={<Notification />} />
      </Routes>
    </Router>
  );
}

export default App;
