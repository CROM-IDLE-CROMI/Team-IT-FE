import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
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
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
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
        <Route path="/notification" element={<Notification />} />
      </Routes>
    </Router>
  );
}

export default App;