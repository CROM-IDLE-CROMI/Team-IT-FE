import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './pages/Main';
import ProjectPage from "./pages/ProjectPage";
import TeamPage from './pages/TeamPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/projects" element={<ProjectPage />} />
        <Route path="/Teams" element={<TeamPage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

