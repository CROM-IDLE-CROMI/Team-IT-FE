import ProjectCard from '../components/ProjectCard';
import BoardCard from '../components/BoardCard';
import Header from '../layouts/Header';
import "../App.css"
import Introduction from '../components/Introduction';
import React from "react";
import DashBoard from '../components/DashBoard';


const Main = () => {
  return (
    <div className="Main-wrapper">
      <Header />
      <DashBoard/>
      <ProjectCard />
      <BoardCard />
      <Introduction />
    </div>
  );
};

export default Main;
