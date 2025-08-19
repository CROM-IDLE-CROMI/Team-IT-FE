import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './pages/Main';
import ProjectPage from "./pages/ProjectPage";
import TeamPage from './pages/TeamPage';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Boarder from './pages/Boarder';
import Stor from './pages/Stor';
import MyProject from './pages/MyProject';
import MYProjectDetail from "./pages/MyProjectDetail";
import React, { useState } from 'react';
import DraftList from "./components/TemporarySave/DraftList";


function App() {
   const [isListModalOpen, setIsListModalOpen] = useState(true);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/projects" element={<ProjectPage />} />
        <Route path="/Teams" element={<TeamPage/>} />
        <Route path="/Signup"element={<Signup/>}/>
        <Route path="/Login"element={<Login/>}/>
        <Route path="/Boarder"element={<Boarder/>}/>
        <Route path='/Stor'element={<Stor/>}/>
        <Route path='/MyProject'element={<MyProject/>}/>
        <Route path="/projects/:id" element={<MYProjectDetail />} />
      </Routes>
      {isListModalOpen && (
  <DraftList
    onClose={() => setIsListModalOpen(false)}
    onLoadDraft={(draftId) => {
    }}
  />
)}
    </BrowserRouter>
  );
}

export default App;

