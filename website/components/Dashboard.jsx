import { useState } from "react";
import Navbardash from "./Navbardash";
import DashboardHome from "./DashboardPages/DashboardHome";
import UsersPage from "./DashboardPages/UsersPage";
import ProjectsPage from "./DashboardPages/ProjectsPage";
import SettingsPage from "./DashboardPages/SettingsPage";
import "./Dashboard.css";

function Dashboard({ isLoggedIn, isLoggingIn, onLogin, onLogout}) {
  const [activeTab, setActiveTab] = useState("home");

  const renderPage = () => {
    switch (activeTab) {
      case "home":
        return <DashboardHome />;
      case "users":
        return <UsersPage />;
      case "projects":
        return <ProjectsPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <Navbardash
          isLoggedIn={isLoggedIn}
          isLoggingIn={isLoggingIn}
          onLogin={() => {}}
          onLogout={onLogout}
          activeTab={activeTab} 
          setActiveTab={setActiveTab} />
      </aside>
      <main className="dashboard-page">
        {renderPage()}
      </main>
    </div>
  );
}

export default Dashboard;
