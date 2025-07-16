import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './pages/Main';
import ProjectPage from "./pages/ProjectPage";
import TeamPage from './pages/TeamPage';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Header from './layouts/Header';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/projects" element={<ProjectPage />} />
        <Route path="/Teams" element={<TeamPage/>} />
        <Route path="/Signup"element={<Signup/>}/>
        <Route path="/Login"element={<Login/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

