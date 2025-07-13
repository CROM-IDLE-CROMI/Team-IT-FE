import Header from "./Header";
import Dashboard from "../pages/Dashboard";

const MainLayout = () => {
  return (
    <div>
        <div>
      <Header />
      </div>
      <div style={{padding:'4rem'}}>
      <Dashboard />
      </div>
      </div>
  );
};

export default MainLayout;
