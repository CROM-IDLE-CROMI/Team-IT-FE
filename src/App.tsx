import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import MyprojectMain from './pages/Myproject/MyprojectMain';
import MyProjectDetail from './pages/Myproject/MyprojectDetail';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/myprojectmain" element={<MyprojectMain />} />
        <Route path="/project/:id" element={<MyProjectDetail />} />
      </Routes>
    </Router>
  );
}

export default App;