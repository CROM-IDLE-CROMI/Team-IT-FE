import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './pages/Main';
import ProjectPage from "./pages/ProjectPage";
import ProjectDetail from "./pages/ProjectDetail";
import TeamPage from './pages/TeamPage';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Boarder from './pages/Boarder';
import Stor from './pages/Stor';
import MyProject from './pages/MyProject';
import MYProjectDetail from "./pages/MyProjectDetail";
import ProjectApply from './components/ProjectPageDetail/ProjectApply';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/projects" element={<ProjectPage />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="/apply" element={<ProjectApply />} />
        <Route path="/Teams" element={<TeamPage/>} />
        <Route path="/Signup"element={<Signup/>}/>
        <Route path="/Login"element={<Login/>}/>
        <Route path="/Boarder"element={<Boarder/>}/>
        <Route path='/Stor'element={<Stor/>}/>
        <Route path='/MyProject'element={<MyProject/>}/>
        <Route path="/projects/:id" element={<MYProjectDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

